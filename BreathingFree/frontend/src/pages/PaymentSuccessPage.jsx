import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { packageInfo, expiryDate } = location.state || {};

    useEffect(() => {
        // Nếu không có thông tin gói, quay lại trang chủ
        if (!packageInfo) {
            navigate('/');
        }
    }, [packageInfo, navigate]);

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            padding: '2rem 0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <div style={{
                maxWidth: '600px',
                width: '90%',
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: '#e1f5fe',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: '0 auto 2rem',
                    fontSize: '3rem',
                    color: '#3498db',
                }}>
                    ✓
                </div>

                <h1 style={{
                    fontSize: '2rem',
                    color: '#2c3e50',
                    margin: '0 0 1rem 0',
                }}>
                    Thanh toán thành công!
                </h1>

                <p style={{
                    fontSize: '1.1rem',
                    color: '#7f8c8d',
                    marginBottom: '2rem',
                    lineHeight: '1.6',
                }}>
                    Cảm ơn bạn đã trở thành thành viên của BreathingFree. Bạn đã được kích hoạt đầy đủ các tính năng thành viên.
                </p>

                {packageInfo && (
                    <div style={{
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        textAlign: 'left',
                    }}>
                        <h2 style={{
                            margin: '0 0 1rem 0',
                            fontSize: '1.3rem',
                            color: '#2c3e50',
                        }}>
                            Thông tin gói thành viên
                        </h2>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.8rem',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1rem',
                            }}>
                                <span style={{ color: '#7f8c8d' }}>Gói thành viên:</span>
                                <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>Gói {packageInfo.duration}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1rem',
                            }}>
                                <span style={{ color: '#7f8c8d' }}>Số tiền:</span>
                                <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{packageInfo.price.toLocaleString()} VND</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1rem',
                            }}>
                                <span style={{ color: '#7f8c8d' }}>Ngày thanh toán:</span>
                                <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{new Date().toLocaleDateString('vi-VN')}</span>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '1rem',
                            }}>
                                <span style={{ color: '#7f8c8d' }}>Ngày hết hạn:</span>
                                <span style={{ fontWeight: 'bold', color: '#2c3e50' }}>{expiryDate}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div style={{
                    padding: '1.5rem',
                    background: '#e8f6fc',
                    borderRadius: '12px',
                    marginBottom: '2rem',
                }}>
                    <h3 style={{
                        margin: '0 0 0.5rem 0',
                        fontSize: '1.1rem',
                        color: '#3498db',
                    }}>
                        Bạn đã có quyền truy cập vào:
                    </h3>

                    <ul style={{
                        textAlign: 'left',
                        padding: '0 0 0 1.5rem',
                        margin: '0',
                    }}>
                        <li style={{ margin: '0.5rem 0', color: '#2c3e50' }}>Tất cả tính năng của gói {packageInfo?.duration}</li>
                        <li style={{ margin: '0.5rem 0', color: '#2c3e50' }}>Tư vấn sức khỏe với bác sĩ chuyên khoa</li>
                        <li style={{ margin: '0.5rem 0', color: '#2c3e50' }}>Kế hoạch cai thuốc cá nhân hóa</li>
                        <li style={{ margin: '0.5rem 0', color: '#2c3e50' }}>Hội thảo sức khỏe độc quyền</li>
                        <li style={{ margin: '0.5rem 0', color: '#2c3e50' }}>Báo cáo tiến độ hàng tháng</li>
                    </ul>
                </div>

                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            padding: '0.8rem 2rem',
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Đi đến bảng điều khiển
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '0.8rem 2rem',
                            background: 'transparent',
                            color: '#3498db',
                            border: '1px solid #3498db',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage; 