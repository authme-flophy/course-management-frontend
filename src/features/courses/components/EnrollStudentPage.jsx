import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    instructorEnrollStudent,
    selectCourseCreationStatus,
    selectCourseCreationError,
    resetCreationStatus,
} from "../courseSlice";

// actually I'll just skip cn if there isn't conditional logic or provide a dummy. Wait, let me keep it simple.

const EnrollStudentPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");

    const creationStatus = useSelector(selectCourseCreationStatus);
    const creationError = useSelector(selectCourseCreationError);

    useEffect(() => {
        // Reset status on mount
        dispatch(resetCreationStatus());
    }, [dispatch]);

    useEffect(() => {
        if (creationStatus === "succeeded") {
            navigate(`/instructor/courses/${courseId}`);
        }
    }, [creationStatus, navigate, courseId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            dispatch(instructorEnrollStudent({ courseId, student_username: username.trim() }));
        }
    };

    const isLoading = creationStatus === "loading";

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Enroll Student</h1>
                <button
                    onClick={() => navigate(`/instructor/courses/${courseId}`)}
                    className="text-gray-500 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
                >
                    Cancel
                </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {creationError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <p className="text-sm text-red-700">{creationError}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Student Username
                        </label>
                        <div className="mt-1">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 hover:border-indigo-400 focus:border-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter student username"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading || !username.trim()}
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed active:bg-indigo-800"
                        >
                            {isLoading ? "Enrolling..." : "Enroll Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EnrollStudentPage;
