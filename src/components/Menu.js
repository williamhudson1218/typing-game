import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  IconButton,
  Text,
  Container,
  HStack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  FiHome,
  FiBook,
  FiPlus,
  FiBarChart,
  FiAward,
  FiSettings,
} from "react-icons/fi";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", icon: FiBook, label: "Courses" },
    { path: "/lessons", icon: FiHome, label: "Lessons" },
    { path: "/add-lesson", icon: FiPlus, label: "Add Lesson" },
    { path: "/progress", icon: FiBarChart, label: "Progress" },
    { path: "/achievements", icon: FiAward, label: "Achievements" },
    { path: "/settings", icon: FiSettings, label: "Settings" },
  ];

  const bg = "white";
  const borderColor = "gray.200";

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={bg}
      borderBottom="1px solid"
      borderColor={borderColor}
      boxShadow="sm"
    >
      <Container maxW="container.xl" px={4}>
        <Flex justify="center" align="center" py={4} minH="70px">
          {isMobile ? (
            // Mobile menu - horizontal scrollable
            <HStack spacing={2} overflowX="auto" w="full" justify="center">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <VStack
                    key={item.path}
                    spacing={1}
                    minW="60px"
                    cursor="pointer"
                    onClick={() => navigate(item.path)}
                    p={2}
                    borderRadius="lg"
                    bg={active ? "brand.50" : "transparent"}
                    border={active ? "2px solid" : "2px solid transparent"}
                    borderColor={active ? "brand.500" : "transparent"}
                    transition="all 0.2s"
                    _hover={{
                      bg: active ? "brand.100" : "gray.50",
                      transform: "translateY(-2px)",
                    }}
                  >
                    <IconButton
                      icon={<Icon />}
                      size="sm"
                      variant="ghost"
                      colorScheme={active ? "brand" : "gray"}
                      aria-label={item.label}
                      isDisabled
                    />
                    <Text
                      fontSize="xs"
                      fontWeight={active ? "semibold" : "medium"}
                      color={active ? "brand.600" : "gray.600"}
                      textAlign="center"
                    >
                      {item.label}
                    </Text>
                  </VStack>
                );
              })}
            </HStack>
          ) : (
            // Desktop menu
            <HStack spacing={4}>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Button
                    key={item.path}
                    leftIcon={<Icon />}
                    onClick={() => navigate(item.path)}
                    variant={active ? "solid" : "ghost"}
                    colorScheme="brand"
                    size="md"
                    px={6}
                    py={3}
                    borderRadius="xl"
                    fontWeight="medium"
                    transition="all 0.2s"
                    _hover={{
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    _active={{
                      transform: "translateY(0)",
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </HStack>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Menu;
