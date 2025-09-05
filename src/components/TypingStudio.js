import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  Progress,
  VStack,
  HStack,
  Card,
  CardBody,
  useToast,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FiArrowLeft, FiCheck, FiCheckCircle } from "react-icons/fi";
import { updateLessonStats } from "../utils/statsManager";
import { suggestEmoji } from "../utils/emojiMap";
import KeyboardKey from "./KeyboardKey";
import Confetti from "react-confetti";
import Sound from "./Sound";

const TypingStudio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [lesson, setLesson] = useState(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showSpaceHint, setShowSpaceHint] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wordStartTime, setWordStartTime] = useState(null);
  const [totalErrors, setTotalErrors] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestSpeed, setBestSpeed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(null);
  const [feedbackTimeout, setFeedbackTimeout] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allowMistakes, setAllowMistakes] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [wordCompleted, setWordCompleted] = useState(false);
  const [completedWordIndex, setCompletedWordIndex] = useState(-1);

  const bg = "white";
  const borderColor = "gray.200";

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
    try {
      const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
      const foundLesson = lessons.find((l) => l.id === parseInt(id));
      if (foundLesson) {
        // Ensure all required properties exist
        const lessonWithDefaults = {
          id: foundLesson.id,
          title: foundLesson.title || "Untitled Lesson",
          words: foundLesson.words || [],
          isPictureMode: foundLesson.isPictureMode || false,
          isKeyLocationMode: foundLesson.isKeyLocationMode || false,
          isSentenceMode: foundLesson.isSentenceMode || false,
          isParagraphMode: foundLesson.isParagraphMode || false,
          newLetters: foundLesson.newLetters || [],
          emojiMap: foundLesson.emojiMap || {},
          completed: foundLesson.completed || false,
          courseId: foundLesson.courseId || null,
        };

        if (lessonWithDefaults.isPictureMode && !lessonWithDefaults.emojiMap) {
          lessonWithDefaults.emojiMap = lessonWithDefaults.words.reduce(
            (map, word) => ({
              ...map,
              [word]: suggestEmoji(word) || "❓",
            }),
            {}
          );
        }
        console.log("Loaded lesson:", lessonWithDefaults);
        setLesson(lessonWithDefaults);
        setStartTime(Date.now());
      } else {
        navigate("/lessons");
      }
    } catch (error) {
      console.error("Error loading lesson:", error);
      navigate("/lessons");
    }
  }, [id, navigate]);

  useEffect(() => {
    // Load settings from localStorage
    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    setAllowMistakes(settings.allowMistakes !== false); // Default to true if not set
    setSoundEnabled(settings.sound !== false); // Default to true if not set
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimeout) {
        clearTimeout(feedbackTimeout);
      }
    };
  }, [feedbackTimeout]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    const targetWord = (lesson.words[currentWordIndex] || "").trim();

    if (!wordStartTime && input.length === 1) {
      setWordStartTime(Date.now());
    }

    // Clear hint if user starts typing again after completing
    if (showSpaceHint && input.length < targetWord.length) {
      setShowSpaceHint(false);
    }

    // Clear hint if user makes an error
    if (isError) {
      setShowSpaceHint(false);
    }

    setUserInput(input);
    setIsError(false);

    // Clear hint if input is empty (user advanced to next word)
    if (input === "") {
      setShowSpaceHint(false);
      return; // Don't process hint logic for empty input
    }

    if (lesson.isParagraphMode || lesson.isSentenceMode) {
      const trimmedInput = input.trimEnd();

      // Only show hint when line/sentence is completely finished
      const shouldShowHint = trimmedInput === targetWord;

      if (shouldShowHint && !showSpaceHint) {
        // Add delay before showing hint
        setTimeout(() => {
          setShowSpaceHint(true);
        }, 300);
      } else if (!shouldShowHint) {
        setShowSpaceHint(false);
      }
    } else {
      // Only show hint when word is completely finished
      const shouldShowHint = input === targetWord;

      if (shouldShowHint && !showSpaceHint) {
        // Add delay before showing hint
        setTimeout(() => {
          setShowSpaceHint(true);
        }, 300);
      } else if (!shouldShowHint) {
        setShowSpaceHint(false);
      }
    }
  };

  const checkWord = (input) => {
    const targetWord = (lesson.words[currentWordIndex] || "").trim();
    const isCorrect = input.trim() === targetWord;

    if (isCorrect) {
      // Play correct sound
      if (soundEnabled) {
        Sound.playSuccess();
      }

      const newStreak = streak + 1;
      setStreak(newStreak);

      // Check for streak feedback
      const streakFeedback = FEEDBACK.STREAK.find(
        (f) => f.threshold === newStreak
      );
      if (streakFeedback) {
        showFeedbackMessage(streakFeedback.message);
        if (soundEnabled) {
          Sound.playStreak();
        }
      }

      // Calculate speed for this word
      if (wordStartTime) {
        const wordTime = (Date.now() - wordStartTime) / 1000; // in seconds
        const wordSpeed = targetWord.length / 5 / (wordTime / 60); // WPM
        if (wordSpeed > bestSpeed) {
          setBestSpeed(wordSpeed);

          // Check for speed milestones
          const speedFeedback = FEEDBACK.SPEED.find(
            (f) => wordSpeed >= f.threshold && bestSpeed < f.threshold
          );
          if (speedFeedback) {
            showFeedbackMessage(speedFeedback.message);
            if (soundEnabled) {
              Sound.playAchievement();
            }
          }
        }
      }

      // Trigger word completion animation
      setWordCompleted(true);
      setCompletedWordIndex(currentWordIndex);

      // Reset animation after a short delay
      setTimeout(() => {
        setWordCompleted(false);
        setCompletedWordIndex(-1);
      }, 300);

      setCurrentWordIndex((prev) => prev + 1);
      setUserInput("");
      setWordStartTime(null);

      if (currentWordIndex + 1 >= lesson.words.length) {
        completeLesson();
      }
    } else {
      // Play error sound
      if (soundEnabled) {
        Sound.playError();
      }

      setStreak(0);
      setTotalErrors((prev) => prev + 1);
      setIsError(true);

      if (!allowMistakes) {
        setUserInput("");
      }
    }
  };

  const checkSentence = (input) => {
    const targetSentence = (lesson.words[currentWordIndex] || "").trim();
    const isCorrect = input.trim() === targetSentence;

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);

      const streakFeedback = FEEDBACK.STREAK.find(
        (f) => f.threshold === newStreak
      );
      if (streakFeedback) {
        showFeedbackMessage(streakFeedback.message);
        if (soundEnabled) {
          Sound.playStreak();
        }
      }

      if (wordStartTime) {
        const wordTime = (Date.now() - wordStartTime) / 1000;
        const wordSpeed = targetSentence.length / 5 / (wordTime / 60);
        if (wordSpeed > bestSpeed) {
          setBestSpeed(wordSpeed);

          // Check for speed milestones
          const speedFeedback = FEEDBACK.SPEED.find(
            (f) => wordSpeed >= f.threshold && bestSpeed < f.threshold
          );
          if (speedFeedback) {
            showFeedbackMessage(speedFeedback.message);
            if (soundEnabled) {
              Sound.playAchievement();
            }
          }
        }
      }

      // Trigger word completion animation
      setWordCompleted(true);
      setCompletedWordIndex(currentWordIndex);

      // Reset animation after a short delay
      setTimeout(() => {
        setWordCompleted(false);
        setCompletedWordIndex(-1);
      }, 300);

      setCurrentWordIndex((prev) => prev + 1);
      setUserInput("");
      setWordStartTime(null);

      if (currentWordIndex + 1 >= lesson.words.length) {
        completeLesson();
      }
    } else {
      setStreak(0);
      setTotalErrors((prev) => prev + 1);
      setIsError(true);

      if (!allowMistakes) {
        setUserInput("");
      }
    }
  };

  const checkParagraph = (input) => {
    const targetLine = (lesson.words[currentWordIndex] || "").trim();
    const isCorrect = input.trim() === targetLine;

    if (isCorrect) {
      // Play correct sound
      if (soundEnabled) {
        Sound.playSuccess();
      }

      const newStreak = streak + 1;
      setStreak(newStreak);

      // Check for streak feedback
      const streakFeedback = FEEDBACK.STREAK.find(
        (f) => f.threshold === newStreak
      );
      if (streakFeedback) {
        showFeedbackMessage(streakFeedback.message);
        if (soundEnabled) {
          Sound.playStreak();
        }
      }

      // Calculate speed for this line
      if (wordStartTime) {
        const wordTime = (Date.now() - wordStartTime) / 1000; // in seconds
        const wordSpeed = targetLine.length / 5 / (wordTime / 60); // WPM
        if (wordSpeed > bestSpeed) {
          setBestSpeed(wordSpeed);

          // Check for speed milestones
          const speedFeedback = FEEDBACK.SPEED.find(
            (f) => wordSpeed >= f.threshold && bestSpeed < f.threshold
          );
          if (speedFeedback) {
            showFeedbackMessage(speedFeedback.message);
            if (soundEnabled) {
              Sound.playAchievement();
            }
          }
        }
      }

      // Trigger word completion animation
      setWordCompleted(true);
      setCompletedWordIndex(currentWordIndex);

      // Reset animation after a short delay
      setTimeout(() => {
        setWordCompleted(false);
        setCompletedWordIndex(-1);
      }, 300);

      setCurrentWordIndex((prev) => prev + 1);
      setUserInput("");
      setWordStartTime(null);

      if (currentWordIndex + 1 >= lesson.words.length) {
        completeLesson();
      }
    } else {
      // Play error sound
      if (soundEnabled) {
        Sound.playError();
      }

      setStreak(0);
      setTotalErrors((prev) => prev + 1);
      setIsError(true);

      if (!allowMistakes) {
        setUserInput("");
      }
    }
  };

  const completeLesson = () => {
    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000; // in seconds
    const totalWords = lesson.words.length;
    const wpm = totalWords / 5 / (totalTime / 60);
    const accuracy = ((totalWords - totalErrors) / totalWords) * 100;

    // Update lesson stats
    updateLessonStats({
      wpm,
      accuracy,
      totalWords,
      totalTime,
      totalErrors,
    });

    // Mark lesson as completed
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const updatedLessons = lessons.map((l) =>
      l.id === parseInt(id) ? { ...l, completed: true } : l
    );
    localStorage.setItem("lessons", JSON.stringify(updatedLessons));

    setCompleted(true);
    setShowConfetti(true);

    // Play completion sound
    if (soundEnabled) {
      Sound.playCompletion();
    }

    toast({
      title: "Lesson Completed! 🎉",
      description: `Speed: ${wpm.toFixed(1)} WPM, Accuracy: ${accuracy.toFixed(
        1
      )}%`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setTimeout(() => setShowConfetti(false), 5000);
  };

  const showFeedbackMessage = (message) => {
    setShowFeedback(message);
    const timeout = setTimeout(() => setShowFeedback(null), 2000);
    setFeedbackTimeout(timeout);
  };

  const renderHighlightedSentence = (sentence) => {
    if (!userInput) return sentence;

    const inputLength = userInput.length;
    const sentenceChars = sentence.split("");
    const inputChars = userInput.split("");

    // Use React.memo or a more efficient approach
    const elements = [];
    for (let i = 0; i < sentenceChars.length; i++) {
      if (i < inputLength) {
        const isCorrect = inputChars[i] === sentenceChars[i];
        elements.push(
          <Text
            key={i}
            as="span"
            color={isCorrect ? "green.500" : "red.500"}
            fontWeight="bold"
            display="inline"
          >
            {sentenceChars[i]}
          </Text>
        );
      } else {
        elements.push(
          <Text key={i} as="span" color="gray.600" display="inline">
            {sentenceChars[i]}
          </Text>
        );
      }
    }

    return <>{elements}</>;
  };

  const renderHighlightedWord = (word) => {
    if (!userInput) return word;

    const inputLength = userInput.length;
    const wordChars = word.split("");
    const inputChars = userInput.split("");

    const elements = [];
    for (let i = 0; i < wordChars.length; i++) {
      if (i < inputLength) {
        const isCorrect = inputChars[i] === wordChars[i];
        elements.push(
          <Text
            key={i}
            as="span"
            color={isCorrect ? "green.500" : "red.500"}
            fontWeight="bold"
            display="inline"
          >
            {wordChars[i]}
          </Text>
        );
      } else {
        elements.push(
          <Text key={i} as="span" color="gray.600" display="inline">
            {wordChars[i]}
          </Text>
        );
      }
    }

    return <>{elements}</>;
  };

  const renderParagraphContent = () => {
    if (!lesson.isParagraphMode) return null;

    return (
      <VStack spacing={4} align="stretch">
        {/* Instructions */}
        <Box
          bg="blue.50"
          p={4}
          borderRadius="lg"
          border="1px solid"
          borderColor="blue.200"
        >
          <Text fontSize="sm" color="blue.800" fontWeight="medium">
            Instructions: Type each line and press Enter after each line.
          </Text>
        </Box>

        {/* Full paragraph display */}
        <Box
          bg="brand.50"
          p={6}
          borderRadius="xl"
          border="2px solid"
          borderColor="brand.200"
          position="relative"
        >
          <Text
            fontSize="lg"
            lineHeight="1.8"
            color="gray.800"
            whiteSpace="pre-wrap"
            fontFamily="serif"
          >
            {lesson.words.map((line, index) => {
              const isCurrentLine = index === currentWordIndex;
              const isCompleted = index < currentWordIndex;
              const isTitle =
                line.includes('"') ||
                line.includes("By ") ||
                line.includes("by ");
              const isAuthor = line.startsWith("By ") || line.startsWith("by ");

              return (
                <React.Fragment key={index}>
                  <Box
                    as="span"
                    position="relative"
                    display="inline-block"
                    px={isCurrentLine ? 2 : 0}
                    py={isCurrentLine ? 1 : 0}
                    borderRadius={isCurrentLine ? "md" : "none"}
                    bg={isCurrentLine ? "blue.100" : "transparent"}
                    border={isCurrentLine ? "2px solid" : "none"}
                    borderColor={isCurrentLine ? "blue.300" : "transparent"}
                    transition="all 0.3s ease"
                    fontWeight={
                      isTitle ? "bold" : isAuthor ? "medium" : "normal"
                    }
                    color={
                      isCompleted
                        ? "green.600"
                        : isCurrentLine
                        ? "blue.800"
                        : isTitle
                        ? "purple.600"
                        : isAuthor
                        ? "blue.600"
                        : "gray.800"
                    }
                  >
                    {isCurrentLine ? renderHighlightedSentence(line) : line}

                    {/* Completion indicator for completed lines */}
                    {isCompleted && (
                      <Box
                        as="span"
                        position="absolute"
                        right="-20px"
                        top="50%"
                        transform="translateY(-50%)"
                        color="green.500"
                        fontSize="sm"
                      >
                        ✓
                      </Box>
                    )}
                  </Box>
                  {index < lesson.words.length - 1 && "\n"}
                </React.Fragment>
              );
            })}
          </Text>

          {/* Current line progress indicator */}
          <Box
            position="absolute"
            bottom={2}
            right={2}
            bg="white"
            px={2}
            py={1}
            borderRadius="md"
            boxShadow="sm"
            border="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="xs" color="gray.600">
              Line {currentWordIndex + 1} of {lesson.words.length}
            </Text>
          </Box>
        </Box>
      </VStack>
    );
  };

  const FeedbackPopup = ({ feedback }) => {
    if (!feedback) return null;

    return (
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={1000}
        bg="yellow.400"
        color="white"
        px={6}
        py={3}
        borderRadius="xl"
        boxShadow="xl"
        animation="fadeIn 0.3s ease-out"
      >
        <Text fontSize="lg" fontWeight="bold" textAlign="center">
          {feedback}
        </Text>
      </Box>
    );
  };

  if (!lesson || !lesson.words || lesson.words.length === 0) {
    return (
      <Container maxW="container.md" py={8}>
        <Box textAlign="center">
          <Text fontSize="lg">Loading...</Text>
        </Box>
      </Container>
    );
  }

  const progress = (currentWordIndex / lesson.words.length) * 100;

  return (
    <Container maxW="container.md" py={8}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <VStack spacing={6} align="stretch">
        <Box>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/lessons")}
            leftIcon={<FiArrowLeft />}
            color="gray.600"
            _hover={{ color: "brand.500" }}
            mb={2}
          >
            Back to Lessons
          </Button>
          <Heading size="xl" mb={2} color="gray.800">
            {lesson.title}
          </Heading>
        </Box>

        {completed ? (
          <Card
            bg={bg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
          >
            <CardBody p={8} textAlign="center">
              <VStack spacing={6}>
                <Icon as={FiCheck} boxSize={16} color="green.500" />
                <Heading size="lg" color="green.600">
                  Congratulations! Lesson completed!
                </Heading>
                <Button
                  colorScheme="brand"
                  size="lg"
                  onClick={() => navigate("/lessons")}
                  leftIcon={<FiArrowLeft />}
                  px={8}
                  py={6}
                  borderRadius="xl"
                >
                  Back to Lessons
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Card
            bg={bg}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="xl"
          >
            <CardBody p={8}>
              <VStack spacing={6} align="stretch">
                <FeedbackPopup feedback={showFeedback} />

                {lesson.isKeyLocationMode && lesson.newLetters && (
                  <Box>
                    <Heading size="md" mb={4}>
                      New Keys to Learn:
                    </Heading>
                    <HStack
                      spacing={4}
                      justify="center"
                      bg="brand.50"
                      p={4}
                      borderRadius="xl"
                      flexWrap="wrap"
                    >
                      {lesson.newLetters.map((letter, index) => (
                        <Box
                          key={index}
                          opacity={
                            letter === (lesson.words[currentWordIndex] || "")[0]
                              ? 1
                              : 0.6
                          }
                          transition="opacity 0.3s"
                        >
                          <KeyboardKey letter={letter} />
                        </Box>
                      ))}
                    </HStack>
                  </Box>
                )}

                <Box>
                  {lesson.isParagraphMode ? (
                    renderParagraphContent()
                  ) : (
                    <>
                      <Heading size="md" mb={4}>
                        {lesson.isPictureMode
                          ? "Type what you see:"
                          : lesson.isKeyLocationMode
                          ? "Practice typing:"
                          : lesson.isSentenceMode
                          ? "Type the sentence:"
                          : "Current Word:"}
                      </Heading>

                      {lesson.isPictureMode ? (
                        <Box
                          fontSize="6rem"
                          textAlign="center"
                          py={8}
                          bg="brand.50"
                          borderRadius="xl"
                          animation="fadeIn 0.5s ease-out"
                        >
                          {(lesson.emojiMap &&
                            lesson.words[currentWordIndex] &&
                            lesson.emojiMap[lesson.words[currentWordIndex]]) ||
                            "❓"}
                        </Box>
                      ) : (
                        <Box
                          bg="brand.50"
                          p={6}
                          borderRadius="xl"
                          textAlign="center"
                          border="2px solid"
                          borderColor={
                            wordCompleted &&
                            completedWordIndex === currentWordIndex
                              ? "green.400"
                              : "brand.200"
                          }
                          transform={
                            wordCompleted &&
                            completedWordIndex === currentWordIndex
                              ? "scale(1.05)"
                              : "scale(1)"
                          }
                          transition="all 0.3s ease"
                          boxShadow={
                            wordCompleted &&
                            completedWordIndex === currentWordIndex
                              ? "0 0 20px rgba(72, 187, 120, 0.4)"
                              : "none"
                          }
                          position="relative"
                        >
                          <Text
                            fontSize={lesson.isSentenceMode ? "xl" : "2xl"}
                            color={
                              wordCompleted &&
                              completedWordIndex === currentWordIndex
                                ? "green.600"
                                : "brand.600"
                            }
                            fontWeight="semibold"
                            lineHeight={lesson.isSentenceMode ? 1.6 : 1.2}
                            transition="color 0.3s ease"
                          >
                            {lesson.isSentenceMode
                              ? renderHighlightedSentence(
                                  lesson.words[currentWordIndex] || ""
                                )
                              : renderHighlightedWord(
                                  lesson.words[currentWordIndex] || ""
                                )}
                          </Text>

                          {/* Word completion checkmark */}
                          {wordCompleted &&
                            completedWordIndex === currentWordIndex && (
                              <Box
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                zIndex={10}
                                animation="fadeInOut 0.6s ease-in-out"
                              >
                                <Icon
                                  as={FiCheckCircle}
                                  color="green.500"
                                  fontSize="4xl"
                                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                                />
                              </Box>
                            )}
                        </Box>
                      )}
                    </>
                  )}
                </Box>

                <Box position="relative">
                  {lesson.isParagraphMode || lesson.isSentenceMode ? (
                    <Textarea
                      value={userInput}
                      onChange={handleInputChange}
                      placeholder={
                        lesson.isParagraphMode
                          ? "Type the line and press Enter..."
                          : "Type the sentence and press Enter..."
                      }
                      isInvalid={isError}
                      autoFocus
                      rows={lesson.isParagraphMode ? 3 : 2}
                      size="lg"
                      borderRadius="xl"
                      bg={isError ? "red.50" : "white"}
                      borderColor={isError ? "red.300" : "gray.300"}
                      transform={wordCompleted ? "scale(1.02)" : "scale(1)"}
                      transition="all 0.2s ease"
                      _focus={{
                        borderColor: isError ? "red.500" : "brand.500",
                        boxShadow: isError
                          ? "0 0 0 1px #E53E3E"
                          : "0 0 0 1px #3182CE",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setShowSpaceHint(false);
                          const trimmed = userInput.trim();
                          if (
                            trimmed === (lesson.words[currentWordIndex] || "")
                          ) {
                            if (lesson.isParagraphMode) {
                              checkParagraph(trimmed);
                            } else {
                              checkSentence(trimmed);
                            }
                          }
                        }
                      }}
                    />
                  ) : (
                    <Input
                      value={userInput}
                      onChange={handleInputChange}
                      placeholder="Type the word and press Space..."
                      isInvalid={isError}
                      autoFocus
                      size="lg"
                      borderRadius="xl"
                      bg={isError ? "red.50" : "white"}
                      borderColor={isError ? "red.300" : "gray.300"}
                      transform={wordCompleted ? "scale(1.02)" : "scale(1)"}
                      transition="all 0.2s ease"
                      _focus={{
                        borderColor: isError ? "red.500" : "brand.500",
                        boxShadow: isError
                          ? "0 0 0 1px #E53E3E"
                          : "0 0 0 1px #3182CE",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === " ") {
                          e.preventDefault();
                          setShowSpaceHint(false);
                          const trimmed = userInput.trim();
                          if (
                            trimmed === (lesson.words[currentWordIndex] || "")
                          ) {
                            checkWord(trimmed);
                          }
                        }
                      }}
                    />
                  )}

                  {showSpaceHint && (
                    <Box
                      position="absolute"
                      right={4}
                      top="50%"
                      transform="translateY(-50%)"
                      display="flex"
                      alignItems="center"
                      gap={2}
                      color="brand.500"
                      animation="hintFadeIn 0.3s ease-out, hintPulse 1.5s ease-in-out 0.3s infinite"
                      bg="white"
                      p={2}
                      borderRadius="md"
                      zIndex={1000}
                      boxShadow="0 2px 8px rgba(0,0,0,0.1)"
                      border="1px solid"
                      borderColor="brand.200"
                    >
                      <Text fontSize="sm" fontWeight="medium">
                        Press
                      </Text>
                      <Badge
                        colorScheme="brand"
                        variant="outline"
                        px={3}
                        py={1}
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        {lesson.isParagraphMode || lesson.isSentenceMode ? (
                          <Text fontSize="xs" fontWeight="medium">
                            RETURN
                          </Text>
                        ) : (
                          <>
                            <Icon as={FiArrowLeft} boxSize={3} />
                            <Text fontSize="xs" fontWeight="medium">
                              SPACE
                            </Text>
                          </>
                        )}
                      </Badge>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Progress
                    value={progress}
                    size="lg"
                    colorScheme="brand"
                    borderRadius="full"
                    mb={2}
                  />
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    Progress: {currentWordIndex}/{lesson.words.length}{" "}
                    {lesson.isParagraphMode
                      ? "lines"
                      : lesson.isSentenceMode
                      ? "sentences"
                      : "words"}
                  </Text>
                </Box>

                {/* Stats Display */}
                <HStack
                  justify="space-between"
                  bg="gray.50"
                  p={4}
                  borderRadius="lg"
                >
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.600">
                      Streak
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="orange.500">
                      {streak}
                    </Text>
                  </VStack>
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.600">
                      Errors
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="red.500">
                      {totalErrors}
                    </Text>
                  </VStack>
                  <VStack spacing={1} align="start">
                    <Text fontSize="sm" color="gray.600">
                      Best Speed
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="blue.500">
                      {bestSpeed.toFixed(1)} WPM
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>
    </Container>
  );
};

export default TypingStudio;
