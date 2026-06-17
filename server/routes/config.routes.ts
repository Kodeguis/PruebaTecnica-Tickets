import { Router } from "express";
import { getEventConfig, updateEventConfig } from "../controllers/config.controller.ts";
import { requireAuth, requireRole } from "../middleware/auth.middleware.ts";

const router = Router();

// Obtener la configuración actual del evento (Público)
router.get("/", getEventConfig);

// Modificar la configuración (Protegido - Solo administradores)
router.put("/", requireAuth, requireRole(["admin"]), updateEventConfig);

export default router;
