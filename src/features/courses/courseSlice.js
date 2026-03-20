import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCoursesApi, enrollCourseApi, createCourseApi, createLessonApi, instructorEnrollApi, fetchInstructorCourseDetailsApi, fetchInstructorEnrollmentsApi, fetchInstructorDashboardApi, fetchInstructorCourseInsightsApi } from "./courseAPI";
import { extractErrorMessage } from "../../utils/errorHandler";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchCoursesApi();
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to fetch courses");
      return rejectWithValue(message);
    }
  }
);

export const enrollCourse = createAsyncThunk(
  "courses/enrollCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      await enrollCourseApi(courseId);
      return courseId;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to enroll in course");
      return rejectWithValue(message);
    }
  }
);

export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createCourseApi(payload);
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to create course");
      return rejectWithValue(message);
    }
  }
);

export const createLesson = createAsyncThunk(
  "courses/createLesson",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createLessonApi(payload);
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to create lesson");
      return rejectWithValue(message);
    }
  }
);

export const instructorEnrollStudent = createAsyncThunk(
  "courses/instructorEnrollStudent",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await instructorEnrollApi(payload);
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to enroll student");
      return rejectWithValue(message);
    }
  }
);

export const fetchInstructorCourseDetails = createAsyncThunk(
  "courses/fetchInstructorCourseDetails",
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await fetchInstructorCourseDetailsApi(courseId);
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to fetch instructor course details");
      return rejectWithValue(message);
    }
  }
);

export const fetchInstructorEnrollments = createAsyncThunk(
  "courses/fetchInstructorEnrollments",
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await fetchInstructorEnrollmentsApi(courseId);
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to fetch enrollments");
      return rejectWithValue(message);
    }
  }
);

export const fetchInstructorDashboard = createAsyncThunk(
  "courses/fetchInstructorDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchInstructorDashboardApi();
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to fetch dashboard data");
      return rejectWithValue(message);
    }
  }
);

export const fetchInstructorCourseInsights = createAsyncThunk(
  "courses/fetchInstructorCourseInsights",
  async (courseId, { rejectWithValue }) => {
    try {
      const data = await fetchInstructorCourseInsightsApi(courseId);
      return data;
    } catch (error) {
      const message = extractErrorMessage(error.response?.data, "Failed to fetch course insights");
      return rejectWithValue(message);
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    items: [],
    instructorDashboard: null,
    instructorCourseInsights: null,
    instructorCourseDetails: null,
    instructorEnrollments: [],
    isLoadingDetails: false,
    detailsError: null,
    isLoading: false,
    error: null,
    enrollmentError: null,
    creationStatus: "idle",
    creationError: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.enrollmentError = null;
      state.creationError = null;
      state.detailsError = null;
    },
    resetCreationStatus: (state) => {
      state.creationStatus = "idle";
      state.creationError = null;
    },
    clearCourseInsights: (state) => {
      state.instructorCourseInsights = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(enrollCourse.pending, (state) => {
        state.enrollmentError = null;
      })
      .addCase(enrollCourse.fulfilled, (state, action) => {
        const course = state.items.find(
          (course) => course.id === action.payload
        );
        if (course) {
          course.isEnrolled = true;
        }
      })
      .addCase(enrollCourse.rejected, (state, action) => {
        state.enrollmentError = action.payload;
      })
      .addCase(createCourse.pending, (state) => {
        state.creationStatus = "loading";
        state.creationError = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.creationStatus = "succeeded";
        state.items.push(action.payload);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.creationStatus = "failed";
        state.creationError = action.payload;
      })
      .addCase(createLesson.pending, (state) => {
        state.creationStatus = "loading";
        state.creationError = null;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.creationStatus = "succeeded";
        // Since we are creating lessons from the dashboard detail view which fetches its own data,
        // we mainly care about signaling success via creationStatus. 
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.creationStatus = "failed";
        state.creationError = action.payload;
      })
      .addCase(instructorEnrollStudent.pending, (state) => {
        state.creationStatus = "loading";
        state.creationError = null;
      })
      .addCase(instructorEnrollStudent.fulfilled, (state) => {
        state.creationStatus = "succeeded";
      })
      .addCase(instructorEnrollStudent.rejected, (state, action) => {
        state.creationStatus = "failed";
        state.creationError = action.payload;
      })
      .addCase(fetchInstructorCourseDetails.pending, (state) => {
        state.isLoadingDetails = true;
        state.detailsError = null;
      })
      .addCase(fetchInstructorCourseDetails.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.instructorCourseDetails = action.payload;
      })
      .addCase(fetchInstructorCourseDetails.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.detailsError = action.payload;
      })
      .addCase(fetchInstructorEnrollments.pending, (state) => {
        // Optionally track loading state, but sharing isLoadingDetails is often sufficient.
      })
      .addCase(fetchInstructorEnrollments.fulfilled, (state, action) => {
        state.instructorEnrollments = action.payload.enrollments;
      })
      .addCase(fetchInstructorEnrollments.rejected, (state, action) => {
        state.detailsError = action.payload;
      })
      .addCase(fetchInstructorDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInstructorDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.instructorDashboard = action.payload;
      })
      .addCase(fetchInstructorDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchInstructorCourseInsights.pending, (state) => {
        state.isLoadingDetails = true;
        state.detailsError = null;
      })
      .addCase(fetchInstructorCourseInsights.fulfilled, (state, action) => {
        state.isLoadingDetails = false;
        state.instructorCourseInsights = action.payload;
      })
      .addCase(fetchInstructorCourseInsights.rejected, (state, action) => {
        state.isLoadingDetails = false;
        state.detailsError = action.payload;
      });
  },
});

export const { clearErrors, resetCreationStatus, clearCourseInsights } = courseSlice.actions;

export const selectCoursesLoading = (state) => state.courses.isLoading;
export const selectCoursesError = (state) => state.courses.error;
export const selectCoursesItems = (state) => state.courses.items;
export const selectCourseCreationStatus = (state) => state.courses.creationStatus;
export const selectCourseCreationError = (state) => state.courses.creationError;
export const selectInstructorCourseDetails = (state) => state.courses.instructorCourseDetails;
export const selectInstructorEnrollments = (state) => state.courses.instructorEnrollments;
export const selectDetailsLoading = (state) => state.courses.isLoadingDetails;
export const selectDetailsError = (state) => state.courses.detailsError;
export const selectInstructorDashboard = (state) => state.courses.instructorDashboard;
export const selectInstructorCourseInsights = (state) => state.courses.instructorCourseInsights;

export default courseSlice.reducer;
