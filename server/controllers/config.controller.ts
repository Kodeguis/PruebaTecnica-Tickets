import type { Response } from "express";
import { getConfig, updateConfig } from "../models/config.model.ts";
import { countTickets } from "../models/ticket.model.ts";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.ts";

// Obtener la configuración actual del evento (Público)
export async function getEventConfig(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const config = await getConfig();
    if (!config) {
      res.status(404).json({ error: "Configuración del evento no encontrada" });
      return;
    }

    const ticketsVendidos = await countTickets();
    const ticketsDisponibles = Math.max(0, config.aforoTotal - ticketsVendidos);
    
    // Fórmula de precio: precio = precio_base + (tickets_vendidos * incremento)
    const precioActualCents = config.precioBaseCents + (ticketsVendidos * config.incrementoCents);

    res.status(200).json({
      aforoTotal: config.aforoTotal,
      ticketsVendidos,
      ticketsDisponibles,
      precioBase: config.precioBaseCents / 100, // Dividimos entre 100 para mostrar el valor decimal estándar
      incremento: config.incrementoCents / 100,
      precioActual: precioActualCents / 100,
    });
  } catch (error) {
    console.error("Error al obtener la configuración:", error);
    res.status(500).json({ error: "Error interno del servidor al consultar la configuración" });
  }
}

// Modificar la configuración actual del evento (Protegido - Solo Admin)
export async function updateEventConfig(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { aforoTotal, precioBase, incremento } = req.body;

  // 1. Validar que todos los campos existan
  if (aforoTotal === undefined || precioBase === undefined || incremento === undefined) {
    res.status(400).json({ error: "Todos los campos son requeridos (aforoTotal, precioBase, incremento)" });
    return;
  }

  // 2. Castear e inspeccionar tipos de datos válidos
  const parsedAforo = Number(aforoTotal);
  const parsedPrecioBase = Number(precioBase);
  const parsedIncremento = Number(incremento);

  if (isNaN(parsedAforo) || parsedAforo <= 0 || !Number.isInteger(parsedAforo)) {
    res.status(400).json({ error: "El aforo total debe ser un número entero mayor a cero" });
    return;
  }

  if (isNaN(parsedPrecioBase) || parsedPrecioBase < 0) {
    res.status(400).json({ error: "El precio base debe ser un número positivo" });
    return;
  }

  if (isNaN(parsedIncremento) || parsedIncremento < 0) {
    res.status(400).json({ error: "El incremento por ticket debe ser un número positivo" });
    return;
  }

  try {
    // 3. Convertir a centavos (enteros) para almacenar en la base de datos
    const precioBaseCents = Math.round(parsedPrecioBase * 100);
    const incrementoCents = Math.round(parsedIncremento * 100);

    const updatedConfig = await updateConfig({
      aforoTotal: parsedAforo,
      precioBaseCents,
      incrementoCents,
    });

    res.status(200).json({
      message: "Configuración del evento actualizada con éxito",
      config: {
        aforoTotal: updatedConfig.aforoTotal,
        precioBase: updatedConfig.precioBaseCents / 100,
        incremento: updatedConfig.incrementoCents / 100,
      },
    });
  } catch (error) {
    console.error("Error al actualizar la configuración:", error);
    res.status(500).json({ error: "Ocurrió un error en el servidor al intentar actualizar la configuración" });
  }
}
