import express from "express";
import { saveNote, generateSummary } from "../controllers/noteController";

export const noteRouter = express.Router();

noteRouter.post("/save", saveNote);
noteRouter.post("/summarize", generateSummary);
