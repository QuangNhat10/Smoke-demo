import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Component Header chung dùng trong toàn ứng dụng
 * Hiển thị logo, menu, và thông tin người dùng nếu đã đăng nhập
 * @param {Object} props - Props của component
 * @param {string} props.userName - Tên người dùng đăng nhập
 * @returns {JSX.Element} - Component Header
 */
const Header = ({ userName }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Thêm hook useLocation để biết đường dẫn hiện tại
  const [isMember, setIsMember] = useState(false); // State kiểm tra người dùng có phải là thành viên
  const [userRole, setUserRole] = useState(''); // State lưu vai trò người dùng (Member, Doctor, Admin, Staff)
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State kiểm tra người dùng đã đăng nhập
  const [showUserDropdown, setShowUserDropdown] = useState(false); // State hiển thị/ẩn dropdown thông tin người dùng
  const dropdownRef = useRef(null); // Ref cho dropdown để xử lý click outside
  const [profilePicture, setProfilePicture] = useState(''); // State lưu link ảnh đại diện
  const [userEmail, setUserEmail] = useState(''); // State lưu email người dùng

  /**
   * Effect chạy khi component được render
   * Lấy thông tin người dùng từ localStorage và thiết lập các state
   */
  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('token');
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(!!token && loggedIn);

    if (token && loggedIn) {
      // Lấy thông tin người dùng
      const role = localStorage.getItem('userRole');
      const email = localStorage.getItem('userEmail');
      setUserRole(role);
      setUserEmail(email);

      // Set profile picture based on role
      const defaultPicture = role === 'Doctor' 
        ? 'https://randomuser.me/api/portraits/women/44.jpg' 
        : 'https://randomuser.me/api/portraits/men/32.jpg';
      setProfilePicture(localStorage.getItem('profilePicture') || defaultPicture);
    }

    // Thêm event listener để đóng dropdown khi click ra ngoài
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Hàm xử lý đăng xuất
   */
  const handleLogout = () => {
    // Xóa tất cả thông tin người dùng
    localStorage.clear();
    setIsLoggedIn(false);
    setUserRole('');
    setUserEmail('');
    setProfilePicture('');
    setShowUserDropdown(false);
    navigate('/');
  };

  /**
   * Hàm xử lý khi nhấn vào logo
   * Điều hướng dựa trên vai trò người dùng
   */
  const handleLogoClick = () => {
    if (userRole === 'Doctor') {
      navigate('/homepage-doctor');
    } else if (userRole === 'Member') {
      navigate('/homepage-member');
    } else if (userRole === 'Admin') {
      navigate('/admin');
    } else if (userRole === 'Staff') {
      navigate('/dashboard-staff');
    } else {
      navigate('/');
    }
  };

  /**
   * Hàm chuyển đổi trạng thái hiển thị dropdown thông tin người dùng
   */
  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };
  
  /**
   * Hàm xử lý chuyển đến trang profile
   */
  const handleProfileClick = () => {
    // Nếu đã ở trang profile rồi thì chỉ đóng dropdown
    if (location.pathname === '/profile') {
      setShowUserDropdown(false);
      return;
    }
    
    // Đảm bảo userId được đặt trước khi chuyển hướng
    if (!localStorage.getItem('userId')) {
      // Nếu không có userId thì tạo một giá trị mặc định dựa trên vai trò
      const role = localStorage.getItem('userRole');
      if (role === 'Doctor') {
        localStorage.setItem('userId', 'doctor123');
      } else {
        localStorage.setItem('userId', 'member123');
      }
    }
    
    navigate('/profile');
    setShowUserDropdown(false);
  };

  /**
   * Hàm xử lý chuyển đến trang đổi mật khẩu
   */
  const handleChangePasswordClick = () => {
    navigate('/change-password');
    setShowUserDropdown(false);
  };

  // Styles
  const styles = {
    mainHeader: {
      backgroundColor: '#ffffff',
      position: 'relative',
      zIndex: 1000,
      width: '100%',
      borderBottom: '1px solid #e6e6e6',
      padding: '10px 0',
      margin: 0,
      left: 0,
      right: 0,
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    logoButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    logoText: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#003b6f',
      letterSpacing: '1px',
    },
    userActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    userInfo: {
      position: 'relative',
    },
    userDropdownToggle: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50px',
      transition: 'all 0.2s ease',
    },
    avatarContainer: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2px solid #35a79c',
    },
    userAvatar: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    dropdownArrow: {
      fontSize: '12px',
      color: '#64748b',
      transition: 'transform 0.2s ease',
    },
    dropdownArrowOpen: {
      transform: 'rotate(180deg)',
    },
    userDropdown: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      right: 0,
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      width: '280px',
      zIndex: 1000,
      overflow: 'hidden',
      animation: 'fadeIn 0.2s ease-out',
    },
    dropdownHeader: {
      padding: '20px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    dropdownAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      overflow: 'hidden',
      border: '2px solid #35a79c',
    },
    dropdownUserDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    dropdownUsername: {
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px',
      fontSize: '1rem',
    },
    dropdownEmail: {
      color: '#64748b',
      fontSize: '0.875rem',
    },
    dropdownDivider: {
      height: '1px',
      backgroundColor: '#f1f5f9',
      margin: '5px 0',
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
      width: '100%',
      backgroundColor: 'transparent',
      border: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
      color: '#1e293b',
      fontWeight: '500',
      fontSize: '0.95rem',
    },
    dropdownItemHover: {
      backgroundColor: '#f8fafc',
    },
    dropdownIcon: {
      fontSize: '1.2rem',
      color: '#64748b',
    },
    textDanger: {
      color: '#e53e3e',
    },
    authButtons: {
      display: 'flex',
      gap: '10px',
    },
    btnLogin: {
      padding: '10px 20px',
      backgroundColor: 'transparent',
      color: '#35a79c',
      border: '2px solid #35a79c',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    btnLoginHover: {
      backgroundColor: 'rgba(53, 167, 156, 0.1)',
    },
    btnRegister: {
      padding: '10px 20px',
      backgroundColor: '#35a79c',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    btnRegisterHover: {
      backgroundColor: '#2c9085',
    },
  };

  return (
    <header style={styles.mainHeader}>
      <div style={styles.container}>
        <div style={styles.headerContent}>
          <button
            onClick={handleLogoClick}
            style={styles.logoButton}
          >
            <span style={styles.logoText}>Breathing Free</span>
          </button>

          <div style={styles.userActions}>
            {isLoggedIn ? (
              <div style={styles.userInfo} ref={dropdownRef}>
                <button 
                  style={styles.userDropdownToggle} 
                  onClick={toggleUserDropdown}
                >
                  <div style={styles.avatarContainer}>
                    <img
                      src={profilePicture || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      style={styles.userAvatar}
                    />
                  </div>
                  <span style={{
                    ...styles.dropdownArrow,
                    ...(showUserDropdown ? styles.dropdownArrowOpen : {})
                  }}>▾</span>
                </button>
                {/* Dropdown menu hiển thị khi nhấn vào avatar */}
                {showUserDropdown && (
                  <div style={styles.userDropdown}>
                    <div style={styles.dropdownHeader}>
                      <div style={styles.dropdownAvatar}>
                        <img 
                          src={profilePicture || 'https://via.placeholder.com/150'} 
                          alt="Profile" 
                          style={styles.userAvatar}
                        />
                      </div>
                      <div style={styles.dropdownUserDetails}>
                        <span style={styles.dropdownUsername}>{userName}</span>
                        <span style={styles.dropdownEmail}>{userEmail}</span>
                      </div>
                    </div>
                    <div style={styles.dropdownDivider}></div>
                    <button
                      style={styles.dropdownItem}
                      onClick={handleProfileClick}
                    >
                      <span style={styles.dropdownIcon}>👤</span>
                      Hồ sơ cá nhân
                    </button>
                    <button
                      style={styles.dropdownItem}
                      onClick={handleChangePasswordClick}
                    >
                      <span style={styles.dropdownIcon}>🔒</span>
                      Đổi mật khẩu
                    </button>
                    <div style={styles.dropdownDivider}></div>
                    <button
                      style={{...styles.dropdownItem, ...styles.textDanger}}
                      onClick={handleLogout}
                    >
                      <span style={styles.dropdownIcon}>🚪</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.authButtons}>
                <button
                  style={styles.btnLogin}
                  onClick={() => navigate('/login')}
                >
                  Đăng Nhập
                </button>
                <button
                  style={styles.btnRegister}
                  onClick={() => navigate('/register')}
                >
                  Đăng Ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </header>
  );
};

export default Header;