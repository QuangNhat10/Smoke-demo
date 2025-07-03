import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import '../styles/SmokingCessation.css';

const SmokingCessationPage = () => {
    const navigate = useNavigate();

    return (
        <div className="smoking-cessation">
            <div className="smoking-cessation-wrapper">
                <Header userName="Thành Viên" />
                <SecondaryNavigation />
            </div>

            <div className="smoking-cessation-container">
                <div className="smoking-cessation-header">
                    <h1 className="smoking-cessation-title">Hướng Dẫn Cai Thuốc Lá</h1>
                    <p className="smoking-cessation-description">
                        Những phương pháp hiệu quả và lời khuyên để giúp bạn cai thuốc lá thành công
                    </p>
                </div>

                <div className="smoking-cessation-content">
                    {/* Main content */}
                    <div className="smoking-cessation-main">
                        {/* Đối Phó Với Cơn Thèm Thuốc */}
                        <div className="smoking-cessation-section">
                            <h2 className="smoking-cessation-section-title">Đối Phó Với Cơn Thèm Thuốc</h2>

                            <div className="coping-strategies-grid">
                                {/* Tình huống thường gặp */}
                                <div className="coping-subsection">
                                    <h3>Các Tình Huống Thường Gặp</h3>
                                    <ul>
                                        <li>Stress và lo lắng</li>
                                        <li>Sau bữa ăn</li>
                                        <li>Uống cà phê hoặc rượu</li>
                                        <li>Gặp gỡ bạn bè hút thuốc</li>
                                    </ul>
                                </div>

                                {/* Chiến lược đối phó */}
                                <div className="coping-subsection">
                                    <h3>Chiến Lược Đối Phó</h3>
                                    <ul>
                                        <li>Thực hành thở sâu và thiền định</li>
                                        <li>Đi bộ hoặc tập thể dục nhẹ nhàng</li>
                                        <li>Nhai kẹo cao su không đường</li>
                                        <li>Gọi điện cho người hỗ trợ</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Lợi ích Khi Cai Thuốc Lá */}
                        <div className="smoking-cessation-section">
                            <h2 className="smoking-cessation-section-title">Lợi Ích Khi Cai Thuốc Lá</h2>

                            <div className="benefits-grid">
                                {/* 20 phút */}
                                <div className="benefit-box">
                                    <h4 className="benefit-time">20 phút</h4>
                                    <p className="benefit-description">
                                        Huyết áp và nhịp tim giảm về mức bình thường
                                    </p>
                                </div>

                                {/* 12 giờ */}
                                <div className="benefit-box">
                                    <h4 className="benefit-time">12 giờ</h4>
                                    <p className="benefit-description">
                                        Nồng độ carbon monoxide trong máu giảm về mức bình thường
                                    </p>
                                </div>

                                {/* 2-12 tuần */}
                                <div className="benefit-box">
                                    <h4 className="benefit-time">2-12 tuần</h4>
                                    <p className="benefit-description">
                                        Tuần hoàn máu cải thiện và chức năng phổi tăng
                                    </p>
                                </div>

                                {/* 1-9 tháng */}
                                <div className="benefit-box">
                                    <h4 className="benefit-time">1-9 tháng</h4>
                                    <p className="benefit-description">
                                        Ho và khó thở giảm đáng kể
                                    </p>
                                </div>

                                {/* 1 năm */}
                                <div className="benefit-box">
                                    <h4 className="benefit-time">1 năm</h4>
                                    <p className="benefit-description">
                                        Nguy cơ bệnh tim mạch vành giảm một nửa
                                    </p>
                                </div>

                                {/* 5-15 năm */}
                                <div className="benefit-box">
                                    <h4 className="benefit-time">5-15 năm</h4>
                                    <p className="benefit-description">
                                        Nguy cơ đột quỵ giảm xuống như người không hút thuốc
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Kế Hoạch Cai Thuốc Cá Nhân */}
                        <div className="smoking-cessation-section">
                            <h2 className="smoking-cessation-section-title">Kế Hoạch Cai Thuốc Cá Nhân</h2>

                            <div className="steps-container">
                                {/* Step 1 */}
                                <div className="step-box">
                                    <h4 className="step-header">
                                        <span className="step-number">1</span>
                                        Bước 1: Chuẩn Bị Cai Thuốc
                                    </h4>
                                    <ul className="step-list">
                                        <li>Chọn ngày cai thuốc trong vòng hai tuần tới</li>
                                        <li>Liệt kê lý do cai thuốc của bạn</li>
                                        <li>Xác định các yếu tố kích hoạt cơn thèm thuốc</li>
                                        <li>Thông báo cho gia đình và bạn bè về kế hoạch của bạn</li>
                                    </ul>
                                </div>

                                {/* Step 2 */}
                                <div className="step-box">
                                    <h4 className="step-header">
                                        <span className="step-number">2</span>
                                        Bước 2: Ngày Đầu Tiên Cai Thuốc
                                    </h4>
                                    <ul className="step-list">
                                        <li>Vứt bỏ tất cả thuốc lá và đồ dùng hút thuốc</li>
                                        <li>Tránh các yếu tố kích hoạt đã xác định</li>
                                        <li>Giữ bản thân bận rộn với các hoạt động</li>
                                        <li>Uống nhiều nước và ăn đồ ăn nhẹ lành mạnh</li>
                                    </ul>
                                </div>

                                {/* Step 3 */}
                                <div className="step-box">
                                    <h4 className="step-header">
                                        <span className="step-number">3</span>
                                        Bước 3: Duy Trì Không Hút Thuốc
                                    </h4>
                                    <ul className="step-list">
                                        <li>Thực hành các kỹ thuật đối phó với stress</li>
                                        <li>Tham gia các hoạt động thể chất</li>
                                        <li>Tự thưởng cho bản thân khi đạt được mốc quan trọng</li>
                                        <li>Tham gia nhóm hỗ trợ cai thuốc</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="smoking-cessation-sidebar">
                        {/* Mẹo Hữu Ích */}
                        <div className="sidebar-card sidebar-tips">
                            <h3 className="sidebar-title">Mẹo Hữu Ích</h3>
                            <ul>
                                <li>Uống nhiều nước</li>
                                <li>Tập thể dục đều đặn</li>
                                <li>Tránh các tình huống có nguy cơ cao</li>
                                <li>Thưởng cho bản thân khi đạt mục tiêu</li>
                            </ul>
                        </div>

                        {/* Khi Gặp Khó Khăn */}
                        <div className="sidebar-card sidebar-emergency">
                            <h3 className="sidebar-title">Khi Gặp Khó Khăn</h3>
                            <p className="sidebar-text">
                                Hãy nhớ: cơn thèm thuốc chỉ kéo dài 3-5 phút
                            </p>
                            <p className="sidebar-highlight">
                                Gọi ngay đường dây hỗ trợ: 1800 6606
                            </p>
                        </div>

                        {/* Đặt lịch hỗ trợ */}
                        <div className="sidebar-card sidebar-appointment">
                            <h3 className="sidebar-title">Đặt Lịch Tư Vấn</h3>
                            <p className="sidebar-text">
                                Gặp gỡ chuyên gia hỗ trợ cai thuốc lá của chúng tôi để được hướng dẫn cá nhân hóa
                            </p>
                            <button
                                onClick={() => navigate('/doctors')}
                                className="appointment-button"
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