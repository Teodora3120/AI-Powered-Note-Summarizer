import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { noteRouter } from "./routes/noteRoutes.ts";

const app = express();

// ✅ Rate Limiter: 2 requests per minute
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 2,
  message: { error: "Too many requests, please try again in a minute." },
  headers: true,
});
// ✅ Security Middlewares
app.use(cors()); // Enable CORS
app.use(helmet()); // Adds security headers
app.use(express.json()); // Parse JSON

app.use(limiter);

// ✅ Routes
app.use("/api/v1/notes", noteRouter);

export default app; // Export the configured app
