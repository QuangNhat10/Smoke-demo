import axiosInstance from './axiosConfig';

// API endpoints cho authentication
const authApi = {
    // API đăng nhập
    login: (email, password) => {
        return axiosInstance.post('/auth/login', { email, password });
    },

    // API đăng ký
    register: (userData) => {
        return axiosInstance.post('/auth/register', userData);
    },

    // API xác thực token
    verifyToken: () => {
        return axiosInstance.get('/auth/verify');
    },

    // API đổi mật khẩu
    changePassword: (oldPassword, newPassword, confirmPassword) => {
        return axiosInstance.post('/auth/change-password', {
            OldPassword: oldPassword,
            NewPassword: newPassword,
            ConfirmPassword: confirmPassword
        });
    },

    // API quên mật khẩu
    forgotPassword: (email) => {
        return axiosInstance.post('/auth/forgot-password', { email });
    },

    // API đặt lại mật khẩu
    resetPassword: (token, newPassword) => {
        return axiosInstance.post('/auth/reset-password', {
            token,
            newPassword
        });
    },

    // Lấy thông tin profile đầy đủ
    getUserProfile: async () => {
        try {
            const response = await axiosInstance.get('/auth/profile');
            return response.data;
        } catch (error) {
            console.error('Error getting user profile:', error);
            throw error;
        }
    },

    // API cập nhật thông tin profile
    updateUserProfile: (profileData) => {
        return axiosInstance.put('/auth/profile', profileData);
    }
};

export default authApi; 