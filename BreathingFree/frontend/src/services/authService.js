import axiosInstance from '../api/axiosConfig';

// Service xử lý các chức năng liên quan đến authentication
const authService = {
    // Hàm đăng nhập
    login: async (email, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', {
                email,
                password
            });

            if (response.data.token) {
                // Lưu token vào localStorage
                localStorage.setItem('token', response.data.token);
                // Nếu backend trả về user thì mới lưu, còn không thì bỏ qua
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                } else {
                    localStorage.removeItem('user');
                }
            }

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Đã có lỗi xảy ra khi đăng nhập' };
        }
    },

    // Hàm đăng ký
    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Đã có lỗi xảy ra khi đăng ký' };
        }
    },

    // Hàm đăng xuất
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Có thể thêm các xử lý khác khi logout
    },

    // Hàm kiểm tra trạng thái đăng nhập
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // Hàm lấy thông tin user hiện tại
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    // Hàm lấy token
    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;