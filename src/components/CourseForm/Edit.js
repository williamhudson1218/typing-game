import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import { FiArrowLeft, FiSave } from "react-icons/fi";

const EditCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const loadCourse = () => {
      try {
        const courses = JSON.parse(localStorage.getItem("courses")) || [];
        const course = courses.find((c) => c.id === parseInt(id));

        if (course) {
          setTitle(course.title);
          setDescription(course.description || "");
        } else {
          alert("Course not found");
          navigate("/courses");
          return;
        }
      } catch (error) {
        console.error("Error loading course:", error);
        alert("Failed to load course");
        navigate("/courses");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a course title");
      return;
    }

    setIsSubmitting(true);

    try {
      const courses = JSON.parse(localStorage.getItem("courses")) || [];
      const updatedCourses = courses.map((course) => {
        if (course.id === parseInt(id)) {
          return {
            ...course,
            title: title.trim(),
            description: description.trim(),
            updatedAt: new Date().toISOString(),
          };
        }
        return course;
      });

      localStorage.setItem("courses", JSON.stringify(updatedCourses));
      navigate("/courses");
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <HStack spacing={4} align="center" mb={4}>
            <Button
              leftIcon={<FiArrowLeft />}
              variant="ghost"
              onClick={() => navigate("/courses")}
              size="sm"
            >
              Back to Courses
            </Button>
          </HStack>
          <Heading size="xl" mb={2} color="gray.800">
            Edit Course
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Update your course information
          </Text>
        </Box>

        {/* Form */}
        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Course Title */}
            <FormControl isRequired>
              <FormLabel fontSize="lg" fontWeight="semibold">
                Course Title
              </FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title..."
                size="lg"
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
            </FormControl>

            {/* Course Description */}
            <FormControl>
              <FormLabel fontSize="lg" fontWeight="semibold">
                Description
              </FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this course covers..."
                size="lg"
                rows={4}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
            </FormControl>

            {/* Submit Buttons */}
            <HStack spacing={4} justify="flex-end" pt={4}>
              <Button
                variant="outline"
                onClick={() => navigate("/courses")}
                size="lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                leftIcon={<FiSave />}
                colorScheme="brand"
                size="lg"
                isLoading={isSubmitting}
                loadingText="Saving..."
              >
                Save Changes
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default EditCourse;
