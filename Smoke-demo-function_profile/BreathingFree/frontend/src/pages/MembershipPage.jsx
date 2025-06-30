import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

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
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPackages();
        const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const memberStatus = localStorage.getItem('isMember') === 'true';

        setIsLoggedIn(loggedIn);
        setIsMember(memberStatus);
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axiosInstance.get('/api/membership/packages');
            console.log('API Response:', response);
            
            if (Array.isArray(response.data)) {
                const formattedPackages = response.data.map(pkg => ({
                    name: pkg.name,
                    price: pkg.price,
                    durationDays: pkg.durationDays,
                    savings: parseInt(pkg.discount),
                    features: pkg.features || [
                        "Không giới hạn tư vấn với bác sĩ",
                        "Kế hoạch cai thuốc cá nhân hóa",
                        "Truy cập nội dung cao cấp",
                        "Hỗ trợ từ cộng đồng",
                        "Đánh giá bác sĩ chuyên gia"
                    ]
                }));
                setPackages(formattedPackages);
            } else {
                console.log('Using sample data because API response is not an array');
                setPackages([
                    {
                        name: "1 Tháng",
                        price: 600000,
                        durationDays: 30,
                        savings: 0,
                        features: [
                            "Không giới hạn tư vấn với bác sĩ",
                            "Kế hoạch cai thuốc cá nhân hóa",
                            "Truy cập nội dung cao cấp",
                            "Hỗ trợ từ cộng đồng",
                            "Đánh giá bác sĩ chuyên gia"
                        ]
                    },
                    {
                        name: "6 Tháng",
                        price: 3000000,
                        durationDays: 180,
                        savings: 16,
                        features: [
                            "Tất cả tính năng từ gói Hàng tháng",
                            "Hỗ trợ bác sĩ ưu tiên",
                            "Báo cáo tiến độ hàng tháng",
                            "Hội thảo sức khỏe độc quyền",
                            "Đánh giá bác sĩ chuyên gia"
                        ]
                    },
                    {
                        name: "1 Năm",
                        price: 5400000,
                        durationDays: 365,
                        savings: 25,
                        features: [
                            "Tất cả tính năng từ gói 6 tháng",
                            "Huấn luyện viên sức khỏe riêng",
                            "Đánh giá sức khỏe hàng quý",
                            "Tài khoản gia đình (tối đa 3 thành viên)",
                            "Đánh giá bác sĩ chuyên gia"
                        ]
                    }
                ]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching packages:', error);
            setPackages([
                {
                    name: "1 Tháng",
            price: 600000,
                    durationDays: 30,
                    savings: 0,
            features: [
                        "Không giới hạn tư vấn với bác sĩ",
                        "Kế hoạch cai thuốc cá nhân hóa",
                        "Truy cập nội dung cao cấp",
                        "Hỗ trợ từ cộng đồng",
                        "Đánh giá bác sĩ chuyên gia"
            ]
        },
                {
                    name: "6 Tháng",
            price: 3000000,
                    durationDays: 180,
                    savings: 16,
            features: [
                        "Tất cả tính năng từ gói Hàng tháng",
                        "Hỗ trợ bác sĩ ưu tiên",
                        "Báo cáo tiến độ hàng tháng",
                        "Hội thảo sức khỏe độc quyền",
                        "Đánh giá bác sĩ chuyên gia"
            ]
        },
                {
                    name: "1 Năm",
            price: 5400000,
                    durationDays: 365,
                    savings: 25,
            features: [
                        "Tất cả tính năng từ gói 6 tháng",
                        "Huấn luyện viên sức khỏe riêng",
                        "Đánh giá sức khỏe hàng quý",
                        "Tài khoản gia đình (tối đa 3 thành viên)",
                        "Đánh giá bác sĩ chuyên gia"
                    ]
                }
            ]);
            setLoading(false);
        }
    };

    const handlePackageSelect = (pkg) => {
        if (!isLoggedIn) {
            alert('Vui lòng đăng nhập để mua gói thành viên');
            navigate('/login');
            return;
        }
        setSelectedPackage(pkg);
        navigate('/payment', { state: { selectedPackage: pkg } });
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)'
            }}>
                Đang tải thông tin gói thành viên...
            </div>
        );
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
                    Chọn gói phù hợp nhất với bạn
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
                    Bắt đầu hành trình cai thuốc lá của bạn với sự hỗ trợ chuyên nghiệp từ đội ngũ bác sĩ của chúng tôi
                </p>
            </div>

            {/* Packages Grid */}
            <div style={{
                maxWidth: '1200px',
                margin: '3rem auto',
                padding: '0 2rem',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
                justifyContent: 'center',
            }}>
                {packages.map((pkg, index) => (
                    <div key={index} style={{
                        flex: '1',
                        minWidth: '300px',
                        maxWidth: '400px',
                    background: 'white',
                        borderRadius: '16px',
                    padding: '2rem',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            padding: '2rem',
                            borderBottom: '1px solid #f0f0f0',
                            textAlign: 'center'
                        }}>
                            <h2 style={{
                                color: '#2c3e50',
                                fontSize: '1.8rem',
                                marginBottom: '1rem'
                            }}>
                                {pkg.name}
                            </h2>
                            <div style={{
                                fontSize: '2.5rem',
                                color: '#44b89d',
                                fontWeight: 'bold',
                                marginBottom: '0.5rem'
                            }}>
                                {new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(pkg.price)}
                            </div>
                            {pkg.savings > 0 && (
                                <div style={{
                                    color: '#e74c3c',
                                    fontSize: '1.1rem',
                                    fontWeight: '500'
                                }}>
                                    Tiết kiệm {pkg.savings}%
                                </div>
                            )}
                        </div>
                        <div style={{
                            padding: '2rem',
                            flex: 1
                        }}>
                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0
                            }}>
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '1rem',
                                        color: '#7f8c8d',
                                        fontSize: '1rem'
                                    }}>
                                        <span style={{
                                            color: '#44b89d',
                                            marginRight: '0.5rem'
                                        }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{
                            padding: '2rem',
                            borderTop: '1px solid #f0f0f0',
                            textAlign: 'center'
                        }}>
                            <button
                                onClick={() => handlePackageSelect(pkg)}
                                style={{
                                    background: '#44b89d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '1rem 2rem',
                                    borderRadius: '8px',
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    width: '100%',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(68, 184, 157, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            >
                                Chọn Gói Này
                            </button>
                        </div>
                    </div>
                ))}
                </div>

                {/* FAQ Section */}
                <div style={{
                maxWidth: '800px',
                margin: '4rem auto',
                padding: '2rem',
                    background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                }}>
                    <h2 style={{
                        color: '#2c3e50',
                    fontSize: '1.8rem',
                    marginBottom: '2rem',
                    textAlign: 'center'
                    }}>
                        Câu hỏi thường gặp
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                    gap: '2rem'
                    }}>
                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                color: '#2c3e50',
                            margin: '0 0 0.5rem 0'
                            }}>
                                Tôi có thể hủy đăng ký bất cứ lúc nào không?
                            </h3>
                            <p style={{
                                color: '#7f8c8d',
                                margin: 0,
                            fontSize: '1rem'
                            }}>
                                Có, bạn có thể hủy đăng ký bất cứ lúc nào. Tuy nhiên, chúng tôi không hoàn lại phí đăng ký cho thời gian chưa sử dụng.
                            </p>
                        </div>

                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                color: '#2c3e50',
                            margin: '0 0 0.5rem 0'
                            }}>
                                Tôi sẽ nhận được gì khi trở thành thành viên?
                            </h3>
                            <p style={{
                                color: '#7f8c8d',
                                margin: 0,
                            fontSize: '1rem'
                            }}>
                                Khi trở thành thành viên, bạn sẽ nhận được quyền truy cập vào tất cả các tính năng cao cấp của ứng dụng, bao gồm tư vấn với bác sĩ, kế hoạch cai thuốc cá nhân hóa, và nhiều tính năng khác tùy theo gói bạn chọn.
                            </p>
                        </div>

                        <div>
                            <h3 style={{
                                fontSize: '1.1rem',
                                color: '#2c3e50',
                            margin: '0 0 0.5rem 0'
                            }}>
                                Các phương thức thanh toán được chấp nhận?
                            </h3>
                            <p style={{
                                color: '#7f8c8d',
                                margin: 0,
                            fontSize: '1rem'
                            }}>
                                Chúng tôi chấp nhận thanh toán qua thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB) và chuyển khoản ngân hàng (BIDV, Vietcombank, Agribank).
                            </p>
                    </div>
                </div>
            </div>

            {/* Modal đã là thành viên */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '16px',
                        maxWidth: '500px',
                        width: '90%',
                        textAlign: 'center'
                    }}>
                        <h2 style={{
                            color: '#2c3e50',
                            marginBottom: '1rem'
                        }}>
                            Bạn đã là thành viên!
                        </h2>
                        <p style={{
                            color: '#7f8c8d',
                            marginBottom: '2rem'
                        }}>
                            Bạn đã có gói thành viên đang hoạt động. Hãy tận hưởng các tính năng cao cấp của chúng tôi!
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
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
                                    cursor: 'pointer'
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
                                    cursor: 'pointer'
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