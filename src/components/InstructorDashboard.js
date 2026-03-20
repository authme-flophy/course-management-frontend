import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CreateCourseModal from "../features/courses/components/CreateCourseModal";
import {
  fetchInstructorDashboard,
  fetchInstructorCourseInsights,
  clearCourseInsights,
  selectInstructorDashboard,
  selectInstructorCourseInsights,
} from "../features/courses/courseSlice";

const InstructorDashboard = () => {
  const dispatch = useDispatch();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);

  const dashboardData = useSelector(selectInstructorDashboard);
  const courseDetails = useSelector(selectInstructorCourseInsights);
  const isLoading = useSelector((state) => state.courses.isLoading);
  const error = useSelector((state) => state.courses.error);

  const fetchDashboardData = useCallback(() => {
    dispatch(fetchInstructorDashboard());
  }, [dispatch]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!selectedCourse) {
      dispatch(clearCourseInsights());
      return;
    }

    dispatch(fetchInstructorCourseInsights(selectedCourse));
  }, [selectedCourse, dispatch]);

  const handleCourseCreated = () => {
    setIsCreateCourseModalOpen(false);
    fetchDashboardData(); // Refetch dashboard to show the new course
  };

  // Transform enrollment trends data for the chart
  const transformEnrollmentTrends = (trends) => {
    return Object.entries(trends).map(([date, count]) => ({
      date,
      enrollments: count,
    }));
  };

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
      {/* Action Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h2>
        <button
          onClick={() => setIsCreateCourseModalOpen(true)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Course
        </button>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Courses
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {dashboardData?.overview.total_courses}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Students
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {dashboardData?.overview.total_students}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Lessons
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {dashboardData?.overview.total_lessons}
          </p>
        </div>
      </div>

      {/* Enrollment Trends Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Enrollment Trends
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={
                dashboardData
                  ? transformEnrollmentTrends(dashboardData.enrollment_trends)
                  : []
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="enrollments"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Enrollments */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Enrollments
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboardData?.recent_enrollments.map((enrollment, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.student_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {enrollment.course_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(enrollment.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Course Statistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData?.courses.map((course) => (
            <Link
              key={course.id}
              to={`/instructor/courses/${course.id}`}
              className="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
            >
              <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Students: {course.total_students}
                </p>
                <p className="text-sm text-gray-600">
                  Lessons: {course.total_lessons}
                </p>
                <p className="text-sm text-gray-600">
                  Start Date: {new Date(course.start_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  End Date: {new Date(course.end_date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && courseDetails && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {courseDetails.title}
              </h3>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-gray-500 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Recent Enrollments
              </h4>
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseDetails.recent_enrollments.map(
                      (enrollment, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {enrollment.student_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(enrollment.date).toLocaleDateString()}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      <CreateCourseModal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        onSuccess={handleCourseCreated}
      />
    </div>
  );
};

export default InstructorDashboard;
