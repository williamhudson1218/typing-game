import React from "react";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";

const KeyboardKey = ({ letter }) => {
  // Define keyboard row layouts
  const keyboardLayout = {
    row1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    row2: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    row3: ["z", "x", "c", "v", "b", "n", "m"],
  };

  return (
    <VStack spacing={2} align="center">
      <Box
        w="180px"
        h="100px"
        position="relative"
        border="1px solid"
        borderColor="gray.300"
        borderRadius="lg"
        bg="gray.50"
        p={2}
      >
        {/* Keyboard visualization */}
        {Object.values(keyboardLayout).map((row, idx) => (
          <HStack key={idx} justify="center" spacing={1} my={1} ml={idx * 2}>
            {row.map((key, keyIdx) => (
              <Box
                key={keyIdx}
                w="16px"
                h="16px"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="sm"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="xs"
                fontWeight="medium"
                bg={key === letter.toLowerCase() ? "brand.500" : "white"}
                color={key === letter.toLowerCase() ? "white" : "gray.700"}
                boxShadow={key === letter.toLowerCase() ? "md" : "none"}
                transition="all 0.2s"
              >
                {key}
              </Box>
            ))}
          </HStack>
        ))}
      </Box>
      <Text fontSize="sm" color="gray.600" fontWeight="medium">
        {letter.toUpperCase()} key location
      </Text>
    </VStack>
  );
};

export default KeyboardKey;
