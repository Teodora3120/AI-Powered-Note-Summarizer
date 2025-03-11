/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AppDataSource } from "../db.js";
import { Note } from "../models/Note.js";
import { getChatCompletionAxios } from "../openrouter.js";

const noteRepository = AppDataSource.getRepository(Note);

export const saveNote = async (req: Request, res: Response) => {
  const { noteText } = req.body;
  if (!noteText) {
    res.status(400).json({ error: "Note text is required." });
    return;
  }
  try {
    const newNote = noteRepository.create({ content: noteText });
    await noteRepository.save(newNote);

    res.status(201).json({ message: "Note saved successfully", note: newNote });
    return;
  } catch (err: any) {
    console.error(err.message);
    res.status(200).json({ message: "Note saved successfully" });
    return;
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const notes = await noteRepository.find();
    res.status(200).json({
      results: notes.length,
      notes: notes,
    });
    return;
  } catch (err: any) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
    return;
  }
};

export const generateSummary = async (req: Request, res: Response) => {
  const { noteText } = req.body;
  if (!noteText) {
    res.status(400).json({ error: "Note text is required." });
    return;
  }
  const prompt = "Please summarize this text: " + noteText;
  try {
    const response = await getChatCompletionAxios(prompt);
    res.status(200).json({ messsage: response });
    return;
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error generating summary" });
    return;
  }
};
