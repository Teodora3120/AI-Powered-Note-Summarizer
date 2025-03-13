import express from "express";
import {
  saveNote,
  getNotes,
  generateSummary,
} from "../controllers/noteController.ts";

export const noteRouter = express.Router();

noteRouter.post("/save", saveNote);
noteRouter.get("/", getNotes);
noteRouter.post("/summarize", generateSummary);
