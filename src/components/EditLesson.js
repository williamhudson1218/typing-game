import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import KeyboardKey from "./KeyboardKey";

const EditLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");
  const [isPictureMode, setIsPictureMode] = useState(false);
  const [isKeyLocationMode, setIsKeyLocationMode] = useState(false);
  const [wordEmojiMap, setWordEmojiMap] = useState({});
  const [newLetters, setNewLetters] = useState("");

  useEffect(() => {
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const lesson = lessons.find((l) => l.id === parseInt(id));
    if (lesson) {
      setTitle(lesson.title);
      setWords(lesson.words.join(" "));
      setIsPictureMode(lesson.isPictureMode || false);
      setIsKeyLocationMode(lesson.isKeyLocationMode || false);
      setWordEmojiMap(lesson.emojiMap || {});
      setNewLetters(lesson.newLetters ? lesson.newLetters.join("") : "");
    } else {
      navigate("/lessons");
    }
  }, [id, navigate]);

  // Auto-populate emojis when in picture mode
  useEffect(() => {
    if (isPictureMode && words) {
      const wordArray = words.trim().split(/\s+/);
      const newEmojiMap = {};

      wordArray.forEach((word) => {
        newEmojiMap[word] = wordEmojiMap[word] || suggestEmoji(word) || "❓";
      });

      setWordEmojiMap(newEmojiMap);
    }
  }, [words, isPictureMode, wordEmojiMap]);

  const handleEmojiSelect = (word) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const wordArray = words.trim().split(/\s+/);
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];

    const updatedLessons = lessons.map((lesson) =>
      lesson.id === parseInt(id)
        ? {
            ...lesson,
            title: title.trim(),
            words: wordArray,
            isPictureMode,
            isKeyLocationMode,
            newLetters: isKeyLocationMode ? newLetters.trim().split("") : [],
            emojiMap: isPictureMode ? wordEmojiMap : {},
          }
        : lesson
    );

    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
    navigate("/lessons");
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Edit Lesson
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

            {/* Mode switches */}
            <Box sx={{ display: "flex", gap: 4 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPictureMode}
                    onChange={(e) => {
                      setIsPictureMode(e.target.checked);
                      if (e.target.checked) setIsKeyLocationMode(false);
                    }}
                  />
                }
                label="Picture Mode (uses emojis)"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={isKeyLocationMode}
                    onChange={(e) => {
                      setIsKeyLocationMode(e.target.checked);
                      if (e.target.checked) setIsPictureMode(false);
                    }}
                  />
                }
                label="Key Location Mode"
              />
            </Box>

            {isKeyLocationMode && (
              <TextField
                label="New Letters to Learn"
                value={newLetters}
                onChange={(e) =>
                  setNewLetters(e.target.value.replace(/[^a-zA-Z]/g, ""))
                }
                helperText="Enter the new letters to learn (letters only)"
                fullWidth
              />
            )}

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

            {isKeyLocationMode && newLetters && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Key Locations:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {newLetters.split("").map((letter, index) => (
                    <KeyboardKey key={index} letter={letter} />
                  ))}
                </Box>
              </Box>
            )}

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
                Save Changes
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default EditLesson;
