import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

function PaymentPage() {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit');

    useEffect(() => {
        // Lấy thông tin gói đã chọn từ localStorage
        const planData = localStorage.getItem('selectedPlan');
        if (!planData) {
            navigate('/membership');
            return;
        }
        setSelectedPlan(JSON.parse(planData));
    }, [navigate]);

    const handlePayment = () => {
        // Xử lý thanh toán và chuyển hướng đến trang thành công
        localStorage.setItem('isMember', 'true');
        navigate('/payment-success');
    };

    if (!selectedPlan) {
        return null;
    }

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <Header />
            
            {/* Secondary Navigation */}
            <SecondaryNavigation />

            {/* Title Section */}
            <div style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                background: 'white',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#35a79c',
                    margin: '0 0 1rem 0',
                    fontWeight: '700',
                    position: 'relative',
                    display: 'inline-block',
                }}>
                    Thanh Toán
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: '#44b89d',
                        borderRadius: '2px',
                    }}></div>
                </h1>

                <p style={{
                    color: '#7f8c8d',
                    fontSize: '1.1rem',
                    maxWidth: '800px',
                    margin: '1.5rem auto 0',
                    lineHeight: '1.6',
                }}>
                    Hoàn tất đăng ký gói thành viên
                </p>
            </div>

            {/* Payment Container */}
            <div style={{
                maxWidth: '800px',
                margin: '3rem auto',
                padding: '0 2rem',
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}>
                    {/* Package Details */}
                    <div style={{
                        marginBottom: '2rem',
                        padding: '1.5rem',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                    }}>
                        <h3 style={{
                            fontSize: '1.2rem',
                            color: '#2c3e50',
                            marginBottom: '1rem',
                        }}>
                            Chi tiết gói
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr',
                            gap: '1rem',
                            fontSize: '1rem',
                            color: '#34495e',
                        }}>
                            <div>Gói</div>
                            <div>{selectedPlan.name}</div>
                            
                            <div>Thời hạn</div>
                            <div>{selectedPlan.duration} ngày</div>
                            
                            <div>Tổng tiền</div>
                            <div style={{ color: '#44b89d', fontWeight: 'bold' }}>
                                {selectedPlan.price.toLocaleString()} đ
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            fontSize: '1.2rem',
                            color: '#2c3e50',
                            marginBottom: '1rem',
                        }}>
                            Phương thức thanh toán
                        </h3>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                border: '1.5px solid #e5e8ee',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="credit"
                                    checked={paymentMethod === 'credit'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div>
                                    <div style={{ fontWeight: '500' }}>Thẻ tín dụng/ghi nợ</div>
                                    <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Visa, Mastercard, JCB</div>
                                </div>
                            </label>

                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                border: '1.5px solid #e5e8ee',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}>
                                <input
                                    type="radio"
                                    name="payment"
                                    value="bank"
                                    checked={paymentMethod === 'bank'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div>
                                    <div style={{ fontWeight: '500' }}>Chuyển khoản ngân hàng</div>
                                    <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>BIDV, Vietcombank, Agribank</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Payment Button */}
                    <button
                        onClick={handlePayment}
                        style={{
                            width: '100%',
                            background: '#44b89d',
                            color: 'white',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '8px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 15px rgba(68, 184, 157, 0.3)',
                        }}
                    >
                        Thanh Toán
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage; 