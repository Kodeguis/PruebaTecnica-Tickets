import { Router } from "express";
import { buyTicket, getMyTickets, getTicketDetail } from "../controllers/ticket.controller.ts";
import { requireAuth } from "../middleware/auth.middleware.ts";

const router = Router();

// Comprar un ticket (Protegido)
router.post("/buy", requireAuth, buyTicket);

// Obtener mis tickets comprados (Protegido)
router.get("/my", requireAuth, getMyTickets);

// Obtener el detalle de un ticket específico (Protegido - con validación de dueño o admin)
router.get("/:ticketId", requireAuth, getTicketDetail);

export default router;
