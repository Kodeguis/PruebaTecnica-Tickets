import express from "express";
import { MongoClient, Db } from "mongodb";
import cookieParser from "cookie-parser";
import cors from "cors";
import { seedAdmin } from "./utils/seed.ts";
import { ensureUserIndexes } from "./models/user.model.ts";
import { seedDefaultConfig } from "./models/config.model.ts";
import authRoutes from "./routes/auth.routes.ts";
import configRoutes from "./routes/config.routes.ts";
import ticketRoutes from "./routes/ticket.routes.ts";
import adminRoutes from "./routes/admin.routes.ts";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME ?? "mydb";
const PORT = Number(process.env.PORT) || 3000;

// Exportamos la instancia db para que sea accesible por otros archivos (modelos, etc.)
export let db: Db;

async function main() {
  const client = new MongoClient(MONGO_URI);

  await client.connect();
  db = client.db(DB_NAME);
  console.log(`Connected to MongoDB — db: ${DB_NAME}`);

  // Asegurar la existencia de índices de rendimiento y duplicidad
  await ensureUserIndexes();

  // Semilla de administrador inicial
  await seedAdmin();
  // Semilla de configuración inicial
  await seedDefaultConfig();

  const app = express();

  // Middlewares requeridos
  app.use(cors({
    origin: "http://localhost:5173", // Permitir solicitudes del frontend local
    credentials: true,               // Permitir cookies HTTP-Only de sesión JWT
  }));
  app.use(express.json()); // Permite procesar cuerpos en formato JSON
  app.use(cookieParser()); // Permite procesar cookies de la cabecera (para JWT HttpOnly)

  // Rutas de la API
  app.use("/api/auth", authRoutes);
  app.use("/api/config", configRoutes);
  app.use("/api/tickets", ticketRoutes);
  app.use("/api/admin", adminRoutes);

  app.get("/", (_req, res) => {
    res.send("Hello World!");
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  process.on("SIGINT", async () => {
    await client.close();
    process.exit(0);
  });
}

main().catch(console.error);

