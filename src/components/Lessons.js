import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  IconButton,
  HStack,
  VStack,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiPlay,
  FiRefreshCw,
  FiImage,
  FiFileText,
  FiBook,
  FiArrowLeft,
} from "react-icons/fi";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const bg = "white";
  const borderColor = "gray.200";

  const loadLessons = useCallback(() => {
    try {
      const storedLessons = JSON.parse(localStorage.getItem("lessons")) || [];
      let filteredLessons = storedLessons;

      if (courseId) {
        const courseIdInt = parseInt(courseId);
        console.log(
          "Filtering lessons for courseId:",
          courseId,
          "as int:",
          courseIdInt
        );
        console.log(
          "Available lessons with courseIds:",
          storedLessons.map((l) => ({
            id: l?.id,
            courseId: l?.courseId,
            title: l?.title,
          }))
        );

        filteredLessons = storedLessons.filter((lesson) => {
          if (!lesson) return false;
          // Try both string and integer comparison
          const matches =
            lesson.courseId === courseIdInt ||
            lesson.courseId === courseId ||
            lesson.courseId === parseInt(lesson.courseId);
          console.log(
            `Lesson ${lesson.id} courseId: ${
              lesson.courseId
            } (${typeof lesson.courseId}) matches ${courseId}: ${matches}`
          );
          return matches;
        });
        console.log("Filtered lessons:", filteredLessons.length);
      }

      // Filter out any invalid lessons and ensure all properties exist
      filteredLessons = filteredLessons
        .filter(
          (lesson) =>
            lesson && typeof lesson === "object" && lesson.id && lesson.title
        )
        .map((lesson) => ({
          ...lesson,
          isPictureMode: lesson.isPictureMode || false,
          isKeyLocationMode: lesson.isKeyLocationMode || false,
          isSentenceMode: lesson.isSentenceMode || false,
          isParagraphMode: lesson.isParagraphMode || false,
          words: lesson.words || [],
          newLetters: lesson.newLetters || [],
          emojiMap: lesson.emojiMap || {},
          completed: lesson.completed || false,
        }));

      const sortedLessons = filteredLessons.sort((a, b) => b.id - a.id);
      console.log("Loaded lessons:", sortedLessons);
      console.log(
        "Lesson structure check:",
        sortedLessons.map((l) => ({
          id: l?.id,
          title: l?.title,
          wordsType: Array.isArray(l?.words) ? "array" : typeof l?.words,
          wordsLength: Array.isArray(l?.words) ? l.words.length : "N/A",
          hasAllProps: !!(l?.id && l?.title && Array.isArray(l?.words)),
        }))
      );
      setLessons(sortedLessons);
    } catch (error) {
      console.error("Error loading lessons:", error);
      setLessons([]);
    }
  }, [courseId]);

  const loadCourses = useCallback(() => {
    try {
      const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
      // Filter out invalid courses
      const validCourses = storedCourses.filter(
        (course) =>
          course && typeof course === "object" && course.id && course.title
      );
      setCourses(validCourses);
    } catch (error) {
      console.error("Error loading courses:", error);
      setCourses([]);
    }
  }, []);

  const loadCourse = useCallback(() => {
    try {
      const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
      const foundCourse = storedCourses.find(
        (c) => c && typeof c === "object" && c.id === parseInt(courseId)
      );
      // Ensure the course is a valid object
      console.log(
        "Looking for course with ID:",
        courseId,
        "Found:",
        foundCourse
      );
      if (foundCourse && typeof foundCourse === "object" && foundCourse.title) {
        setCourse(foundCourse);
      } else {
        console.log("No valid course found for ID:", courseId);
        setCourse(null);
      }
    } catch (error) {
      console.error("Error loading course:", error);
      setCourse(null);
    }
  }, [courseId]);

  useEffect(() => {
    // Load settings to get current course
    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    const currentCourseId = settings.currentCourseId;

    // If no courseId in URL but there's a current course, redirect to that course's lessons
    if (!courseId && currentCourseId) {
      navigate(`/course/${currentCourseId}`, { replace: true });
      return;
    }

    loadLessons();
    loadCourses();
    if (courseId) {
      loadCourse();
    }
  }, [courseId, loadLessons, loadCourses, loadCourse, navigate]);

  const handleDelete = (lesson) => {
    setLessonToDelete(lesson);
    onOpen();
  };

  const confirmDelete = () => {
    if (lessonToDelete) {
      const updatedLessons = lessons.filter(
        (lesson) => lesson.id !== lessonToDelete.id
      );
      localStorage.setItem("lessons", JSON.stringify(updatedLessons));
      setLessons(updatedLessons);
    }
    onClose();
    setLessonToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/edit-lesson/${id}`);
  };

  // Safety function to ensure we never render objects directly
  const safeRender = (value, fallback = "") => {
    if (typeof value === "string" || typeof value === "number") {
      return value;
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    if (Array.isArray(value)) {
      return value.length.toString();
    }
    if (typeof value === "object" && value !== null) {
      console.warn("Attempted to render object directly:", value);
      return fallback;
    }
    return fallback;
  };

  const getPreviewWords = (words) => {
    if (!words || !Array.isArray(words) || words.length === 0) {
      return "No words available";
    }

    // Ensure all words are strings and filter out any non-string values
    const stringWords = words
      .filter((word) => {
        // Handle both string words and objects that might have a text property
        if (typeof word === "string") {
          return word.trim().length > 0;
        } else if (typeof word === "object" && word.text) {
          return typeof word.text === "string" && word.text.trim().length > 0;
        }
        return false;
      })
      .map((word) => {
        // Convert objects to strings if needed
        if (typeof word === "string") {
          return word;
        } else if (typeof word === "object" && word.text) {
          return word.text;
        }
        return String(word); // Fallback
      })
      .slice(0, 3);

    if (stringWords.length === 0) {
      return "No words available";
    }

    return stringWords.join(", ") + (words.length > 3 ? "..." : "");
  };

  const getFilteredLessons = () => {
    // Additional safety check to ensure all lessons are valid objects
    const filtered = lessons.filter((lesson) => {
      if (!lesson || typeof lesson !== "object") {
        console.warn("Invalid lesson found:", lesson);
        return false;
      }
      return true;
    });
    console.log("getFilteredLessons returning:", filtered);
    return filtered;
  };

  const getCourseName = (courseId) => {
    if (!courseId) return "Unassigned";
    const course = courses.find(
      (c) => c && typeof c === "object" && c.id === courseId
    );
    console.log("getCourseName - course found:", course);
    console.log(
      "getCourseName - course.title:",
      course?.title,
      "type:",
      typeof course?.title
    );
    const result =
      course && typeof course.title === "string"
        ? course.title
        : "Unknown Course";
    console.log("getCourseName for", courseId, "returning:", result);
    return result;
  };

  const getCourseProgress = () => {
    if (!courseId) return null;

    const courseLessons = lessons.filter(
      (lesson) =>
        lesson &&
        typeof lesson === "object" &&
        lesson.courseId === parseInt(courseId)
    );

    if (courseLessons.length === 0) return null;

    const completedLessons = courseLessons.filter(
      (lesson) => lesson && lesson.completed === true
    );
    const progressPercentage = Math.round(
      (completedLessons.length / courseLessons.length) * 100
    );

    return {
      totalLessons: courseLessons.length,
      completedLessons: completedLessons.length,
      progressPercentage,
    };
  };

  const getCourseStats = () => {
    if (!courseId) return null;

    const courseLessons = lessons.filter(
      (lesson) =>
        lesson &&
        typeof lesson === "object" &&
        lesson.courseId === parseInt(courseId)
    );

    return {
      totalLessons: courseLessons.length,
      completedLessons: courseLessons.filter(
        (lesson) => lesson && lesson.completed === true
      ).length,
    };
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          {courseId && course && (
            <Box mb={4}>
              <Button
                leftIcon={<FiArrowLeft />}
                variant="ghost"
                onClick={() => navigate("/courses")}
                size="sm"
                mb={4}
              >
                Back to Courses
              </Button>
            </Box>
          )}

          <HStack spacing={4} align="start" mb={4}>
            <Box flex="1">
              <Heading size="xl" mb={2} color="gray.800">
                {courseId && course ? course.title : "My Lessons"}
              </Heading>
              <Text color="gray.600" fontSize="lg" mb={courseId ? 2 : 0}>
                {courseId && course
                  ? course.description
                  : "Practice your typing skills with custom lessons"}
              </Text>

              {courseId && course && (
                <HStack spacing={4} mt={2}>
                  <Badge colorScheme="blue" variant="subtle">
                    {getCourseStats()?.totalLessons || 0} lessons
                  </Badge>
                  <Badge colorScheme="green" variant="subtle">
                    {getCourseStats()?.completedLessons || 0} completed
                  </Badge>
                  {getCourseProgress() && (
                    <Badge colorScheme="purple" variant="subtle">
                      {getCourseProgress().progressPercentage}% complete
                    </Badge>
                  )}
                </HStack>
              )}
            </Box>

            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              size="lg"
              onClick={() => {
                if (courseId) {
                  navigate("/add-lesson", {
                    state: { courseId: parseInt(courseId) },
                  });
                } else {
                  navigate("/add-lesson");
                }
              }}
            >
              {courseId ? "Add Lesson to Course" : "Create New Lesson"}
            </Button>
          </HStack>
        </Box>

        {/* Controls */}
        <HStack spacing={4} justify="space-between">
          {/* The "Add Lesson to Course" button is now in the header */}
        </HStack>

        {/* Lessons Grid */}
        {getFilteredLessons().length > 0 ? (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {getFilteredLessons().map((lesson) => {
              // Safety check to ensure lesson is valid
              if (!lesson || typeof lesson !== "object" || !lesson.id) {
                console.warn("Invalid lesson object:", lesson);
                return null;
              }

              // Additional safety check to ensure lesson has required properties
              if (!lesson.title || !Array.isArray(lesson.words)) {
                console.warn("Lesson missing required properties:", lesson);
                return null;
              }

              return (
                <GridItem key={lesson.id}>
                  <Card
                    bg={bg}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="xl"
                    boxShadow="lg"
                    transition="all 0.2s"
                    _hover={{
                      transform: "translateY(-4px)",
                      boxShadow: "xl",
                    }}
                    h="280px"
                    display="flex"
                    flexDirection="column"
                  >
                    <CardHeader pb={2}>
                      <Flex align="center" justify="space-between">
                        <VStack align="start" spacing={1}>
                          <Heading size="md" noOfLines={1}>
                            {safeRender(lesson.title, "Untitled Lesson")}
                          </Heading>
                          <HStack spacing={2}>
                            <Badge
                              colorScheme={
                                lesson.isPictureMode
                                  ? "purple"
                                  : lesson.isParagraphMode
                                  ? "teal"
                                  : "blue"
                              }
                              variant="subtle"
                              borderRadius="full"
                              px={3}
                            >
                              <HStack spacing={1}>
                                {lesson.isPictureMode ? (
                                  <FiImage size={14} />
                                ) : (
                                  <FiFileText size={14} />
                                )}
                                <Text fontSize="xs">
                                  {lesson.isPictureMode
                                    ? "Pictures"
                                    : lesson.isParagraphMode
                                    ? "Paragraph"
                                    : "Text"}
                                </Text>
                              </HStack>
                            </Badge>
                            <Badge
                              colorScheme={lesson.completed ? "green" : "gray"}
                              variant="subtle"
                              borderRadius="full"
                              px={3}
                            >
                              {lesson.completed ? "Completed" : "Not Started"}
                            </Badge>
                            <Badge
                              colorScheme="gray"
                              variant="subtle"
                              borderRadius="full"
                              px={3}
                            >
                              <HStack spacing={1}>
                                <FiBook size={12} />
                                <Text fontSize="xs">
                                  {getCourseName(lesson.courseId)}
                                </Text>
                              </HStack>
                            </Badge>
                          </HStack>
                        </VStack>
                      </Flex>
                    </CardHeader>

                    <CardBody
                      pt={0}
                      flex="1"
                      display="flex"
                      flexDirection="column"
                    >
                      <VStack align="stretch" spacing={4} flex="1">
                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            Preview
                          </Text>
                          <Text fontSize="md" noOfLines={2}>
                            {safeRender(
                              getPreviewWords(lesson.words || []),
                              "No preview available"
                            )}
                          </Text>
                        </Box>

                        <Box>
                          <Text fontSize="sm" color="gray.500" mb={1}>
                            {lesson.isParagraphMode
                              ? "Lines"
                              : lesson.isSentenceMode
                              ? "Sentences"
                              : "Words"}
                          </Text>
                          <Text fontSize="lg" fontWeight="semibold">
                            {safeRender((lesson.words || []).length, "0")}{" "}
                            {lesson.isParagraphMode
                              ? "lines"
                              : lesson.isSentenceMode
                              ? "sentences"
                              : "words"}
                          </Text>
                        </Box>

                        <Box mt="auto">
                          <HStack spacing={2}>
                            <Button
                              leftIcon={
                                lesson.completed ? <FiRefreshCw /> : <FiPlay />
                              }
                              colorScheme="brand"
                              variant="solid"
                              size="sm"
                              flex={1}
                              onClick={() => navigate(`/lesson/${lesson.id}`)}
                            >
                              {lesson.completed ? "Review" : "Start"}
                            </Button>
                            <IconButton
                              icon={<FiEdit />}
                              colorScheme="blue"
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(lesson.id)}
                              aria-label="Edit lesson"
                            />
                            <IconButton
                              icon={<FiTrash2 />}
                              colorScheme="red"
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(lesson)}
                              aria-label="Delete lesson"
                            />
                          </HStack>
                        </Box>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              );
            })}
          </Grid>
        ) : (
          // Empty State
          <Card
            bg={bg}
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="xl"
            py={16}
          >
            <VStack spacing={6}>
              <Box textAlign="center">
                <Heading size="lg" color="gray.600" mb={2}>
                  {courseId && course
                    ? `No Lessons in ${course.title}`
                    : "No Lessons Yet"}
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  {courseId && course
                    ? "Add your first lesson to this course to get started!"
                    : "Create your first typing lesson to get started!"}
                </Text>
              </Box>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="brand"
                size="lg"
                onClick={() => {
                  if (courseId) {
                    navigate("/add-lesson", {
                      state: { courseId: parseInt(courseId) },
                    });
                  } else {
                    navigate("/add-lesson");
                  }
                }}
                px={8}
                py={6}
                borderRadius="xl"
              >
                {courseId ? "Add Lesson to Course" : "Add New Lesson"}
              </Button>
            </VStack>
          </Card>
        )}

        {/* Add Lesson Button for when lessons exist */}
        {lessons.length > 0 && (
          <Box textAlign="center">
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              variant="outline"
              size="lg"
              onClick={() => {
                if (courseId) {
                  navigate("/add-lesson", {
                    state: { courseId: parseInt(courseId) },
                  });
                } else {
                  navigate("/add-lesson");
                }
              }}
              px={8}
              py={6}
              borderRadius="xl"
            >
              {courseId ? "Add Another Lesson to Course" : "Add Another Lesson"}
            </Button>
          </Box>
        )}
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Lesson
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{lessonToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default Lessons;
