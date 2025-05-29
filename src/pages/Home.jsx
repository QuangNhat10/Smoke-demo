/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img20m from '../assets/20m.png';
import img8h from '../assets/8h.png';
import img48h from '../assets/48h.png';
import img72h from '../assets/72h.png';
import img2_12w from '../assets/2-12w.png';
import img3_9m from '../assets/3-9m.png';
import img1y from '../assets/1y.png';
import img10y from '../assets/10y.png';
import DoctorModal from '../components/DoctorModal';

// Icon SVGs
const icons = {
  home: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M3 10.5L12 4l9 6.5" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 10v8a2 2 0 002 2h3m6 0h3a2 2 0 002-2v-8" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><rect x="9" y="14" width="6" height="6" rx="1.5" fill="#44b89d" /></svg>
  ),
  tools: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l-6 6v3h3l6-6m2-2l3.536-3.536a2.5 2.5 0 10-3.536-3.536L11 9m2 2l-2-2" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  quit: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#35a79c" strokeWidth="2" /><path d="M8 12l2 2 4-4" stroke="#44b89d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  challenge: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" stroke="#35a79c" strokeWidth="2" /><path d="M8 12l2 2 4-4" stroke="#44b89d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  help: (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#35a79c" strokeWidth="2" /><path d="M9.09 9a3 3 0 115.82 0c0 1.657-3 2.5-3 4" stroke="#44b89d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="17" r="1" fill="#44b89d" /></svg>
  ),
  search: (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#35a79c" strokeWidth="2" fill="none" /><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" /></svg>
  ),
};

function Home() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // Contact form state
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    isRobot: true
  });

  // Doctor Modal state
  const [showDoctorModal, setShowDoctorModal] = useState(false);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    // Check if user is logged in
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const storedUserName = localStorage.getItem('userName');

    setIsLoggedIn(userLoggedIn);
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, [showSearch]);

  // Dropdown state
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSearchIconClick = () => {
    setShowSearch((prev) => !prev);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSearch(false);
    setSearchValue('');
  };

  const navigateToDashboard = (path) => {
    // Check if user is logged in before navigating to dashboard
    if (isLoggedIn) {
      navigate(path);
    } else {
      alert('Vui lòng đăng nhập để truy cập tính năng này.');
      navigate('/login');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserName('');
    // Refresh the page or state
    window.location.reload();
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
  };

  const handleRobotChange = (value) => {
    setContactForm({
      ...contactForm,
      isRobot: value
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('Cảm ơn vì tin nhắn của bạn. Chúng tôi sẽ liên hệ lại sớm!');
    setShowContactModal(false);
    setContactForm({
      name: '',
      email: '',
      message: '',
      isRobot: true
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
      fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 2rem 0.5rem 2rem',
        background: '#fff',
        boxShadow: '0 8px 32px 0 rgba(53, 167, 156, 0.08)',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        borderBottom: '1.5px solid #e5e8ee',
      }}>
        <button onClick={() => navigate('/')} style={{
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#35a79c',
          letterSpacing: '1px',
          fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
        }}>
          Breathing Free
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Search Icon & Input */}
          <div style={{ position: 'relative', marginRight: '1rem' }}>
            <button
              aria-label="Tìm kiếm"
              onClick={handleSearchIconClick}
              style={{
                background: '#e5e8ee',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                outline: 'none',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '50%',
                boxShadow: showSearch ? '0 2px 8px rgba(53, 167, 156, 0.3)' : '0 1px 3px rgba(53, 167, 156, 0.2)',
                transition: 'box-shadow 0.2s, background 0.2s',
                height: '40px',
                width: '40px',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#35a79c" strokeWidth="2" fill="none" /><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#35a79c" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '110%',
              transform: showSearch ? 'translateX(-50%) scaleX(1)' : 'translateX(-50%) scaleX(0.5)',
              opacity: showSearch ? 1 : 0,
              pointerEvents: showSearch ? 'auto' : 'none',
              background: 'rgba(255,255,255,0.97)',
              borderRadius: '12px',
              boxShadow: '0 4px 16px #002f6c22',
              padding: showSearch ? '0.5rem 1rem' : '0 0',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              minWidth: '220px',
              border: '1px solid #e5e8ee',
              transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
            }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  placeholder="Tìm kiếm..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '1rem',
                    padding: '0.5rem',
                    width: '150px',
                    background: 'transparent',
                    color: '#002f6c',
                  }}
                />
                <button type="submit" style={{
                  background: '#002f6c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.4rem 0.9rem',
                  marginLeft: '0.5rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px #002f6c22',
                  transition: 'background 0.2s',
                }}>Đi</button>
              </form>
            </div>
          </div>

          {/* User profile or login/register */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#e5f5ff',
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                color: '#1976d2',
                fontWeight: '600',
              }}>
                <span style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#1976d2',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem'
                }}>
                  {userName.charAt(0)}
                </span>
                <span>{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: '0.5rem 1.5rem',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: '600',
                  boxShadow: '0 4px 12px #e74c3c22',
                  transition: 'transform 0.2s, background 0.2s',
                  fontSize: '1.08rem',
                  cursor: 'pointer',
                }}
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" style={{
                padding: '0.5rem 1.5rem',
                background: '#1976d2',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                boxShadow: '0 4px 12px #002f6c22',
                transition: 'transform 0.2s, background 0.2s',
                border: 'none',
                fontSize: '1.08rem',
              }}>
                Đăng Nhập
              </Link>
              <Link to="/register" style={{
                padding: '0.5rem 1.5rem',
                background: '#0057b8',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '50px',
                fontWeight: '600',
                boxShadow: '0 4px 12px #002f6c22',
                transition: 'transform 0.2s, background 0.2s',
                border: 'none',
                fontSize: '1.08rem',
              }}>
                Đăng Ký
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Secondary Navigation Bar */}
      <div style={{
        width: '100%',
        background: '#35a79c',
        boxShadow: '0 2px 8px rgba(53, 167, 156, 0.04)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '2rem',
        padding: '0.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 9,
        borderBottom: '2px solid #e5e8ee',
      }}>
        <button onClick={() => navigate('/')} style={navBtnStyle}>Trang Chủ</button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('tools')} style={navBtnStyle}>Công Cụ & Mẹo ▾</button>
          {openDropdown === 'tools' && (
            <div style={dropdownMenuStyle}>
              <button style={dropdownBtnStyle}>Theo Dõi Trạng Thái</button>
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    navigateToDashboard('/dashboard-member');
                  } else {
                    alert('Vui lòng đăng nhập để tạo kế hoạch cai thuốc.');
                    navigate('/login');
                  }
                }}
                style={dropdownBtnStyle}
              >
                Tạo Kế Hoạch
              </button>
              <button style={dropdownBtnStyle}>Cách Cai Thuốc</button>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('about')} style={navBtnStyle}>Về Chúng Tôi ▾</button>
          {openDropdown === 'about' && (
            <div style={dropdownMenuStyle}>
              <button
                onClick={() => navigate('/expert-advice')}
                style={dropdownBtnStyle}
              >
                Chia Sẻ Từ Chuyên Gia
              </button>
              <button style={dropdownBtnStyle}>Lời Khuyên Cai Thuốc</button>
              <button style={dropdownBtnStyle}>Blog</button>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('challenge')} style={navBtnStyle}>Thử Thách ▾</button>
          {openDropdown === 'challenge' && (
            <div style={dropdownMenuStyle}>
              <button style={dropdownBtnStyle}>Khó Khăn</button>
              <button style={dropdownBtnStyle}>Bài Tập Hỗ Trợ</button>
              <button style={dropdownBtnStyle}>Dinh Dưỡng</button>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('help')} style={navBtnStyle}>Trợ Giúp & Hỗ Trợ ▾</button>
          {openDropdown === 'help' && (
            <div style={dropdownMenuStyle}>
              <button
                onClick={() => setShowContactModal(true)}
                style={dropdownBtnStyle}
              >
                Liên Hệ
              </button>
              <button
                onClick={() => navigate('/doctors')}
                style={dropdownBtnStyle}
              >
                Bác Sĩ
              </button>
              <button style={dropdownBtnStyle}>Nhắn Tin Hỗ Trợ</button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2.5rem',
            maxWidth: '500px',
            width: '90%',
            position: 'relative',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <button
              onClick={() => setShowContactModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#666',
                transition: 'color 0.2s',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                ':hover': {
                  color: '#000',
                  background: '#f5f5f5'
                }
              }}
            >
              ✕
            </button>

            <h2 style={{
              textAlign: 'center',
              marginBottom: '2rem',
              fontSize: '1.75rem',
              color: '#002f6c',
              fontWeight: '700',
              position: 'relative',
              paddingBottom: '10px'
            }}>
              LIÊN HỆ CHÚNG TÔI
              <div style={{
                content: '""',
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '3px',
                background: '#44b89d',
                borderRadius: '2px'
              }}></div>
            </h2>

            <form onSubmit={handleContactSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Họ tên <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactFormChange}
                  placeholder="Tên của bạn"
                  required
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.2rem',
                    borderRadius: '10px',
                    border: '1.5px solid #e5e8ee',
                    fontSize: '1rem',
                    background: '#f8f9fa',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box',
                    color: '#2c3e50',
                    fontWeight: '500',
                    ':focus': {
                      borderColor: '#44b89d',
                      boxShadow: '0 0 0 3px rgba(68, 184, 157, 0.2)'
                    },
                    '::placeholder': {
                      color: '#95a5a6',
                      fontStyle: 'italic',
                      fontWeight: '400',
                      opacity: 0.7
                    }
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Địa chỉ Email <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactFormChange}
                  placeholder="Địa chỉ email của bạn"
                  required
                  style={{
                    width: '100%',
                    padding: '0.9rem 1.2rem',
                    borderRadius: '10px',
                    border: '1.5px solid #e5e8ee',
                    fontSize: '1rem',
                    background: '#f8f9fa',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box',
                    color: '#2c3e50',
                    fontWeight: '500',
                    ':focus': {
                      borderColor: '#44b89d',
                      boxShadow: '0 0 0 3px rgba(68, 184, 157, 0.2)'
                    },
                    '::placeholder': {
                      color: '#95a5a6',
                      fontStyle: 'italic',
                      fontWeight: '400',
                      opacity: 0.7
                    }
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Tin nhắn <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  placeholder="Nội dung tin nhắn"
                  required
                  style={{
                    width: '100%',
                    padding: '1rem 1.2rem',
                    borderRadius: '10px',
                    border: '1.5px solid #e5e8ee',
                    fontSize: '1rem',
                    minHeight: '120px',
                    resize: 'vertical',
                    background: '#f8f9fa',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
                    color: '#2c3e50',
                    fontWeight: '500',
                    lineHeight: '1.5',
                    ':focus': {
                      borderColor: '#44b89d',
                      boxShadow: '0 0 0 3px rgba(68, 184, 157, 0.2)'
                    },
                    '::placeholder': {
                      color: '#95a5a6',
                      fontStyle: 'italic',
                      fontWeight: '400',
                      opacity: 0.7
                    }
                  }}
                />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.75rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: '#2c3e50'
                }}>
                  Bạn có phải là robot? <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <div style={{
                  display: 'flex',
                  gap: '3rem',
                  padding: '0.5rem 0'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#34495e'
                  }}>
                    <input
                      type="radio"
                      name="robot"
                      checked={contactForm.isRobot}
                      onChange={() => handleRobotChange(true)}
                      style={{
                        marginRight: '0.6rem',
                        accentColor: '#44b89d',
                        width: '18px',
                        height: '18px'
                      }}
                    />
                    Tôi là
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#34495e'
                  }}>
                    <input
                      type="radio"
                      name="robot"
                      checked={!contactForm.isRobot}
                      onChange={() => handleRobotChange(false)}
                      style={{
                        marginRight: '0.6rem',
                        accentColor: '#44b89d',
                        width: '18px',
                        height: '18px'
                      }}
                    />
                    Tôi không phải
                  </label>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="submit"
                  disabled={contactForm.isRobot}
                  style={{
                    padding: '0.9rem 3rem',
                    background: contactForm.isRobot ? '#bdc3c7' : '#44b89d',
                    color: 'white',
                    borderRadius: '10px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: '700',
                    cursor: contactForm.isRobot ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: contactForm.isRobot ? 'none' : '0 4px 10px rgba(68, 184, 157, 0.3)',
                    letterSpacing: '1px',
                    ':hover': {
                      background: contactForm.isRobot ? '#bdc3c7' : '#35a79c',
                      transform: contactForm.isRobot ? 'none' : 'translateY(-2px)',
                      boxShadow: contactForm.isRobot ? 'none' : '0 6px 15px rgba(68, 184, 157, 0.4)'
                    },
                    ':active': {
                      transform: 'translateY(1px)',
                      boxShadow: '0 2px 5px rgba(68, 184, 157, 0.4)'
                    }
                  }}
                >
                  GỬI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Modal */}
      {showDoctorModal && (
        <DoctorModal
          isOpen={showDoctorModal}
          onClose={() => setShowDoctorModal(false)}
        />
      )}

      {/* Hero section */}
      <section style={{
        padding: '2rem 2rem 4rem',
        width: '100%',
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        boxSizing: 'border-box',
      }}>
        {/* Hero content: Title, text, and CTA buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          padding: '3rem 1rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f7fa 100%)',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(53, 167, 156, 0.08)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '8px',
            background: 'linear-gradient(90deg, #35a79c 0%, #44b89d 100%)',
          }}></div>

          <h1 style={{
            fontSize: '2.7rem',
            fontWeight: '900',
            marginBottom: '1.5rem',
            color: '#35a79c',
            letterSpacing: '1px',
            paddingBottom: '10px',
            position: 'relative',
            display: 'inline-block',
          }}>
            Bỏ Thuốc Lá Vì Một Cuộc Sống Khỏe Mạnh Hơn
            <div style={{
              position: 'absolute',
              bottom: '0',
              left: '10%',
              right: '10%',
              height: '3px',
              background: '#44b89d',
              borderRadius: '2px',
            }}></div>
          </h1>

          <p style={{
            fontSize: '1.2rem',
            marginBottom: '2rem',
            maxWidth: '800px',
            color: '#2c3e50',
            lineHeight: '1.6',
          }}>
            Chúng tôi cung cấp sự hỗ trợ, các công cụ và tài nguyên cá nhân hóa để giúp bạn cai thuốc lá.
            Hãy lập kế hoạch và bắt đầu hành trình cai thuốc lá của bạn ngay hôm nay!
          </p>

          <div style={{
            display: 'flex',
            gap: '1.5rem',
            marginTop: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            <button
              onClick={() => {
                if (isLoggedIn) {
                  navigate('/dashboard-member');
                } else {
                  navigate('/login');
                }
              }}
              style={{
                padding: '1rem 2rem',
                background: '#35a79c',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '1.1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(53, 167, 156, 0.3)',
                transition: 'transform 0.2s, background 0.2s',
                willChange: 'transform',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 1,
              }}
            >
              <span style={{
                position: 'relative',
                zIndex: 2,
              }}>
                Bắt Đầu Hành Trình Cai Thuốc Lá Ngay
              </span>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '-100%',
                width: '200%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                zIndex: 1,
                animation: 'glowingEffect 3s infinite linear',
              }}></div>
            </button>

            <button
              onClick={() => {
                setShowDoctorModal(true);
              }}
              style={{
                padding: '1rem 2rem',
                background: 'white',
                color: '#35a79c',
                border: '2px solid #35a79c',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '1.1rem',
                cursor: 'pointer',
                transition: 'transform 0.2s, background 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 10px rgba(53, 167, 156, 0.1)',
              }}
            >
              Tìm Bác Sĩ Gần Đây
            </button>
          </div>
        </div>
      </section>

      {/* Health Benefits Section */}
      <div style={{
        width: '100%',
        marginTop: '1rem',
        marginBottom: '1rem',
      }}>
        <h2 style={{
          textAlign: 'center',
          color: '#35a79c',
          fontSize: '2.2rem',
          fontWeight: '800',
          marginBottom: '1.5rem',
          position: 'relative',
          paddingBottom: '0.75rem',
          display: 'inline-block',
          left: '50%',
          transform: 'translateX(-50%)',
        }}>
          Lợi ích sức khỏe khi cai thuốc lá
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '10%',
            right: '10%',
            height: '3px',
            background: '#44b89d',
            borderRadius: '2px',
          }}></div>
        </h2>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 0',
        }}>
          <BenefitCard
            title="20 phút"
            image={img20m}
            text="Nhịp tim và huyết áp của bạn giảm về mức bình thường, thúc đẩy lưu thông máu khỏe mạnh hơn và giảm nguy cơ tim mạch."
          />

          <BenefitCard
            title="8 giờ"
            image={img8h}
            text="Nồng độ nicotine và carbon monoxide trong máu giảm đi một nửa, mức oxy trong máu tăng lên mức bình thường, cải thiện chức năng phổi của bạn."
          />

          <BenefitCard
            title="48 giờ"
            image={img48h}
            text="Cơ thể bạn đã loại bỏ tất cả nicotine. Các dây thần kinh bắt đầu mọc lại và khả năng nếm và ngửi của bạn cải thiện đáng kể."
          />

          <BenefitCard
            title="72 giờ"
            image={img72h}
            text="Khí quản của bạn thư giãn, mức năng lượng tăng lên và việc thở trở nên dễ dàng hơn khi chức năng phổi tiếp tục cải thiện."
          />

          <BenefitCard
            title="2-12 tuần"
            image={img2_12w}
            text="Tuần hoàn trong cơ thể bạn cải thiện, làm cho hoạt động thể chất trở nên dễ dàng hơn. Phổi của bạn có thể hoạt động tốt hơn đến 30%."
          />

          <BenefitCard
            title="3-9 tháng"
            image={img3_9m}
            text="Các vấn đề về hô hấp như ho và khó thở giảm đi và chức năng phổi tăng lên khi viêm trong phổi giảm."
          />

          <BenefitCard
            title="1 năm"
            image={img1y}
            text="Nguy cơ mắc bệnh tim mạch vành giảm còn một nửa so với người hút thuốc. Lưu thông máu và chức năng phổi cải thiện đáng kể."
          />

          <BenefitCard
            title="10 năm"
            image={img10y}
            text="Nguy cơ tử vong do ung thư phổi giảm một nửa so với người tiếp tục hút thuốc lá. Nguy cơ mắc các loại ung thư khác cũng giảm."
          />
        </div>
      </div>

      {/* Expert Advice Section */}
      <div style={{
        padding: '5rem 2rem',
        backgroundColor: 'white',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '1rem'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#35a79c',
          marginBottom: '1.5rem',
          fontWeight: '700'
        }}>
          Lời Khuyên Từ Chuyên Gia
        </h2>

        <p style={{
          textAlign: 'center',
          color: '#7f8c8d',
          fontSize: '1.1rem',
          maxWidth: '800px',
          margin: '0 auto 3rem',
          lineHeight: '1.6',
        }}>
          Những lời khuyên quý báu từ các chuyên gia hàng đầu về cai thuốc lá sẽ giúp bạn trên hành trình này
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{
            flex: '1 1 300px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '2rem',
            borderLeft: '4px solid #44b89d',
            boxShadow: '0 5px 15px rgba(53, 167, 156, 0.05)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.2rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#44b89d22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                👨‍⚕️
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#2c3e50', margin: '0 0 0.2rem 0', fontWeight: '600' }}>BS. Nguyễn Đức Quảng</h3>
                <p style={{ fontSize: '0.85rem', color: '#44b89d', margin: 0 }}>Phó Giám đốc Bệnh viện Phổi Hà Tĩnh</p>
              </div>
            </div>
            <h4 style={{ fontSize: '1.2rem', color: '#44b89d', marginBottom: '0.7rem' }}>Giải pháp hỗ trợ khi gặp cơn thèm thuốc lá</h4>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
              Khi bạn gặp cơn thèm thuốc lá, hãy thử phương pháp 4D: Delay (Trì hoãn), Deep breathing (Hít thở sâu), Drink water (Uống nước), Distract (Chuyển hướng)...
            </p>
            <Link
              to="/expert-advice"
              style={{
                display: 'inline-block',
                color: '#44b89d',
                fontWeight: '600',
                textDecoration: 'none',
                padding: '0.5rem 0',
                borderBottom: '2px solid #44b89d',
              }}
            >
              Đọc tiếp →
            </Link>
          </div>

          <div style={{
            flex: '1 1 300px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '2rem',
            borderLeft: '4px solid #1976d2',
            boxShadow: '0 5px 15px rgba(53, 167, 156, 0.05)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.2rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#1976d222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                👨‍⚕️
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#2c3e50', margin: '0 0 0.2rem 0', fontWeight: '600' }}>BS. Bùi Duy Anh</h3>
                <p style={{ fontSize: '0.85rem', color: '#1976d2', margin: 0 }}>Phòng Quản lý Chất lượng BV Y học cổ truyền</p>
              </div>
            </div>
            <h4 style={{ fontSize: '1.2rem', color: '#1976d2', marginBottom: '0.7rem' }}>Phương pháp Nhĩ châm trong cai thuốc lá</h4>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
              Phương pháp nhĩ châm tác động lên các huyệt đặc biệt trên vành tai, giúp giảm ham muốn sử dụng nicotine và làm dịu các triệu chứng cai nghiện...
            </p>
            <Link
              to="/expert-advice"
              style={{
                display: 'inline-block',
                color: '#1976d2',
                fontWeight: '600',
                textDecoration: 'none',
                padding: '0.5rem 0',
                borderBottom: '2px solid #1976d2',
              }}
            >
              Đọc tiếp →
            </Link>
          </div>

          <div style={{
            flex: '1 1 300px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '2rem',
            borderLeft: '4px solid #e74c3c',
            boxShadow: '0 5px 15px rgba(53, 167, 156, 0.05)',
            transition: 'transform 0.3s ease',
            maxWidth: '350px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.2rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: '#e74c3c22',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                👩‍⚕️
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', color: '#2c3e50', margin: '0 0 0.2rem 0', fontWeight: '600' }}>BS. Phạm Thị Hương</h3>
                <p style={{ fontSize: '0.85rem', color: '#e74c3c', margin: 0 }}>Trưởng khoa Nội, Bệnh viện Đại học Y Hà Nội</p>
              </div>
            </div>
            <h4 style={{ fontSize: '1.2rem', color: '#e74c3c', marginBottom: '0.7rem' }}>Dinh dưỡng và thực phẩm hỗ trợ cai thuốc lá</h4>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6', margin: '0 0 1.5rem 0' }}>
              Dinh dưỡng đóng vai trò quan trọng trong quá trình cai thuốc lá. Hãy bổ sung các thực phẩm giàu vitamin C, B và omega-3...
            </p>
            <Link
              to="/expert-advice"
              style={{
                display: 'inline-block',
                color: '#e74c3c',
                fontWeight: '600',
                textDecoration: 'none',
                padding: '0.5rem 0',
                borderBottom: '2px solid #e74c3c',
              }}
            >
              Đọc tiếp →
            </Link>
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '3rem'
        }}>
          <Link
            to="/expert-advice"
            style={{
              display: 'inline-block',
              padding: '1rem 2.5rem',
              background: '#35a79c',
              color: 'white',
              fontWeight: '700',
              fontSize: '1.1rem',
              borderRadius: '10px',
              textDecoration: 'none',
              boxShadow: '0 4px 12px rgba(53, 167, 156, 0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            Xem Tất Cả Lời Khuyên
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{
        padding: '5rem 2rem',
        backgroundColor: '#f5f7fa',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          color: '#35a79c',
          marginBottom: '3rem',
          fontWeight: '700'
        }}>
          Tính Năng Chính
        </h2>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(53, 167, 156, 0.05)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              backgroundColor: 'rgba(53, 167, 156, 0.1)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <div style={{ fontSize: '2rem', color: '#35a79c' }}>📊</div>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#35a79c', marginBottom: '1rem' }}>Theo Dõi Tiến Độ</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Theo dõi số ngày không hút thuốc, tiền tiết kiệm được và các cải thiện sức khỏe theo thời gian thực với công cụ theo dõi tiên tiến của chúng tôi.
            </p>
          </div>

          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(53, 167, 156, 0.05)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              backgroundColor: 'rgba(68, 184, 157, 0.1)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <div style={{ fontSize: '2rem', color: '#44b89d' }}>🏆</div>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#35a79c', marginBottom: '1rem' }}>Thành Tích & Phần Thưởng</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Mở khóa huy hiệu và đạt được thành tích khi bạn đạt đến các cột mốc quan trọng trong hành trình cai thuốc lá của mình.
            </p>
          </div>

          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(53, 167, 156, 0.05)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              backgroundColor: 'rgba(53, 167, 156, 0.1)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <div style={{ fontSize: '2rem', color: '#35a79c' }}>👥</div>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#35a79c', marginBottom: '1rem' }}>Huấn Luyện Chuyên Nghiệp</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Kết nối với huấn luyện viên chuyên nghiệp để nhận hướng dẫn cá nhân hóa cho hành trình cai thuốc lá của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: '#35a79c',
        color: 'white',
        padding: '3rem 2rem',
        marginTop: '2rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Breathing Free</h3>
            <p style={{ lineHeight: '1.6' }}>
              Trang web hỗ trợ cai thuốc lá hàng đầu, cung cấp hỗ trợ, công cụ và tài nguyên cá nhân hóa để giúp bạn thành công trong hành trình cai thuốc lá.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Liên kết hữu ích</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.8rem' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Giới thiệu</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Blog</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Đội ngũ</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Chính sách riêng tư</a></li>
              <li style={{ marginBottom: '0.8rem' }}><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Điều khoản sử dụng</a></li>
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Liên hệ chúng tôi</h3>
            <p style={{ marginBottom: '0.8rem' }}>Email: contact@breathingfree.com</p>
            <p style={{ marginBottom: '0.8rem' }}>Điện thoại: +84 12 345 6789</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.068 10.068 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.894 4.894 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.894 4.894 0 01-2.186-.61v.061a4.919 4.919 0 003.946 4.824 4.925 4.925 0 01-2.184.081 4.935 4.935 0 004.604 3.42 9.863 9.863 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.99 13.99 0 007.557 2.21c8.195 0 12.68-6.773 12.68-12.605 0-.19 0-.385-.013-.578a9.005 9.005 0 002.21-2.296z" /></svg>
              </a>
              <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.323 6.162 6.162 0 000-12.323zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.441 1.441 0 100 2.881 1.441 1.441 0 000-2.881z" /></svg>
              </a>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '2rem',
          marginTop: '2rem',
        }}>
          <p>© 2025 Breathing Free. Tất cả quyền được bảo lưu.</p>
        </div>
      </footer>
    </div>
  );
}

// Style cho dropdown và nav button
const navBtnStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  fontWeight: 600,
  fontSize: '1.1rem',
  cursor: 'pointer',
  padding: '0.5rem 1.2rem',
  borderRadius: '6px',
  transition: 'background 0.2s, color 0.2s',
  outline: 'none',
  boxShadow: 'none',
  position: 'relative',
};

const dropdownMenuStyle = {
  position: 'absolute',
  top: '110%',
  left: 0,
  background: '#fff',
  boxShadow: '0 2px 12px rgba(53, 167, 156, 0.22)',
  borderRadius: '12px',
  minWidth: '240px',
  zIndex: 100,
  padding: '0.5rem 0',
  border: '1px solid #e5e8ee',
  animation: 'fadeIn 0.2s',
};

const dropdownBtnStyle = {
  display: 'block',
  width: '100%',
  background: 'none',
  border: 'none',
  color: '#35a79c',
  fontWeight: 500,
  fontSize: '1.08rem',
  textAlign: 'left',
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background 0.2s, color 0.2s',
  outline: 'none',
};

// BenefitCard component
const BenefitCard = ({ title, image, text }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '260px',
      padding: '1.5rem',
      borderRadius: '15px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
      background: 'white',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}>
      <img
        src={image}
        alt={title}
        style={{
          width: '80px',
          height: '80px',
          marginBottom: '1rem',
          objectFit: 'contain'
        }}
      />
      <h3 style={{
        color: '#002f6c',
        marginBottom: '0.5rem',
        fontSize: '1.35rem',
        fontWeight: '700',
        textAlign: 'center'
      }}>
        {title}
      </h3>
      <p style={{
        color: '#2c3e50',
        textAlign: 'center',
        lineHeight: '1.5',
        fontSize: '0.95rem'
      }}>
        {text}
      </p>
    </div>
  );
};

export default Home;
