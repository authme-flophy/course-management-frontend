import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Login";
import Register from "./components/Register";
import CourseList from "./components/CourseList";
import CourseDetails from "./components/CourseDetails";
import Navigation from "./components/Navigation";
import LessonPage from "./components/LessonPage";
import InstructorDashboard from "./components/InstructorDashboard";
import CourseDetailsPage from "./components/dashboard/CourseDetailsPage";
import CreateLessonPage from "./features/courses/components/CreateLessonPage";
import EnrollStudentPage from "./features/courses/components/EnrollStudentPage";

const PrivateRoute = ({ element: Element, ...rest }) => {
  const token = useSelector((state) => state.auth.token);
  return token ? <Element {...rest} /> : <Navigate to="/login" />;
};

function App() {
  const isInstructor = useSelector(
    (state) => state.auth.userType === "instructor"
  );

  // Determine the default redirect path based on user type
  const defaultRedirect = isInstructor ? "/instructor/dashboard" : "/courses";

  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/courses"
            element={<PrivateRoute element={CourseList} />}
          />
          <Route
            path="/courses/:courseId"
            element={<PrivateRoute element={CourseDetails} />}
          />
          <Route
            path="/courses/:courseId/lessons/:lessonId"
            element={<PrivateRoute element={LessonPage} />}
          />
          <Route
            path="/instructor/dashboard"
            element={<PrivateRoute element={InstructorDashboard} />}
          />
          <Route
            path="/instructor/courses/:courseId"
            element={<PrivateRoute element={CourseDetailsPage} />}
          />
          <Route
            path="/instructor/courses/:courseId/lessons/new"
            element={<PrivateRoute element={CreateLessonPage} />}
          />
          <Route
            path="/instructor/courses/:courseId/enroll"
            element={<PrivateRoute element={EnrollStudentPage} />}
          />
          <Route path="/" element={<Navigate to={defaultRedirect} />} />
          <Route path="*" element={<Navigate to={defaultRedirect} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
