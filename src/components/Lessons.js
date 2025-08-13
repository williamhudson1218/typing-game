import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  FiFilter,
} from "react-icons/fi";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("all");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (selectedCourseFilter === "all") {
      return lessons;
    } else if (selectedCourseFilter === "unassigned") {
      return lessons.filter((lesson) => !lesson.courseId);
    } else {
      return lessons.filter(
        (lesson) => lesson.courseId === parseInt(selectedCourseFilter)
      );
    }
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

          {/* Course Filter */}
          <HStack spacing={2}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              Filter by course:
            </Text>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                fontSize: "14px",
                backgroundColor: "white",
              }}
            >
              <option value="all">All Lessons</option>
              <option value="unassigned">Unassigned</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </HStack>
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
                            colorScheme={lesson.completed ? "green" : "orange"}
                            variant="subtle"
                            borderRadius="full"
                            px={3}
                          >
                            {lesson.completed ? "Completed" : "In Progress"}
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

                  <CardBody pt={0}>
                    <VStack align="stretch" spacing={4}>
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
                          Words
                        </Text>
                        <Text fontSize="lg" fontWeight="semibold">
                          {lesson.words.length} words
                        </Text>
                      </Box>

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
                  {selectedCourseFilter === "all"
                    ? "No Lessons Yet"
                    : "No Lessons Found"}
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  {selectedCourseFilter === "all"
                    ? "Create your first typing lesson to get started!"
                    : `No lessons found for the selected filter. Try changing the course filter or create a new lesson.`}
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
