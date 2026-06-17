import { ObjectId } from "mongodb";
import { db } from "../index.ts";

export interface Configuracion {
  _id?: ObjectId;
  aforoTotal: number;
  precioBaseCents: number; // Guardado en centavos para precisión total (ej. 5000 = $50.00)
  incrementoCents: number;  // Guardado en centavos para precisión total (ej. 200 = $2.00)
}

// Retorna la colección "config" de MongoDB
export function getConfigCollection() {
  return db.collection<Configuracion>("config");
}

// Obtiene la configuración actual del evento
export async function getConfig(): Promise<Configuracion | null> {
  return getConfigCollection().findOne({});
}

// Actualiza o crea la configuración (Upsert)
export async function updateConfig(configData: Omit<Configuracion, "_id">): Promise<Configuracion> {
  const collection = getConfigCollection();

  // Actualiza el primer documento que encuentre o crea uno nuevo si está vacía la colección
  const result = await collection.findOneAndUpdate(
    {},
    { $set: configData },
    { upsert: true, returnDocument: "after" }
  );

  return result!;
}

// Siembra la configuración inicial por defecto si la base de datos está vacía
export async function seedDefaultConfig() {
  try {
    const config = await getConfig();
    if (!config) {
      console.log("🌱 No se encontró configuración del evento. Creando valores por defecto...");
      
      await getConfigCollection().insertOne({
        aforoTotal: 100,       // 100 personas de aforo total
        precioBaseCents: 5000, // $50.00 base
        incrementoCents: 200,  // $2.00 por ticket vendido
      });
      
      console.log("✅ Configuración inicial creada (Aforo: 100, Base: $50.00, Incremento: $2.00).");
    } else {
      console.log("ℹ️ La configuración del evento ya existe. No se requiere semilla.");
    }
  } catch (error) {
    console.error("❌ Error al sembrar la configuración inicial del evento:", error);
  }
}
