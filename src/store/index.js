import { configureStore } from '@reduxjs/toolkit';
import courseReducer from '../features/courses/courseSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    auth: authReducer,
  },
});