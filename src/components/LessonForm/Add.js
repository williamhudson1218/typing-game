import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const AddLesson = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseId = location.state?.courseId;
  const [title, setTitle] = useState("");
  const [words, setWords] = useState("");
  const [isPictureMode, setIsPictureMode] = useState(false);
  const [isKeyLocationMode, setIsKeyLocationMode] = useState(false);
  const [isSentenceMode, setIsSentenceMode] = useState(false);
  const [isParagraphMode, setIsParagraphMode] = useState(false);
  const [wordEmojiMap, setWordEmojiMap] = useState({});
  const [newLetters, setNewLetters] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    // Set default course from settings or passed courseId
    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    const defaultCourseId = courseId || settings.currentCourseId;
    setSelectedCourseId(defaultCourseId);
  }, [courseId]);

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

    let wordArray;
    if (isParagraphMode) {
      wordArray = words
        .trim()
        .split(/\n+/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } else if (isSentenceMode) {
      wordArray = words
        .trim()
        .split(/\n+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence.length > 0);
    } else {
      wordArray = words.trim().split(/\s+/);
    }

    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];

    const newLesson = {
      id: Date.now(),
      title: title.trim(),
      words: wordArray,
      isPictureMode,
      isKeyLocationMode,
      isSentenceMode,
      isParagraphMode,
      newLetters: isKeyLocationMode ? newLetters.trim().split("") : [],
      emojiMap: isPictureMode ? wordEmojiMap : {},
      completed: false,
      courseId: selectedCourseId,
    };

    lessons.push(newLesson);
    localStorage.setItem("lessons", JSON.stringify(lessons));

    navigate("/lessons");
  };

  return (
    <Container maxW="container.md" py={8}>
      <Box>
        <Heading size="xl" mb={2} color="gray.800">
          Add New Lesson
        </Heading>
        <Text color="gray.600" fontSize="lg" mb={8}>
          Create a custom typing lesson to improve your skills
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
              isParagraphMode={isParagraphMode}
              setIsParagraphMode={setIsParagraphMode}
              wordEmojiMap={wordEmojiMap}
              setWordEmojiMap={setWordEmojiMap}
              newLetters={newLetters}
              setNewLetters={setNewLetters}
              courseId={selectedCourseId}
              setCourseId={setSelectedCourseId}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/lessons")}
              submitButtonText="Create Lesson"
            />
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
};

export default AddLesson;
