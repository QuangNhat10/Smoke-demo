import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error);
        
        // Handle network errors
        if (!error.response) {
            return Promise.reject(new Error('Network error. Please check your connection.'));
        }

        // Handle specific HTTP status codes
            switch (error.response.status) {
            case 401:
                localStorage.clear(); // Clear auth data on unauthorized
                    window.location.href = '/login';
                return Promise.reject(new Error('Session expired. Please login again.'));
            case 403:
                return Promise.reject(new Error('Access denied. You do not have permission.'));
            case 404:
                return Promise.reject(new Error('Resource not found.'));
            case 500:
                return Promise.reject(new Error('Server error. Please try again later.'));
                default:
                return Promise.reject(error);
        }
    }
);

export default axiosInstance; 