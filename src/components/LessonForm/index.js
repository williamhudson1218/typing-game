import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Text,
  Switch,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Divider,
  Heading,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
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
  isParagraphMode,
  setIsParagraphMode,
  wordEmojiMap,
  setWordEmojiMap,
  newLetters,
  setNewLetters,
  courseId,
  setCourseId,
  onSubmit,
  onCancel,
  submitButtonText,
}) => {
  const [emojiPickerState, setEmojiPickerState] = useState({
    isOpen: false,
    selectedWord: null,
  });

  const handleEmojiSelect = useCallback((word) => {
    setEmojiPickerState({
      isOpen: true,
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
        selectedWord: null,
      });
    },
    [emojiPickerState.selectedWord, setWordEmojiMap]
  );

  const handleClose = useCallback(() => {
    setEmojiPickerState({
      isOpen: false,
      selectedWord: null,
    });
  }, []);

  // Memoize the word array to prevent re-splitting on every render
  const wordArray = useMemo(() => {
    if (!words || !isPictureMode) return [];
    return words
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
  }, [words, isPictureMode]);

  // Only show emoji mappings if there are words and we're in picture mode
  const shouldShowEmojiMappings = isPictureMode && wordArray.length > 0;

  // Defer emoji mappings rendering to avoid typing delays
  const [showEmojiMappings, setShowEmojiMappings] = useState(false);

  // Show emoji mappings after a delay when typing stops
  React.useEffect(() => {
    if (shouldShowEmojiMappings) {
      const timer = setTimeout(() => {
        setShowEmojiMappings(true);
      }, 1000); // 1 second delay
      return () => clearTimeout(timer);
    } else {
      setShowEmojiMappings(false);
    }
  }, [shouldShowEmojiMappings]);

  return (
    <form onSubmit={onSubmit}>
      <VStack spacing={6} align="stretch">
        {/* Lesson Title */}
        <FormControl isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            Lesson Title
          </FormLabel>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lesson title..."
            size="lg"
            borderRadius="lg"
          />
        </FormControl>

        {/* Course Selection */}
        <FormControl>
          <FormLabel fontSize="lg" fontWeight="semibold">
            Course (Optional)
          </FormLabel>
          <select
            value={courseId || ""}
            onChange={(e) =>
              setCourseId(e.target.value ? parseInt(e.target.value) : null)
            }
            style={{
              padding: "12px 16px",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              fontSize: "16px",
              backgroundColor: "white",
              width: "100%",
            }}
          >
            <option value="">No Course (Unassigned)</option>
            {(() => {
              const courses = JSON.parse(localStorage.getItem("courses")) || [];
              return courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ));
            })()}
          </select>
        </FormControl>

        {/* Mode Switches */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Lesson Type
          </Text>
          <VStack spacing={3} align="stretch">
            <HStack
              justify="space-between"
              p={4}
              bg="gray.50"
              borderRadius="lg"
            >
              <Box>
                <Text fontWeight="medium">Picture Mode</Text>
                <Text fontSize="sm" color="gray.600">
                  Use emojis to represent words
                </Text>
              </Box>
              <Switch
                isChecked={isPictureMode}
                onChange={(e) => {
                  setIsPictureMode(e.target.checked);
                  if (e.target.checked) {
                    setIsKeyLocationMode(false);
                    setIsSentenceMode(false);
                    setIsParagraphMode(false);
                  }
                }}
                colorScheme="purple"
                size="lg"
              />
            </HStack>

            <HStack
              justify="space-between"
              p={4}
              bg="gray.50"
              borderRadius="lg"
            >
              <Box>
                <Text fontWeight="medium">Key Location Mode</Text>
                <Text fontSize="sm" color="gray.600">
                  Focus on specific keyboard keys
                </Text>
              </Box>
              <Switch
                isChecked={isKeyLocationMode}
                onChange={(e) => {
                  setIsKeyLocationMode(e.target.checked);
                  if (e.target.checked) {
                    setIsPictureMode(false);
                    setIsSentenceMode(false);
                    setIsParagraphMode(false);
                  }
                }}
                colorScheme="blue"
                size="lg"
              />
            </HStack>

            <HStack
              justify="space-between"
              p={4}
              bg="gray.50"
              borderRadius="lg"
            >
              <Box>
                <Text fontWeight="medium">Sentence Mode</Text>
                <Text fontSize="sm" color="gray.600">
                  Practice with full sentences
                </Text>
              </Box>
              <Switch
                isChecked={isSentenceMode}
                onChange={(e) => {
                  setIsSentenceMode(e.target.checked);
                  if (e.target.checked) {
                    setIsPictureMode(false);
                    setIsKeyLocationMode(false);
                    setIsParagraphMode(false);
                  }
                }}
                colorScheme="green"
                size="lg"
              />
            </HStack>

            <HStack
              justify="space-between"
              p={4}
              bg="gray.50"
              borderRadius="lg"
            >
              <Box>
                <Text fontWeight="medium">Paragraph Mode</Text>
                <Text fontSize="sm" color="gray.600">
                  Practice with structured paragraphs, poems, and formatted text
                </Text>
              </Box>
              <Switch
                isChecked={isParagraphMode}
                onChange={(e) => {
                  setIsParagraphMode(e.target.checked);
                  if (e.target.checked) {
                    setIsPictureMode(false);
                    setIsKeyLocationMode(false);
                    setIsSentenceMode(false);
                  }
                }}
                colorScheme="teal"
                size="lg"
              />
            </HStack>
          </VStack>
        </Box>

        {/* New Letters Input */}
        {isKeyLocationMode && (
          <FormControl>
            <FormLabel fontSize="lg" fontWeight="semibold">
              New Letters to Learn
            </FormLabel>
            <Input
              value={newLetters}
              onChange={(e) =>
                setNewLetters(e.target.value.replace(/[^a-zA-Z]/g, ""))
              }
              placeholder="Enter letters (e.g., qwerty)"
              size="lg"
              borderRadius="lg"
            />
            <Text fontSize="sm" color="gray.600" mt={2}>
              Enter the new letters to learn (letters only)
            </Text>
          </FormControl>
        )}

        {/* Words/Sentences/Paragraphs Input */}
        <FormControl isRequired>
          <FormLabel fontSize="lg" fontWeight="semibold">
            {isParagraphMode
              ? "Lesson Content"
              : isSentenceMode
              ? "Lesson Sentences"
              : "Lesson Words"}
          </FormLabel>
          <Textarea
            value={words}
            onChange={(e) => setWords(e.target.value)}
            placeholder={
              isParagraphMode
                ? "Enter structured content with titles, authors, and text..."
                : isSentenceMode
                ? "Enter sentences separated by line breaks..."
                : "Enter words separated by spaces..."
            }
            rows={isParagraphMode ? 10 : 6}
            size="lg"
            borderRadius="lg"
            resize="vertical"
          />
          <Text fontSize="sm" color="gray.600" mt={2}>
            {isParagraphMode
              ? "Enter structured content. Use line breaks to separate paragraphs, titles, and authors. Format: Title (bold), Author, Content lines..."
              : isSentenceMode
              ? "Enter sentences separated by line breaks (Enter key)"
              : "Enter words separated by spaces"}
          </Text>
        </FormControl>

        {/* Key Locations Preview */}
        {isKeyLocationMode && newLetters && (
          <Box>
            <Heading size="md" mb={4}>
              Key Locations:
            </Heading>
            <HStack spacing={3} flexWrap="wrap">
              {newLetters.split("").map((letter, index) => (
                <KeyboardKey key={index} letter={letter} />
              ))}
            </HStack>
          </Box>
        )}

        {/* Emoji Mappings */}
        {showEmojiMappings && (
          <Box>
            <Heading size="md" mb={4}>
              Emoji Mappings
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={4}>
              Click on emojis to change them
            </Text>
            <VStack spacing={3} align="stretch">
              {wordArray.map((word) => (
                <HStack
                  key={word}
                  p={3}
                  bg="gray.50"
                  borderRadius="lg"
                  justify="space-between"
                >
                  <Text fontWeight="medium">{word}</Text>
                  <Popover
                    isOpen={
                      emojiPickerState.isOpen &&
                      emojiPickerState.selectedWord === word
                    }
                    onClose={handleClose}
                    placement="top"
                  >
                    <PopoverTrigger>
                      <Badge
                        colorScheme="purple"
                        variant="outline"
                        cursor="pointer"
                        px={3}
                        py={2}
                        borderRadius="full"
                        onClick={() => handleEmojiSelect(word)}
                        _hover={{ bg: "purple.50" }}
                      >
                        <HStack spacing={2}>
                          <Text fontSize="lg">
                            {wordEmojiMap[word] || "Select emoji"}
                          </Text>
                          <FiEdit size={14} />
                        </HStack>
                      </Badge>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverBody p={0}>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        <Divider />

        {/* Action Buttons */}
        <HStack spacing={4} justify="flex-end">
          <Button
            variant="outline"
            colorScheme="red"
            onClick={onCancel}
            size="lg"
            px={8}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="brand"
            size="lg"
            px={8}
            borderRadius="xl"
          >
            {submitButtonText}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
};

export default LessonForm;
