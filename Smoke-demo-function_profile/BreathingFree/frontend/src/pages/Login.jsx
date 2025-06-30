import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import Header from '../components/Header';
import "../styles/login.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Chỉ kiểm tra xác thực khi component được tải lần đầu
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const userLoggedIn = localStorage.getItem('userLoggedIn');
            
            if (token && userLoggedIn === 'true') {
                const roleId = parseInt(localStorage.getItem('roleId'));
                // Chỉ chuyển hướng nếu roleId hợp lệ
                if (!isNaN(roleId) && roleId > 0) {
                    redirectBasedOnRole(roleId);
                }
            }
        };
        
        checkAuth();
        // Không thêm event listener để tránh kiểm tra liên tục
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const redirectBasedOnRole = (roleId) => {
        let redirectUrl;
        switch (roleId) {
            case 1:
                redirectUrl = '/admin';
                break;
            case 2:
                redirectUrl = '/homepage-member';
                break;
            case 3:
                redirectUrl = '/homepage-doctor';
                break;
            case 4:
                redirectUrl = '/dashboard-staff';
                break;
            default:
                redirectUrl = '/';
        }
        navigate(redirectUrl);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validate input
            if (!formData.email || !formData.password) {
                throw new Error('Vui lòng điền đầy đủ email và mật khẩu');
            }

            const response = await authApi.login(formData.email, formData.password);
            
            if (!response?.data) {
                throw new Error('Không nhận được phản hồi từ máy chủ');
            }

            const { token, userId, roleId } = response.data;

            if (!token || !userId || !roleId) {
                throw new Error('Dữ liệu đăng nhập không hợp lệ');
            }

            // Clear any existing auth data
            localStorage.clear();

            // Store new auth data
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId.toString());
            localStorage.setItem('roleId', roleId.toString());
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', formData.email);

            // Set role and authentication state
            const role = getRoleName(roleId);
            localStorage.setItem('userRole', role);
            localStorage.setItem('isAuthenticated', 'true');

            // Không cần trigger event storage, chỉ cần chuyển hướng
            console.log('Đăng nhập thành công, chuyển hướng đến trang chủ');
            
            // Thêm timeout nhỏ để đảm bảo localStorage được cập nhật trước khi chuyển hướng
            setTimeout(() => {
                redirectBasedOnRole(roleId);
            }, 100);

        } catch (error) {
            console.error('Login error:', error);
            setError(
                error.response?.data?.message || 
                error.message || 
                'Đăng nhập thất bại. Vui lòng thử lại.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1: return 'Admin';
            case 2: return 'Member';
            case 3: return 'Doctor';
            case 4: return 'Staff';
            default: return 'User';
        }
    };

    return (
        <>
            <Header />
            <div className="login-container">
                <div className="login-box">
                    <div className="login-header">
                        <h2>Đăng nhập</h2>
                        <p>Chào mừng bạn trở lại với Breathing Free</p>
                    </div>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="Nhập địa chỉ email của bạn"
                                required
                                className={error ? 'error' : ''}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder="Nhập mật khẩu của bạn"
                                required
                                className={error ? 'error' : ''}
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                <span className="error-icon">⚠️</span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`login-button ${isLoading ? 'loading' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    <span>Đang đăng nhập...</span>
                                </>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>

                        <div className="register-section">
                            <p>Chưa có tài khoản?</p>
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="register-button"
                                disabled={isLoading}
                            >
                                Đăng ký ngay
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
