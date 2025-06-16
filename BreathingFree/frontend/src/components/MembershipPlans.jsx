import React, { useState, useEffect } from 'react';

// Component MembershipPlans dùng để hiển thị và xử lý các gói thành viên
const MembershipPlans = ({ onClose }) => {
  // Gói thành viên mà người dùng đang chọn để đăng ký
  const [selectedPlan, setSelectedPlan] = useState(null);
  // Gói thành viên hiện tại của người dùng (lấy từ localStorage)
  const [currentPlan, setCurrentPlan] = useState(null);
  // Trạng thái hiển thị modal xác nhận hủy gói
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);

  useEffect(() => {
    // Lấy thông tin gói thành viên từ localStorage
    const hasMembership = localStorage.getItem('hasMembership') === 'true';
    const membershipPlan = localStorage.getItem('membershipPlan');

    if (hasMembership && membershipPlan) {
      setCurrentPlan(membershipPlan);
    }
  }, []);

  // Danh sách các gói thành viên
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

  // Hàm xử lý khi người dùng đăng ký gói thành viên
  const handlePurchaseMembership = () => {
    if (!selectedPlan) return;

    // Lưu thông tin gói thành viên vào localStorage
    localStorage.setItem('hasMembership', 'true');
    localStorage.setItem('membershipPlan', selectedPlan.name);
    setCurrentPlan(selectedPlan.name);
    setSelectedPlan(null);

    alert(`Bạn đã đăng ký thành công gói ${selectedPlan.name}.`);
  };

  // Hàm xử lý khi người dùng hủy gói thành viên
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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  border: selectedPlan?.id === plan.id ? `2px solid ${plan.color}` : '2px solid transparent',
                  transform: selectedPlan?.id === plan.id ? 'translateY(-5px)' : 'none',
                  zIndex: plan.popular ? 10 : 1,
                  transition: 'all 0.3s ease',
                  height: '100%',
                  minHeight: '480px',
                  maxWidth: '100%',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  if (selectedPlan?.id !== plan.id) {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedPlan?.id !== plan.id) {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)';
                  }
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '0',
                    backgroundColor: '#f39c12',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    padding: '0.5rem 1rem',
                    borderTopLeftRadius: '50px',
                    borderBottomLeftRadius: '50px',
                    boxShadow: '0 4px 8px rgba(243, 156, 18, 0.3)',
                    zIndex: 5
                  }}>
                    PHỔ BIẾN NHẤT
                  </div>
                )}

                <div style={{
                  borderBottom: '1px solid #f1f1f1',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  height: '180px'
                }}>
                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: '#2c3e50',
                    marginBottom: '1rem',
                    textAlign: 'center'
                  }}>{plan.name}</h3>

                  <div style={{
                    color: '#95a5a6',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {plan.description}
                  </div>

                  <div style={{ marginBottom: '0.5rem' }}>
                    <span style={{
                      fontSize: '1rem',
                      color: '#7f8c8d',
                      fontWeight: '500'
                    }}>VND</span>
                  </div>

                  <div style={{
                    fontSize: '3rem',
                    fontWeight: '800',
                    color: plan.color,
                    marginBottom: '1.5rem',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {plan.popular && (
                      <div style={{
                        position: 'absolute',
                        height: '100%',
                        width: '6px',
                        backgroundColor: plan.color,
                        left: '-12px',
                        borderRadius: '3px'
                      }}></div>
                    )}
                    {plan.price}
                  </div>
                </div>

                <div style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  justifyContent: 'space-between',
                  height: '300px'
                }}>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    marginBottom: '2rem',
                    height: '220px'
                  }}>
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          marginBottom: '1rem',
                          color: '#2c3e50',
                          fontSize: '1rem'
                        }}
                      >
                        <span style={{
                          color: plan.color,
                          marginRight: '0.75rem',
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                    }}
                    style={{
                      backgroundColor: selectedPlan?.id === plan.id ? plan.color : 'white',
                      color: selectedPlan?.id === plan.id ? 'white' : plan.color,
                      border: `2px solid ${plan.color}`,
                      borderRadius: '50px',
                      padding: '1rem',
                      fontWeight: '700',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      if (selectedPlan?.id !== plan.id) {
                        e.target.style.backgroundColor = plan.color;
                        e.target.style.color = 'white';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedPlan?.id !== plan.id) {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = plan.color;
                      }
                    }}
                  >
                    Chọn Gói
                  </button>
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