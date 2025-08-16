import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Menu from "./components/Menu";
import Courses from "./components/Courses";
import CourseView from "./components/CourseView";
import AddCourse from "./components/CourseForm/Add";
import EditCourse from "./components/CourseForm/Edit";
import Lessons from "./components/Lessons";
import AddLesson from "./components/LessonForm/Add";
import TypingStudio from "./components/TypingStudio";
import EditLesson from "./components/LessonForm/Edit";
import ProgressTracker from "./components/ProgressTracker";
import Achievements from "./components/Achievements";
import Settings from "./components/Settings";
import "./styles.css";
import theme from "./theme";

function App() {
  // Get basename from package.json homepage or default to '/'
  const basename =
    process.env.NODE_ENV === "production"
      ? "/typing-game" // GitHub Pages repository name
      : "/";

  return (
    <ChakraProvider theme={theme}>
      <Router basename={basename}>
        <div className="App">
          <Menu />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Courses />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:courseId" element={<CourseView />} />
              <Route path="/add-course" element={<AddCourse />} />
              <Route path="/edit-course/:id" element={<EditCourse />} />
              <Route path="/lessons" element={<Lessons />} />
              <Route path="/course/:courseId/lessons" element={<Lessons />} />
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
    </ChakraProvider>
  );
}

export default App;
