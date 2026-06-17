import type { Response } from "express";
import crypto from "crypto";
import { getConfig } from "../models/config.model.ts";
import {
  createTicket,
  countTickets,
  findTicketById,
  findTicketsByUserIdPaginated,
} from "../models/ticket.model.ts";
import { findUserById } from "../models/user.model.ts";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.ts";

// Comprar un ticket (Protegido - Solo usuarios autenticados)
export async function buyTicket(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user || !req.user._id) {
    res.status(401).json({ error: "Acceso denegado: No autenticado" });
    return;
  }

  try {
    // 1. Obtener la configuración del evento para saber el aforo y precios
    const config = await getConfig();
    if (!config) {
      res.status(500).json({ error: "Error en el servidor: Configuración del evento no inicializada" });
      return;
    }

    // 2. Contar los tickets vendidos para ver si hay aforo disponible
    const ticketsVendidos = await countTickets();

    if (ticketsVendidos >= config.aforoTotal) {
      res.status(400).json({ error: "Aforo completo: Ya no quedan entradas disponibles para este evento" });
      return;
    }

    // 3. Calcular el precio dinámico de la entrada en centavos
    // precio = precio_base + (tickets_vendidos * incremento)
    const precioPagadoCents = config.precioBaseCents + (ticketsVendidos * config.incrementoCents);

    // 4. Generar un código único e irrepetible para el ticket
    // Generamos un código corto legible ej. TKT-7FA9C12
    const codigoUnico = `TKT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // 5. Insertar el ticket en la base de datos
    const newTicket = await createTicket({
      codigoUnico,
      compradorId: req.user._id,
      precioPagadoCents,
      fechaCompra: new Date(),
    });

    res.status(201).json({
      message: "Compra realizada con éxito",
      ticket: {
        _id: newTicket._id,
        codigoUnico: newTicket.codigoUnico,
        precioPagado: newTicket.precioPagadoCents / 100, // Retornamos en decimal estándar
        fechaCompra: newTicket.fechaCompra,
      },
    });
  } catch (error) {
    console.error("Error al comprar ticket:", error);
    res.status(500).json({ error: "Ocurrió un error interno en el servidor al procesar la compra" });
  }
}

// Obtener mis tickets comprados (Protegido - Paginado)
export async function getMyTickets(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user || !req.user._id) {
    res.status(401).json({ error: "Acceso denegado: No autenticado" });
    return;
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (page <= 0 || limit <= 0) {
    res.status(400).json({ error: "Parámetros de paginación inválidos" });
    return;
  }

  try {
    const result = await findTicketsByUserIdPaginated(req.user._id, page, limit);

    // Convertimos los centavos a decimales para la respuesta
    const formattedItems = result.items.map((ticket) => ({
      _id: ticket._id,
      codigoUnico: ticket.codigoUnico,
      precioPagado: ticket.precioPagadoCents / 100,
      fechaCompra: ticket.fechaCompra,
    }));

    res.status(200).json({
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      items: formattedItems,
    });
  } catch (error) {
    console.error("Error al obtener tickets del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor al consultar tus tickets" });
  }
}

// Obtener detalle de un ticket específico (Protegido - Con validación estricta de dueño o admin)
export async function getTicketDetail(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user || !req.user._id) {
    res.status(401).json({ error: "Acceso denegado: No autenticado" });
    return;
  }

  const { ticketId } = req.params;

  if (!ticketId || typeof ticketId !== "string") {
    res.status(400).json({ error: "El identificador del ticket es requerido y debe ser válido" });
    return;
  }

  try {
    const ticket = await findTicketById(ticketId);

    if (!ticket) {
      res.status(404).json({ error: "Ticket no encontrado" });
      return;
    }

    // Validación estricta: Solo el dueño del ticket o un administrador pueden ver el detalle
    const isOwner = ticket.compradorId.toString() === req.user._id.toString();
    const isAdmin = req.user.rol === "admin";

    if (!isOwner && !isAdmin) {
      res.status(403).json({ error: "Acceso prohibido: No tienes autorización para ver este ticket" });
      return;
    }

    // Buscamos los datos del comprador en la BD para mostrarlos en el ticket
    const comprador = await findUserById(ticket.compradorId);
    if (!comprador) {
      res.status(404).json({ error: "Comprador asociado al ticket no encontrado" });
      return;
    }

    res.status(200).json({
      codigoUnico: ticket.codigoUnico,
      evento: "Concierto de Gala de Antigravity", // Nombre del evento de demostración
      fechaCompra: ticket.fechaCompra,
      precioPagado: ticket.precioPagadoCents / 100,
      comprador: {
        nombre: comprador.nombre,
        apellido: comprador.apellido,
        dni: comprador.dni,
      },
    });
  } catch (error) {
    console.error("Error al obtener detalle del ticket:", error);
    res.status(500).json({ error: "Error interno del servidor al consultar el detalle del ticket" });
  }
}
