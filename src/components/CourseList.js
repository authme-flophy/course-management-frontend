import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourses } from "../features/courses/courseSlice";

const CourseList = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.items);
  const isLoading = useSelector((state) => state.courses.isLoading);
  const error = useSelector((state) => state.courses.error);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center p-8 text-gray-600">
        <p className="text-xl">No courses available</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Available Courses
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            to={`/courses/${course.id}`}
            className="block group h-full"
          >
            <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full flex flex-col p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {course.title}
              </h2>
              <p className="text-blue-600 text-sm mb-3 flex items-center">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {course.instructor.username || "Unknown Instructor"}
              </p>
              <p className="text-gray-600 text-sm flex-grow">
                {course.description || "No description available"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
