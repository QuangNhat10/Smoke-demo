import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem('userRole');

    const getHomepage = () => {
        switch (userRole) {
            case 'Member':
                return '/homepage-member';
            case 'Doctor':
                return '/homepage-doctor';
            case 'Admin':
                return '/admin';
            case 'Staff':
                return '/dashboard-staff';
            default:
                return '/';
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '3rem 2rem',
                borderRadius: '18px',
                boxShadow: '0 10px 30px rgba(53, 167, 156, 0.15)',
                maxWidth: '600px',
                width: '100%'
            }}>
                <div style={{
                    color: '#e53935',
                    fontSize: '6rem',
                    marginBottom: '1rem'
                }}>
                    ⚠️
                </div>

                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#e53935',
                    marginBottom: '1.5rem'
                }}>
                    Không có quyền truy cập
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    color: '#5a6a6e',
                    marginBottom: '2rem',
                    lineHeight: 1.6
                }}>
                    Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ với quản trị viên nếu bạn cho rằng đây là lỗi.
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => navigate(getHomepage())}
                        style={{
                            backgroundColor: '#35a79c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0.9rem 2rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#2c9085'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#35a79c'}
                    >
                        Quay về trang chủ
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#35a79c',
                            border: '2px solid #35a79c',
                            borderRadius: '8px',
                            padding: '0.9rem 2rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#35a79c';
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#35a79c';
                        }}
                    >
                        Đăng nhập lại
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized; 