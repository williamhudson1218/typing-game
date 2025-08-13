import React, { useState, useEffect } from "react";
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
  FiImage,
  FiFileText,
  FiArrowLeft,
  FiBook,
} from "react-icons/fi";

const CourseView = () => {
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    const loadCourse = () => {
      const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
      const foundCourse = storedCourses.find(
        (c) => c.id === parseInt(courseId)
      );
      setCourse(foundCourse);
    };

    const loadLessons = () => {
      const storedLessons = JSON.parse(localStorage.getItem("lessons")) || [];
      const courseLessons = storedLessons
        .filter((lesson) => lesson.courseId === parseInt(courseId))
        .sort((a, b) => b.id - a.id);
      setLessons(courseLessons);
    };

    loadCourse();
    loadLessons();
  }, [courseId]);

  const handleDelete = (lesson) => {
    setLessonToDelete(lesson);
    onOpen();
  };

  const confirmDelete = () => {
    if (lessonToDelete) {
      const allLessons = JSON.parse(localStorage.getItem("lessons")) || [];
      const updatedLessons = allLessons.filter(
        (lesson) => lesson.id !== lessonToDelete.id
      );
      localStorage.setItem("lessons", JSON.stringify(updatedLessons));

      // Reload lessons after deletion
      const storedLessons = JSON.parse(localStorage.getItem("lessons")) || [];
      const courseLessons = storedLessons
        .filter((lesson) => lesson.courseId === parseInt(courseId))
        .sort((a, b) => b.id - a.id);
      setLessons(courseLessons);
    }
    onClose();
    setLessonToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/edit-lesson/${id}`);
  };

  const handleStart = (id) => {
    navigate(`/lesson/${id}`);
  };

  const getPreviewWords = (words) => {
    return words.slice(0, 3).join(", ") + (words.length > 3 ? "..." : "");
  };

  const getLessonProgress = (lessonId) => {
    const lessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const lesson = lessons.find((l) => l.id === lessonId);
    return {
      completed: lesson ? lesson.completed : false,
    };
  };

  if (!course) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Course not found</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Back Button */}
        <Box>
          <Button
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            onClick={() => navigate("/courses")}
            size="sm"
          >
            Back to Courses
          </Button>
        </Box>

        {/* Header with Add Lesson Button */}
        <Flex justify="space-between" align="start">
          <Box flex="1">
            <Heading size="xl" mb={2} color="gray.800">
              {course.title}
            </Heading>
            <Text color="gray.600" fontSize="lg" mb={4}>
              {course.description}
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="blue" variant="subtle">
                {lessons.length} lessons
              </Badge>
              <Badge colorScheme="green" variant="subtle">
                {
                  lessons.filter(
                    (lesson) => getLessonProgress(lesson.id).completed
                  ).length
                }{" "}
                completed
              </Badge>
            </HStack>
          </Box>

          {/* Add Lesson Button */}
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            size="lg"
            onClick={() =>
              navigate("/add-lesson", {
                state: { courseId: parseInt(courseId) },
              })
            }
          >
            Add Lesson to Course
          </Button>
        </Flex>

        {/* Lessons Grid */}
        {lessons.length > 0 ? (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {lessons.map((lesson) => {
              const progress = getLessonProgress(lesson.id);

              return (
                <GridItem key={lesson.id}>
                  <Card
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      borderColor: "brand.300",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.2s"
                  >
                    <CardHeader pb={2}>
                      <Flex justify="space-between" align="start">
                        <Box flex="1">
                          <Heading size="md" color="gray.800" mb={1}>
                            {lesson.title}
                          </Heading>
                          <Text color="gray.600" fontSize="sm" noOfLines={2}>
                            {lesson.words.length}{" "}
                            {lesson.isSentenceMode ? "sentences" : "words"}
                          </Text>
                        </Box>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<FiPlay />}
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleStart(lesson.id)}
                            aria-label="Start lesson"
                          />
                          <IconButton
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            onClick={() => handleEdit(lesson.id)}
                            aria-label="Edit lesson"
                          />
                          <IconButton
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDelete(lesson)}
                            aria-label="Delete lesson"
                          />
                        </HStack>
                      </Flex>
                    </CardHeader>

                    <CardBody pt={0}>
                      <VStack spacing={3} align="stretch">
                        {/* Lesson Type Badges */}
                        <HStack spacing={2}>
                          {lesson.isPictureMode && (
                            <Badge colorScheme="purple" variant="subtle">
                              <HStack spacing={1}>
                                <FiImage size={12} />
                                <Text>Picture</Text>
                              </HStack>
                            </Badge>
                          )}
                          {lesson.isKeyLocationMode && (
                            <Badge colorScheme="orange" variant="subtle">
                              <HStack spacing={1}>
                                <FiFileText size={12} />
                                <Text>Key Location</Text>
                              </HStack>
                            </Badge>
                          )}
                          {lesson.isSentenceMode && (
                            <Badge colorScheme="teal" variant="subtle">
                              <HStack spacing={1}>
                                <FiFileText size={12} />
                                <Text>Sentence</Text>
                              </HStack>
                            </Badge>
                          )}
                        </HStack>

                        {/* Preview Words */}
                        <Box>
                          <Text fontSize="sm" color="gray.600" mb={1}>
                            Preview:
                          </Text>
                          <Text fontSize="sm" color="gray.700" noOfLines={2}>
                            {getPreviewWords(lesson.words)}
                          </Text>
                        </Box>

                        {/* Progress */}
                        {progress.completed && (
                          <Badge
                            colorScheme="green"
                            variant="solid"
                            alignSelf="start"
                          >
                            Completed
                          </Badge>
                        )}

                        {/* Start Button */}
                        <Button
                          leftIcon={<FiPlay />}
                          colorScheme="brand"
                          size="sm"
                          onClick={() => handleStart(lesson.id)}
                        >
                          {progress.completed
                            ? "Practice Again"
                            : "Start Lesson"}
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </GridItem>
              );
            })}
          </Grid>
        ) : (
          <Box
            textAlign="center"
            py={12}
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="lg"
          >
            <FiBook
              size={48}
              color="#CBD5E0"
              style={{ margin: "0 auto 16px" }}
            />
            <Heading size="md" color="gray.500" mb={2}>
              No Lessons in This Course
            </Heading>
            <Text color="gray.500" mb={4}>
              Add your first lesson to start learning
            </Text>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              onClick={() =>
                navigate("/add-lesson", {
                  state: { courseId: parseInt(courseId) },
                })
              }
            >
              Add Lesson
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

export default CourseView;
