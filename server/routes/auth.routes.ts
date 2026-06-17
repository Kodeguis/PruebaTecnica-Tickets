import { Router } from "express";
import { register, login, logout, me, updateProfile } from "../controllers/auth.controller.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

const router = Router();

// Ruta de registro público (rol 'user')
router.post("/register", register);

// Ruta de login público
router.post("/login", login);

// Ruta para cerrar sesión
router.post("/logout", logout);

// Ruta protegida para obtener los datos de la sesión actual
router.get("/me", requireAuth, me);

// Ruta protegida para actualizar el perfil del usuario
router.put("/update", requireAuth, updateProfile);

export default router;
