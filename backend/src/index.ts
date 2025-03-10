import express from "express";
import cors from "cors";
import { noteRouter } from "./routes/noteRoutes";
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notes", noteRouter);

// Start server
app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
});
