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
  
  // Chỉ giữ lại state cần thiết cho achievements
  const [smokeFreeCount, setSmokeFreeCount] = useState(() => {
    const savedCount = localStorage.getItem('smokeFreeCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

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

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo.fullName) {
      setUserName(userInfo.fullName);
    }

    // Load active quit plan
    loadQuitPlan();
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('smokeFreeCount', smokeFreeCount);
  }, [smokeFreeCount]);

  const loadQuitPlan = async () => {
    try {
      setLoading(true);
      const activePlan = await quitPlanApi.getActiveQuitPlan();
      setQuitPlan(activePlan);
    } catch (error) {
      console.error('Error loading quit plan:', error);
      setQuitPlan(null);
    } finally {
      setLoading(false);
    }
  };

  const increaseSmokeFreeDay = () => {
    setSmokeFreeCount(prev => prev + 1);
  };

  const resetSmokeFreeCount = () => {
    if (window.confirm('Bạn có chắc chắn muốn reset số ngày không hút thuốc không?')) {
      setSmokeFreeCount(0);
    }
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
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Smoke Free Days Counter */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {smokeFreeCount}
                </div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                  Ngày không hút thuốc
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexDirection: isMobile ? 'column' : 'row'
              }}>
                <button
                  onClick={increaseSmokeFreeDay}
                  style={{
                    flex: 1,
                    padding: '0.8rem',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#27ae60'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2ecc71'}
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
                    fontWeight: '500',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
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
            gap: '1rem'
          }}>
            <button
              onClick={() => navigate('/support-chat')}
              style={{
                padding: '1rem',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
            >
              Hỗ Trợ
            </button>
            <button
              onClick={() => navigate('/blog')}
              style={{
                padding: '1rem',
                backgroundColor: '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#8e44ad'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#9b59b6'}
            >
              Blog
            </button>
            <button
              onClick={() => navigate('/profile')}
              style={{
                padding: '1rem',
                backgroundColor: '#f39c12',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#e67e22'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#f39c12'}
            >
              Hồ Sơ
            </button>
            <button
              onClick={() => navigate('/track-status')}
              style={{
                padding: '1rem',
                backgroundColor: '#1abc9c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#16a085'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1abc9c'}
            >
              Theo Dõi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMember; 