import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6", // Modern blue
      light: "#60a5fa",
      dark: "#2563eb",
    },
    secondary: {
      main: "#8b5cf6", // Modern purple
      light: "#a78bfa",
      dark: "#7c3aed",
    },
    error: {
      main: "#ef4444", // Modern red
      light: "#f87171",
      dark: "#dc2626",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: [
      "Inter",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h4: {
      fontWeight: 600,
      fontSize: "1.75rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          padding: "8px 16px",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "16px 24px",
        },
        head: {
          fontWeight: 600,
          backgroundColor: "#f8fafc",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": {
            borderBottom: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8,
        },
      },
    },
  },
});

export default theme;
