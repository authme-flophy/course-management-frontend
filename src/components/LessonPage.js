import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const isInstructor = useSelector(
    (state) => state.auth.user?.user_type === "instructor"
  );
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);

  useEffect(() => {
    const fetchLessonAndEnrollment = async () => {
      try {
        // First check enrollment status
        const enrollmentResponse = await axios.get(
          `http://localhost:8000/api/courses/${courseId}/enrollment_status/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const isUserEnrolled = enrollmentResponse.data.is_enrolled;

        // Only fetch lesson if user is enrolled or is an instructor
        if (isUserEnrolled || isInstructor) {
          // Fetch all lessons for the course
          const lessonsResponse = await axios.get(
            `http://localhost:8000/api/courses/${courseId}/lessons/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLessons(lessonsResponse.data);

          // Find current lesson index
          const index = lessonsResponse.data.findIndex(
            (lesson) => lesson.id === parseInt(lessonId)
          );
          setCurrentLessonIndex(index);

          // Fetch current lesson details
          const lessonResponse = await axios.get(
            `http://localhost:8000/api/courses/${courseId}/lessons/${lessonId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setLesson(lessonResponse.data);
        } else {
          setError("You must be enrolled in this course to access its lessons");
        }
      } catch (error) {
        setError(error.response?.data?.message || "Error accessing lesson");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonAndEnrollment();
  }, [courseId, lessonId, token, isInstructor]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mt-4 text-blue-500 hover:text-blue-600"
          >
            Return to Course Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Course
        </button>

        <div className="flex gap-4">
          {currentLessonIndex > 0 && (
            <button
              onClick={() =>
                navigate(
                  `/courses/${courseId}/lessons/${lessons[currentLessonIndex - 1].id
                  }`
                )
              }
              className="flex items-center px-4 py-2 text-sm text-blue-500 hover:text-blue-600"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous Lesson
            </button>
          )}

          {currentLessonIndex < lessons.length - 1 && (
            <button
              onClick={() =>
                navigate(
                  `/courses/${courseId}/lessons/${lessons[currentLessonIndex + 1].id
                  }`
                )
              }
              className="flex items-center px-4 py-2 text-sm text-blue-500 hover:text-blue-600"
            >
              Next Lesson
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{lesson?.title}</h1>
          {isInstructor && (
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-600 whitespace-pre-wrap">{lesson?.content}</p>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Last updated: {new Date(lesson?.updated_at).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
