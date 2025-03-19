import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Button,
} from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { NotesApi } from "../api/index";
import { formatStreamingText } from "../utils/formatStreamingText";
import pink from "@mui/material/colors/pink";

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
  const [copied, setCopied] = useState(false);

  const Api = new NotesApi();

  useEffect(() => {
    getNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getNotes();
    document.body.style.overflow = "hidden";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      setSelectedNote(notes[0]);
    }
  }, [notes]);

  const handleCopy = async (noteText: string) => {
    try {
      await navigator.clipboard.writeText(noteText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleDeleteNote = async (id: Number) => {
    try {
      if (!id) {
        return;
      }
      const response = await Api.handleDeleteNote(id);
      console.log(response);
      getNotes();
    } catch (err: any) {
      console.error("Could not save note", err);
      setErrMessage(err.message);
    }
  };

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
    <div className="container mx-auto p-6 flex gap-4 flex h-screen">
      {/* Left Panel - Notes List */}
      <div className="w-1/3 border-r border-gray-300 h-full flex flex-col">
        <div className="p-2 font-bold sticky top-0  z-10">
          <Typography variant="h4">Notes</Typography>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "80vh" }}>
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
                  primary={note.content.substring(0, 50) + "..."}
                  secondary={new Date(note.createdAt).toLocaleDateString()}
                />
                <Grid size={{ xs: 8 }} sx={{ color: pink[500] }}>
                  <DeleteOutlinedIcon
                    onClick={() => handleDeleteNote(note.id)}
                  />
                </Grid>
              </ListItem>
            ))}
          </List>
        </div>
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
              height: "500px",
              borderRadius: "8px",
              boxShadow: "4px 4px 10px rgba(0,0,0,0.2)",
              transform: `rotate(${Math.random() * 6 - 3}deg)`,
            }}
            className="!copy-box"
          >
            <Tooltip
              title={copied ? "Copied! Paste away. 🚀" : "Copy to clipboard"}
            >
              <Button
                onClick={() => handleCopy(selectedNote.content)}
                sx={{ minWidth: "30px" }}
              >
                <ContentCopyIcon sx={{ height: "20px", color: "#216C17" }} />
              </Button>
            </Tooltip>
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
