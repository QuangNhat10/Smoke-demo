import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

const SmokingCessationPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            padding: '0',
            margin: '0',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            <div style={{
                width: '100%',
                margin: '0',
                padding: '0'
            }}>
                <Header userName="Thành Viên" />
                <SecondaryNavigation />
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                padding: '2rem',
                boxSizing: 'border-box'
            }}>
                <div className="page-header" style={{
                    textAlign: 'center',
                    margin: '2rem 0 3rem',
                    position: 'relative'
                }}>
                    <h1 className="page-title" style={{
                        fontSize: '2.2rem',
                        color: '#35a79c',
                        position: 'relative',
                        display: 'inline-block',
                        marginBottom: '1rem',
                        fontWeight: '700'
                    }}>Hướng Dẫn Cai Thuốc Lá</h1>
                    <p className="page-description" style={{
                        color: '#7f8c8d',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>Những phương pháp hiệu quả và lời khuyên để giúp bạn cai thuốc lá thành công</p>
                </div>

                <div className="content-container" style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '2rem',
                }}>
                    {/* Main content */}
                    <div className="main-content" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem',
                    }}>
                        {/* Đối Phó Với Cơn Thèm Thuốc */}
                        <div className="section-card" style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        }}>
                            <h2 className="section-title" style={{
                                color: '#35a79c',
                                fontSize: '1.6rem',
                                marginBottom: '1.5rem',
                                fontWeight: '700',
                                borderBottom: '2px solid #f0f0f0',
                                paddingBottom: '0.75rem',
                            }}>Đối Phó Với Cơn Thèm Thuốc</h2>

                            <div className="section-content" style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '2rem',
                            }}>
                                {/* Tình huống thường gặp */}
                                <div className="subsection">
                                    <h3 style={{
                                        fontSize: '1.2rem',
                                        color: '#2c3e50',
                                        marginBottom: '1rem',
                                        fontWeight: '600',
                                    }}>Các Tình Huống Thường Gặp</h3>
                                    <ul style={{
                                        listStylePosition: 'outside',
                                        paddingLeft: '1.5rem',
                                        marginBottom: '1.5rem',
                                    }}>
                                        <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Stress và lo lắng</li>
                                        <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Sau bữa ăn</li>
                                        <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Uống cà phê hoặc rượu</li>
                                        <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Gặp gỡ bạn bè hút thuốc</li>
                                    </ul>
                                </div>

                                {/* Chiến lược đối phó */}
                                <div className="subsection">
                                    <h3 style={{
                                        fontSize: '1.2rem',
                                        color: '#2c3e50',
                                        marginBottom: '1rem',
                                        fontWeight: '600',
                                    }}>Chiến Lược Đối Phó</h3>
                                    <ul style={{
                                        listStylePosition: 'outside',
                                        paddingLeft: '1.5rem',
                                        marginBottom: '1.5rem',
                                    }}>
                                        <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Thực hành thở sâu và thiền định</li>
                                        <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Đi bộ hoặc tập thể dục nhẹ nhàng</li>
                                        <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Nhai kẹo cao su không đường</li>
                                        <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Gọi điện cho người hỗ trợ</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Lợi ích Khi Cai Thuốc Lá */}
                        <div className="section-card" style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        }}>
                            <h2 className="section-title" style={{
                                color: '#35a79c',
                                fontSize: '1.6rem',
                                marginBottom: '1.5rem',
                                fontWeight: '700',
                                borderBottom: '2px solid #f0f0f0',
                                paddingBottom: '0.75rem',
                            }}>Lợi Ích Khi Cai Thuốc Lá</h2>

                            <div className="benefits-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                                gap: '1.5rem',
                            }}>
                                {/* 20 phút */}
                                <div className="benefit-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    borderTop: '4px solid #e74c3c',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '0.75rem',
                                        fontSize: '1.25rem',
                                    }}>20 phút</h4>
                                    <p style={{ color: '#5d6d7e', fontSize: '0.95rem' }}>
                                        Huyết áp và nhịp tim giảm về mức bình thường
                                    </p>
                                </div>

                                {/* 12 giờ */}
                                <div className="benefit-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    borderTop: '4px solid #f39c12',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '0.75rem',
                                        fontSize: '1.25rem',
                                    }}>12 giờ</h4>
                                    <p style={{ color: '#5d6d7e', fontSize: '0.95rem' }}>
                                        Nồng độ carbon monoxide trong máu giảm về mức bình thường
                                    </p>
                                </div>

                                {/* 2-12 tuần */}
                                <div className="benefit-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    borderTop: '4px solid #3498db',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '0.75rem',
                                        fontSize: '1.25rem',
                                    }}>2-12 tuần</h4>
                                    <p style={{ color: '#5d6d7e', fontSize: '0.95rem' }}>
                                        Tuần hoàn máu cải thiện và chức năng phổi tăng
                                    </p>
                                </div>

                                {/* 1-9 tháng */}
                                <div className="benefit-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    borderTop: '4px solid #2ecc71',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '0.75rem',
                                        fontSize: '1.25rem',
                                    }}>1-9 tháng</h4>
                                    <p style={{ color: '#5d6d7e', fontSize: '0.95rem' }}>
                                        Ho và khó thở giảm đáng kể
                                    </p>
                                </div>

                                {/* 1 năm */}
                                <div className="benefit-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    borderTop: '4px solid #9b59b6',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '0.75rem',
                                        fontSize: '1.25rem',
                                    }}>1 năm</h4>
                                    <p style={{ color: '#5d6d7e', fontSize: '0.95rem' }}>
                                        Nguy cơ bệnh tim mạch vành giảm một nửa
                                    </p>
                                </div>

                                {/* 5-15 năm */}
                                <div className="benefit-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    textAlign: 'center',
                                    borderTop: '4px solid #34495e',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '0.75rem',
                                        fontSize: '1.25rem',
                                    }}>5-15 năm</h4>
                                    <p style={{ color: '#5d6d7e', fontSize: '0.95rem' }}>
                                        Nguy cơ đột quỵ giảm xuống như người không hút thuốc
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kế Hoạch Cai Thuốc Cá Nhân */}
                        <div className="section-card" style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '2rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        }}>
                            <h2 className="section-title" style={{
                                color: '#35a79c',
                                fontSize: '1.6rem',
                                marginBottom: '1.5rem',
                                fontWeight: '700',
                                borderBottom: '2px solid #f0f0f0',
                                paddingBottom: '0.75rem',
                            }}>Kế Hoạch Cai Thuốc Cá Nhân</h2>

                            <div className="steps-container" style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '1.5rem',
                            }}>
                                {/* Step 1 */}
                                <div className="step-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '1.1rem',
                                    }}>
                                        <span style={{
                                            background: '#3498db',
                                            color: 'white',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.9rem',
                                        }}>1</span>
                                        Bước 1: Chuẩn Bị Cai Thuốc
                                    </h4>
                                    <ul style={{
                                        padding: '0 0 0 1.2rem',
                                        margin: '0',
                                        fontSize: '0.95rem',
                                    }}>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Chọn ngày cai thuốc trong vòng hai tuần tới</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Liệt kê lý do cai thuốc của bạn</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Xác định các yếu tố kích hoạt cơn thèm thuốc</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Thông báo cho gia đình và bạn bè về kế hoạch của bạn</li>
                                    </ul>
                                </div>

                                {/* Step 2 */}
                                <div className="step-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '1.1rem',
                                    }}>
                                        <span style={{
                                            background: '#3498db',
                                            color: 'white',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.9rem',
                                        }}>2</span>
                                        Bước 2: Ngày Đầu Tiên Cai Thuốc
                                    </h4>
                                    <ul style={{
                                        padding: '0 0 0 1.2rem',
                                        margin: '0',
                                        fontSize: '0.95rem',
                                    }}>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Vứt bỏ tất cả thuốc lá và đồ dùng hút thuốc</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Tránh các yếu tố kích hoạt đã xác định</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Giữ bản thân bận rộn với các hoạt động</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Uống nhiều nước và ăn đồ ăn nhẹ lành mạnh</li>
                                    </ul>
                                </div>

                                {/* Step 3 */}
                                <div className="step-box" style={{
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    padding: '1.5rem',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                                }}>
                                    <h4 style={{
                                        color: '#3498db',
                                        marginBottom: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '1.1rem',
                                    }}>
                                        <span style={{
                                            background: '#3498db',
                                            color: 'white',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.9rem',
                                        }}>3</span>
                                        Bước 3: Duy Trì Không Hút Thuốc
                                    </h4>
                                    <ul style={{
                                        padding: '0 0 0 1.2rem',
                                        margin: '0',
                                        fontSize: '0.95rem',
                                    }}>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Thực hành các kỹ thuật đối phó với stress</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Tham gia các hoạt động thể chất</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Tự thưởng cho bản thân khi đạt được mốc quan trọng</li>
                                        <li style={{ marginBottom: '0.5rem', color: '#5d6d7e' }}>Tham gia nhóm hỗ trợ cai thuốc</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="sidebar" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                    }}>
                        {/* Mẹo Hữu Ích */}
                        <div className="sidebar-card" style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        }}>
                            <h3 style={{
                                color: '#35a79c',
                                fontSize: '1.3rem',
                                marginBottom: '1.2rem',
                                fontWeight: '700',
                            }}>Mẹo Hữu Ích</h3>

                            <ul style={{
                                padding: '0 0 0 1.2rem',
                                margin: '0'
                            }}>
                                <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Uống nhiều nước</li>
                                <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Tập thể dục đều đặn</li>
                                <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Tránh các tình huống có nguy cơ cao</li>
                                <li style={{ marginBottom: '0.75rem', color: '#5d6d7e' }}>Thưởng cho bản thân khi đạt mục tiêu</li>
                            </ul>
                        </div>

                        {/* Khi Gặp Khó Khăn */}
                        <div className="sidebar-card" style={{
                            backgroundColor: '#f44336',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 15px rgba(244, 67, 54, 0.2)',
                        }}>
                            <h3 style={{
                                color: 'white',
                                fontSize: '1.3rem',
                                marginBottom: '1.2rem',
                                fontWeight: '700',
                            }}>Khi Gặp Khó Khăn</h3>

                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: '1rem',
                                fontSize: '0.95rem',
                            }}>
                                Hãy nhớ: cơn thèm thuốc chỉ kéo dài 3-5 phút
                            </p>

                            <p style={{
                                color: 'white',
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                            }}>
                                Gọi ngay đường dây hỗ trợ: 1800 6606
                            </p>
                        </div>

                        {/* Đặt lịch hỗ trợ */}
                        <div className="sidebar-card" style={{
                            backgroundColor: '#3498db',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 15px rgba(52, 152, 219, 0.2)',
                        }}>
                            <h3 style={{
                                color: 'white',
                                fontSize: '1.3rem',
                                marginBottom: '1.2rem',
                                fontWeight: '700',
                            }}>Đặt Lịch Tư Vấn</h3>

                            <p style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: '1rem',
                                fontSize: '0.95rem',
                            }}>
                                Gặp gỡ chuyên gia hỗ trợ cai thuốc lá của chúng tôi để được hướng dẫn cá nhân hóa
                            </p>

                            <button
                                onClick={() => navigate('/doctors')}
                                style={{
                                    background: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.75rem 1rem',
                                    color: '#3498db',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    width: '100%',
                                }}
                            >
                                Đặt Lịch Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmokingCessationPage; 