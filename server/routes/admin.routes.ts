import { Router } from "express";
import { getStats, getSalesList, searchUsers } from "../controllers/admin.controller.ts";
import { requireAuth, requireRole } from "../middleware/auth.middleware.ts";

const router = Router();

// Todas las rutas de administración están protegidas bajo autenticación + rol 'admin'
router.use(requireAuth, requireRole(["admin"]));

// Obtener estadísticas de ventas y ganancias
router.get("/stats", getStats);

// Listar ventas detalladas (Paginado)
router.get("/sales", getSalesList);

// Buscar usuarios por nombre, apellido o DNI (Paginado)
router.get("/users/search", searchUsers);

export default router;
