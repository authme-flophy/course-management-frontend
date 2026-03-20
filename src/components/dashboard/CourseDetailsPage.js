import React, { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInstructorCourseDetails,
  fetchInstructorEnrollments,
  selectInstructorCourseDetails,
  selectInstructorEnrollments,
  selectDetailsLoading,
  selectDetailsError,
} from "../../features/courses/courseSlice";

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const course = useSelector(selectInstructorCourseDetails);
  const enrollments = useSelector(selectInstructorEnrollments);
  const isLoading = useSelector(selectDetailsLoading);
  const error = useSelector(selectDetailsError);

  const token = useSelector((state) => state.auth.token); // Kept for any other usages though not strictly needed for this file now that Axios is abstracted

  const fetchCourseData = useCallback(() => {
    dispatch(fetchInstructorCourseDetails(courseId));
    dispatch(fetchInstructorEnrollments(courseId));
  }, [courseId, dispatch]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{course?.title}</h1>
          <button
            onClick={() => navigate("/instructor/dashboard")}
            className="text-blue-500 hover:text-blue-600 flex items-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded px-2"
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
            Back to Dashboard
          </button>
        </div>
        <p className="mt-2 text-gray-600">{course?.description}</p>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Students
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {enrollments?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Lessons
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {course?.lessons?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Course Status
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {course?.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {/* Lessons Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Lessons</h2>
          <button
            onClick={() => navigate(`/instructor/courses/${courseId}/lessons/new`)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Lesson
          </button>
        </div>

        <div className="space-y-4">
          {course?.lessons?.map((lesson) => (
            <div
              key={lesson.id}
              className="border rounded-lg p-4 hover:border-blue-500"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  {lesson.title}
                </h3>
                <div className="text-sm text-gray-500">
                  {new Date(lesson.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          {(!course?.lessons || course.lessons.length === 0) && (
            <p className="text-gray-500 text-center py-4">No lessons added yet.</p>
          )}
        </div>
      </div>

      {/* Enrollments Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Enrolled Students
          </h2>
          <button
            onClick={() => navigate(`/instructor/courses/${courseId}/enroll`)}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Enroll Student
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => (
                  <tr key={enrollment.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.student.full_name ||
                        enrollment.student.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(
                        enrollment.enrollment_date
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                      >
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No students enrolled yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
