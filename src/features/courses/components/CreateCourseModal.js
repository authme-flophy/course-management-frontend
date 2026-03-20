import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCourse, selectCourseCreationStatus, selectCourseCreationError, resetCreationStatus } from "../courseSlice";

const CreateCourseModal = ({ isOpen, onClose, onSuccess }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const dispatch = useDispatch();
    const creationStatus = useSelector(selectCourseCreationStatus);
    const creationError = useSelector(selectCourseCreationError);

    useEffect(() => {
        if (creationStatus === "succeeded") {
            dispatch(resetCreationStatus());
            onSuccess();
        }
    }, [creationStatus, dispatch, onSuccess]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createCourse({
            title,
            description,
            start_date: startDate || null,
            end_date: endDate || null
        }));
    };

    const handleClose = () => {
        dispatch(resetCreationStatus());
        setTitle("");
        setDescription("");
        setStartDate("");
        setEndDate("");
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
            <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Create New Course</h3>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 rounded">
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            id="title"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Advanced React Patterns"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            id="description"
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Course description..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                id="start_date"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                id="end_date"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {creationError && (
                        <div className="text-sm text-red-600 bg-red-50 border-l-4 border-red-500 p-2">
                            {typeof creationError === 'string' ? creationError : "An error occurred creating the course."}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={creationStatus === "loading"}
                            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50"
                        >
                            {creationStatus === "loading" ? "Creating..." : "Create Course"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCourseModal;
