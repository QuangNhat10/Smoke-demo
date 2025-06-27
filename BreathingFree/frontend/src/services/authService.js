import axiosInstance from '../api/axiosConfig';

// Hàm mapping RoleID sang role name
const getRoleFromId = (roleId) => {
    switch (roleId) {
        case 1:
            return 'Doctor';
        case 2:
            return 'Member';
        case 3:
            return 'Staff';
        case 4:
            return 'Admin';
        default:
            return 'Member';
    }
};

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
                
                // Lưu thông tin user vào localStorage
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    
                    // Cập nhật userName với fullName từ response
                    localStorage.setItem('userName', response.data.user.fullName || response.data.user.email);
                    
                    // Mapping RoleID sang role name và lưu vào localStorage
                    const roleName = getRoleFromId(response.data.user.roleId);
                    localStorage.setItem('userRole', roleName);
                    localStorage.setItem('userId', response.data.user.userId.toString());
                    localStorage.setItem('userEmail', response.data.user.email);
                    localStorage.setItem('userLoggedIn', 'true');
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
        localStorage.removeItem('userName');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
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