import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, Paper } from "@mui/material";
import { suggestEmoji } from "../../utils/emojiMap";
import LessonForm from "./index";

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

  useEffect(() => {
    if (isPictureMode && words) {
      const wordArray = words.trim().split(/\s+/);
      const newEmojiMap = {};
      wordArray.forEach((word) => {
        if (!wordEmojiMap[word]) {
          newEmojiMap[word] = suggestEmoji(word) || "❓";
        }
      });
      if (Object.keys(newEmojiMap).length > 0) {
        setWordEmojiMap((prev) => ({
          ...prev,
          ...newEmojiMap,
        }));
      }
    }
  }, [words, isPictureMode, wordEmojiMap]);

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
          submitButtonText="Save Changes"
        />
      </Paper>
    </Box>
  );
};

export default EditLesson;
