import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccessPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { membershipDetails } = location.state || {};

    if (!membershipDetails) {
        navigate('/membership');
        return null;
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            padding: '2rem',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
            }}>
                <div style={{
                    background: '#44b89d',
                    padding: '2rem',
                    textAlign: 'center',
                    color: 'white'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        fontSize: '2.5rem'
                    }}>
                        ✓
                    </div>
                    <h1 style={{
                        margin: '0 0 0.5rem 0',
                        fontSize: '2rem'
                    }}>Thanh Toán Thành Công!</h1>
                    <p style={{
                        margin: 0,
                        opacity: 0.9
                    }}>Cảm ơn bạn đã đăng ký thành viên</p>
                </div>

                <div style={{ padding: '2rem' }}>
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <h2 style={{
                            margin: '0 0 1rem 0',
                            color: '#2c3e50',
                            fontSize: '1.3rem'
                        }}>Chi tiết đăng ký</h2>
                        
                        <div style={{
                            display: 'grid',
                            gap: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #e5e8ee'
                            }}>
                                <span style={{ color: '#7f8c8d' }}>Gói thành viên</span>
                                <span style={{ color: '#2c3e50', fontWeight: '600' }}>{membershipDetails.packageName}</span>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #e5e8ee'
                            }}>
                                <span style={{ color: '#7f8c8d' }}>Thời hạn</span>
                                <span style={{ color: '#2c3e50', fontWeight: '600' }}>
                                    {new Date(membershipDetails.startDate).toLocaleDateString('vi-VN')} - {new Date(membershipDetails.endDate).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #e5e8ee'
                            }}>
                                <span style={{ color: '#7f8c8d' }}>Phương thức thanh toán</span>
                                <span style={{ color: '#2c3e50', fontWeight: '600' }}>{membershipDetails.paymentMethod}</span>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0'
                            }}>
                                <span style={{ color: '#7f8c8d' }}>Số tiền</span>
                                <span style={{ color: '#44b89d', fontSize: '1.2rem', fontWeight: '700' }}>
                                    {new Intl.NumberFormat('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND'
                                    }).format(membershipDetails.price)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <button
                            onClick={() => navigate('/homepage-member')}
                            style={{
                                flex: 1,
                                padding: '1rem',
                                background: '#44b89d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 10px rgba(68, 184, 157, 0.2)'
                            }}
                        >
                            Về Trang Chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage; 