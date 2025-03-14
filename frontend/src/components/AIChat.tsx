import { useEffect, useState } from "react";
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
import { formatStreamingText } from "../utils/formatStreamingText";

export const AIChat = () => {
  const [noteText, setNoteText] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [temperature, setTemperature] = useState("medium");
  const temperatureMapping: { [key: string]: number } = {
    low: 0.3,
    medium: 0.7,
    high: 1.0,
  };

  const [loadingGenerate, setLoadingGenerate] = useState<boolean>(false);
  const [loadingRegenerate, setLoadingRegenerate] = useState<boolean>(false);
  const [loadingSave, setLoadingSave] = useState<boolean>(false);
  const [attemptedGenerate, setAttemptedGenerate] = useState<boolean>(false);

  const [attemptedSaving, setAttemptedSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>("");

  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  useEffect(() => {
    setAttemptedGenerate(false);
  }, [noteText]);

  useEffect(() => {
    setAttemptedSaving(false);
  }, [noteText, summary]);

  useEffect(() => {
    setErrMessage("");
  }, [noteText]);

  const Api = new NotesApi();

  const handleSaveNote = async () => {
    try {
      if (!summary) {
        setAttemptedSaving(true);
        return;
      }
      setAttemptedSaving(false);

      setLoadingSave(true);
      await Api.handleSaveNote(summary);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setLoadingSave(false);
    } catch (err: any) {
      console.error("Could not save note", err);
      setErrMessage(err.message);
      setLoadingSave(false);
    }
  };

  const handleGenerateSummary = async (button: string) => {
    try {
      if (!noteText) {
        setAttemptedGenerate(true);
        return;
      }
      setSummary("");

      if (button === "generate") setLoadingGenerate(true);
      if (button === "regenerate") setLoadingRegenerate(true);

      let buffer = "";

      // Create a new AbortController for each request
      const controller = new AbortController();
      setAbortController(controller); // Store it in state

      await Api.handleGenerateSummary(
        noteText,
        temperatureMapping[temperature] || 0.7,
        length,
        tone,
        (chunk) => {
          buffer += chunk; // Append new chunk
          const cleanedText = formatStreamingText(buffer);
          setSummary(cleanedText); // Update UI dynamically
        },
        controller.signal // Pass abort signal
      );

      setAbortController(null); // Reset after completion
      if (button === "generate") setLoadingGenerate(false);
      if (button === "regenerate") setLoadingRegenerate(false);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Streaming aborted.");
      } else {
        console.error("Could not generate summary", err);
        setErrMessage(err.message);
      }
    } finally {
      if (button === "generate") setLoadingGenerate(false);
      if (button === "regenerate") setLoadingRegenerate(false);
    }
  };

  const handleStopGenerating = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    setLoadingGenerate(false);
    setLoadingRegenerate(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Grid container spacing={4} display="flex" alignItems="flex-start">
        {/* Left Column - Input & Buttons */}
        <Grid size={{ xs: 12, md: 6 }} display="flex" flexDirection="column">
          {/* Selection Dropdowns */}
          <div className="mb-4 flex space-x-4">
            <FormControl fullWidth variant="standard" size="small">
              <InputLabel>Creativity</InputLabel>
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
            error={attemptedGenerate}
            helperText={attemptedGenerate ? "Note text is required" : ""}
          />

          {/* Buttons */}
          <div className="flex space-x-4">
            <Button
              variant="contained"
              className={`!text-white ${
                loadingSave ||
                loadingGenerate ||
                loadingRegenerate ||
                attemptedGenerate
                  ? "!bg-blue-600 !cursor-not-allowed"
                  : "!bg-blue-700"
              }`}
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
              className={`!text-white ${
                loadingSave ||
                loadingGenerate ||
                loadingRegenerate ||
                attemptedGenerate
                  ? "!bg-sky-500 !cursor-not-allowed"
                  : "!bg-sky-600"
              }`}
              onClick={() => handleGenerateSummary("regenerate")}
              disabled={loadingRegenerate || loadingGenerate}
              startIcon={
                loadingRegenerate ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              Regenerate
            </Button>
            {loadingRegenerate ||
              (loadingGenerate && (
                <Button
                  variant="contained"
                  className={`!text-white !bg-red-800`}
                  onClick={handleStopGenerating}
                  disabled={!loadingRegenerate && !loadingGenerate}
                >
                  Stop
                </Button>
              ))}
          </div>
        </Grid>

        {/* Right Column - Summary Display */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ mt: 4 }}
          display="flex"
          flexDirection="column"
        >
          {errMessage && (
            <Typography className="!text-red-800">{errMessage}</Typography>
          )}
          <Card
            className={`!p-4 !border ${
              errMessage ? "!border-red-700" : "!border-gray-300"
            }  `}
            variant="outlined"
          >
            {saveSuccess && (
              <Typography className="text-green-600 text-center">
                ✅ Note saved successfully!
              </Typography>
            )}
            <CardContent>
              <Typography
                variant={summary ? "body1" : "h6"}
                className={
                  summary
                    ? "prose prose-sm max-w-full"
                    : "!text-gray-400 !italic min-h-[80px] flex items-center justify-center"
                }
                dangerouslySetInnerHTML={{
                  __html: summary || "Waiting for AI to generate summary...",
                }}
              />
            </CardContent>
          </Card>

          <div className="mt-4 flex justify-center">
            <Button
              variant="contained"
              className={`!text-white ${
                loadingSave || loadingGenerate || loadingRegenerate
                  ? "!bg-green-500"
                  : attemptedSaving
                  ? "!bg-red-600"
                  : "!bg-green-600"
              }`}
              onClick={handleSaveNote}
              disabled={loadingSave || loadingGenerate || loadingRegenerate}
              sx={{ px: 10 }}
              startIcon={
                loadingSave ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {attemptedSaving ? "Failed saving..." : "Save"}
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
