import { useEffect, useState } from "react";
import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";
import { NotesApi } from "../api/index";
import { formatStreamingText } from "../utils/formatStreamingText";

// Define Note type
interface Note {
  id: number;
  content: string;
  createdAt: string;
}

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [errMessage, setErrMessage] = useState<string>("");

  const Api = new NotesApi();

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      setSelectedNote(notes[0]); // Set the latest note by default
    }
  }, [notes]);

  const getNotes = async () => {
    try {
      const response = await Api.getNotes();
      const sortedNotes = (response.notes || []).sort(
        (a: Note, b: Note) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotes(sortedNotes);
    } catch (err: any) {
      console.error("Could not fetch notes", err);
      setErrMessage(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6 flex gap-4">
      {/* Left Panel - Notes List */}
      <div className="w-1/3 border-r border-gray-300 h-screen overflow-auto">
        <Typography variant="h4" className="p-4 font-bold">
          Notes
        </Typography>
        <List>
          {notes.map((note) => (
            <ListItem
              component="button"
              key={note.id}
              onClick={() => setSelectedNote(note)}
              sx={{
                bgcolor: selectedNote?.id === note.id ? "#f0f0f0" : "white",
                borderBottom: "1px solid #ddd",
              }}
            >
              <ListItemText
                primary={note.content.substring(0, 30) + "..."}
                secondary={new Date(note.createdAt).toLocaleDateString()}
              />
            </ListItem>
          ))}
        </List>
      </div>

      {/* Right Panel - Selected Note */}
      <div className="w-2/3 p-6 flex justify-center items-center">
        {selectedNote ? (
          <Paper
            elevation={3}
            sx={{
              bgcolor: "#fdf6e3",
              padding: "70px",
              width: "500px",
              height: "300px",
              borderRadius: "8px",
              boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
              transform: `rotate(${Math.random() * 6 - 3}deg)`,
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "black" }}
              dangerouslySetInnerHTML={{
                __html: formatStreamingText(selectedNote.content),
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: "gray", display: "block", mt: 1 }}
            >
              {new Date(selectedNote.createdAt).toLocaleDateString()}
            </Typography>
          </Paper>
        ) : errMessage ? (
          <Typography variant="h6" className="!text-red-800">
            {errMessage}
          </Typography>
        ) : (
          <Typography variant="h6" sx={{ color: "gray" }}>
            No saved notes yet...
          </Typography>
        )}
      </div>
    </div>
  );
};
