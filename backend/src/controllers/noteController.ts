/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { AppDataSource } from "../db.ts";
import { Note } from "../models/Note.ts";
import { getChatCompletion, getChatCompletion2 } from "../openrouter.ts";

const noteRepository = AppDataSource.getRepository(Note);

export const saveNote = async (req: Request, res: Response) => {
  const { summary } = req.body;
  if (!summary) {
    res.status(400).json({ error: "Note text is required." });
    return;
  }
  try {
    console.log(summary);
    const newNote = noteRepository.create({ content: summary });
    await noteRepository.save(newNote);
    res.status(201).json({ message: "Note saved successfully", note: newNote });
    return;
  } catch (err: any) {
    console.error(err.message);
    res.status(200).json({ message: err.message });
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
  const { noteText, temperature, tone, length } = req.body;
  if (!noteText) {
    res.status(400).json({ error: "Note text is required." });
    return;
  }
  const lengthLimits: { [key: string]: string } = {
    short: "between 20 and 100",
    medium: "between 100 and 200",
    long: "between 200 and 300",
  };

  const prompt = `Summarize the following text in a ${tone} tone. The summary must be ${lengthLimits[length]} characters long. Keep key details and ensure clarity:\n\n"${noteText}"`;
  console.log(`Prompt: ${prompt}`);
  await getChatCompletion2(prompt);
  await getChatCompletion(prompt, res, temperature);
};
