import React, { useState, useEffect } from 'react';

const MembershipPlans = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);

  useEffect(() => {
    const hasMembership = localStorage.getItem('hasMembership') === 'true';
    const membershipPlan = localStorage.getItem('membershipPlan');

    if (hasMembership && membershipPlan) {
      setCurrentPlan(membershipPlan);
    }
  }, []);

  const plans = [
    {
      id: 1,
      name: '1 Tháng',
      price: '600.000',
      description: 'Truy cập đầy đủ tất cả tính năng',
      features: [
        'Không giới hạn tư vấn với bác sĩ',
        'Kế hoạch cai thuốc cá nhân hóa',
        'Truy cập nội dung cao cấp',
        'Hỗ trợ từ cộng đồng'
      ],
      popular: false,
      color: '#44b89d'
    },
    {
      id: 2,
      name: '6 Tháng',
      price: '3.000.000',
      description: 'Tiết kiệm 16% so với gói hàng tháng',
      features: [
        'Tất cả tính năng từ gói Hàng tháng',
        'Hỗ trợ bác sĩ ưu tiên',
        'Báo cáo tiến độ hàng tháng',
        'Hội thảo sức khỏe độc quyền'
      ],
      popular: true,
      color: '#0057b8'
    },
    {
      id: 3,
      name: '1 Năm',
      price: '5.400.000',
      description: 'Tiết kiệm 25% so với gói hàng tháng',
      features: [
        'Tất cả tính năng từ gói 6 tháng',
        'Huấn luyện viên sức khỏe riêng',
        'Đánh giá sức khỏe hàng quý',
        'Tài khoản gia đình (tối đa 3 thành viên)'
      ],
      popular: false,
      color: '#35a79c'
    }
  ];

  const handlePurchaseMembership = () => {
    if (!selectedPlan) return;

    // Simulate purchase
    localStorage.setItem('hasMembership', 'true');
    localStorage.setItem('membershipPlan', selectedPlan.name);
    setCurrentPlan(selectedPlan.name);
    setSelectedPlan(null);

    alert(`Bạn đã đăng ký thành công gói ${selectedPlan.name}.`);
  };

  const handleCancelMembership = () => {
    localStorage.removeItem('hasMembership');
    localStorage.removeItem('membershipPlan');
    setCurrentPlan(null);
    setShowConfirmCancelModal(false);

    alert('Gói thành viên của bạn đã được hủy thành công.');
  };

  return (
    <div style={{
      maxWidth: '900px',
      width: '100%',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e8ee',
        paddingBottom: '1rem'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          color: '#35a79c',
          margin: '0'
        }}>Gói Thành Viên</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: '#95a5a6',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
        >✕</button>
      </div>

      {currentPlan ? (
        <div style={{
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem',
          border: '1px solid #e5e8ee'
        }}>
          <div>
            <h3 style={{
              marginBottom: '1rem',
              color: '#35a79c',
              fontSize: '1.4rem',
              fontWeight: '600'
            }}>Gói Hiện Tại Của Bạn</h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap'
            }}>
              <span style={{
                backgroundColor: '#35a79c',
                color: 'white',
                fontWeight: '700',
                padding: '0.35rem 0.75rem',
                borderRadius: '50px',
                fontSize: '0.9rem'
              }}>{currentPlan}</span>
              <p style={{
                margin: '0',
                color: '#7f8c8d',
                fontSize: '1rem'
              }}>Gói thành viên của bạn đang hoạt động và cung cấp đầy đủ quyền truy cập vào tất cả tính năng cao cấp.</p>
            </div>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setCurrentPlan(null)}
                style={{
                  padding: '0.7rem 1.2rem',
                  backgroundColor: 'transparent',
                  color: '#35a79c',
                  border: '1px solid #35a79c',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f0f7f5';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Thay Đổi Gói
              </button>
              <button
                onClick={() => setShowConfirmCancelModal(true)}
                style={{
                  padding: '0.7rem 1.2rem',
                  backgroundColor: 'transparent',
                  color: '#e74c3c',
                  border: '1px solid #e74c3c',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#fdf2f2';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Hủy Gói Thành Viên
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p style={{
            textAlign: 'center',
            marginBottom: '2rem',
            color: '#7f8c8d',
            fontSize: '1.1rem'
          }}>Chọn gói phù hợp nhất với bạn</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  border: selectedPlan?.id === plan.id ? `2px solid ${plan.color}` : '2px solid transparent',
                  transform: plan.popular ? 'scale(1.05)' : selectedPlan?.id === plan.id ? 'translateY(-5px)' : 'none',
                  zIndex: plan.popular ? 10 : 1,
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (!plan.popular && selectedPlan?.id !== plan.id) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!plan.popular && selectedPlan?.id !== plan.id) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#ff9800',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    padding: '0.25rem 0.5rem',
                    borderBottomLeftRadius: '8px',
                    letterSpacing: '0.5px'
                  }}>PHỔ BIẾN NHẤT</div>
                )}
                <div style={{
                  padding: '1.5rem',
                  textAlign: 'center',
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: `${plan.color}11`
                }}>
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                    color: '#2c3e50',
                    fontWeight: '700'
                  }}>{plan.name}</h3>
                  <div style={{
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'center',
                    gap: '0.25rem'
                  }}>
                    <span style={{
                      fontSize: '2rem',
                      fontWeight: '800',
                      color: plan.color
                    }}>{plan.price}</span>
                    <span style={{
                      fontSize: '1rem',
                      color: '#7f8c8d'
                    }}>VND</span>
                  </div>
                  <p style={{
                    color: '#7f8c8d',
                    fontSize: '0.875rem',
                    margin: '0'
                  }}>{plan.description}</p>
                </div>
                <div style={{
                  padding: '1.5rem',
                  flexGrow: 1
                }}>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0
                  }}>
                    {plan.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.75rem',
                        fontSize: '0.95rem',
                        color: '#2c3e50'
                      }}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="12" r="10" stroke={plan.color} strokeWidth="2" />
                          <path d="M8 12l2 2 4-4" stroke={plan.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  fontWeight: '600',
                  color: plan.color,
                  backgroundColor: selectedPlan?.id === plan.id ? `${plan.color}11` : 'transparent',
                  transition: 'all 0.2s',
                  marginTop: 'auto',
                  borderTop: selectedPlan?.id === plan.id ? `2px solid ${plan.color}` : '2px solid transparent'
                }}>
                  {selectedPlan?.id === plan.id && (
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill={plan.color} fillOpacity="0.2" stroke={plan.color} strokeWidth="2" />
                      <path d="M8 12l2 2 6-6" stroke={plan.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  <span>Chọn Gói</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '0.7rem 1.5rem',
                backgroundColor: '#95a5a6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#7f8c8d';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#95a5a6';
              }}
            >
              Hủy
            </button>
            <button
              disabled={!selectedPlan}
              onClick={handlePurchaseMembership}
              style={{
                padding: '0.7rem 1.5rem',
                backgroundColor: selectedPlan ? '#35a79c' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: selectedPlan ? 'pointer' : 'not-allowed',
                fontWeight: '500',
                boxShadow: selectedPlan ? '0 4px 10px rgba(53, 167, 156, 0.3)' : 'none',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (selectedPlan) {
                  e.target.style.backgroundColor = '#2c9085';
                  e.target.style.boxShadow = '0 6px 15px rgba(53, 167, 156, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedPlan) {
                  e.target.style.backgroundColor = '#35a79c';
                  e.target.style.boxShadow = '0 4px 10px rgba(53, 167, 156, 0.3)';
                }
              }}
            >
              Đăng Ký Gói
            </button>
          </div>
        </>
      )}

      {/* Confirm Cancel Modal */}
      {showConfirmCancelModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              marginBottom: '1rem',
              color: '#e74c3c',
              fontSize: '1.4rem',
              fontWeight: '600'
            }}>Hủy Gói Thành Viên</h3>
            <p style={{
              color: '#7f8c8d',
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>Bạn có chắc chắn muốn hủy gói thành viên của mình? Bạn sẽ mất quyền truy cập vào tất cả các tính năng cao cấp.</p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              <button
                onClick={() => setShowConfirmCancelModal(false)}
                style={{
                  padding: '0.7rem 1.2rem',
                  backgroundColor: 'transparent',
                  color: '#35a79c',
                  border: '1px solid #35a79c',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#f0f7f5';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Giữ Gói Thành Viên
              </button>
              <button
                onClick={handleCancelMembership}
                style={{
                  padding: '0.7rem 1.2rem',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#c0392b';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#e74c3c';
                }}
              >
                Đồng Ý, Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipPlans; 