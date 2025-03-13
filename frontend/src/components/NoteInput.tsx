import { useState } from "react";
import {
  Button,
  TextField,
  Card,
  Typography,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { NotesApi } from "../api/index";

export const NoteInput = () => {
  const [notes, setNotes] = useState<[]>([]);
  const [noteText, setNoteText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loadingGenerate, setLoadingGenerate] = useState<boolean>(false);
  const [loadingRegenerate, setLoadingRegenerate] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);

  const [temperature, setTemperature] = useState("medium");
  const [length, setLength] = useState("medium");
  const [tone, setTone] = useState("professional");

  const Api = new NotesApi();

  const handleSaveNote = async () => {
    try {
      setLoadingSave(true);
      const response = await Api.handleSaveNote(noteText);
      setNotes(response.data.notes);
      setLoadingSave(false);
    } catch (err: any) {
      console.error(err.message);
      setLoadingSave(false);
    }
  };

  const cleanLatex = (text: string) => {
    return text
      .replace(/\\boxed{([^{}]*)}/g, "$1")
      .replace(/\\box/g, "")
      .replace(/[{}]/g, "")
      .replace(/\s*,\s*/g, ", ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleGenerateSummary = async (button: string) => {
    setSummary("");

    if (button === "generate") setLoadingGenerate(true);
    if (button === "regenerate") setLoadingRegenerate(true);

    let buffer = "";
    await Api.handleGenerateSummary(noteText, async (chunk) => {
      buffer += chunk;
      const cleanedText = cleanLatex(buffer);
      setSummary(cleanedText);
    });

    if (button === "generate") setLoadingGenerate(false);
    if (button === "regenerate") setLoadingRegenerate(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Grid container spacing={4}>
        {/* Left Column - Input & Buttons */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Selection Dropdowns */}
          <div className="mb-4 flex space-x-4">
            <FormControl fullWidth variant="standard" size="small">
              <InputLabel>Temperature</InputLabel>
              <Select
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="standard" size="small">
              <InputLabel>Length</InputLabel>
              <Select
                value={length}
                onChange={(e) => setLength(e.target.value)}
              >
                <MenuItem value="short">Short</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="long">Long</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="standard" size="small">
              <InputLabel>Tone</InputLabel>
              <Select value={tone} onChange={(e) => setTone(e.target.value)}>
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="casual">Casual</MenuItem>
                <MenuItem value="academic">Academic</MenuItem>
              </Select>
            </FormControl>
          </div>

          <TextField
            label="Write a note..."
            multiline
            fullWidth
            rows={4}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="!mb-4"
          />

          {/* Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="contained"
              className="!bg-blue-600 !text-white"
              onClick={() => handleGenerateSummary("generate")}
              disabled={loadingGenerate}
              startIcon={
                loadingGenerate ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              Generate Summary
            </Button>
            <Button
              variant="contained"
              className="!bg-sky-500 !text-white"
              onClick={() => handleGenerateSummary("regenerate")}
              disabled={loadingRegenerate}
              startIcon={
                loadingRegenerate ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              Regenerate
            </Button>
          </div>
        </Grid>

        {/* Right Column - Summary Display */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="!p-4 !border !border-gray-300" variant="outlined">
            <CardContent>
              <Typography
                variant="h6"
                className={
                  summary ? "!text-gray-800" : "!text-gray-400 !italic"
                }
              >
                {summary || "Waiting for AI to generate summary..."}
              </Typography>
            </CardContent>
          </Card>

          <Button
            variant="contained"
            className="!mt-4 !bg-green-500 !text-white"
            onClick={handleSaveNote}
            disabled={loadingSave}
            startIcon={
              loadingSave ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};
