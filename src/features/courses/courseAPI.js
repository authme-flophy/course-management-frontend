import api from '../../services/api';

export async function fetchCoursesApi() {
    const { data } = await api.get('courses/');
    return data;
}

export async function enrollCourseApi(courseId) {
    const { data } = await api.post(`courses/${courseId}/enroll/`, {});
    return data;
}

export async function createCourseApi(payload) {
    const { data } = await api.post('courses/', payload);
    return data;
}

export async function createLessonApi({ courseId, ...payload }) {
    const { data } = await api.post(`courses/${courseId}/lessons/`, payload);
    return data;
}

export async function instructorEnrollApi({ courseId, student_username }) {
    const { data } = await api.post(`courses/${courseId}/instructor_enroll/`, { student_username });
    return data;
}

export async function fetchInstructorCourseDetailsApi(courseId) {
    const { data } = await api.get(`courses/${courseId}/`);
    return data;
}

export async function fetchInstructorEnrollmentsApi(courseId) {
    const { data } = await api.get(`courses/${courseId}/instructor_enrollments/`);
    return data;
}

export async function fetchInstructorDashboardApi() {
    const { data } = await api.get('instructor/dashboard/');
    return data;
}

export async function fetchInstructorCourseInsightsApi(courseId) {
    const { data } = await api.get(`instructor/courses/${courseId}/details/`);
    return data;
}
