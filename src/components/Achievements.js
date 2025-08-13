import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
  Icon,
  Progress,

} from "@chakra-ui/react";
import {
  FiZap,
  FiTarget,
  FiBook,
  FiAward,
  FiStar,
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

const Achievements = () => {
  const bg = "white";
  const borderColor = "gray.200";

  const achievements = [
    {
      id: 1,
      title: "Speed Demon",
      description: "Type 60 words per minute",
      icon: FiZap,
      status: "in-progress",
      progress: 75,
      colorScheme: "yellow",
      category: "Speed",
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Complete a lesson with 100% accuracy",
      icon: FiTarget,
      status: "completed",
      progress: 100,
      colorScheme: "green",
      category: "Accuracy",
    },
    {
      id: 3,
      title: "Dedicated Learner",
      description: "Complete 5 lessons",
      icon: FiBook,
      status: "in-progress",
      progress: 60,
      colorScheme: "blue",
      category: "Progress",
    },
    {
      id: 4,
      title: "Consistency King",
      description: "Practice for 7 days in a row",
      icon: FiTrendingUp,
      status: "locked",
      progress: 0,
      colorScheme: "purple",
      category: "Consistency",
    },
    {
      id: 5,
      title: "Early Bird",
      description: "Complete a lesson before 9 AM",
      icon: FiClock,
      status: "completed",
      progress: 100,
      colorScheme: "orange",
      category: "Time",
    },
    {
      id: 6,
      title: "Marathon Runner",
      description: "Type 1000 words in a single session",
      icon: FiStar,
      status: "in-progress",
      progress: 45,
      colorScheme: "red",
      category: "Endurance",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge colorScheme="green" variant="solid" borderRadius="full" px={3}>
            <HStack spacing={1}>
              <Icon as={FiCheckCircle} boxSize={3} />
              <Text fontSize="xs">Completed</Text>
            </HStack>
          </Badge>
        );
      case "in-progress":
        return (
          <Badge colorScheme="blue" variant="subtle" borderRadius="full" px={3}>
            <Text fontSize="xs">In Progress</Text>
          </Badge>
        );
      case "locked":
        return (
          <Badge
            colorScheme="gray"
            variant="outline"
            borderRadius="full"
            px={3}
          >
            <Text fontSize="xs">Locked</Text>
          </Badge>
        );
      default:
        return null;
    }
  };

  const completedCount = achievements.filter(
    (a) => a.status === "completed"
  ).length;
  const totalCount = achievements.length;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2} color="gray.800">
            Achievements
          </Heading>
          <Text color="gray.600" fontSize="lg" mb={4}>
            Unlock achievements as you improve your typing skills
          </Text>

          {/* Overall Progress */}
          <Card
            bg="brand.50"
            border="1px solid"
            borderColor="brand.200"
            borderRadius="xl"
          >
            <CardBody p={6}>
              <HStack justify="space-between" align="center">
                <VStack align="start" spacing={1}>
                  <Text fontSize="lg" fontWeight="semibold" color="brand.700">
                    Overall Progress
                  </Text>
                  <Text fontSize="sm" color="brand.600">
                    {completedCount} of {totalCount} achievements unlocked
                  </Text>
                </VStack>
                <Icon as={FiAward} boxSize={8} color="brand.500" />
              </HStack>
              <Progress
                value={(completedCount / totalCount) * 100}
                size="lg"
                colorScheme="brand"
                borderRadius="full"
                mt={4}
                bg="brand.100"
              />
            </CardBody>
          </Card>
        </Box>

        {/* Achievements Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {achievements.map((achievement) => (
            <GridItem key={achievement.id}>
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
                opacity={achievement.status === "locked" ? 0.6 : 1}
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="lg" fontWeight="bold" color="gray.800">
                          {achievement.title}
                        </Text>
                        <Badge
                          colorScheme={achievement.colorScheme}
                          variant="subtle"
                          size="sm"
                          borderRadius="full"
                        >
                          {achievement.category}
                        </Badge>
                      </VStack>
                      <Icon
                        as={achievement.icon}
                        boxSize={8}
                        color={`${achievement.colorScheme}.500`}
                      />
                    </HStack>

                    {/* Description */}
                    <Text fontSize="sm" color="gray.600" lineHeight="tall">
                      {achievement.description}
                    </Text>

                    {/* Progress */}
                    {achievement.status !== "locked" && (
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="xs" color="gray.500">
                            Progress
                          </Text>
                          <Text
                            fontSize="xs"
                            fontWeight="semibold"
                            color="gray.700"
                          >
                            {achievement.progress}%
                          </Text>
                        </HStack>
                        <Progress
                          value={achievement.progress}
                          size="sm"
                          colorScheme={achievement.colorScheme}
                          borderRadius="full"
                          bg="gray.100"
                        />
                      </Box>
                    )}

                    {/* Status Badge */}
                    {getStatusBadge(achievement.status)}
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          ))}
        </Grid>

        {/* Achievement Tips */}
        <Card
          bg="gray.50"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="xl"
        >
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <Heading size="md" color="gray.800">
                💡 Tips to Unlock More Achievements
              </Heading>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                gap={4}
              >
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    • Practice daily to maintain consistency
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    • Focus on accuracy before speed
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    • Try different lesson types
                  </Text>
                </VStack>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    • Set aside dedicated practice time
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    • Challenge yourself with harder lessons
                  </Text>
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    • Track your progress regularly
                  </Text>
                </VStack>
              </Grid>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Achievements;
