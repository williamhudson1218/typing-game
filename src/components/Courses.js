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
  Progress,
} from "@chakra-ui/react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiBook,
  FiChevronRight,
  FiStar,
} from "react-icons/fi";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
    loadLessons();
  }, []);

  const loadCourses = () => {
    const storedCourses = JSON.parse(localStorage.getItem("courses")) || [];
    const sortedCourses = storedCourses.sort((a, b) => b.id - a.id);
    setCourses(sortedCourses);
  };

  const loadLessons = () => {
    const storedLessons = JSON.parse(localStorage.getItem("lessons")) || [];
    setLessons(storedLessons);
  };

  const handleDelete = (course) => {
    setCourseToDelete(course);
    onOpen();
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      // Remove course
      const updatedCourses = courses.filter(
        (course) => course.id !== courseToDelete.id
      );
      localStorage.setItem("courses", JSON.stringify(updatedCourses));

      // Remove course from lessons
      const updatedLessons = lessons.map((lesson) => {
        if (lesson.courseId === courseToDelete.id) {
          return { ...lesson, courseId: null };
        }
        return lesson;
      });
      localStorage.setItem("lessons", JSON.stringify(updatedLessons));

      setCourses(updatedCourses);
      setLessons(updatedLessons);
    }
    onClose();
    setCourseToDelete(null);
  };

  const handleEdit = (id) => {
    navigate(`/edit-course/${id}`);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleSetAsDefault = (courseId) => {
    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    const newSettings = { ...settings, currentCourseId: courseId };
    localStorage.setItem("settings", JSON.stringify(newSettings));
    
    // Show a toast or feedback
    alert("Course set as default! This will be the default filter on the lessons page.");
  };

  const getCourseProgress = (courseId) => {
    const courseLessons = lessons.filter(
      (lesson) => lesson.courseId === courseId
    );
    if (courseLessons.length === 0) return 0;

    const completedLessons = courseLessons.filter((lesson) => {
      const progress =
        JSON.parse(localStorage.getItem(`progress_${lesson.id}`)) || {};
      return progress.completed;
    });

    return Math.round((completedLessons.length / courseLessons.length) * 100);
  };

  const getCourseStats = (courseId) => {
    const courseLessons = lessons.filter(
      (lesson) => lesson.courseId === courseId
    );
    return {
      totalLessons: courseLessons.length,
      completedLessons: courseLessons.filter((lesson) => {
        const progress =
          JSON.parse(localStorage.getItem(`progress_${lesson.id}`)) || {};
        return progress.completed;
      }).length,
    };
  };

  const getCurrentDefaultCourse = () => {
    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    return settings.currentCourseId;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2} color="gray.800">
            My Courses
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Organize your lessons into courses for structured learning
          </Text>
        </Box>

        {/* Add Course Button */}
        <Box>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="brand"
            size="lg"
            onClick={() => navigate("/add-course")}
          >
            Create New Course
          </Button>
        </Box>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {courses.map((course) => {
              const stats = getCourseStats(course.id);
              const progress = getCourseProgress(course.id);
              const isDefault = getCurrentDefaultCourse() === course.id;

              return (
                <GridItem key={course.id}>
                  <Card
                    border="1px solid"
                    borderColor="gray.200"
                    _hover={{
                      borderColor: "brand.300",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    transition="all 0.2s"
                    cursor="pointer"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    <CardHeader pb={2}>
                      <Flex justify="space-between" align="start">
                        <Box flex="1">
                          <Heading size="md" color="gray.800" mb={1}>
                            {course.title}
                          </Heading>
                          <Text color="gray.600" fontSize="sm" noOfLines={2}>
                            {course.description}
                          </Text>
                        </Box>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(course.id);
                            }}
                            aria-label="Edit course"
                          />
                          <IconButton
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(course);
                            }}
                            aria-label="Delete course"
                          />
                        </HStack>
                      </Flex>
                    </CardHeader>

                    <CardBody pt={0}>
                      <VStack spacing={3} align="stretch">
                        {/* Progress */}
                        <Box>
                          <Flex justify="space-between" mb={1}>
                            <Text fontSize="sm" color="gray.600">
                              Progress
                            </Text>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.700"
                            >
                              {progress}%
                            </Text>
                          </Flex>
                          <Progress
                            value={progress}
                            colorScheme="brand"
                            size="sm"
                            borderRadius="full"
                          />
                        </Box>

                        {/* Stats */}
                        <HStack justify="space-between">
                          <Badge colorScheme="blue" variant="subtle">
                            {stats.totalLessons} lessons
                          </Badge>
                          <Badge colorScheme="green" variant="subtle">
                            {stats.completedLessons} completed
                          </Badge>
                        </HStack>

                        {/* View Course Button */}
                        <Button
                          rightIcon={<FiChevronRight />}
                          variant="outline"
                          colorScheme="brand"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCourse(course.id);
                          }}
                        >
                          View Course
                        </Button>

                        {/* Set as Default Button */}
                        <Button
                          leftIcon={<FiStar />}
                          variant={isDefault ? "solid" : "ghost"}
                          colorScheme="yellow"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetAsDefault(course.id);
                          }}
                        >
                          {isDefault ? "Default Course" : "Set as Default"}
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
              No Courses Yet
            </Heading>
            <Text color="gray.500" mb={4}>
              Create your first course to organize your lessons
            </Text>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="brand"
              onClick={() => navigate("/add-course")}
            >
              Create Course
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
              Delete Course
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{courseToDelete?.title}"? This
              will remove the course but keep the lessons (they'll become
              unassigned).
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

export default Courses;
