import { Request, Response } from "express";
import { Configuration, OpenAIApi } from "openai";

// Setup OpenAI API
const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}));

export const saveNote = (req: Request, res: Response) => {
    const { noteText } = req.body;
    // Aici poți salva nota într-o bază de date (SQLite/PostgreSQL)
    return res.status(200).json({ message: "Note saved successfully" });
};

export const generateSummary = async (req: Request, res: Response) => {
    const { noteText } = req.body;

    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [{ role: "user", content: noteText }],
        });

        const summary = completion.data.choices[0].message?.content;
        res.status(200).json({ summary });
    } catch (error) {
        res.status(500).json({ error: "Error generating summary" });
    }
};
