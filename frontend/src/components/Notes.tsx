import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { NotesApi } from "../api/index";
import { formatStreamingText } from "../utils/formatStreamingText";

// Define Note type based on API response
interface Note {
  id: number;
  content: string;
  createdAt: string;
}

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]); // Updated state type
  const [errMessage, setErrMessage] = useState<string>("");

  useEffect(() => {
    getNotes();
  }, []);

  useEffect(() => {
    setErrMessage("");
  }, [notes]);

  const Api = new NotesApi();

  const getNotes = async () => {
    try {
      const response = await Api.getNotes();
      setNotes(response.notes || []);
    } catch (err: any) {
      console.error("Could not fetch notes", err);
      setErrMessage(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-wrap gap-4">
      {notes.length > 0 ? (
        notes.map((note) => (
          <Paper
            key={note.id}
            elevation={3}
            sx={{
              bgcolor: "yellow",
              padding: "16px",
              width: "250px",
              height: "150px",
              borderRadius: "8px",
              boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
              transform: `rotate(${Math.random() * 6 - 3}deg)`, // Slight random rotation
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", color: "black" }}
              dangerouslySetInnerHTML={{
                __html: formatStreamingText(note.content),
              }} // Display content
            />
            <Typography
              variant="caption"
              sx={{ color: "gray", display: "block", mt: 1 }}
            >
              {new Date(note.createdAt).toLocaleDateString()}{" "}
              {/* Format date */}
            </Typography>
          </Paper>
        ))
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
  );
};
