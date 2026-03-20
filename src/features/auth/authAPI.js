import api from '../../services/api';

export async function loginApi({ username, password }) {
    const { data } = await api.post('login/', { username, password });
    return data;
}

export async function registerApi({ username, email, password, user_type }) {
    const { data } = await api.post('register/', { username, email, password, user_type });
    return data;
}
