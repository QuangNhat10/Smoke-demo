import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [formData, setFormData] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryDate: '',
        cvv: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Lấy thông tin gói đã chọn từ state
    useEffect(() => {
        if (location.state && location.state.packageInfo) {
            setSelectedPackage(location.state.packageInfo);
        } else {
            // Nếu không có thông tin gói, quay lại trang chọn gói
            navigate('/membership');
        }
    }, [location.state, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra số thẻ
        if (!formData.cardNumber) {
            newErrors.cardNumber = 'Vui lòng nhập số thẻ';
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Số thẻ không hợp lệ';
        }

        // Kiểm tra tên chủ thẻ
        if (!formData.cardHolder) {
            newErrors.cardHolder = 'Vui lòng nhập tên chủ thẻ';
        }

        // Kiểm tra ngày hết hạn
        if (!formData.expiryDate) {
            newErrors.expiryDate = 'Vui lòng nhập ngày hết hạn';
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = 'Định dạng MM/YY không hợp lệ';
        }

        // Kiểm tra CVV
        if (!formData.cvv) {
            newErrors.cvv = 'Vui lòng nhập mã CVV';
        } else if (!/^\d{3,4}$/.test(formData.cvv)) {
            newErrors.cvv = 'Mã CVV không hợp lệ';
        }

        // Kiểm tra email
        if (!formData.email) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Giả lập quá trình thanh toán
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Lưu thông tin thành viên vào localStorage
            const membershipExpiry = new Date();
            if (selectedPackage.duration === '1 Tháng') {
                membershipExpiry.setMonth(membershipExpiry.getMonth() + 1);
            } else if (selectedPackage.duration === '6 Tháng') {
                membershipExpiry.setMonth(membershipExpiry.getMonth() + 6);
            } else if (selectedPackage.duration === '1 Năm') {
                membershipExpiry.setFullYear(membershipExpiry.getFullYear() + 1);
            }

            localStorage.setItem('isMember', 'true');
            localStorage.setItem('membershipType', selectedPackage.duration);
            localStorage.setItem('membershipExpiry', membershipExpiry.toISOString());
            localStorage.setItem('membershipPurchaseDate', new Date().toISOString());

            // Chuyển hướng đến trang thành công
            navigate('/payment-success', {
                state: {
                    packageInfo: selectedPackage,
                    expiryDate: membershipExpiry.toLocaleDateString('vi-VN')
                }
            });
        } catch (error) {
            alert('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    if (!selectedPackage) {
        return <div>Đang tải...</div>;
    }

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            padding: '2rem 0',
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
            }}>
                {/* Header */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: '#3498db',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Quay lại
                    </button>
                    <h1 style={{
                        margin: 0,
                        color: '#2c3e50',
                        fontSize: '1.5rem',
                    }}>
                        Thanh toán
                    </h1>
                    <div style={{ width: '80px' }}></div> {/* Để cân bằng layout */}
                </div>

                {/* Content */}
                <div style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                }}>
                    {/* Thông tin gói đã chọn */}
                    <div style={{
                        flex: '1 1 300px',
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    }}>
                        <h2 style={{
                            margin: '0 0 1.5rem 0',
                            color: '#2c3e50',
                            fontSize: '1.2rem',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '0.5rem',
                        }}>Thông tin đơn hàng</h2>

                        <div style={{
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            marginBottom: '1.5rem',
                        }}>
                            <h3 style={{
                                margin: '0 0 1rem 0',
                                color: '#3498db',
                                fontSize: '1.3rem',
                            }}>
                                Gói {selectedPackage.duration}
                            </h3>
                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                marginBottom: '1rem',
                            }}>
                                {selectedPackage.price.toLocaleString()} VND
                            </div>
                            <p style={{
                                color: '#7f8c8d',
                                margin: '0 0 0.5rem 0',
                            }}>
                                {selectedPackage.discount
                                    ? `Tiết kiệm ${selectedPackage.discount}% so với gói hàng tháng`
                                    : 'Truy cập đầy đủ tất cả tính năng'}
                            </p>
                        </div>

                        <div style={{
                            borderTop: '1px dashed #eee',
                            paddingTop: '1rem',
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                                fontSize: '1rem',
                                color: '#7f8c8d',
                            }}>
                                <span>Giá gói</span>
                                <span>{selectedPackage.price.toLocaleString()} VND</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '0.5rem',
                                fontSize: '1rem',
                                color: '#7f8c8d',
                            }}>
                                <span>Thuế VAT (10%)</span>
                                <span>0 VND</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '1rem',
                                paddingTop: '1rem',
                                borderTop: '1px solid #eee',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                            }}>
                                <span>Tổng cộng</span>
                                <span>{selectedPackage.price.toLocaleString()} VND</span>
                            </div>
                        </div>
                    </div>

                    {/* Form thanh toán */}
                    <div style={{
                        flex: '1 1 500px',
                        background: 'white',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                    }}>
                        <h2 style={{
                            margin: '0 0 1.5rem 0',
                            color: '#2c3e50',
                            fontSize: '1.2rem',
                            borderBottom: '1px solid #eee',
                            paddingBottom: '0.5rem',
                        }}>Thông tin thanh toán</h2>

                        {/* Phương thức thanh toán */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{
                                margin: '0 0 1rem 0',
                                fontSize: '1rem',
                                color: '#2c3e50',
                            }}>Chọn phương thức thanh toán</h3>

                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                flexWrap: 'wrap',
                            }}>
                                <label style={{
                                    flex: '1 1 calc(50% - 0.5rem)',
                                    padding: '1rem',
                                    border: `2px solid ${paymentMethod === 'credit_card' ? '#3498db' : '#e5e8ee'}`,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="credit_card"
                                        checked={paymentMethod === 'credit_card'}
                                        onChange={() => setPaymentMethod('credit_card')}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Thẻ tín dụng/ghi nợ</div>
                                        <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>Visa, Mastercard, JCB</div>
                                    </div>
                                </label>

                                <label style={{
                                    flex: '1 1 calc(50% - 0.5rem)',
                                    padding: '1rem',
                                    border: `2px solid ${paymentMethod === 'banking' ? '#3498db' : '#e5e8ee'}`,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                }}>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="banking"
                                        checked={paymentMethod === 'banking'}
                                        onChange={() => setPaymentMethod('banking')}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>Chuyển khoản ngân hàng</div>
                                        <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>BIDV, Vietcombank, Agribank</div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Form thông tin thẻ */}
                        {paymentMethod === 'credit_card' && (
                            <form onSubmit={handlePayment}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#2c3e50',
                                    }}>
                                        Số thẻ
                                    </label>
                                    <input
                                        type="text"
                                        name="cardNumber"
                                        value={formData.cardNumber}
                                        onChange={handleInputChange}
                                        placeholder="1234 5678 9012 3456"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: errors.cardNumber ? '1px solid #e74c3c' : '1px solid #e5e8ee',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    {errors.cardNumber && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                            {errors.cardNumber}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#2c3e50',
                                    }}>
                                        Tên chủ thẻ
                                    </label>
                                    <input
                                        type="text"
                                        name="cardHolder"
                                        value={formData.cardHolder}
                                        onChange={handleInputChange}
                                        placeholder="NGUYEN VAN A"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: errors.cardHolder ? '1px solid #e74c3c' : '1px solid #e5e8ee',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    {errors.cardHolder && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                            {errors.cardHolder}
                                        </div>
                                    )}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    marginBottom: '1rem',
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: '#2c3e50',
                                        }}>
                                            Ngày hết hạn
                                        </label>
                                        <input
                                            type="text"
                                            name="expiryDate"
                                            value={formData.expiryDate}
                                            onChange={handleInputChange}
                                            placeholder="MM/YY"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: errors.expiryDate ? '1px solid #e74c3c' : '1px solid #e5e8ee',
                                                fontSize: '1rem',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.expiryDate && (
                                            <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                {errors.expiryDate}
                                            </div>
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: '#2c3e50',
                                        }}>
                                            Mã CVV
                                        </label>
                                        <input
                                            type="text"
                                            name="cvv"
                                            value={formData.cvv}
                                            onChange={handleInputChange}
                                            placeholder="123"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: errors.cvv ? '1px solid #e74c3c' : '1px solid #e5e8ee',
                                                fontSize: '1rem',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.cvv && (
                                            <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                {errors.cvv}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.9rem',
                                        color: '#2c3e50',
                                    }}>
                                        Email nhận hóa đơn
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: errors.email ? '1px solid #e74c3c' : '1px solid #e5e8ee',
                                            fontSize: '1rem',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    {errors.email && (
                                        <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        background: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                    }}
                                >
                                    {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
                                </button>
                            </form>
                        )}

                        {/* Thông tin chuyển khoản */}
                        {paymentMethod === 'banking' && (
                            <div>
                                <div style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    marginBottom: '1.5rem',
                                }}>
                                    <h3 style={{
                                        margin: '0 0 1rem 0',
                                        fontSize: '1rem',
                                        color: '#2c3e50',
                                    }}>Thông tin chuyển khoản</h3>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                            Ngân hàng
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>
                                            Vietcombank
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                            Số tài khoản
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>
                                            1027739641
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                            Chủ tài khoản
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>
                                            TRUONG QUANG NHAT
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                                            Nội dung chuyển khoản
                                        </div>
                                        <div style={{ fontWeight: 'bold' }}>
                                            BF-{Date.now().toString().slice(-6)}
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: '0.75rem',
                                        background: '#fff8e1',
                                        borderRadius: '8px',
                                        fontSize: '0.9rem',
                                        color: '#f39c12',
                                        border: '1px dashed #f39c12',
                                        marginTop: '1rem',
                                    }}>
                                        <strong>Lưu ý:</strong> Vui lòng chuyển khoản đúng nội dung để hệ thống có thể xác nhận thanh toán của bạn. Thời gian xác nhận từ 5-15 phút sau khi chuyển khoản thành công.
                                    </div>
                                </div>

                                <form onSubmit={handlePayment}>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: '#2c3e50',
                                        }}>
                                            Email nhận thông báo
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="email@example.com"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: errors.email ? '1px solid #e74c3c' : '1px solid #e5e8ee',
                                                fontSize: '1rem',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                        {errors.email && (
                                            <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                {errors.email}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            background: '#3498db',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '1rem',
                                            fontWeight: 'bold',
                                            cursor: loading ? 'not-allowed' : 'pointer',
                                            opacity: loading ? 0.7 : 1,
                                        }}
                                    >
                                        {loading ? 'Đang xử lý...' : 'Xác nhận đã chuyển khoản'}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage; 