import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import QuitPlanCard from '../components/QuitPlanCard';
import { quitPlanApi } from '../api/quitPlanApi';

const DashboardMember = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [quitPlan, setQuitPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const fullName = user.fullName || localStorage.getItem('userName') || 'User';
    setUserName(fullName);
    
    // Load active quit plan
    loadQuitPlan();
  }, [navigate]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'userId' || e.key === 'token') {
        console.log('User changed, reloading data...');
        // Reload data when user changes
        window.location.reload(); // Simple approach to reload everything
      }
    };

    // Listen storage changes từ tabs khác  
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const loadQuitPlan = async () => {
    try {
      setLoading(true);
      setQuitPlan(null);
      
      const currentUser = localStorage.getItem('userId');
      console.log('Loading quit plan for user:', currentUser);
      
      const result = await quitPlanApi.getActiveQuitPlan();
      console.log('API response:', result);
      
      // API trả về object với data property
      const activePlan = result?.data || null;
      console.log('Processed quit plan:', activePlan);
      setQuitPlan(activePlan);
    } catch (error) {
      console.error('Error loading quit plan:', error);
      setQuitPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const increaseSmokeFreeDay = async () => {
    try {
      await quitPlanApi.addSmokeFreeDay();
      // Reload quit plan để hiển thị dữ liệu mới
      await loadQuitPlan();
      alert('Chúc mừng bạn đã có thêm một ngày không hút thuốc!');
    } catch (error) {
      console.error('Error adding smoke-free day:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi ghi nhận tiến trình';
      alert(errorMessage);
    }
  };

  const resetSmokeFreeCount = () => {
    alert('Tính năng reset sẽ được cập nhật trong phiên bản sau. Vui lòng liên hệ với bác sĩ hoặc nhân viên hỗ trợ để reset tiến trình.');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
      fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <Header userName={userName} />
      <SecondaryNavigation />

      <div style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Welcome Section */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            color: '#35a79c',
            fontSize: '2rem',
            fontWeight: '600',
            marginBottom: '0.5rem'
          }}>
            Chào mừng, {userName}!
          </h1>
          <p style={{
            color: '#7f8c8d',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Hành trình cai thuốc của bạn bắt đầu từ đây
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {/* Quit Plan Section */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              fontWeight: '600', 
              marginBottom: '1.5rem', 
              color: '#35a79c',
              textAlign: 'center'
            }}>
              Kế Hoạch Cai Thuốc
            </h2>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Đang tải...</p>
              </div>
            ) : quitPlan ? (
              <QuitPlanCard 
                quitPlan={quitPlan} 
                onUpdate={loadQuitPlan}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ 
                  color: '#7f8c8d', 
                  marginBottom: '1.5rem',
                  fontSize: '1.1rem'
                }}>
                  Bạn chưa có kế hoạch cai thuốc nào
                </p>
                <button
                  onClick={() => navigate('/create-plan')}
                  style={{
                    padding: '1rem 2rem',
                    backgroundColor: '#35a79c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(53, 167, 156, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#2d8f85';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#35a79c';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Tạo Kế Hoạch Mới
                </button>
              </div>
            )}
          </div>

          {/* Achievements Section */}
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            height: 'fit-content'
          }}>
            <h2 style={{ 
              fontWeight: '600', 
              marginBottom: '1.5rem', 
              color: '#35a79c',
              textAlign: 'center'
            }}>
              Thành Tích
            </h2>

            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              color: 'white',
              marginBottom: '1.5rem'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {quitPlan?.daysSmokeFree || 0}
              </div>
              <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                Ngày không hút thuốc
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={increaseSmokeFreeDay}
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#229954';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#27ae60';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                +1 Ngày
              </button>
              <button
                onClick={resetSmokeFreeCount}
                style={{
                  flex: 1,
                  padding: '0.8rem',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#c0392b';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#e74c3c';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ 
            fontWeight: '600', 
            marginBottom: '1.5rem', 
            color: '#35a79c',
            textAlign: 'center'
          }}>
            Thao Tác Nhanh
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              { title: 'Hỗ Trợ', color: '#3498db', path: '/support-chat' },
              { title: 'Blog', color: '#9b59b6', path: '/blog' },
              { title: 'Hồ Sơ', color: '#f39c12', path: '/profile' },
              { title: 'Theo Dõi', color: '#1abc9c', path: '/track-status' }
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                style={{
                  padding: '1.5rem 1rem',
                  backgroundColor: action.color,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
              >
                {action.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMember; 