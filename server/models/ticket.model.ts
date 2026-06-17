import { ObjectId } from "mongodb";
import { db } from "../index.ts";

export interface Ticket {
  _id?: ObjectId;
  codigoUnico: string;       // Código único e irrepetible para el ticket
  compradorId: ObjectId;     // ID del usuario que compró el ticket
  precioPagadoCents: number; // Precio exacto cobrado en centavos
  fechaCompra: Date;
}

// Retorna la colección "tickets" de MongoDB
export function getTicketCollection() {
  return db.collection<Ticket>("tickets");
}

// Crea un nuevo ticket
export async function createTicket(ticket: Omit<Ticket, "_id">): Promise<Ticket> {
  const result = await getTicketCollection().insertOne(ticket as Ticket);
  return {
    ...ticket,
    _id: result.insertedId,
  };
}

// Cuenta la cantidad total de tickets vendidos
export async function countTickets(): Promise<number> {
  return getTicketCollection().countDocuments({});
}

// Busca un ticket por su ID
export async function findTicketById(id: string | ObjectId): Promise<Ticket | null> {
  try {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    return await getTicketCollection().findOne({ _id: objectId });
  } catch (error) {
    return null;
  }
}

// Busca tickets de un usuario con paginación
export async function findTicketsByUserIdPaginated(
  userId: string | ObjectId,
  page: number = 1,
  limit: number = 10
) {
  const objectId = typeof userId === "string" ? new ObjectId(userId) : userId;
  const collection = getTicketCollection();
  const skip = (page - 1) * limit;

  const totalItems = await collection.countDocuments({ compradorId: objectId });
  const items = await collection
    .find({ compradorId: objectId })
    .sort({ fechaCompra: -1 })
    .skip(skip)
    .limit(limit)
    .toArray();

  return {
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    page,
    limit,
    items,
  };
}

// Busca todas las ventas con paginación e información del comprador (usando Agregación $lookup)
export async function findAllTicketsPaginated(
  page: number = 1,
  limit: number = 10
) {
  const collection = getTicketCollection();
  const skip = (page - 1) * limit;

  const totalItems = await collection.countDocuments({});

  // Agregamos lookup para cruzar la colección de tickets con la de usuarios y obtener nombre/DNI del comprador
  const items = await collection.aggregate([
    { $sort: { fechaCompra: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "compradorId",
        foreignField: "_id",
        as: "compradorInfo"
      }
    },
    { $unwind: { path: "$compradorInfo", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        codigoUnico: 1,
        precioPagadoCents: 1,
        fechaCompra: 1,
        comprador: {
          _id: "$compradorInfo._id",
          nombre: "$compradorInfo.nombre",
          apellido: "$compradorInfo.apellido",
          dni: "$compradorInfo.dni",
          email: "$compradorInfo.email"
        }
      }
    }
  ]).toArray();

  return {
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    page,
    limit,
    items,
  };
}
