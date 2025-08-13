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
  Progress,
  Stat,
  StatNumber,
  Icon,
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiTarget,
  FiClock,
  FiAward,
  FiBarChart,
} from "react-icons/fi";
import { getStats } from "../utils/statsManager";

const ProgressTracker = () => {
  const stats = getStats();
  const bg = "white";
  const borderColor = "gray.200";

  const StatCard = ({ title, value, icon, unit, colorScheme = "brand" }) => (
    <Card
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="lg"
      transition="all 0.2s"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "xl",
      }}
    >
      <CardBody p={6}>
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
              {title}
            </Text>
            <Icon as={icon} boxSize={6} color={`${colorScheme}.500`} />
          </HStack>
          <Stat>
            <StatNumber
              fontSize="3xl"
              color={`${colorScheme}.600`}
              fontWeight="bold"
            >
              {typeof value === "number" ? value.toFixed(1) : value}
              {unit && (
                <Text as="span" fontSize="lg" color="gray.500" ml={2}>
                  {unit}
                </Text>
              )}
            </StatNumber>
          </Stat>
        </VStack>
      </CardBody>
    </Card>
  );

  const progressPercentage = Math.min((stats.lessonsCompleted / 10) * 100, 100);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2} color="gray.800">
            Progress Tracker
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Monitor your typing improvement over time
          </Text>
        </Box>

        {/* Stats Grid */}
        <Grid
          templateColumns={{
            base: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          }}
          gap={6}
        >
          <GridItem>
            <StatCard
              title="Words Typed"
              value={stats.wordsTyped}
              icon={FiTrendingUp}
              unit="words"
              colorScheme="blue"
            />
          </GridItem>
          <GridItem>
            <StatCard
              title="Accuracy"
              value={stats.accuracy}
              icon={FiTarget}
              unit="%"
              colorScheme="green"
            />
          </GridItem>
          <GridItem>
            <StatCard
              title="Average Speed"
              value={stats.averageSpeed}
              icon={FiClock}
              unit="WPM"
              colorScheme="orange"
            />
          </GridItem>
          <GridItem>
            <StatCard
              title="Lessons Completed"
              value={stats.lessonsCompleted}
              icon={FiAward}
              colorScheme="purple"
            />
          </GridItem>
        </Grid>

        {/* Progress Section */}
        <Card
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="lg"
        >
          <CardBody p={8}>
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between" align="center">
                <Box>
                  <Heading size="md" mb={1} color="gray.800">
                    Overall Progress
                  </Heading>
                  <Text color="gray.600">
                    {stats.lessonsCompleted} of 10 lessons completed
                  </Text>
                </Box>
                <Icon as={FiBarChart} boxSize={8} color="brand.500" />
              </HStack>

              <Box>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Progress
                  </Text>
                  <Text fontSize="sm" fontWeight="bold" color="brand.600">
                    {progressPercentage.toFixed(0)}%
                  </Text>
                </HStack>
                <Progress
                  value={progressPercentage}
                  size="lg"
                  colorScheme="brand"
                  borderRadius="full"
                  bg="gray.100"
                />
              </Box>

              {/* Progress Insights */}
              <Box>
                <Text fontSize="sm" color="gray.600" mb={3}>
                  Progress Insights
                </Text>
                <VStack spacing={2} align="stretch">
                  {stats.accuracy >= 95 ? (
                    <HStack p={3} bg="green.50" borderRadius="lg">
                      <Icon as={FiTarget} color="green.500" />
                      <Text fontSize="sm" color="green.700">
                        Excellent accuracy! Keep up the great work.
                      </Text>
                    </HStack>
                  ) : (
                    <HStack p={3} bg="orange.50" borderRadius="lg">
                      <Icon as={FiTarget} color="orange.500" />
                      <Text fontSize="sm" color="orange.700">
                        Focus on accuracy - aim for 95% or higher.
                      </Text>
                    </HStack>
                  )}

                  {stats.averageSpeed >= 40 ? (
                    <HStack p={3} bg="blue.50" borderRadius="lg">
                      <Icon as={FiTrendingUp} color="blue.500" />
                      <Text fontSize="sm" color="blue.700">
                        Great speed! You're typing faster than average.
                      </Text>
                    </HStack>
                  ) : (
                    <HStack p={3} bg="yellow.50" borderRadius="lg">
                      <Icon as={FiTrendingUp} color="yellow.500" />
                      <Text fontSize="sm" color="yellow.700">
                        Practice regularly to improve your typing speed.
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default ProgressTracker;
