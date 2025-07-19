import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import authApi from '../api/authApi';
import { quitPlanApi } from '../api/quitPlanApi';

const TrackStatus = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState(null);
    const [quitPlan, setQuitPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Không cần kiểm tra token nữa vì đã được bảo vệ bởi PrivateRoute
        Promise.all([
            loadUserProfile(),
            loadQuitPlan()
        ]).finally(() => {
            setLoading(false);
        });
    }, []);

    const loadUserProfile = async () => {
        try {
            const profileData = await authApi.getUserProfile();
            setUser(profileData);
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    };

    const loadQuitPlan = async () => {
        try {
            const result = await quitPlanApi.getActiveQuitPlan();
            setQuitPlan(result?.data || null);
        } catch (error) {
            console.error('Error loading quit plan:', error);
            setQuitPlan(null);
        }
    };

    const determineAchievement = (days) => {
        if (days >= 365) return '🏆 Bậc thầy cai thuốc';
        if (days >= 180) return '💎 Chuyên gia 6 tháng';
        if (days >= 90) return '🎖️ Chiến binh 3 tháng';
        if (days >= 30) return '🥇 Vô địch 1 tháng';
        if (days >= 14) return '🥈 Kiên trì 2 tuần';
        if (days >= 7) return '🥉 Mạnh mẽ 1 tuần';
        if (days >= 3) return '⭐ Khởi đầu vững chắc';
        if (days >= 1) return '🌱 Bước đầu dũng cảm';
        return '🌱 Mới bắt đầu';
    };

    const getAchievementEmoji = (days) => {
        if (days >= 365) return '🏆';
        if (days >= 180) return '💎';
        if (days >= 90) return '🎖️';
        if (days >= 30) return '🥇';
        if (days >= 14) return '🥈';
        if (days >= 7) return '🥉';
        if (days >= 3) return '⭐';
        if (days >= 1) return '🌱';
        return '🌱';
    };

    const getNextGoal = (days) => {
        if (days < 3) return '3 ngày đầu tiên';
        if (days < 7) return '1 tuần không thuốc';
        if (days < 14) return '2 tuần kiên trì';
        if (days < 30) return '1 tháng thành công';
        if (days < 90) return '3 tháng vững chắc';
        if (days < 180) return '6 tháng hoàn hảo';
        if (days < 365) return '1 năm chiến thắng';
        return 'Chuyên gia cai thuốc';
    };

    const calculateDaysToNextGoal = (days) => {
        if (days < 3) return 3 - days;
        if (days < 7) return 7 - days;
        if (days < 14) return 14 - days;
        if (days < 30) return 30 - days;
        if (days < 90) return 90 - days;
        if (days < 180) return 180 - days;
        if (days < 365) return 365 - days;
        return 0;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const calculateAge = (dob) => {
        return new Date().getFullYear() - new Date(dob).getFullYear();
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                width: '100%',
                background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
                fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
                boxSizing: 'border-box',
                overflowX: 'hidden'
            }}>
                <div style={{ textAlign: 'center', color: '#35a79c', fontSize: '1.2rem', padding: '2rem' }}>
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
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            <Header userName={user?.fullName || 'User'} />
            <SecondaryNavigation />

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '2rem',
                boxSizing: 'border-box'
            }}>
                {/* Hero Header Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                }}>
                    {/* Avatar Section */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: '#35a79c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem',
                        color: 'white',
                        flexShrink: 0
                    }}>
                        👤
                    </div>

                    {/* User Info */}
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            margin: '0 0 0.5rem 0',
                            color: '#2c3e50',
                            fontSize: '2rem',
                            fontWeight: '600'
                        }}>
                            {user?.fullName || 'User'}
                        </h1>
                        
                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                            color: '#7f8c8d',
                            flexWrap: 'wrap',
                            alignItems: 'center'
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
                        📊 Tổng Quan
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
                        🏆 Thành Tựu
                    </button>
                </div>

                {/* Content Area */}
                <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    padding: '2rem',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                    minHeight: '500px'
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
                                    <div style={{
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
                                    <div style={{
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
                                    <div style={{
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
                                    <div style={{
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
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                    gap: '2rem'
                                }}>
                                    {/* Current Achievement */}
                                    <div style={{
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
                                            {getAchievementEmoji(quitPlan.daysSmokeFree)}
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

                                    {/* Money Saved */}
                                    <div style={{
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

                                    {/* Next Goal */}
                                    <div style={{
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
                                            {getNextGoal(quitPlan.daysSmokeFree)}
                                        </p>
                                        <p style={{ color: '#7f8c8d' }}>
                                            Còn {calculateDaysToNextGoal(quitPlan.daysSmokeFree)} ngày nữa
                                        </p>
                                    </div>

                                    {/* Cigarettes Avoided */}
                                    <div style={{
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
                                            🚫
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

                                    {/* Motivation */}
                                    {quitPlan.motivation && (
                                        <div style={{
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