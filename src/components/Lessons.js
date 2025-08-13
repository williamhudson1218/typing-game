import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fi";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();

  const bg = "white";
  const borderColor = "gray.200";

  useEffect(() => {
    loadLessons();
    loadCourses();
  }, []);

  const loadLessons = () => {
    const storedLessons = JSON.parse(localStorage.getItem("lessons")) || [];
    const sortedLessons = storedLessons.sort((a, b) => b.id - a.id);
    setLessons(sortedLessons);
  };

  const loadCourses = () => {
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    setCourses(storedCourses);
  };



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

  const getPreviewWords = (words) => {
    return words.slice(0, 3).join(", ") + (words.length > 3 ? "..." : "");
  };

  const getFilteredLessons = () => {
    return lessons;
  };

  const getCourseName = (courseId) => {
    if (!courseId) return "Unassigned";
    const course = courses.find((c) => c.id === courseId);
    return course ? course.title : "Unknown Course";
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack spacing={4} align="start" mb={4}>
            <Box flex="1">
              <Heading size="xl" mb={2} color="gray.800">
                My Lessons
              </Heading>
              <Text color="gray.600" fontSize="lg">
                Practice your typing skills with custom lessons
              </Text>
            </Box>
            <Button
              leftIcon={<FiBook />}
              variant="outline"
              colorScheme="brand"
              onClick={() => navigate("/courses")}
            >
              View Courses
            </Button>
          </HStack>
        </Box>

        {/* Controls */}
        <HStack spacing={4} justify="space-between">
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            size="lg"
            onClick={() => navigate("/add-lesson")}
          >
            Create New Lesson
          </Button>


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
            {getFilteredLessons().map((lesson) => (
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
                  h="100%"
                  display="flex"
                  flexDirection="column"
                >
                  <CardHeader pb={2}>
                    <Flex align="center" justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Heading size="md" noOfLines={1}>
                          {lesson.title}
                        </Heading>
                        <HStack spacing={2}>
                          <Badge
                            colorScheme={
                              lesson.isPictureMode ? "purple" : "blue"
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
                                {lesson.isPictureMode ? "Pictures" : "Text"}
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
                          {getPreviewWords(lesson.words)}
                        </Text>
                      </Box>

                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>
                          {lesson.isSentenceMode ? "Sentences" : "Words"}
                        </Text>
                        <Text fontSize="lg" fontWeight="semibold">
                          {lesson.words.length}{" "}
                          {lesson.isSentenceMode ? "sentences" : "words"}
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
            ))}
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
                  No Lessons Yet
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  Create your first typing lesson to get started!
                </Text>
              </Box>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="brand"
                size="lg"
                onClick={() => navigate("/add-lesson")}
                px={8}
                py={6}
                borderRadius="xl"
              >
                Add New Lesson
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
              onClick={() => navigate("/add-lesson")}
              px={8}
              py={6}
              borderRadius="xl"
            >
              Add Another Lesson
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
