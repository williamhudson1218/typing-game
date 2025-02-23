import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const Lessons = () => {
  const [lessons, setLessons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadLessons();
  }, []);

  const loadLessons = () => {
    const storedLessons = JSON.parse(localStorage.getItem("lessons")) || [];
    setLessons(storedLessons);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      const updatedLessons = lessons.filter((lesson) => lesson.id !== id);
      localStorage.setItem("lessons", JSON.stringify(updatedLessons));
      setLessons(updatedLessons);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-lesson/${id}`);
  };

  const getPreviewWords = (words) => {
    return words.slice(0, 3).join(", ") + (words.length > 3 ? "..." : "");
  };

  return (
    <Box sx={{ p: 4, maxWidth: "100%" }}>
      <Typography variant="h4" component="h2" gutterBottom>
        My Lessons
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Lesson Name</TableCell>
              <TableCell>Preview</TableCell>
              <TableCell>Words</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <TableRow key={lesson.id} hover>
                  <TableCell>{lesson.title}</TableCell>
                  <TableCell>{getPreviewWords(lesson.words)}</TableCell>
                  <TableCell>{lesson.words.length} words</TableCell>
                  <TableCell>
                    {lesson.isPictureMode ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>Pictures</span>
                        <span role="img" aria-label="picture mode">
                          🖼️
                        </span>
                      </Box>
                    ) : (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <span>Text</span>
                        <span role="img" aria-label="text mode">
                          📝
                        </span>
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {lesson.completed ? "Completed" : "In Progress"}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => navigate(`/lesson/${lesson.id}`)}
                      color={lesson.completed ? "secondary" : "primary"}
                      sx={{
                        mr: 1,
                        ...(lesson.completed && {
                          "&:hover": {
                            color: "white",
                          },
                        }),
                      }}
                    >
                      {lesson.completed ? "Review" : "Start"}
                    </Button>
                    <IconButton
                      onClick={() => handleEdit(lesson.id)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(lesson.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Lessons Yet
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Create your first typing lesson to get started!
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/add-lesson")}
                    startIcon={<AddIcon />}
                  >
                    Add New Lesson
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Lessons;
