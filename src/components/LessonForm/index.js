import React, { useState, useCallback } from "react";
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
  Popover,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";
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
  isSentenceMode,
  setIsSentenceMode,
  wordEmojiMap,
  setWordEmojiMap,
  newLetters,
  setNewLetters,
  onSubmit,
  onCancel,
  submitButtonText,
}) => {
  const [emojiPickerState, setEmojiPickerState] = useState({
    isOpen: false,
    anchorEl: null,
    selectedWord: null,
  });

  const handleEmojiSelect = useCallback((word, event) => {
    setEmojiPickerState({
      isOpen: true,
      anchorEl: event.currentTarget,
      selectedWord: word,
    });
  }, []);

  const handleEmojiClick = useCallback(
    (emojiData) => {
      if (emojiPickerState.selectedWord) {
        setWordEmojiMap((prev) => ({
          ...prev,
          [emojiPickerState.selectedWord]: emojiData.emoji,
        }));
      }
      setEmojiPickerState({
        isOpen: false,
        anchorEl: null,
        selectedWord: null,
      });
    },
    [emojiPickerState.selectedWord, setWordEmojiMap]
  );

  const handleClose = useCallback(() => {
    setEmojiPickerState({
      isOpen: false,
      anchorEl: null,
      selectedWord: null,
    });
  }, []);

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

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <FormControlLabel
            control={
              <Switch
                checked={isPictureMode}
                onChange={(e) => {
                  setIsPictureMode(e.target.checked);
                  if (e.target.checked) {
                    setIsKeyLocationMode(false);
                    setIsSentenceMode(false);
                  }
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
                  if (e.target.checked) {
                    setIsPictureMode(false);
                    setIsSentenceMode(false);
                  }
                }}
              />
            }
            label="Key Location Mode"
          />
          <FormControlLabel
            control={
              <Switch
                checked={isSentenceMode}
                onChange={(e) => {
                  setIsSentenceMode(e.target.checked);
                  if (e.target.checked) {
                    setIsPictureMode(false);
                    setIsKeyLocationMode(false);
                  }
                }}
              />
            }
            label="Sentence Mode"
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
          label={isSentenceMode ? "Lesson Sentences" : "Lesson Words"}
          value={words}
          onChange={(e) => setWords(e.target.value)}
          required
          fullWidth
          multiline
          rows={6}
          helperText={
            isSentenceMode
              ? "Enter sentences separated by line breaks (Enter key)"
              : "Enter words separated by spaces"
          }
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
                      onClick={(event) => handleEmojiSelect(word, event)}
                      icon={<EditIcon />}
                    />
                  </ListItem>
                ))}
            </List>
            <Popover
              id="emoji-popover"
              open={emojiPickerState.isOpen}
              anchorEl={emojiPickerState.anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              sx={{ zIndex: 1300 }}
            >
              <Box sx={{ p: 1 }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </Box>
            </Popover>
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
