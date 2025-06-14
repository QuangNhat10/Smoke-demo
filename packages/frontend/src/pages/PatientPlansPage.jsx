import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';
import Header from '../components/Header';

const PatientPlansPage = () => {
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
        <div className="patient-plans-page">
            <Header userName={userName} />
            <SecondaryNavigationDoctor />

            <div className="container py-5">
                <h1 className="page-title">Kế Hoạch Cai Thuốc Của Bệnh Nhân</h1>
                <p className="page-description">
                    Xem và điều chỉnh kế hoạch cai thuốc cho từng bệnh nhân
                </p>

                <div className="content-section mt-4">
                    <div className="filters">
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
                                <option value="">Tất cả kế hoạch</option>
                                <option value="in-progress">Đang thực hiện</option>
                                <option value="new">Mới tạo</option>
                                <option value="completed">Đã hoàn thành</option>
                            </select>
                        </div>
                    </div>

                    <div className="plans-grid mt-4">
                        <div className="plan-card" onClick={() => navigate('/edit-plan/1')}>
                            <div className="patient-info">
                                <h3>Nguyễn Văn A</h3>
                                <p><span className="label">Tuổi:</span> 45</p>
                                <p><span className="label">Loại kế hoạch:</span> Cai thuốc lá dần dần</p>
                            </div>
                            <div className="plan-details">
                                <div className="progress-section">
                                    <span className="progress-label">Tiến độ:</span>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: '70%' }}></div>
                                    </div>
                                    <span className="progress-value">70%</span>
                                </div>
                                <p><span className="label">Bắt đầu:</span> 30/07/2023</p>
                                <p><span className="label">Dự kiến hoàn thành:</span> 30/10/2023</p>
                            </div>
                            <div className="plan-actions">
                                <button className="action-button edit">Chỉnh sửa</button>
                                <button className="action-button view">Xem chi tiết</button>
                            </div>
                        </div>

                        <div className="plan-card" onClick={() => navigate('/edit-plan/2')}>
                            <div className="patient-info">
                                <h3>Trần Thị B</h3>
                                <p><span className="label">Tuổi:</span> 35</p>
                                <p><span className="label">Loại kế hoạch:</span> Cai thuốc lá hoàn toàn</p>
                            </div>
                            <div className="plan-details">
                                <div className="progress-section">
                                    <span className="progress-label">Tiến độ:</span>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: '40%' }}></div>
                                    </div>
                                    <span className="progress-value">40%</span>
                                </div>
                                <p><span className="label">Bắt đầu:</span> 15/08/2023</p>
                                <p><span className="label">Dự kiến hoàn thành:</span> 15/11/2023</p>
                            </div>
                            <div className="plan-actions">
                                <button className="action-button edit">Chỉnh sửa</button>
                                <button className="action-button view">Xem chi tiết</button>
                            </div>
                        </div>

                        <div className="plan-card" onClick={() => navigate('/edit-plan/3')}>
                            <div className="patient-info">
                                <h3>Lê Văn C</h3>
                                <p><span className="label">Tuổi:</span> 52</p>
                                <p><span className="label">Loại kế hoạch:</span> Cai thuốc lá với hỗ trợ thuốc</p>
                            </div>
                            <div className="plan-details">
                                <div className="progress-section">
                                    <span className="progress-label">Tiến độ:</span>
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: '100%' }}></div>
                                    </div>
                                    <span className="progress-value">100%</span>
                                </div>
                                <p><span className="label">Bắt đầu:</span> 01/06/2023</p>
                                <p><span className="label">Hoàn thành:</span> 01/09/2023</p>
                            </div>
                            <div className="plan-actions">
                                <button className="action-button view">Xem chi tiết</button>
                                <button className="action-button report">Báo cáo</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .patient-plans-page {
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
                
                .filters {
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
                
                .plans-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                
                .plan-card {
                    border: 1px solid #eee;
                    border-radius: 8px;
                    padding: 1.5rem;
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr;
                    gap: 1.5rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .plan-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                }
                
                .patient-info h3 {
                    font-size: 1.3rem;
                    margin: 0 0 1rem 0;
                    color: #2c3e50;
                }
                
                .patient-info p, .plan-details p {
                    margin: 0.5rem 0;
                    color: #5a6a6e;
                    font-size: 0.95rem;
                }
                
                .label {
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .progress-section {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }
                
                .progress-label {
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
                
                .progress-value {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #35a79c;
                }
                
                .plan-actions {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 1rem;
                }
                
                .action-button {
                    padding: 0.6rem 1.2rem;
                    border-radius: 8px;
                    border: none;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    text-align: center;
                }
                
                .action-button.edit {
                    background-color: #3498db;
                    color: white;
                }
                
                .action-button.view {
                    background-color: #f8f9fa;
                    border: 1px solid #ddd;
                    color: #2c3e50;
                }
                
                .action-button.report {
                    background-color: #27ae60;
                    color: white;
                }
                
                @media (max-width: 992px) {
                    .plan-card {
                        grid-template-columns: 1fr;
                    }
                    
                    .plan-actions {
                        flex-direction: row;
                    }
                }
            `}</style>
        </div>
    );
};

export default PatientPlansPage; 