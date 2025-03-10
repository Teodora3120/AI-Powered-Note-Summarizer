import { useState } from "react";
import { Button, TextField, Card, Typography } from "@mui/material";
import { NotesApi } from '../api/index'

export const NoteInput = () => {
    const [noteText, setNoteText] = useState<string>("");
    const [summary, setSummary] = useState<string>("");

    const Api = new NotesApi();

    const handleSaveNote = async () => {
        const response = await Api.handleSaveNote(noteText)
        console.log(response);
    }

    const handleGenerateSummary = async () => {
        const response = await Api.handleGenerateSummary(noteText)
        console.log(response);
    }


    return (
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
    );
};
