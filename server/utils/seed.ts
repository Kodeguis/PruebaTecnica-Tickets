import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, getUserCollection } from "../models/user.model.ts";

export async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminDni = process.env.ADMIN_DNI;
  const adminName = process.env.ADMIN_NAME;
  const adminLastname = process.env.ADMIN_LASTNAME;

  if (!adminEmail || !adminPassword || !adminDni || !adminName || !adminLastname) {
    console.warn("⚠️ Semilla de administrador omitida: Faltan variables de configuración en el archivo .env");
    return;
  }

  try {
    // Verificamos si existe AL MENOS un usuario con el rol 'admin'
    const adminExists = await getUserCollection().findOne({ rol: "admin" });

    if (!adminExists) {
      console.log("🌱 No se encontró ningún administrador en la base de datos. Creando administrador inicial...");

      // Encriptamos la contraseña del admin inicial
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await createUser({
        dni: adminDni.trim(),
        email: adminEmail.trim(),
        nombre: adminName.trim(),
        apellido: adminLastname.trim(),
        contrasena: hashedPassword,
        rol: "admin",
      });

      console.log(`✅ Administrador inicial creado con éxito: ${adminEmail}`);
    } else {
      console.log("ℹ️ El administrador ya existe en la base de datos. No se requiere semilla.");
    }
  } catch (error) {
    console.error("❌ Error al sembrar el administrador inicial:", error);
  }
}
