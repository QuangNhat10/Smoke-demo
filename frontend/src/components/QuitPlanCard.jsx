import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quitPlanApi } from '../api/quitPlanApi';

const QuitPlanCard = () => {
    const [quitPlan, setQuitPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadActiveQuitPlan();
    }, []);

    const loadActiveQuitPlan = async () => {
        try {
            setLoading(true);
            const response = await quitPlanApi.getActiveQuitPlan();
            if (response && response.data) {
                setQuitPlan(response.data);
            } else {
                setQuitPlan(null);
            }
        } catch (error) {
            if (error.response?.status !== 404) {
                setError('Có lỗi khi tải thông tin kế hoạch');
                console.error('Error loading quit plan:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getDaysFromStart = (startDate) => {
        const start = new Date(startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <div>Đang tải thông tin kế hoạch...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <div style={{ color: '#e53e3e' }}>{error}</div>
            </div>
        );
    }

    if (!quitPlan) {
        return (
            <div style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                padding: '2rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
            }}>
                <h3 style={{ color: '#2C9085', marginBottom: '1rem' }}>
                    Chưa có kế hoạch cai thuốc
                </h3>
                <p style={{ marginBottom: '2rem', color: '#666' }}>
                    Hãy tạo kế hoạch cai thuốc để bắt đầu hành trình của bạn!
                </p>
                <Link 
                    to="/create-plan" 
                    style={{
                        display: 'inline-block',
                        padding: '1rem 2rem',
                        backgroundColor: '#2C9085',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '500'
                    }}
                >
                    Tạo Kế Hoạch Cai Thuốc
                </Link>
            </div>
        );
    }

    const totalDays = getDaysFromStart(quitPlan.startDate);
    const progressPercentage = quitPlan.completionPercentage || 0;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <h3 style={{ color: '#2C9085', margin: 0 }}>
                    Kế Hoạch Cai Thuốc Của Bạn
                </h3>
                <span style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: quitPlan.status === 'Active' ? '#48bb78' : '#ed8936',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                }}>
                    {quitPlan.status === 'Active' ? 'Đang hoạt động' : quitPlan.status}
                </span>
            </div>

            {/* Thống kê tổng quan */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    backgroundColor: '#f7fafc',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2C9085' }}>
                        {totalDays}
                    </div>
                    <div style={{ color: '#666' }}>Ngày đã bắt đầu</div>
                </div>

                <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    backgroundColor: '#f7fafc',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
                        {quitPlan.daysSmokeFree}
                    </div>
                    <div style={{ color: '#666' }}>Ngày không hút thuốc</div>
                </div>

                <div style={{
                    textAlign: 'center',
                    padding: '1rem',
                    backgroundColor: '#f7fafc',
                    borderRadius: '8px'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ed8936' }}>
                        {formatCurrency(quitPlan.totalMoneySaved)}
                    </div>
                    <div style={{ color: '#666' }}>Tiền đã tiết kiệm</div>
                </div>
            </div>

            {/* Thanh tiến trình */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                }}>
                    <span style={{ color: '#666' }}>Tiến trình</span>
                    <span style={{ color: '#2C9085', fontWeight: 'bold' }}>
                        {progressPercentage.toFixed(1)}%
                    </span>
                </div>
                <div style={{
                    width: '100%',
                    height: '10px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '5px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progressPercentage}%`,
                        height: '100%',
                        backgroundColor: '#2C9085',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            {/* Thông tin chi tiết */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div>
                    <h4 style={{ color: '#2C9085', marginBottom: '0.5rem' }}>
                        Thông tin hút thuốc trước đây
                    </h4>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        Số điếu/ngày: <strong>{quitPlan.cigarettesPerDay}</strong>
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        Số năm hút: <strong>{quitPlan.yearsSmoked}</strong>
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        Chi phí/ngày: <strong>{formatCurrency(quitPlan.dailyCost)}</strong>
                    </p>
                </div>

                <div>
                    <h4 style={{ color: '#2C9085', marginBottom: '0.5rem' }}>
                        Kế hoạch
                    </h4>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        Bắt đầu: <strong>{formatDate(quitPlan.startDate)}</strong>
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        Dự kiến hoàn thành: <strong>
                            {quitPlan.expectedEndDate ? formatDate(quitPlan.expectedEndDate) : 'Chưa xác định'}
                        </strong>
                    </p>
                    <p style={{ margin: '0.25rem 0', color: '#666' }}>
                        Mức độ: <strong>
                            {quitPlan.difficulty === 'easy' ? 'Dễ' : 
                             quitPlan.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </strong>
                    </p>
                </div>
            </div>

            {/* Giai đoạn hiện tại */}
            {quitPlan.stages && quitPlan.stages.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#2C9085', marginBottom: '1rem' }}>
                        Giai đoạn hiện tại
                    </h4>
                    {quitPlan.stages
                        .filter(stage => !stage.isCompleted)
                        .slice(0, 1)
                        .map(stage => (
                            <div key={stage.stageID} style={{
                                padding: '1rem',
                                backgroundColor: '#f7fafc',
                                borderRadius: '8px',
                                border: '2px solid #2C9085'
                            }}>
                                <h5 style={{ color: '#2C9085', margin: '0 0 0.5rem 0' }}>
                                    {stage.stageName}
                                </h5>
                                <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                                    {stage.description}
                                </p>
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                    Mục tiêu đến: <strong>{formatDate(stage.targetDate)}</strong>
                                </p>
                            </div>
                        ))}
                </div>
            )}

            {/* Động lực */}
            {quitPlan.motivation && (
                <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ color: '#2C9085', marginBottom: '0.5rem' }}>
                        Động lực của bạn
                    </h4>
                    <p style={{
                        padding: '1rem',
                        backgroundColor: '#f7fafc',
                        borderRadius: '8px',
                        margin: 0,
                        color: '#666',
                        fontStyle: 'italic'
                    }}>
                        "{quitPlan.motivation}"
                    </p>
                </div>
            )}

            {/* Nút hành động */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
            }}>
                <Link 
                    to="/track-status" 
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#2C9085',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontWeight: '500'
                    }}
                >
                    Theo Dõi Tiến Trình
                </Link>
                
                <button
                    onClick={loadActiveQuitPlan}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: 'white',
                        color: '#2C9085',
                        border: '1px solid #2C9085',
                        borderRadius: '8px',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                >
                    Làm Mới
                </button>
            </div>
        </div>
    );
};

export default QuitPlanCard; 