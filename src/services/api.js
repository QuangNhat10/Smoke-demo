import axios from 'axios';
import { API_ENDPOINTS } from './config';

// Create axios instance with default config
const api = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API calls
export const authAPI = {
    login: (credentials) => api.post(API_ENDPOINTS.LOGIN, credentials),
    register: (userData) => api.post(API_ENDPOINTS.REGISTER, userData),
};

// User API calls
export const userAPI = {
    getProfile: () => api.get(API_ENDPOINTS.USER_PROFILE),
    updateProfile: (data) => api.put(API_ENDPOINTS.UPDATE_PROFILE, data),
};

// Appointment API calls
export const appointmentAPI = {
    getAll: () => api.get(API_ENDPOINTS.APPOINTMENTS),
    getById: (id) => api.get(`${API_ENDPOINTS.APPOINTMENTS}/${id}`),
    create: (data) => api.post(API_ENDPOINTS.APPOINTMENTS, data),
    update: (id, data) => api.put(`${API_ENDPOINTS.APPOINTMENTS}/${id}`, data),
    delete: (id) => api.delete(`${API_ENDPOINTS.APPOINTMENTS}/${id}`),
};

// Blog API calls
export const blogAPI = {
    getAllPosts: () => api.get(API_ENDPOINTS.BLOG_POSTS),
    getPost: (id) => api.get(`${API_ENDPOINTS.BLOG_POSTS}/${id}`),
    createPost: (data) => api.post(API_ENDPOINTS.BLOG_POSTS, data),
    updatePost: (id, data) => api.put(`${API_ENDPOINTS.BLOG_POSTS}/${id}`, data),
    deletePost: (id) => api.delete(`${API_ENDPOINTS.BLOG_POSTS}/${id}`),
};

// Doctor API calls
export const doctorAPI = {
    getAll: () => api.get(API_ENDPOINTS.DOCTORS),
    getById: (id) => api.get(`${API_ENDPOINTS.DOCTORS}/${id}`),
    update: (id, data) => api.put(`${API_ENDPOINTS.DOCTORS}/${id}`, data),
};

// Membership API calls
export const membershipAPI = {
    getPlans: () => api.get(API_ENDPOINTS.MEMBERSHIP_PLANS),
    subscribe: (planId) => api.post(`${API_ENDPOINTS.MEMBERSHIP_PLANS}/subscribe`, { planId }),
};

// Tracking API calls
export const trackingAPI = {
    getStatus: () => api.get(API_ENDPOINTS.SMOKING_STATUS),
    updateStatus: (data) => api.post(API_ENDPOINTS.SMOKING_STATUS, data),
};

// Support API calls
export const supportAPI = {
    getMessages: () => api.get(API_ENDPOINTS.SUPPORT_MESSAGES),
    sendMessage: (message) => api.post(API_ENDPOINTS.SUPPORT_MESSAGES, message),
};
