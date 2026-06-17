import type { Response } from "express";
import { getTicketCollection, countTickets, findAllTicketsPaginated } from "../models/ticket.model.ts";
import { searchUsersPaginated } from "../models/user.model.ts";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.ts";

// Obtener estadísticas del panel administrativo (Ventas y ganancias exactas)
export async function getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const ticketsVendidos = await countTickets();

    // Agregación en MongoDB para sumar la recaudación de manera 100% exacta
    const collection = getTicketCollection();
    const aggregationResult = await collection.aggregate([
      {
        $group: {
          _id: null,
          totalEarningsCents: { $sum: "$precioPagadoCents" },
        },
      },
    ]).toArray();

    // Si no hay ventas, la recaudación total es 0
    const totalEarningsCents = aggregationResult[0]?.totalEarningsCents || 0;
    const gananciasTotales = totalEarningsCents / 100;

    res.status(200).json({
      ticketsVendidos,
      gananciasTotales,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas del administrador:", error);
    res.status(500).json({ error: "Error interno del servidor al consultar estadísticas" });
  }
}

// Obtener el listado de ventas detallado (Paginado)
export async function getSalesList(req: AuthenticatedRequest, res: Response): Promise<void> {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (page <= 0 || limit <= 0) {
    res.status(400).json({ error: "Parámetros de paginación inválidos" });
    return;
  }

  try {
    const result = await findAllTicketsPaginated(page, limit);

    // Convertimos los centavos a decimal para la API del frontend
    const formattedItems = result.items.map((sale) => ({
      _id: sale._id,
      codigoUnico: sale.codigoUnico,
      precioPagado: sale.precioPagadoCents / 100,
      fechaCompra: sale.fechaCompra,
      comprador: sale.comprador,
    }));

    res.status(200).json({
      totalItems: result.totalItems,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      items: formattedItems,
    });
  } catch (error) {
    console.error("Error al listar ventas:", error);
    res.status(500).json({ error: "Ocurrió un error en el servidor al listar las ventas" });
  }
}

// Búsqueda de usuarios (Paginado)
export async function searchUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  const query = String(req.query.query || "").trim();
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (page <= 0 || limit <= 0) {
    res.status(400).json({ error: "Parámetros de paginación inválidos" });
    return;
  }

  try {
    const result = await searchUsersPaginated(query, page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al buscar usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor al buscar usuarios" });
  }
}
