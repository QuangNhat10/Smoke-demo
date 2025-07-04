import axiosInstance from '../api/axiosConfig';

// Event listeners để notify khi user thay đổi
let authListeners = [];

// Hàm để add listener
const addAuthListener = (callback) => {
    authListeners.push(callback);
};

// Hàm để remove listener
const removeAuthListener = (callback) => {
    authListeners = authListeners.filter(listener => listener !== callback);
};

// Hàm để notify tất cả listeners
const notifyAuthChange = (eventType, data = null) => {
    console.log('Notifying auth change:', eventType, 'to', authListeners.length, 'listeners');
    authListeners.forEach(listener => {
        try {
            listener(eventType, data);
        } catch (error) {
            console.error('Error in auth listener:', error);
        }
    });
};

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
                    
                    // Cũng lưu vào userInfo để tương thích với code cũ
                    localStorage.setItem('userInfo', JSON.stringify({
                        fullName: response.data.user.fullName,
                        email: response.data.user.email,
                        userId: response.data.user.userId,
                        roleId: response.data.user.roleId
                    }));
                } else {
                    localStorage.removeItem('user');
                    localStorage.removeItem('userInfo');
                }
                
                // Notify listeners về login
                notifyAuthChange('login', response.data.user);
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
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userName');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        
        // Notify listeners về logout
        notifyAuthChange('logout');
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
    },

    // Export auth listeners
    addAuthListener,
    forgotPassword: async (email) => {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Đã có lỗi xảy ra khi gửi mã đặt lại mật khẩu' };
        }
    },

    resetPassword: async (email, code, newPassword) => {
        try {
            const response = await axiosInstance.post('/auth/reset-password', {
                email,
                code,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Đã có lỗi xảy ra khi đặt lại mật khẩu' };
        }
    },

    removeAuthListener
};

export default authService;
import axiosInstance from '../api/axiosConfig';

// Event listeners để notify khi user thay đổi
let authListeners = [];

// Hàm để add listener
const addAuthListener = (callback) => {
    authListeners.push(callback);
};

// Hàm để remove listener
const removeAuthListener = (callback) => {
    authListeners = authListeners.filter(listener => listener !== callback);
};

// Hàm để notify tất cả listeners
const notifyAuthChange = (eventType, data = null) => {
    console.log('Notifying auth change:', eventType, 'to', authListeners.length, 'listeners');
    authListeners.forEach(listener => {
        try {
            listener(eventType, data);
        } catch (error) {
            console.error('Error in auth listener:', error);
        }
    });
};

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
                    
                    // Cũng lưu vào userInfo để tương thích với code cũ
                    localStorage.setItem('userInfo', JSON.stringify({
                        fullName: response.data.user.fullName,
                        email: response.data.user.email,
                        userId: response.data.user.userId,
                        roleId: response.data.user.roleId
                    }));
                } else {
                    localStorage.removeItem('user');
                    localStorage.removeItem('userInfo');
                }
                
                // Notify listeners về login
                notifyAuthChange('login', response.data.user);
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
        localStorage.removeItem('userInfo');
        localStorage.removeItem('userName');
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        
        // Notify listeners về logout
        notifyAuthChange('logout');
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
    },

    // Export auth listeners
    addAuthListener,
    removeAuthListener
};

export default authService;