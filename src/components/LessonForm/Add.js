import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import { suggestEmoji } from "../../utils/emojiMap";
import LessonForm from "./index";

const AddLesson = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");
  const [isPictureMode, setIsPictureMode] = useState(false);
  const [isKeyLocationMode, setIsKeyLocationMode] = useState(false);
  const [wordEmojiMap, setWordEmojiMap] = useState({});
  const [newLetters, setNewLetters] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const wordArray = words.trim().split(/\s+/);
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];

    const newLesson = {
      id: Date.now(),
      title: title.trim(),
      words: wordArray,
      isPictureMode,
      isKeyLocationMode,
      newLetters: isKeyLocationMode ? newLetters.trim().split("") : [],
      emojiMap: isPictureMode ? wordEmojiMap : {},
      completed: false,
    };

    lessons.push(newLesson);
    localStorage.setItem("lessons", JSON.stringify(lessons));
    navigate("/lessons");
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Add New Lesson
      </Typography>
      <Paper sx={{ p: 4, mt: 3 }}>
        <LessonForm
          title={title}
          setTitle={setTitle}
          words={words}
          setWords={setWords}
          isPictureMode={isPictureMode}
          setIsPictureMode={setIsPictureMode}
          isKeyLocationMode={isKeyLocationMode}
          setIsKeyLocationMode={setIsKeyLocationMode}
          wordEmojiMap={wordEmojiMap}
          setWordEmojiMap={setWordEmojiMap}
          newLetters={newLetters}
          setNewLetters={setNewLetters}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/lessons")}
          submitButtonText="Create Lesson"
        />
      </Paper>
    </Box>
  );
};

export default AddLesson;
