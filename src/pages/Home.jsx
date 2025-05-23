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
    navigate(path);
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
    alert('Thank you for your message. We will get back to you soon!');
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
      background: '#f4f6f8',
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
        boxShadow: '0 8px 32px 0 rgba(0,47,108,0.08)',
        width: '100%',
        boxSizing: 'border-box',
        position: 'relative',
        zIndex: 10,
        borderBottom: '1.5px solid #e5e8ee',
      }}>
        <button onClick={() => navigate('/')} style={{
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#002f6c',
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
              aria-label="Search"
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
                boxShadow: showSearch ? '0 2px 8px #002f6c33' : '0 1px 3px #002f6c22',
                transition: 'box-shadow 0.2s, background 0.2s',
                height: '40px',
                width: '40px',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" fill="#002f6c" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke="#002f6c" strokeWidth="2" fill="none" /><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#002f6c" strokeWidth="2" strokeLinecap="round" /></svg>
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
                  placeholder="Search..."
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
                }}>Go</button>
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
                Logout
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
                Login
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
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Secondary Navigation Bar */}
      <div style={{
        width: '100%',
        background: '#002f6c',
        boxShadow: '0 2px 8px rgba(0, 47, 108, 0.04)',
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
        <button onClick={() => navigate('/')} style={navBtnStyle}>Home</button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('tools')} style={navBtnStyle}>Tools & Tips ▾</button>
          {openDropdown === 'tools' && (
            <div style={dropdownMenuStyle}>
              <button style={dropdownBtnStyle}>Track Your Status</button>
              <button
                onClick={() => navigateToDashboard('/dashboard-member')}
                style={dropdownBtnStyle}
              >
                Create a Plan
              </button>
              <button style={dropdownBtnStyle}>How to Quit</button>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('about')} style={navBtnStyle}>About Us ▾</button>
          {openDropdown === 'about' && (
            <div style={dropdownMenuStyle}>
              <button style={dropdownBtnStyle}>Expert Sharing</button>
              <button style={dropdownBtnStyle}>Quit Smoking Advice</button>
              <button style={dropdownBtnStyle}>Blog</button>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('challenge')} style={navBtnStyle}>Challenge ▾</button>
          {openDropdown === 'challenge' && (
            <div style={dropdownMenuStyle}>
              <button style={dropdownBtnStyle}>Difficulties</button>
              <button style={dropdownBtnStyle}>Supportive Exercises</button>
              <button style={dropdownBtnStyle}>Nutrition</button>
            </div>
          )}
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => handleDropdown('help')} style={navBtnStyle}>Help & Support ▾</button>
          {openDropdown === 'help' && (
            <div style={dropdownMenuStyle}>
              <button
                onClick={() => setShowContactModal(true)}
                style={dropdownBtnStyle}
              >
                Contact
              </button>
              <button
                onClick={() => navigate('/doctors')}
                style={dropdownBtnStyle}
              >
                Doctor
              </button>
              <button style={dropdownBtnStyle}>Chat Message</button>
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
              CONTACT US
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
                  Name <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactFormChange}
                  placeholder="Your name"
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
                  E-mail Address <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactFormChange}
                  placeholder="Your email address"
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
                  Message <span style={{ color: '#e74c3c' }}>*</span>
                </label>
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactFormChange}
                  placeholder="Your message"
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
                  Are you a robot? <span style={{ color: '#e74c3c' }}>*</span>
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
                    I am
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
                    I am not
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
                  SEND
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

      {/* Hero Section */}
      <section
        style={{
          width: '100%',
          minHeight: '420px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundImage:
            'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginBottom: '0',
        }}
      >
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            color: 'white',
            padding: '3rem 2rem',
            maxWidth: '700px',
            marginLeft: '5vw',
            textShadow: '0 4px 24px rgba(0,47,108,0.18)',
          }}
        >
          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              marginBottom: '1.2rem',
              lineHeight: 1.1,
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            Freedom begins with a<br />
            <span style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #0057b8 0%, #1976d2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '3.2rem',
              fontWeight: 900,
            }}>
              breath of fresh air.
            </span>
          </h1>
          <p
            style={{
              fontSize: '1.25rem',
              fontWeight: 400,
              color: '#fff',
              maxWidth: '500px',
              marginBottom: '0',
              lineHeight: 1.6,
              textShadow: '0 2px 8px rgba(0,47,108,0.12)',
            }}
          >
            Join BreathingFree and start your journey to a healthier, happier, smoke-free life today.
          </p>
        </div>
      </section>

      {/* Timeline Section - New Design */}
      <div id="timeline" style={{
        padding: '5rem 2rem',
        backgroundColor: 'white',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{
          maxWidth: '100%',
          margin: '0 auto',
          width: '100%'
        }}>
          <h2 style={{
            textAlign: 'center',
            fontSize: '2.8rem',
            color: '#2c3e50',
            marginBottom: '1rem',
            fontWeight: '700'
          }}>
            What happens when you quit?
          </h2>

          <p style={{
            textAlign: 'center',
            fontSize: '1.2rem',
            color: '#34495e',
            maxWidth: '800px',
            margin: '0 auto 4rem',
            lineHeight: '1.6'
          }}>
            The sooner you quit, the sooner you'll notice changes to your body and health. Look at what happens when you quit for good.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '3rem 2rem',
            width: '100%'
          }}>
            {/* 20 minutes */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img20m} alt="20 minutes" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 20 minutes</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Check your pulse rate, it will already be starting to return to normal.</p>
              </div>
            </div>

            {/* 8 hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img8h} alt="8 hours" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 8 hours</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Your oxygen levels are recovering, and the harmful carbon monoxide level in your blood will have reduced by half.</p>
              </div>
            </div>

            {/* 48 hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img48h} alt="48 hours" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 48 hours</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Your carbon monoxide levels have dropped to that of a non-smoker. Your lungs are clearing out mucus and your senses of taste and smell are improving.</p>
              </div>
            </div>

            {/* 72 hours */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img72h} alt="72 hours" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 72 hours</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>If you notice that breathing feels easier, it's because your bronchial tubes have started to relax. Also your energy will be increasing.</p>
              </div>
            </div>

            {/* 2-12 weeks */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img2_12w} alt="2-12 weeks" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 2 to 12 weeks</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Blood will be pumping through to your heart and muscles much better because your circulation will have improved.</p>
              </div>
            </div>

            {/* 3-9 months */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img3_9m} alt="3-9 months" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 3 to 9 months</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Any coughs, wheezing or breathing problems will be improving as your lung function increases by up to 10%.</p>
              </div>
            </div>

            {/* 1 year */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img1y} alt="1 year" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 1 year</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Great news! Your risk of heart attack will have halved compared with a smoker's.</p>
              </div>
            </div>

            {/* 10 years */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <img src={img10y} alt="10 years" style={{ width: 70, height: 70, objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#2c3e50', marginBottom: '0.5rem' }}>After 10 years</h3>
                <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>More great news! Your risk of death from lung cancer will have halved compared with a smoker's.</p>
              </div>
            </div>
          </div>
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
          color: '#2c3e50',
          marginBottom: '3rem',
          fontWeight: '700'
        }}>
          Key Features
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
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
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
            <h3 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1rem' }}>Progress Tracking</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Monitor your smoke-free days, money saved, and health improvements in real-time with our advanced tracking tools.
            </p>
          </div>

          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
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
            <h3 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1rem' }}>Achievements & Rewards</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Unlock badges and earn achievements as you reach important milestones in your journey to quit smoking.
            </p>
          </div>

          <div style={{
            flex: '1 1 300px',
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{
              backgroundColor: 'rgba(61, 125, 160, 0.1)',
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <div style={{ fontSize: '2rem', color: '#3d7da0' }}>👥</div>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#2c3e50', marginBottom: '1rem' }}>Professional Coaching</h3>
            <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
              Connect with professional coaches to receive personalized guidance for your smoking cessation journey.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '3rem 2rem',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            <span style={{ color: '#44b89d' }}>Breathing</span>
            <span style={{ color: '#35a79c' }}>Free</span>
          </div>
          <p style={{ maxWidth: '600px', margin: '0 auto', color: '#bdc3c7' }}>
            Smoking Cessation Support Platform - A comprehensive solution to help you quit smoking. We're here to support you every step of the way.
          </p>
        </div>

        <div style={{ marginTop: '2rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
          © 2024 BreathingFree. All rights reserved.
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
  boxShadow: '0 2px 12px #002f6c22',
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
  color: '#002f6c',
  fontWeight: 500,
  fontSize: '1.08rem',
  textAlign: 'left',
  padding: '0.75rem 1.5rem',
  cursor: 'pointer',
  borderRadius: '8px',
  transition: 'background 0.2s, color 0.2s',
  outline: 'none',
};

export default Home;
