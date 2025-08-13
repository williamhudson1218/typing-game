import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { suggestEmoji } from "../../utils/emojiMap";
import LessonForm from "./index";

const EditLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");
  const [isPictureMode, setIsPictureMode] = useState(false);
  const [isKeyLocationMode, setIsKeyLocationMode] = useState(false);
  const [isSentenceMode, setIsSentenceMode] = useState(false);
  const [wordEmojiMap, setWordEmojiMap] = useState({});
  const [newLetters, setNewLetters] = useState("");
  const [debouncedWords, setDebouncedWords] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const lesson = lessons.find((l) => l.id === parseInt(id));
    if (lesson) {
      setTitle(lesson.title);
      setWords(
        lesson.isSentenceMode ? lesson.words.join("\n") : lesson.words.join(" ")
      );
      setIsPictureMode(lesson.isPictureMode || false);
      setIsKeyLocationMode(lesson.isKeyLocationMode || false);
      setIsSentenceMode(lesson.isSentenceMode || false);
      setWordEmojiMap(lesson.emojiMap || {});
      setNewLetters(lesson.newLetters ? lesson.newLetters.join("") : "");
      setSelectedCourseId(lesson.courseId || null);
    } else {
      navigate("/lessons");
    }
  }, [id, navigate]);

  // Debounce words input to avoid emoji lookup on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedWords(words);
    }, 2000); // 2 second delay to ensure no typing interference

    return () => clearTimeout(timer);
  }, [words]);

  // Optimized emoji lookup with better performance
  useEffect(() => {
    if (isPictureMode && debouncedWords) {
      const wordArray = debouncedWords.trim().split(/\s+/);
      const newEmojiMap = {};
      wordArray.forEach((word) => {
        // Only auto-assign emojis for words that don't already have them
        if (word && !wordEmojiMap[word]) {
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
  }, [debouncedWords, isPictureMode, wordEmojiMap]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let wordArray;
    if (isSentenceMode) {
      wordArray = words
        .trim()
        .split(/\n+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);
    } else {
      wordArray = words.trim().split(/\s+/);
    }

    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];

    const updatedLessons = lessons.map((lesson) =>
      lesson.id === parseInt(id)
        ? {
            ...lesson,
            title: title.trim(),
            words: wordArray,
            isPictureMode,
            isKeyLocationMode,
            isSentenceMode,
            newLetters: isKeyLocationMode ? newLetters.trim().split("") : [],
            emojiMap: isPictureMode ? wordEmojiMap : {},
            courseId: selectedCourseId,
          }
        : lesson
    );

    localStorage.setItem("lessons", JSON.stringify(updatedLessons));

    navigate("/lessons");
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box>
        <Heading size="xl" mb={2} color="gray.800">
          Edit Lesson
        </Heading>
        <Text color="gray.600" fontSize="lg" mb={8}>
          Modify your typing lesson settings and content
        </Text>

        <Card borderRadius="xl" boxShadow="lg">
          <CardBody p={8}>
            <LessonForm
              title={title}
              setTitle={setTitle}
              words={words}
              setWords={setWords}
              isPictureMode={isPictureMode}
              setIsPictureMode={setIsPictureMode}
              isKeyLocationMode={isKeyLocationMode}
              setIsKeyLocationMode={setIsKeyLocationMode}
              isSentenceMode={isSentenceMode}
              setIsSentenceMode={setIsSentenceMode}
              wordEmojiMap={wordEmojiMap}
              setWordEmojiMap={setWordEmojiMap}
              newLetters={newLetters}
              setNewLetters={setNewLetters}
              courseId={selectedCourseId}
              setCourseId={setSelectedCourseId}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/lessons")}
              submitButtonText="Save Changes"
            />
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
};

export default EditLesson;
