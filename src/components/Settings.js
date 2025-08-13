import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Switch,
  Select,
  Icon,
} from "@chakra-ui/react";
import {
  FiVolume2,
  FiVolumeX,
  FiMoon,
  FiSun,
  FiTarget,
  FiSettings,
  FiSave,
  FiBook,
} from "react-icons/fi";

const Settings = () => {
  const [settings, setSettings] = useState({
    sound: true,
    darkMode: false,
    allowMistakes: true,
    difficulty: "medium",
    showProgress: true,
    autoSave: true,
    currentCourseId: null,
  });

  const bg = "white";
  const borderColor = "gray.200";

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem("settings")) || {};
    setSettings((prev) => ({ ...prev, ...savedSettings }));
  }, []);

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    localStorage.setItem("settings", JSON.stringify(newSettings));
  };

  const SettingItem = ({
    title,
    description,
    icon,
    type = "switch",
    value,
    onChange,
    options = [],
    colorScheme = "brand",
  }) => (
    <HStack justify="space-between" p={4} bg="gray.50" borderRadius="lg">
      <HStack spacing={4} flex={1}>
        <Icon as={icon} boxSize={5} color={`${colorScheme}.500`} />
        <VStack align="start" spacing={1}>
          <Text fontWeight="semibold" color="gray.800">
            {title}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {description}
          </Text>
        </VStack>
      </HStack>

      {type === "switch" ? (
        <Switch
          isChecked={value}
          onChange={(e) => onChange(e.target.checked)}
          colorScheme={colorScheme}
          size="lg"
        />
      ) : type === "select" ? (
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="sm"
          w="120px"
          borderRadius="lg"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : null}
    </HStack>
  );

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2} color="gray.800">
            Settings
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Customize your typing experience
          </Text>
        </Box>

        {/* Audio Settings */}
        <Card
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
        >
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon as={FiVolume2} boxSize={6} color="blue.500" />
                <Heading size="md" color="gray.800">
                  Audio Settings
                </Heading>
              </HStack>

              <SettingItem
                title="Sound Effects"
                description="Play sounds for correct/incorrect keystrokes"
                icon={settings.sound ? FiVolume2 : FiVolumeX}
                value={settings.sound}
                onChange={(value) => handleSettingChange("sound", value)}
                colorScheme="blue"
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Display Settings */}
        <Card
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
        >
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon as={FiMoon} boxSize={6} color="purple.500" />
                <Heading size="md" color="gray.800">
                  Display Settings
                </Heading>
              </HStack>

              <SettingItem
                title="Dark Mode"
                description="Switch between light and dark themes"
                icon={settings.darkMode ? FiMoon : FiSun}
                value={settings.darkMode}
                onChange={(value) => handleSettingChange("darkMode", value)}
                colorScheme="purple"
              />

              <SettingItem
                title="Show Progress"
                description="Display real-time typing progress"
                icon={FiTarget}
                value={settings.showProgress}
                onChange={(value) => handleSettingChange("showProgress", value)}
                colorScheme="green"
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Typing Settings */}
        <Card
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
        >
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon as={FiTarget} boxSize={6} color="orange.500" />
                <Heading size="md" color="gray.800">
                  Typing Behavior
                </Heading>
              </HStack>

              <SettingItem
                title="Allow Mistakes"
                description="Continue typing even after making errors"
                icon={FiTarget}
                value={settings.allowMistakes}
                onChange={(value) =>
                  handleSettingChange("allowMistakes", value)
                }
                colorScheme="orange"
              />

              <SettingItem
                title="Difficulty Level"
                description="Set the challenge level for lessons"
                icon={FiTarget}
                type="select"
                value={settings.difficulty}
                onChange={(value) => handleSettingChange("difficulty", value)}
                options={[
                  { value: "easy", label: "Easy" },
                  { value: "medium", label: "Medium" },
                  { value: "hard", label: "Hard" },
                ]}
                colorScheme="red"
              />

              <SettingItem
                title="Default Course"
                description="Set the default course filter for the lessons page"
                icon={FiBook}
                type="select"
                value={settings.currentCourseId || ""}
                onChange={(value) => handleSettingChange("currentCourseId", value ? parseInt(value) : null)}
                options={(() => {
                  const courses = JSON.parse(localStorage.getItem("courses")) || [];
                  return [
                    { value: "", label: "All Lessons" },
                    ...courses.map(course => ({
                      value: course.id.toString(),
                      label: course.title
                    }))
                  ];
                })()}
                colorScheme="blue"
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Data Settings */}
        <Card
          bg={bg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="xl"
        >
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon as={FiSave} boxSize={6} color="teal.500" />
                <Heading size="md" color="gray.800">
                  Data & Storage
                </Heading>
              </HStack>

              <SettingItem
                title="Auto Save"
                description="Automatically save your progress"
                icon={FiSave}
                value={settings.autoSave}
                onChange={(value) => handleSettingChange("autoSave", value)}
                colorScheme="teal"
              />
            </VStack>
          </CardBody>
        </Card>

        {/* Reset Settings */}
        <Card
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          borderRadius="xl"
        >
          <CardBody p={6}>
            <VStack spacing={4} align="stretch">
              <HStack spacing={3}>
                <Icon as={FiSettings} boxSize={6} color="red.500" />
                <Heading size="md" color="red.800">
                  Reset Options
                </Heading>
              </HStack>

              <Text fontSize="sm" color="red.700">
                Reset all settings to their default values. This action cannot
                be undone.
              </Text>

              <HStack justify="flex-end">
                <Box
                  as="button"
                  px={4}
                  py={2}
                  bg="red.500"
                  color="white"
                  borderRadius="lg"
                  fontSize="sm"
                  fontWeight="medium"
                  _hover={{ bg: "red.600" }}
                  _active={{ bg: "red.700" }}
                  onClick={() => {
                    const defaultSettings = {
                      sound: true,
                      darkMode: false,
                      allowMistakes: true,
                      difficulty: "medium",
                      showProgress: true,
                      autoSave: true,
                    };
                    setSettings(defaultSettings);
                    localStorage.setItem(
                      "settings",
                      JSON.stringify(defaultSettings)
                    );
                  }}
                >
                  Reset All Settings
                </Box>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};

export default Settings;
