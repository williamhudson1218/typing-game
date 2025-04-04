import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Lessons from "./components/Lessons";
import AddLesson from "./components/LessonForm/Add";
import TypingStudio from "./components/TypingStudio";
import EditLesson from "./components/LessonForm/Edit";
import ProgressTracker from "./components/ProgressTracker";
import Achievements from "./components/Achievements";
import Settings from "./components/Settings";
import "./styles.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

function App() {
  // Get basename from package.json homepage or default to '/'
  const basename =
    process.env.NODE_ENV === "production"
      ? "/typing-game" // GitHub Pages repository name
      : "/";

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router basename={basename}>
        <div className="App">
          <Menu />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Lessons />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/add-lesson" element={<AddLesson />} />
              <Route path="/lesson/:id" element={<TypingStudio />} />
              <Route path="/edit-lesson/:id" element={<EditLesson />} />
              <Route path="/progress" element={<ProgressTracker />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
