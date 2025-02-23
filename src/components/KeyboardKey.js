import React from "react";
import { Box, Typography } from "@mui/material";

const KeyboardKey = ({ letter }) => {
  // Define keyboard row layouts
  const keyboardLayout = {
    row1: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    row2: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    row3: ["z", "x", "c", "v", "b", "n", "m"],
  };

  return (
    <Box
      sx={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        my: 1,
      }}
    >
      <Box
        sx={{
          width: "200px",
          height: "120px",
          position: "relative",
          border: "1px solid #ccc",
          borderRadius: 1,
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Keyboard visualization */}
        {Object.values(keyboardLayout).map((row, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 0.5,
              my: 0.5,
              ml: idx * 1,
            }}
          >
            {row.map((key, keyIdx) => (
              <Box
                key={keyIdx}
                sx={{
                  width: "20px",
                  height: "20px",
                  border: "1px solid #ccc",
                  borderRadius: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  backgroundColor:
                    key === letter.toLowerCase() ? "primary.main" : "white",
                  color: key === letter.toLowerCase() ? "white" : "inherit",
                }}
              >
                {key}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <Typography variant="caption" sx={{ mt: 1 }}>
        {letter.toUpperCase()} key location
      </Typography>
    </Box>
  );
};

export default KeyboardKey;
