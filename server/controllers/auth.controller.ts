import type { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail, findUserByDni, updateUser } from "../models/user.model.ts";
import type { User } from "../models/user.model.ts";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.ts";

const JWT_SECRET = process.env.JWT_SECRET ?? "super_secreto_para_firmar_tokens_123";
const IS_PROD = process.env.NODE_ENV === "production";

// Registrar un usuario con rol 'user'
export async function register(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { dni, email, nombre, apellido, contrasena } = req.body;

  // 1. Validar que todos los campos requeridos estén presentes
  if (!dni || !email || !nombre || !apellido || !contrasena) {
    res.status(400).json({ error: "Todos los campos son requeridos (dni, email, nombre, apellido, contrasena)" });
    return;
  }

  try {
    // 2. Verificar duplicados de Correo Electrónico
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      res.status(400).json({ error: "El correo electrónico ingresado ya está registrado" });
      return;
    }

    // 3. Verificar duplicados de DNI (Se almacena exactamente como lo escribe el usuario)
    const existingDni = await findUserByDni(dni);
    if (existingDni) {
      res.status(400).json({ error: "El DNI ingresado ya está registrado" });
      return;
    }

    // 4. Encriptar la contraseña de manera segura
    const hashedPassword = await bcrypt.hash(contrasena.trim(), 10);

    // 5. Insertar el usuario en la base de datos
    const newUser = await createUser({
      dni: dni.toString().trim(),
      email: email.trim(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      contrasena: hashedPassword,
      rol: "user",
    });

    // 6. Enviar la respuesta sin incluir el hash de la contraseña por seguridad
    const { contrasena: _, ...userResponse } = newUser;
    res.status(201).json({
      message: "Usuario registrado con éxito",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Ocurrió un error en el servidor al procesar el registro" });
  }
}

// Iniciar sesión y establecer cookie JWT
export async function login(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    res.status(400).json({ error: "El correo electrónico y la contraseña son requeridos" });
    return;
  }

  try {
    // 1. Buscar el usuario en la BD por correo electrónico
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Credenciales de acceso incorrectas" });
      return;
    }

    // 2. Comparar la contraseña provista con la encriptada en la BD
    const isMatch = await bcrypt.compare(contrasena.trim(), user.contrasena);
    if (!isMatch) {
      res.status(401).json({ error: "Credenciales de acceso incorrectas" });
      return;
    }

    // 3. Generar token JWT firmado
    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 4. Adjuntar el token en una cookie HttpOnly segura
    res.cookie("token", token, {
      httpOnly: true, // Protege contra vulnerabilidades XSS
      secure: IS_PROD, // Solo transmite sobre HTTPS en producción
      sameSite: "lax", // Mitiga ataques CSRF
      maxAge: 24 * 60 * 60 * 1000, // Duración de 24 horas
    });

    // 5. Responder al cliente
    const { contrasena: _, ...userResponse } = user;
    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Ocurrió un error en el servidor al intentar iniciar sesión" });
  }
}

// Cerrar sesión limpiando la cookie del token
export async function logout(req: AuthenticatedRequest, res: Response): Promise<void> {
  res.clearCookie("token", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
  });
  res.status(200).json({ message: "Sesión cerrada correctamente" });
}

// Retornar los datos del usuario autenticado actual (sesión activa)
export async function me(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user || !req.user._id) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  const { contrasena: _, ...userResponse } = req.user;
  res.status(200).json({ user: userResponse });
}

// Actualizar el perfil del usuario autenticado
export async function updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user || !req.user._id) {
    res.status(401).json({ error: "Acceso denegado: No autenticado" });
    return;
  }

  const { nombre, apellido, dni, contrasena } = req.body;

  if (!nombre || !apellido || !dni) {
    res.status(400).json({ error: "Nombre, apellido y DNI son campos obligatorios" });
    return;
  }

  try {
    const userId = req.user._id;

    // Si el DNI cambia, validar que no esté en uso por otro usuario
    if (dni.trim() !== req.user.dni) {
      const existingDni = await findUserByDni(dni.trim());
      if (existingDni && existingDni._id?.toString() !== userId.toString()) {
        res.status(400).json({ error: "El DNI ingresado ya está registrado por otro usuario" });
        return;
      }
    }

    const updateData: Partial<User> = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      dni: dni.trim(),
    };

    // Si se provee contraseña, encriptarla de forma segura
    if (contrasena && contrasena.trim().length >= 6) {
      const hashedPassword = await bcrypt.hash(contrasena.trim(), 10);
      updateData.contrasena = hashedPassword;
    } else if (contrasena && contrasena.trim().length > 0 && contrasena.trim().length < 6) {
      res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    const updatedUser = await updateUser(userId, updateData);
    if (!updatedUser) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const { contrasena: _, ...userResponse } = updatedUser;
    res.status(200).json({
      message: "Perfil actualizado con éxito",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error en el servidor al intentar actualizar el perfil" });
  }
}
