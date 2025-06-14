import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Trang Gói Thành Viên - cho phép người dùng mua các gói thành viên
 * 
 * Khi mua gói thành viên, người dùng sẽ nhận được nhiều quyền lợi,
 * trong đó có quyền đánh giá bác sĩ chuyên gia trên trang Doctors.
 * 
 * Sau khi thanh toán, trạng thái thành viên sẽ được lưu vào localStorage
 * với key "isMember" = "true", và sẽ được kiểm tra ở các trang khác
 * để xác định người dùng có quyền đánh giá bác sĩ hay không.
 */
const MembershipPage = () => {
    const navigate = useNavigate();
    const [selectedPackage, setSelectedPackage] = useState('monthly6');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Kiểm tra trạng thái đăng nhập và thành viên
    useEffect(() => {
        const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const memberStatus = localStorage.getItem('isMember') === 'true';

        setIsLoggedIn(loggedIn);
        setIsMember(memberStatus);
    }, []);

    // Định nghĩa các gói thành viên
    const packages = {
        monthly1: {
            id: 'monthly1',
            duration: '1 Tháng',
            price: 600000,
            discount: 0,
            features: [
                'Không giới hạn tư vấn với bác sĩ',
                'Kế hoạch cai thuốc cá nhân hóa',
                'Truy cập nội dung cao cấp',
                'Hỗ trợ từ cộng đồng',
                'Đánh giá bác sĩ chuyên gia' // Tính năng đánh giá bác sĩ cho thành viên
            ]
        },
        monthly6: {
            id: 'monthly6',
            duration: '6 Tháng',
            price: 3000000,
            discount: 16,
            features: [
                'Tất cả tính năng từ gói Hàng tháng',
                'Hỗ trợ bác sĩ ưu tiên',
                'Báo cáo tiến độ hàng tháng',
                'Hội thảo sức khỏe độc quyền',
                'Đánh giá bác sĩ chuyên gia' // Tính năng đánh giá bác sĩ cho thành viên
            ]
        },
        yearly: {
            id: 'yearly',
            duration: '1 Năm',
            price: 5400000,
            discount: 25,
            features: [
                'Tất cả tính năng từ gói 6 tháng',
                'Huấn luyện viên sức khỏe riêng',
                'Đánh giá sức khỏe hàng quý',
                'Tài khoản gia đình (tối đa 3 thành viên)',
                'Đánh giá bác sĩ chuyên gia' // Tính năng đánh giá bác sĩ cho thành viên
            ]
        }
    };

    const handleSelectPackage = (packageId) => {
        setSelectedPackage(packageId);
    };

    const handleContinue = () => {
        if (!isLoggedIn) {
            // Lưu gói đã chọn vào localStorage
            localStorage.setItem('selectedPackage', selectedPackage);
            // Chuyển hướng đến trang đăng nhập
            navigate('/login', { state: { redirectTo: '/membership' } });
            return;
        }

        if (isMember) {
            setShowModal(true);
            return;
        }

        // Chuyển hướng đến trang thanh toán với thông tin gói đã chọn
        navigate('/payment', {
            state: {
                packageInfo: packages[selectedPackage]
            }
        });
    };

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
                        Gói Thành Viên
                    </h1>
                    <div style={{ width: '80px' }}></div> {/* Để cân bằng layout */}
                </div>

                {/* Content */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '1.8rem',
                        color: '#2c3e50',
                        margin: '0 0 1rem 0',
                    }}>
                        Chọn gói phù hợp nhất với bạn
                    </h2>

                    {/* Package Options */}
                    <div style={{
                        display: 'flex',
                        gap: '1.5rem',
                        margin: '3rem 0',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                    }}>
                        {/* 1 Tháng */}
                        <div style={{
                            flex: '1 1 300px',
                            background: selectedPackage === 'monthly1' ? '#f0f9ff' : '#fff',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                            border: `2px solid ${selectedPackage === 'monthly1' ? '#3498db' : 'transparent'}`,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                        }}>
                            <h3 style={{
                                margin: '0 0 1rem 0',
                                color: '#2c3e50',
                                fontSize: '1.5rem',
                                textAlign: 'center',
                            }}>
                                1 Tháng
                            </h3>

                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                textAlign: 'center',
                                margin: '1.5rem 0',
                            }}>
                                <div style={{ fontSize: '1.2rem', color: '#7f8c8d', fontWeight: 'normal' }}>VND</div>
                                600.000
                            </div>

                            <p style={{
                                textAlign: 'center',
                                color: '#7f8c8d',
                                margin: '0 0 2rem 0',
                            }}>
                                Truy cập đầy đủ tất cả tính năng
                            </p>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 2rem 0',
                            }}>
                                {packages.monthly1.features.map((feature, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        margin: '0.8rem 0',
                                        color: '#2c3e50',
                                    }}>
                                        <span style={{
                                            color: '#3498db',
                                            fontWeight: 'bold',
                                        }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPackage('monthly1')}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: selectedPackage === 'monthly1' ? '#3498db' : '#f8f9fa',
                                    color: selectedPackage === 'monthly1' ? 'white' : '#7f8c8d',
                                    border: `1px solid ${selectedPackage === 'monthly1' ? '#3498db' : '#e5e8ee'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                {selectedPackage === 'monthly1' && <span>✓</span>}
                                Chọn Gói
                            </button>
                        </div>

                        {/* 6 Tháng */}
                        <div style={{
                            flex: '1 1 300px',
                            background: selectedPackage === 'monthly6' ? '#f0f9ff' : '#fff',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                            border: `2px solid ${selectedPackage === 'monthly6' ? '#3498db' : 'transparent'}`,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            transform: 'scale(1.05)',
                            zIndex: 2,
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                right: '20px',
                                background: '#f39c12',
                                color: 'white',
                                padding: '0.4rem 1rem',
                                borderRadius: '30px',
                                fontSize: '0.9rem',
                                fontWeight: 'bold',
                            }}>
                                PHỔ BIẾN NHẤT
                            </div>

                            <h3 style={{
                                margin: '0 0 1rem 0',
                                color: '#2c3e50',
                                fontSize: '1.5rem',
                                textAlign: 'center',
                            }}>
                                6 Tháng
                            </h3>

                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                textAlign: 'center',
                                margin: '1.5rem 0',
                            }}>
                                <div style={{ fontSize: '1.2rem', color: '#7f8c8d', fontWeight: 'normal' }}>VND</div>
                                3.000.000
                            </div>

                            <p style={{
                                textAlign: 'center',
                                color: '#7f8c8d',
                                margin: '0 0 2rem 0',
                            }}>
                                Tiết kiệm 16% so với gói hàng tháng
                            </p>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 2rem 0',
                            }}>
                                {packages.monthly6.features.map((feature, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        margin: '0.8rem 0',
                                        color: '#2c3e50',
                                    }}>
                                        <span style={{
                                            color: '#3498db',
                                            fontWeight: 'bold',
                                        }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPackage('monthly6')}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: selectedPackage === 'monthly6' ? '#3498db' : '#f8f9fa',
                                    color: selectedPackage === 'monthly6' ? 'white' : '#7f8c8d',
                                    border: `1px solid ${selectedPackage === 'monthly6' ? '#3498db' : '#e5e8ee'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                {selectedPackage === 'monthly6' && <span>✓</span>}
                                Chọn Gói
                            </button>
                        </div>

                        {/* 1 Năm */}
                        <div style={{
                            flex: '1 1 300px',
                            background: selectedPackage === 'yearly' ? '#f0f9ff' : '#fff',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                            border: `2px solid ${selectedPackage === 'yearly' ? '#3498db' : 'transparent'}`,
                            transition: 'all 0.3s ease',
                            position: 'relative',
                        }}>
                            <h3 style={{
                                margin: '0 0 1rem 0',
                                color: '#2c3e50',
                                fontSize: '1.5rem',
                                textAlign: 'center',
                            }}>
                                1 Năm
                            </h3>

                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                textAlign: 'center',
                                margin: '1.5rem 0',
                            }}>
                                <div style={{ fontSize: '1.2rem', color: '#7f8c8d', fontWeight: 'normal' }}>VND</div>
                                5.400.000
                            </div>

                            <p style={{
                                textAlign: 'center',
                                color: '#7f8c8d',
                                margin: '0 0 2rem 0',
                            }}>
                                Tiết kiệm 25% so với gói hàng tháng
                            </p>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 2rem 0',
                            }}>
                                {packages.yearly.features.map((feature, index) => (
                                    <li key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        margin: '0.8rem 0',
                                        color: '#2c3e50',
                                    }}>
                                        <span style={{
                                            color: '#3498db',
                                            fontWeight: 'bold',
                                        }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSelectPackage('yearly')}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    background: selectedPackage === 'yearly' ? '#3498db' : '#f8f9fa',
                                    color: selectedPackage === 'yearly' ? 'white' : '#7f8c8d',
                                    border: `1px solid ${selectedPackage === 'yearly' ? '#3498db' : '#e5e8ee'}`,
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                {selectedPackage === 'yearly' && <span>✓</span>}
                                Chọn Gói
                            </button>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '2rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '2rem',
                            position: 'relative',
                        }}>
                            <button
                                onClick={handleContinue}
                                style={{
                                    padding: '1.2rem 3.5rem',
                                    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    boxShadow: '0 6px 16px rgba(52, 152, 219, 0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 8px 20px rgba(52, 152, 219, 0.5)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 6px 16px rgba(52, 152, 219, 0.4)';
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '0.5rem' }}>
                                    <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="white" />
                                    <path d="M6 14H18V16H6V14Z" fill="white" />
                                </svg>
                                Tiến Hành Thanh Toán
                            </button>
                            <div style={{
                                position: 'absolute',
                                top: '-15px',
                                right: 'calc(50% - 90px)',
                                background: '#e74c3c',
                                color: 'white',
                                padding: '0.25rem 1rem',
                                borderRadius: '30px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                boxShadow: '0 3px 8px rgba(231, 76, 60, 0.3)',
                                animation: 'pulse 2s infinite'
                            }}>
                                Thanh toán an toàn
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
                        @keyframes pulse {
                            0% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                            100% { transform: scale(1); }
                        }
                    `}</style>
                </div>

                {/* FAQ Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        color: '#2c3e50',
                        margin: '0 0 1.5rem 0',
                    }}>
                        Câu hỏi thường gặp
                    </h2>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                color: '#2c3e50',
                                margin: '0 0 0.5rem 0',
                            }}>
                                Tôi có thể hủy đăng ký bất cứ lúc nào không?
                            </h3>
                            <p style={{
                                color: '#7f8c8d',
                                margin: 0,
                                fontSize: '1rem',
                            }}>
                                Có, bạn có thể hủy đăng ký bất cứ lúc nào. Tuy nhiên, chúng tôi không hoàn lại phí đăng ký cho thời gian chưa sử dụng.
                            </p>
                        </div>

                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                color: '#2c3e50',
                                margin: '0 0 0.5rem 0',
                            }}>
                                Tôi sẽ nhận được gì khi trở thành thành viên?
                            </h3>
                            <p style={{
                                color: '#7f8c8d',
                                margin: 0,
                                fontSize: '1rem',
                            }}>
                                Khi trở thành thành viên, bạn sẽ nhận được quyền truy cập vào tất cả các tính năng cao cấp của ứng dụng, bao gồm tư vấn với bác sĩ, kế hoạch cai thuốc cá nhân hóa, và nhiều tính năng khác tùy theo gói bạn chọn.
                            </p>
                        </div>

                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                color: '#2c3e50',
                                margin: '0 0 0.5rem 0',
                            }}>
                                Các phương thức thanh toán được chấp nhận?
                            </h3>
                            <p style={{
                                color: '#7f8c8d',
                                margin: 0,
                                fontSize: '1rem',
                            }}>
                                Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB) và chuyển khoản ngân hàng (BIDV, Vietcombank, Agribank).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal đã là thành viên */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            color: '#2c3e50',
                            margin: '0 0 1rem 0',
                        }}>
                            Bạn đã là thành viên
                        </h2>

                        <p style={{
                            color: '#7f8c8d',
                            margin: '0 0 1.5rem 0',
                        }}>
                            Bạn đã là thành viên của BreathingFree. Bạn có thể kiểm tra thông tin gói thành viên của mình trong trang cá nhân.
                        </p>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '1rem',
                        }}>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    background: '#f8f9fa',
                                    color: '#7f8c8d',
                                    border: '1px solid #e5e8ee',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Đóng
                            </button>

                            <button
                                onClick={() => navigate('/dashboard')}
                                style={{
                                    padding: '0.8rem 1.5rem',
                                    background: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                            >
                                Đi đến trang cá nhân
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembershipPage; 