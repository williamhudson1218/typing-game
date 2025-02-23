import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { suggestEmoji } from "../utils/emojiMap";

const AddLesson = () => {
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");
  const [isPictureMode, setIsPictureMode] = useState(false);
  const [wordEmojiMap, setWordEmojiMap] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const wordArray = words.trim().split(/\s+/);
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];

    // Create emoji map if in picture mode
    const emojiMap = isPictureMode
      ? wordArray.reduce(
          (map, word) => ({
            ...map,
            [word]: wordEmojiMap[word] || suggestEmoji(word) || "❓",
          }),
          {}
        )
      : {};

    const newLesson = {
      id: Date.now(),
      title: title.trim(),
      words: wordArray,
      isPictureMode,
      emojiMap, // Make sure we're saving the complete emoji map
      completed: false,
    };

    console.log("Saving lesson with emojiMap:", newLesson); // Debug log
    lessons.push(newLesson);
    localStorage.setItem("lessons", JSON.stringify(lessons));
    navigate("/lessons");
  };

  // Update the useEffect to auto-populate emojis
  useEffect(() => {
    if (isPictureMode && words) {
      const wordArray = words.trim().split(/\s+/);
      const newEmojiMap = {};

      wordArray.forEach((word) => {
        // Keep existing mappings or get new suggestion
        newEmojiMap[word] = wordEmojiMap[word] || suggestEmoji(word) || "❓";
      });

      setWordEmojiMap(newEmojiMap);
    }
  }, [words, isPictureMode, wordEmojiMap]);

  const handleEmojiSelect = (word) => {
    // Open the native emoji picker
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.right = "0";
    input.style.top = "0";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.focus();

    const cleanup = () => {
      document.body.removeChild(input);
      window.removeEventListener("emoji-click", handleEmojiClick);
    };

    const handleEmojiClick = (event) => {
      setWordEmojiMap((prev) => ({
        ...prev,
        [word]: event.detail.emoji,
      }));
      cleanup();
    };

    window.addEventListener("emoji-click", handleEmojiClick);
    input.addEventListener("blur", cleanup);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Add New Lesson
      </Typography>
      <Paper sx={{ p: 4, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Lesson Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Lesson Words"
              value={words}
              onChange={(e) => setWords(e.target.value)}
              required
              fullWidth
              multiline
              rows={4}
              helperText="Enter words separated by spaces"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={isPictureMode}
                  onChange={(e) => setIsPictureMode(e.target.checked)}
                />
              }
              label="Picture Mode (uses emojis)"
            />

            {isPictureMode && words && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Emoji Mappings (click to change):
                </Typography>
                <List>
                  {words
                    .trim()
                    .split(/\s+/)
                    .map((word) => (
                      <ListItem key={word}>
                        <ListItemText primary={word} />
                        <Chip
                          label={wordEmojiMap[word] || "Select emoji"}
                          onClick={() => handleEmojiSelect(word)}
                          icon={<EditIcon />}
                        />
                      </ListItem>
                    ))}
                </List>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => navigate("/lessons")}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained">
                Create Lesson
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default AddLesson;
