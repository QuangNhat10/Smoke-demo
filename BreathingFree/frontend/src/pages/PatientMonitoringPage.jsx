import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';
import Header from '../components/Header';

const PatientMonitoringPage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

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
        <div className="patient-monitoring-page">
            <Header userName={userName} />
            <SecondaryNavigationDoctor />

            <div className="container py-5">
                <h1 className="page-title">Theo Dõi Bệnh Nhân</h1>
                <p className="page-description">
                    Quản lý và theo dõi tiến trình cai thuốc lá của bệnh nhân
                </p>

                <div className="content-section mt-4">
                    <div className="patient-filters">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bệnh nhân..."
                                className="search-input"
                            />
                            <button className="search-button">Tìm</button>
                        </div>
                        <div className="filter-options">
                            <select className="filter-select">
                                <option value="">Tất cả bệnh nhân</option>
                                <option value="active">Đang theo dõi</option>
                                <option value="completed">Đã hoàn thành</option>
                                <option value="risk">Có nguy cơ tái nghiện</option>
                            </select>
                        </div>
                    </div>

                    <div className="patient-list mt-4">
                        <div className="patient-card" onClick={() => navigate('/patient-details/1')}>
                            <div className="patient-info">
                                <h3>Nguyễn Văn A</h3>
                                <p>Tuổi: 45 | Thời gian cai: 30 ngày</p>
                                <div className="status status-success">Đang tiến triển tốt</div>
                            </div>
                            <div className="patient-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Tiến độ:</span>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: '70%' }}></div>
                                    </div>
                                    <span className="stat-value">70%</span>
                                </div>
                            </div>
                        </div>

                        <div className="patient-card" onClick={() => navigate('/patient-details/2')}>
                            <div className="patient-info">
                                <h3>Trần Thị B</h3>
                                <p>Tuổi: 35 | Thời gian cai: 15 ngày</p>
                                <div className="status status-warning">Có dấu hiệu thèm thuốc</div>
                            </div>
                            <div className="patient-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Tiến độ:</span>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: '40%' }}></div>
                                    </div>
                                    <span className="stat-value">40%</span>
                                </div>
                            </div>
                        </div>

                        <div className="patient-card" onClick={() => navigate('/patient-details/3')}>
                            <div className="patient-info">
                                <h3>Lê Văn C</h3>
                                <p>Tuổi: 52 | Thời gian cai: 60 ngày</p>
                                <div className="status status-success">Hoàn thành chương trình</div>
                            </div>
                            <div className="patient-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Tiến độ:</span>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="stat-value">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .patient-monitoring-page {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                
                .py-5 {
                    padding-top: 3rem;
                    padding-bottom: 3rem;
                }
                
                .page-title {
                    font-size: 2.2rem;
                    color: #35a79c;
                    margin-bottom: 0.5rem;
                    text-align: center;
                }
                
                .page-description {
                    color: #5a6a6e;
                    margin-bottom: 2rem;
                    text-align: center;
                    font-size: 1.1rem;
                }
                
                .content-section {
                    background: white;
                    border-radius: 8px;
                    padding: 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .mt-4 {
                    margin-top: 1.5rem;
                }
                
                .patient-filters {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .search-box {
                    display: flex;
                    flex-grow: 1;
                    max-width: 400px;
                }
                
                .search-input {
                    flex-grow: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px 0 0 8px;
                    font-size: 1rem;
                }
                
                .search-button {
                    padding: 0.75rem 1.5rem;
                    background: #35a79c;
                    color: white;
                    border: none;
                    border-radius: 0 8px 8px 0;
                    cursor: pointer;
                }
                
                .filter-options {
                    display: flex;
                    gap: 1rem;
                }
                
                .filter-select {
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                
                .patient-card {
                    padding: 1.5rem;
                    border: 1px solid #eee;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background-color: white;
                }
                
                .patient-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                }
                
                .patient-info {
                    flex-grow: 1;
                }
                
                .patient-info h3 {
                    font-size: 1.3rem;
                    margin: 0 0 0.5rem 0;
                    color: #2c3e50;
                }
                
                .patient-info p {
                    color: #7f8c8d;
                    margin: 0 0 0.75rem 0;
                }
                
                .status {
                    display: inline-block;
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    font-weight: 500;
                }
                
                .status-success {
                    background-color: rgba(46, 204, 113, 0.15);
                    color: #27ae60;
                }
                
                .status-warning {
                    background-color: rgba(241, 196, 15, 0.15);
                    color: #f39c12;
                }
                
                .patient-stats {
                    width: 30%;
                }
                
                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .stat-label {
                    font-size: 0.9rem;
                    color: #7f8c8d;
                }
                
                .progress-bar {
                    height: 12px;
                    background-color: #f1f1f1;
                    border-radius: 6px;
                    flex-grow: 1;
                    overflow: hidden;
                }
                
                .progress {
                    height: 100%;
                    background-color: #35a79c;
                    border-radius: 6px;
                }
                
                .stat-value {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #35a79c;
                }
            `}</style>
        </div>
    );
};

export default PatientMonitoringPage; 