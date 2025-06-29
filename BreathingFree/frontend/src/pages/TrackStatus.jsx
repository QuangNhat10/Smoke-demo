/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import { quitPlanApi } from '../api/quitPlanApi';
import authApi from '../api/authApi';

/**
 * TrackStatus - Trang theo dõi trạng thái cai thuốc
 * 
 * Component này hiển thị thông tin chi tiết về tiến trình cai thuốc của thành viên:
 * - Thông tin cá nhân từ database
 * - Tiến độ và thành tựu từ quit plan
 * - Thống kê cai thuốc thực tế
 */
const TrackStatus = () => {
    const navigate = useNavigate();
    const [quitPlan, setQuitPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'achievements'

    useEffect(() => {
        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        // Load user profile and quit plan data
        loadUserProfile();
        loadQuitPlan();
    }, [navigate]);

    const loadUserProfile = async () => {
        try {
            const profile = await authApi.getUserProfile();
            setUser(profile);
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    };

    const loadQuitPlan = async () => {
        try {
            setLoading(true);
            const result = await quitPlanApi.getActiveQuitPlan();
            const activePlan = result?.data || null;
            setQuitPlan(activePlan);
        } catch (error) {
            console.error('Error loading quit plan:', error);
            setQuitPlan(null);
        } finally {
            setLoading(false);
        }
    };

    const determineAchievement = (days) => {
        if (days >= 365) return '🏆 Nhà vô địch một năm';
        if (days >= 90) return '🥇 Siêu sao ba tháng';
        if (days >= 30) return '🌟 Cột mốc một tháng';
        if (days >= 14) return '⭐ Quán quân hai tuần';
        if (days >= 7) return '💪 Chiến binh một tuần';
        if (days >= 3) return '🎯 Bước đầu tiên';
        return '🌱 Mới bắt đầu';
    };

    const getNextGoal = (days) => {
        if (days < 7) return { target: 7, label: '1 tuần không hút thuốc' };
        if (days < 14) return { target: 14, label: '2 tuần không hút thuốc' };
        if (days < 30) return { target: 30, label: '1 tháng không hút thuốc' };
        if (days < 90) return { target: 90, label: '3 tháng không hút thuốc' };
        if (days < 365) return { target: 365, label: '1 năm không hút thuốc' };
        return { target: days + 365, label: 'Tiếp tục duy trì' };
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa xác định';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const calculateAge = (dob) => {
        if (!dob) return null;
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                width: '100%',
                background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
                fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center', color: '#35a79c', fontSize: '1.2rem' }}>
                    Đang tải thông tin...
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
        }}>
            <Header userName={user?.fullName || 'User'} />
            <SecondaryNavigation />

            <div style={{
                maxWidth: '1200px',
                margin: '2rem auto',
                padding: '0 2rem'
            }}>
                {/* Header Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: '#35a79c22',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem'
                    }}>
                        👤
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            margin: '0 0 0.5rem 0',
                            color: '#2c3e50',
                            fontSize: '2rem'
                        }}>
                            {user?.fullName || 'User'}
                        </h1>
                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                            color: '#7f8c8d'
                        }}>
                            <span>🎯 {quitPlan?.daysSmokeFree || 0} ngày không hút thuốc</span>
                            <span>🏆 {determineAchievement(quitPlan?.daysSmokeFree || 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'overview' ? '#35a79c' : 'white',
                            color: activeTab === 'overview' ? 'white' : '#2c3e50',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Tổng Quan
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'achievements' ? '#35a79c' : 'white',
                            color: activeTab === 'achievements' ? 'white' : '#2c3e50',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Thành Tựu
                    </button>
                </div>

                {/* Content Area */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    {activeTab === 'overview' && (
                        <>
                            {!quitPlan ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    color: '#7f8c8d'
                                }}>
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: '1rem'
                                    }}>📋</div>
                                    <h3 style={{
                                        color: '#2c3e50',
                                        marginBottom: '1rem'
                                    }}>
                                        Chưa có kế hoạch cai thuốc
                                    </h3>
                                    <p style={{ marginBottom: '2rem' }}>
                                        Hãy tạo kế hoạch cai thuốc để bắt đầu theo dõi tiến trình của bạn
                                    </p>
                                    <button
                                        onClick={() => navigate('/create-plan')}
                                        style={{
                                            padding: '1rem 2rem',
                                            backgroundColor: '#35a79c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontWeight: '600',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        Tạo Kế Hoạch Cai Thuốc
                                    </button>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '2rem'
                                }}>
                                    {/* Personal Information */}
                                    <div className="info-card" style={{
                                        background: '#f8fafb',
                                        borderRadius: '15px',
                                        padding: '1.5rem'
                                    }}>
                                        <h3 style={{
                                            color: '#35a79c',
                                            marginBottom: '1rem',
                                            fontSize: '1.2rem'
                                        }}>Thông Tin Cá Nhân</h3>
                                        <div style={{
                                            display: 'grid',
                                            gap: '1rem'
                                        }}>
                                                                                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                 <span style={{ color: '#7f8c8d' }}>Giới tính</span>
                                                 <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                     {user?.gender || 'Chưa cập nhật'}
                                                 </span>
                                             </div>
                                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                 <span style={{ color: '#7f8c8d' }}>Tuổi</span>
                                                 <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                     {user?.dob ? `${calculateAge(user.dob)} tuổi` : 'Chưa cập nhật'}
                                                 </span>
                                             </div>
                                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                 <span style={{ color: '#7f8c8d' }}>Email</span>
                                                 <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                     {user?.email || 'Chưa cập nhật'}
                                                 </span>
                                             </div>
                                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                 <span style={{ color: '#7f8c8d' }}>Điện thoại</span>
                                                 <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                     {user?.phone || 'Chưa cập nhật'}
                                                 </span>
                                             </div>
                                        </div>
                                    </div>

                                    {/* Quit Plan Information */}
                                    <div className="info-card" style={{
                                        background: '#f8fafb',
                                        borderRadius: '15px',
                                        padding: '1.5rem'
                                    }}>
                                        <h3 style={{
                                            color: '#35a79c',
                                            marginBottom: '1rem',
                                            fontSize: '1.2rem'
                                        }}>Lịch Sử Hút Thuốc</h3>
                                        <div style={{
                                            display: 'grid',
                                            gap: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Thời gian hút thuốc</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {quitPlan.yearsSmoked} năm
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Thời gian cai thuốc</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {quitPlan.daysSmokeFree} ngày
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Thành tựu hiện tại</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {determineAchievement(quitPlan.daysSmokeFree)}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Bác sĩ tư vấn</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {quitPlan.doctorName || 'Chưa có'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Statistics */}
                                    <div className="info-card" style={{
                                        background: '#f8fafb',
                                        borderRadius: '15px',
                                        padding: '1.5rem'
                                    }}>
                                        <h3 style={{
                                            color: '#35a79c',
                                            marginBottom: '1rem',
                                            fontSize: '1.2rem'
                                        }}>Thống Kê Tiến Trình</h3>
                                        <div style={{
                                            display: 'grid',
                                            gap: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Bắt đầu</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {formatDate(quitPlan.startDate)}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Dự kiến hoàn thành</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {formatDate(quitPlan.expectedEndDate)}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Tiến độ</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {quitPlan.completionPercentage?.toFixed(1) || 0}%
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Mức độ</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {quitPlan.difficulty === 'easy' ? 'Dễ' : 
                                                     quitPlan.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Money & Health Statistics */}
                                    <div className="info-card" style={{
                                        background: '#f8fafb',
                                        borderRadius: '15px',
                                        padding: '1.5rem'
                                    }}>
                                        <h3 style={{
                                            color: '#35a79c',
                                            marginBottom: '1rem',
                                            fontSize: '1.2rem'
                                        }}>Lợi Ích Đạt Được</h3>
                                        <div style={{
                                            display: 'grid',
                                            gap: '1rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Tiền tiết kiệm</span>
                                                <span style={{ color: '#27ae60', fontWeight: '500' }}>
                                                    {quitPlan.totalMoneySaved?.toLocaleString() || 0} VND
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Điếu thuốc tránh được</span>
                                                <span style={{ color: '#e74c3c', fontWeight: '500' }}>
                                                    {(quitPlan.daysSmokeFree * quitPlan.cigarettesPerDay).toLocaleString()} điếu
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Chi phí mỗi ngày</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {quitPlan.dailyCost?.toLocaleString() || 0} VND
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#7f8c8d' }}>Điếu/ngày trước đây</span>
                                                <span style={{ color: '#2c3e50', fontWeight: '500' }}>
                                                    {quitPlan.cigarettesPerDay} điếu
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'achievements' && (
                        <>
                            {!quitPlan ? (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '3rem',
                                    color: '#7f8c8d'
                                }}>
                                    <div style={{
                                        fontSize: '3rem',
                                        marginBottom: '1rem'
                                    }}>🏆</div>
                                    <h3 style={{
                                        color: '#2c3e50',
                                        marginBottom: '1rem'
                                    }}>
                                        Chưa có thành tựu
                                    </h3>
                                    <p>
                                        Tạo kế hoạch cai thuốc để bắt đầu thu thập thành tựu
                                    </p>
                                </div>
                            ) : (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '2rem'
                                }}>
                                    <div className="achievement-card" style={{
                                        background: '#f8fafb',
                                        borderRadius: '15px',
                                        padding: '1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: '#35a79c22',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            margin: '0 auto 1rem'
                                        }}>
                                            🌟
                                        </div>
                                        <h3 style={{ color: '#35a79c', marginBottom: '0.5rem' }}>
                                            Thành tựu hiện tại
                                        </h3>
                                        <p style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>
                                            {determineAchievement(quitPlan.daysSmokeFree)}
                                        </p>
                                        <p style={{ color: '#7f8c8d' }}>
                                            {quitPlan.daysSmokeFree} ngày không hút thuốc
                                        </p>
                                    </div>

                                    <div className="achievement-card" style={{
                                        background: '#f8fafb',
                                        borderRadius: '15px',
                                        padding: '1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: '#27ae6022',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            margin: '0 auto 1rem'
                                        }}>
                                            💰
                                        </div>
                                        <h3 style={{ color: '#27ae60', marginBottom: '0.5rem' }}>
                                            Tiết Kiệm Được
                                        </h3>
                                        <p style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>
                                            {quitPlan.totalMoneySaved?.toLocaleString() || 0} VND
                                        </p>
                                        <p style={{ color: '#7f8c8d' }}>
                                            Từ việc không mua thuốc lá
                                        </p>
                                    </div>

                                    <div className="achievement-card" style={{
                                        background: '#f8fafb',
                                        borderRadius: '15px',
                                        padding: '1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: '#3498db22',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            margin: '0 auto 1rem'
                                        }}>
                                            🎯
                                        </div>
                                        <h3 style={{ color: '#3498db', marginBottom: '0.5rem' }}>
                                            Mục Tiêu Tiếp Theo
                                        </h3>
                                        <p style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>
                                            {getNextGoal(quitPlan.daysSmokeFree).label}
                                        </p>
                                        <p style={{ color: '#7f8c8d' }}>
                                            Còn {getNextGoal(quitPlan.daysSmokeFree).target - quitPlan.daysSmokeFree} ngày nữa
                                        </p>
                                    </div>

                                    <div className="achievement-card" style={{
                                        background: '#f8fafb',
                                        borderRadius: '15px',
                                        padding: '1.5rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            borderRadius: '50%',
                                            background: '#e74c3c22',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '2rem',
                                            margin: '0 auto 1rem'
                                        }}>
                                            🚭
                                        </div>
                                        <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>
                                            Thuốc Lá Tránh Được
                                        </h3>
                                        <p style={{ color: '#2c3e50', fontWeight: '600', fontSize: '1.1rem' }}>
                                            {(quitPlan.daysSmokeFree * quitPlan.cigarettesPerDay).toLocaleString()} điếu
                                        </p>
                                        <p style={{ color: '#7f8c8d' }}>
                                            Hóa chất độc hại đã tránh được
                                        </p>
                                    </div>

                                    {quitPlan.motivation && (
                                        <div className="achievement-card" style={{
                                            background: '#f8fafb',
                                            borderRadius: '15px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            gridColumn: 'span 2'
                                        }}>
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                borderRadius: '50%',
                                                background: '#9b59b622',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '2rem',
                                                margin: '0 auto 1rem'
                                            }}>
                                                💪
                                            </div>
                                            <h3 style={{ color: '#9b59b6', marginBottom: '0.5rem' }}>
                                                Động Lực Của Bạn
                                            </h3>
                                            <p style={{ 
                                                color: '#2c3e50', 
                                                fontStyle: 'italic',
                                                fontSize: '1.1rem',
                                                lineHeight: '1.5'
                                            }}>
                                                "{quitPlan.motivation}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackStatus; 