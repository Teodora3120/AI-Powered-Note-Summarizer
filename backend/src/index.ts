import express from "express";
import cors from "cors";
import { noteRouter } from "./routes/noteRoutes.ts";
import { AppDataSource } from "./db.ts";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 5000;

// ✅ Initialize the database before starting the server
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Connected to PostgreSQL with TypeORM");

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use("/api/v1/notes", noteRouter);

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on PORT ${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection error:", error);
  });
