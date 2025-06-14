/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';
import Header from '../components/Header';

/**
 * HomepageDoctor - Trang chủ dành cho tài khoản bác sĩ
 * 
 * Component này hiển thị trang chính cho các bác sĩ sau khi đăng nhập với các tính năng:
 * - Hiển thị lời chào và thông tin tài khoản
 * - Các chức năng nhanh: theo dõi bệnh nhân, quản lý kế hoạch, viết blog
 * - Điều hướng đến các trang quản lý khác
 */
const HomepageDoctor = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(''); // Tên người dùng bác sĩ

    /**
     * Kiểm tra xác thực và lấy thông tin người dùng
     * Chuyển hướng đến trang đăng nhập nếu chưa xác thực
     */
    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="homepage-doctor">
            <Header userName={userName} />
            <SecondaryNavigationDoctor />

            <div className="container my-5">
                <div className="welcome-section">
                    <h1>Chào mừng, Bác sĩ {userName}</h1>
                    <p className="doctor-dashboard-intro">
                        Đây là cổng thông tin dành cho bác sĩ, nơi bạn có thể quản lý bệnh nhân,
                        theo dõi tiến trình và chia sẻ kiến thức về cai thuốc lá.
                    </p>
                </div>

                <div className="dashboard-cards">
                    <div className="dashboard-card patient-monitoring">
                        <h3>Theo dõi bệnh nhân</h3>
                        <p>Quản lý và theo dõi tiến trình cai thuốc lá của bệnh nhân</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/patient-monitoring')}
                        >
                            Xem chi tiết
                        </button>
                    </div>

                    <div className="dashboard-card patient-plans">
                        <h3>Kế hoạch cai thuốc</h3>
                        <p>Xem và điều chỉnh kế hoạch cai thuốc của bệnh nhân</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/patient-plans')}
                        >
                            Quản lý kế hoạch
                        </button>
                    </div>

                    <div className="dashboard-card community-blog">
                        <h3>Blog cộng đồng</h3>
                        <p>Chia sẻ kiến thức và tư vấn với tư cách chuyên gia</p>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/blog')}
                        >
                            Viết bài
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .homepage-doctor {
                    min-height: 100vh;
                    background-color: var(--light-bg);
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                
                .my-5 {
                    margin-top: 3rem;
                    margin-bottom: 3rem;
                }
                
                .welcome-section {
                    margin-bottom: 2rem;
                    text-align: center;
                }
                
                .welcome-section h1 {
                    font-size: 2.5rem;
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                }
                
                .doctor-dashboard-intro {
                    font-size: 1.1rem;
                    color: var(--text-dark);
                    max-width: 800px;
                    margin: 0 auto 2rem;
                }
                
                .dashboard-cards {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-top: 2rem;
                }
                
                .dashboard-card {
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    padding: 1.5rem;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .dashboard-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                
                .dashboard-card h3 {
                    color: #35a79c;
                    margin-bottom: 1rem;
                    font-size: 1.3rem;
                }
                
                .dashboard-card p {
                    color: #5a6a6e;
                    margin-bottom: 1.5rem;
                }
                
                .btn-primary {
                    background-color: #35a79c;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                
                .btn-primary:hover {
                    background-color: #2c9085;
                }
            `}</style>
        </div>
    );
};

export default HomepageDoctor; 