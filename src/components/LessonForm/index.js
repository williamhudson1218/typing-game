import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import KeyboardKey from "../KeyboardKey";

const LessonForm = ({
  title,
  setTitle,
  words,
  setWords,
  isPictureMode,
  setIsPictureMode,
  isKeyLocationMode,
  setIsKeyLocationMode,
  wordEmojiMap,
  setWordEmojiMap,
  newLetters,
  setNewLetters,
  onSubmit,
  onCancel,
  submitButtonText,
}) => {
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

  return (
    <form onSubmit={onSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Lesson Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
        />

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
          <Button variant="outlined" color="error" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {submitButtonText}
          </Button>
        </Box>
      </Stack>
    </form>
  );
};

export default LessonForm;
