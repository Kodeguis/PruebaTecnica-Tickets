import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.model.ts";
import type { User } from "../models/user.model.ts";

const JWT_SECRET = process.env.JWT_SECRET ?? "super_secreto_para_firmar_tokens_123";

// Extendemos la interfaz Request de Express de forma local y explícita
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware para verificar que el usuario esté logueado
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Extraemos el token desde las cookies
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: "Acceso denegado: Inicia sesión para continuar" });
    return;
  }

  try {
    // Decodificamos y verificamos la firma del JWT
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; rol: string };

    // Buscamos el usuario en la base de datos
    const user = await findUserById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: "Acceso denegado: El usuario ya no existe" });
      return;
    }

    // Inyectamos el usuario en la request para que los siguientes controladores lo usen
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Acceso denegado: Sesión inválida o expirada" });
    return;
  }
}

// Middleware para validar el rol del usuario (Control de Acceso Basado en Roles — RBAC)
export function requireRole(allowedRoles: ("user" | "admin")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // requireRole siempre debe ir después de requireAuth, por lo que req.user ya debe existir
    if (!req.user) {
      res.status(401).json({ error: "Acceso denegado: No autenticado" });
      return;
    }

    // Si el rol del usuario no está dentro de la lista de roles permitidos, lanzamos 403 Forbidden
    if (!allowedRoles.includes(req.user.rol)) {
      res.status(403).json({ error: "Acceso prohibido: No tienes permisos para realizar esta acción" });
      return;
    }

    next();
  };
}
