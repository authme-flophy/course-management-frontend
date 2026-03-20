import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { createLesson, selectCourseCreationStatus, selectCourseCreationError, resetCreationStatus } from "../courseSlice";

const CreateLessonPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [order, setOrder] = useState("");

    const dispatch = useDispatch();
    const creationStatus = useSelector(selectCourseCreationStatus);
    const creationError = useSelector(selectCourseCreationError);

    useEffect(() => {
        if (creationStatus === "succeeded") {
            dispatch(resetCreationStatus());
            navigate(`/instructor/courses/${courseId}`);
        }
    }, [creationStatus, dispatch, navigate, courseId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { title, content };
        if (order !== "") {
            payload.order = parseInt(order, 10);
        }
        dispatch(createLesson({ courseId, ...payload }));
    };

    const handleCancel = () => {
        dispatch(resetCreationStatus());
        navigate(`/instructor/courses/${courseId}`);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Create New Lesson</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Add a new lesson to your course.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Lesson Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to React"
                        />
                    </div>

                    <div>
                        <label htmlFor="order" className="block text-sm font-medium text-gray-700">Order (Optional)</label>
                        <input
                            type="number"
                            id="order"
                            min="1"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            placeholder="1"
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content <span className="text-red-500">*</span></label>
                        <textarea
                            id="content"
                            required
                            rows="10"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Markdown or text content here..."
                        />
                    </div>

                    {creationError && (
                        <div className="text-sm text-red-600 bg-red-50 border-l-4 border-red-500 p-4">
                            {typeof creationError === 'string' ? creationError : "An error occurred creating the lesson."}
                        </div>
                    )}

                    <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creationStatus === "loading"}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                        >
                            {creationStatus === "loading" ? "Adding..." : "Add Lesson"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLessonPage;
