import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AddCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert("Please enter a course title");
      return;
    }

    setIsSubmitting(true);

    try {
      const newCourse = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString(),
      };

      const existingCourses = JSON.parse(localStorage.getItem("courses")) || [];
      const updatedCourses = [newCourse, ...existingCourses];
      localStorage.setItem("courses", JSON.stringify(updatedCourses));

      navigate("/courses");
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Create New Course
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Organize your lessons into a structured course
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
                loadingText="Creating..."
              >
                Create Course
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default AddCourse;
