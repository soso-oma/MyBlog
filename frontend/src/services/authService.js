import api from './api';
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`;

export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const googleLogin = (token) => api.post('/auth/google-login', { token });