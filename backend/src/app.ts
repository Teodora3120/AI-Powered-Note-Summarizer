import express from "express";
import cors from "cors";
import helmet from "helmet"; // Security middleware
import { noteRouter } from "./routes/noteRoutes.ts";

const app = express();

// ✅ Security Middlewares
app.use(cors()); // Enable CORS
app.use(helmet()); // Adds security headers
app.use(express.json()); // Parse JSON

// ✅ Routes
app.use("/api/v1/notes", noteRouter);

export default app; // Export the configured app
