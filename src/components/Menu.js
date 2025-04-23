import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Container,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Home as HomeIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as AchievementsIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", icon: <HomeIcon />, label: "Lessons" },
    { path: "/add-lesson", icon: <AddIcon />, label: "Add Lesson" },
    { path: "/progress", icon: <AssessmentIcon />, label: "Progress" },
    {
      path: "/achievements",
      icon: <AchievementsIcon />,
      label: "Achievements",
    },
    { path: "/settings", icon: <SettingsIcon />, label: "Settings" },
  ];

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Desktop menu */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: 2,
              justifyContent: "center",
            }}
          >
            {menuItems.map((item) => (
              <Box key={item.path}>
                <Button
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  color={isActive(item.path) ? "primary" : "inherit"}
                  variant={isActive(item.path) ? "contained" : "text"}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                  }}
                >
                  {item.label}
                </Button>
              </Box>
            ))}
          </Box>

          {/* Mobile menu */}
          <Box
            sx={{
              display: { xs: "flex", sm: "none" },
              gap: 1,
              justifyContent: "center",
              width: "100%",
            }}
          >
            {menuItems.map((item) => (
              <IconButton
                key={item.path}
                onClick={() => navigate(item.path)}
                color={isActive(item.path) ? "primary" : "inherit"}
                size="large"
              >
                {item.icon}
              </IconButton>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Menu;
