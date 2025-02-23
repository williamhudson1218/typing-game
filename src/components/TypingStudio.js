import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sound from "./Sound";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  LinearProgress,
  Fade,
} from "@mui/material";
import { SpaceBar as SpaceBarIcon } from "@mui/icons-material";
import { updateLessonStats } from "../utils/statsManager";
import { findClosestMatch, suggestEmoji } from "../utils/emojiMap";

const TypingStudio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showSpaceHint, setShowSpaceHint] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wordStartTime, setWordStartTime] = useState(null);
  const [totalErrors, setTotalErrors] = useState(0);
  const [wordErrors, setWordErrors] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestSpeed, setBestSpeed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [feedbackTimeout, setFeedbackTimeout] = useState(null);

  console.log(streak);

  const FEEDBACK = {
    STREAK: [
      { threshold: 8, message: "Great Streak! 🔥" },
      { threshold: 15, message: "Unstoppable! ⚡" },
      { threshold: 25, message: "Legendary! 🏆" },
    ],
    SPEED: [
      { threshold: 20, message: "Good Pace! 👍" },
      { threshold: 40, message: "Flying! ✈️" },
      { threshold: 60, message: "Incredible Speed! 🚀" },
    ],
  };

  useEffect(() => {
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const foundLesson = lessons.find((l) => l.id === parseInt(id));
    if (foundLesson) {
      if (foundLesson.isPictureMode && !foundLesson.emojiMap) {
        foundLesson.emojiMap = foundLesson.words.reduce(
          (map, word) => ({
            ...map,
            [word]: suggestEmoji(word) || "❓",
          }),
          {}
        );
      }
      console.log("Loaded lesson:", foundLesson);
      setLesson(foundLesson);
      setStartTime(Date.now());
    } else {
      navigate("/lessons");
    }
  }, [id, navigate]);

  useEffect(() => {
    return () => {
      if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
      }
    };
  }, [feedbackTimeout]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    const targetWord = lesson.words[currentWordIndex];

    if (!wordStartTime && input.length === 1) {
      setWordStartTime(Date.now());
    }

    setShowSpaceHint(input === targetWord);

    if (!targetWord.startsWith(input) && !input.endsWith(" ")) {
      Sound.playError();
      setIsError(true);
      setTotalErrors(totalErrors + 1);
      setWordErrors(wordErrors + 1);
    } else {
      setIsError(false);
    }

    setUserInput(input);

    if (input.endsWith(" ")) {
      setShowSpaceHint(false);
      checkWord(input.trim());
    }
  };

  const showFeedbackWithTimeout = (feedback) => {
    setShowFeedback(feedback);

    if (feedbackTimeout) {
      clearTimeout(feedbackTimeout);
    }

    const timeout = setTimeout(() => {
      setShowFeedback(null);
    }, 1500);

    setFeedbackTimeout(timeout);
  };

  const checkWord = (input) => {
    const targetWord = lesson.words[currentWordIndex];
    const matchedWord =
      lesson.isPictureMode && lesson.emojiMap
        ? findClosestMatch(input, Object.keys(lesson.emojiMap))
        : input;

    if (matchedWord === targetWord) {
      const wordTime = (Date.now() - wordStartTime) / 1000;
      const wordSpeed = 60 / wordTime;
      const wordAccuracy = Math.max(0, 100 - (wordErrors / input.length) * 100);

      setStreak((prev) => {
        const newStreak = prev + 1;
        const streakFeedback = FEEDBACK.STREAK.find(
          (f) => f.threshold === newStreak
        );
        if (streakFeedback) {
          showFeedbackWithTimeout({
            message: streakFeedback.message,
            type: "streak",
          });
          Sound.playStreak();
        } else {
          Sound.playSuccess();
        }
        return newStreak;
      });

      if (wordSpeed > bestSpeed && wordSpeed >= 20 && bestSpeed !== 0) {
        setBestSpeed(wordSpeed);
        const speedFeedback = FEEDBACK.SPEED.find(
          (f) => wordSpeed >= f.threshold && f.threshold > (bestSpeed || 0)
        );
        if (speedFeedback) {
          showFeedbackWithTimeout({
            message: speedFeedback.message,
            type: "speed",
          });
          Sound.playAchievement();
        }
      }

      setWordStartTime(null);
      setWordErrors(0);

      if (currentWordIndex === lesson.words.length - 1) {
        handleLessonComplete(wordSpeed, wordAccuracy);
      } else {
        setCurrentWordIndex(currentWordIndex + 1);
      }
    } else {
      setStreak(0);
    }
    setUserInput("");
  };

  const handleLessonComplete = (finalWordSpeed, finalWordAccuracy) => {
    const totalTime = (Date.now() - startTime) / 1000;
    const averageSpeed = (lesson.words.length / totalTime) * 60;
    const accuracy = Math.max(
      0,
      100 - (totalErrors / lesson.words.join("").length) * 100
    );

    updateLessonStats({
      wordsTyped: lesson.words.length,
      accuracy: (accuracy + finalWordAccuracy) / 2,
      speed: (averageSpeed + finalWordSpeed) / 2,
      totalTime,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      errors: totalErrors,
    });

    Sound.playCompletion();

    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const updatedLessons = lessons.map((l) =>
      l.id === lesson.id ? { ...l, completed: true } : l
    );
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));
    setCompleted(true);
  };

  const FeedbackPopup = ({ feedback }) => (
    <Fade in={Boolean(feedback)} timeout={200}>
      <Box
        sx={{
          position: "absolute",
          top: -60,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
          animation: "popUp 0.5s ease-out",
          "@keyframes popUp": {
            "0%": {
              transform: "translate(-50%, 20px)",
              opacity: 0,
            },
            "50%": {
              transform: "translate(-50%, -10px)",
              opacity: 1,
            },
            "100%": {
              transform: "translate(-50%, 0)",
              opacity: 1,
            },
          },
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color:
              feedback?.type === "streak" ? "success.main" : "primary.main",
            fontWeight: "bold",
            textAlign: "center",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {feedback?.message}
        </Typography>
      </Box>
    </Fade>
  );

  if (!lesson) return <Box sx={{ p: 4 }}>Loading...</Box>;

  const progress = (currentWordIndex / lesson.words.length) * 100;

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        {lesson.title}
      </Typography>

      {completed ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" color="success.main" gutterBottom>
            Congratulations! Lesson completed!
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/lessons")}
            sx={{ mt: 2 }}
          >
            Back to Lessons
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 4 }}>
          <Box sx={{ position: "relative" }}>
            <FeedbackPopup feedback={showFeedback} />
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                {lesson.isPictureMode ? "Type what you see:" : "Current Word:"}
              </Typography>
              {lesson.isPictureMode ? (
                <Box
                  sx={{
                    fontSize: "6rem",
                    textAlign: "center",
                    py: 4,
                    backgroundColor: "primary.50",
                    borderRadius: 2,
                    animation: "fadeIn 0.5s ease-out",
                    "@keyframes fadeIn": {
                      from: { opacity: 0, transform: "scale(0.9)" },
                      to: { opacity: 1, transform: "scale(1)" },
                    },
                  }}
                >
                  {(lesson.emojiMap &&
                    lesson.emojiMap[lesson.words[currentWordIndex]]) ||
                    "❓"}
                </Box>
              ) : (
                <Typography
                  variant="h5"
                  sx={{
                    color: "primary.main",
                    fontWeight: "500",
                    backgroundColor: "primary.50",
                    p: 2,
                    borderRadius: 1,
                    textAlign: "center",
                  }}
                >
                  {lesson.words[currentWordIndex]}
                </Typography>
              )}
              {/* Hidden text for screen readers */}
              <Typography
                sx={{ position: "absolute", left: -9999, opacity: 0 }}
              >
                {lesson.words[currentWordIndex]}
              </Typography>
            </Box>

            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type the word above..."
                error={isError}
                autoFocus
                sx={{
                  mb: 3,
                  animation: isError
                    ? "shake 0.5s cubic-bezier(.36,.07,.19,.97) both"
                    : "none",
                  backgroundColor: isError ? "error.50" : "transparent",
                  transition: "background-color 0.3s",
                  "@keyframes shake": {
                    "10%, 90%": {
                      transform: "translate3d(-1px, 0, 0)",
                    },
                    "20%, 80%": {
                      transform: "translate3d(2px, 0, 0)",
                    },
                    "30%, 50%, 70%": {
                      transform: "translate3d(-4px, 0, 0)",
                    },
                    "40%, 60%": {
                      transform: "translate3d(4px, 0, 0)",
                    },
                  },
                }}
              />
              <Fade in={showSpaceHint}>
                <Box
                  sx={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "primary.main",
                    animation: "pulse 1.5s infinite",
                    "@keyframes pulse": {
                      "0%": {
                        opacity: 1,
                      },
                      "50%": {
                        opacity: 0.5,
                      },
                      "100%": {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Press
                  </Typography>
                  <Box
                    sx={{
                      border: "2px solid",
                      borderColor: "primary.main",
                      borderRadius: 1,
                      px: 1,
                      py: 0.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <SpaceBarIcon fontSize="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      SPACE
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Box>

            <Box sx={{ mb: 2 }}>
              <LinearProgress variant="determinate" value={progress} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Progress: {currentWordIndex}/{lesson.words.length} words
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default TypingStudio;
