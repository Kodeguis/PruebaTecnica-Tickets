import { ObjectId } from "mongodb";
import { db } from "../index.ts";

export interface User {
  _id?: ObjectId;
  dni: string;
  email: string;
  nombre: string;
  apellido: string;
  contrasena: string; // Guardará el hash encriptado
  rol: "user" | "admin";
}

// Retorna la colección "users" tipada de MongoDB
export function getUserCollection() {
  return db.collection<User>("users");
}

// Crea un nuevo usuario en la base de datos
export async function createUser(user: Omit<User, "_id">): Promise<User> {
  const result = await getUserCollection().insertOne(user as User);
  return {
    ...user,
    _id: result.insertedId,
  };
}

// Busca un usuario por correo electrónico (sin importar mayúsculas/minúsculas)
export async function findUserByEmail(email: string): Promise<User | null> {
  return getUserCollection().findOne({ 
    email: { $regex: new RegExp(`^${email.trim()}$`, "i") } 
  });
}

// Busca un usuario por DNI exacto
export async function findUserByDni(dni: string): Promise<User | null> {
  return getUserCollection().findOne({ dni: dni.trim() });
}

// Busca un usuario por su ID (ObjectId)
export async function findUserById(id: string | ObjectId): Promise<User | null> {
  try {
    const objectId = typeof id === "string" ? new ObjectId(id) : id;
    return await getUserCollection().findOne({ _id: objectId });
  } catch (error) {
    return null; // Si el ID no es un ObjectId válido, retorna null
  }
}

// Busca usuarios por coincidencia parcial de nombre, apellido o DNI con paginación
export async function searchUsersPaginated(
  query: string,
  page: number = 1,
  limit: number = 10
) {
  const collection = getUserCollection();
  const skip = (page - 1) * limit;

  // Escapamos caracteres especiales de regex para evitar errores si el usuario busca símbolos especiales
  const escapedQuery = query.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");

  const filter = {
    $or: [
      { nombre: { $regex: escapedQuery, $options: "i" } },
      { apellido: { $regex: escapedQuery, $options: "i" } },
      { dni: { $regex: escapedQuery, $options: "i" } },
    ],
  };

  const totalItems = await collection.countDocuments(filter);
  const items = await collection
    .find(filter, { projection: { contrasena: 0 } }) // Excluimos el hash de contraseña
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

// Actualiza los datos de un usuario por su ID de forma segura
export async function updateUser(
  id: string | ObjectId,
  updateData: Partial<User>
): Promise<User | null> {
  const collection = getUserCollection();
  const objectId = typeof id === "string" ? new ObjectId(id) : id;
  
  await collection.updateOne({ _id: objectId }, { $set: updateData });
  return findUserById(objectId);
}

// Crea índices automáticos en MongoDB para búsquedas rápidas y evitar duplicados
export async function ensureUserIndexes() {
  const collection = getUserCollection();
  try {
    // 1. Índice único de correo
    await collection.createIndex({ email: 1 }, { unique: true });

    // 2. Índice único de DNI
    await collection.createIndex({ dni: 1 }, { unique: true });

    // 3. Índice compuesto para acelerar las búsquedas por nombre, apellido y DNI
    await collection.createIndex({ nombre: 1, apellido: 1, dni: 1 });

    console.log("✅ Índices de la colección 'users' asegurados.");
  } catch (error) {
    console.error("❌ Error al crear índices en 'users':", error);
  }
}

