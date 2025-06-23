import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: 'http://localhost:5050/api', // URL của backend API
    timeout: 10000, // Timeout cho mỗi request
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor cho request
axiosInstance.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho response
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Xử lý các lỗi response
        if (error.response) {
            switch (error.response.status) {
                case 401: // Unauthorized
                    // Xử lý khi token hết hạn hoặc không hợp lệ
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403: // Forbidden
                    // Xử lý khi không có quyền truy cập
                    break;
                case 404: // Not found
                    // Xử lý khi không tìm thấy resource
                    break;
                default:
                    // Xử lý các lỗi khác
                    break;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 