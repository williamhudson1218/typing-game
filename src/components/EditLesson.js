import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

const EditLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");

  useEffect(() => {
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const lesson = lessons.find((l) => l.id === parseInt(id));
    if (lesson) {
      setTitle(lesson.title);
      setWords(lesson.words.join(" "));
    } else {
      navigate("/lessons");
    }
  }, [id, navigate]);

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
