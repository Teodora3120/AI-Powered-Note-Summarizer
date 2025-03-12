import { useState } from "react";
import { Button, TextField, Card, Typography } from "@mui/material";
import { NotesApi } from "../api/index";

export const NoteInput = () => {
  const [noteText, setNoteText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");

  const Api = new NotesApi();

  const handleSaveNote = async () => {
    const response = await Api.handleSaveNote(noteText);
    console.log(response);
  };

  //   const handleGenerateSummary = async () => {
  //     setSummary(""); // Reset before starting

  //     await Api.handleGenerateSummary(noteText, (chunk) => {
  //       setSummary((prev) => prev + chunk); // Append streamed text to summary
  //     });
  //   };

  const handleGenerateSummary = async () => {
    setSummary(""); // Reset before starting

    let buffer = ""; // Temporary storage for incoming text
    await Api.handleGenerateSummary(noteText, async (chunk) => {
      buffer += chunk; // Append new chunk to the buffer
      const words = buffer.split(" "); // Split into words

      for (let i = 0; i < words.length; i++) {
        setSummary((prev) => prev + words[i] + " "); // Append word-by-word
        await new Promise((resolve) => setTimeout(resolve, 50)); // ⏳ Delay (adjust as needed)
      }

      buffer = ""; // Reset buffer after processing
    });
  };

  return (
    <>
      <div>
        <TextField
          label="Introduceti notita"
          multiline
          fullWidth
          rows={4}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <Button variant="contained" onClick={handleSaveNote}>
          Salvare
        </Button>
        <Button variant="contained" onClick={handleGenerateSummary}>
          Generează rezumat AI
        </Button>

        {summary && (
          <Card>
            <Typography variant="h6">Rezumat AI:</Typography>
            <Typography>{summary}</Typography>
          </Card>
        )}
      </div>
      <div>
        <Button className="bg-red-900 g-blue-500 py-2 px-4 rounded">
          Tailwind
        </Button>
      </div>
    </>
  );
};
