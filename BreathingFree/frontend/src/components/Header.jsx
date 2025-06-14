import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component Header chung dùng trong toàn ứng dụng
 * Hiển thị logo, menu, và thông tin người dùng nếu đã đăng nhập
 * @param {Object} props - Props của component
 * @param {string} props.userName - Tên người dùng đăng nhập
 * @returns {JSX.Element} - Component Header
 */
const Header = ({ userName }) => {
  const navigate = useNavigate();
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
    // Kiểm tra xem người dùng đã là thành viên chưa
    const membershipStatus = localStorage.getItem('isMember') === 'true';
    setIsMember(membershipStatus);

    // Lấy vai trò người dùng và ID
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    setUserRole(role);

    // Kiểm tra đăng nhập
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    // Lấy ảnh đại diện và email từ localStorage nếu có
    const storedProfilePicture = localStorage.getItem('profilePicture');
    const storedEmail = localStorage.getItem('userEmail');

    if (loggedIn && userId) {
      // Lấy thông tin từ localStorage
      if (storedProfilePicture) {
        setProfilePicture(storedProfilePicture);
      } else {
        // Fallback nếu không có ảnh trong localStorage
        setProfilePicture(role === 'Doctor' ?
          'https://randomuser.me/api/portraits/women/44.jpg' :
          'https://randomuser.me/api/portraits/men/32.jpg');
      }

      if (storedEmail) {
        setUserEmail(storedEmail);
      } else {
        // Fallback nếu không có email trong localStorage
        setUserEmail(role === 'Doctor' ? 'doctor@example.com' : 'user@example.com');
      }
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
   * Xóa thông tin người dùng khỏi localStorage và chuyển về trang chủ
   */
  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('hasMembership');
    localStorage.removeItem('membershipPlan');
    localStorage.removeItem('profilePicture'); // Xóa ảnh đại diện khi logout
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

  return (
    <header className="main-header">
      <div className="container">
        <div className="header-content">
          <button
            onClick={handleLogoClick}
            className="logo-button"
          >
            <span className="logo-text">Breathing Free</span>
          </button>

          <div className="user-actions">
            {isLoggedIn ? (
              <div className="user-info" ref={dropdownRef}>
                <button className="user-dropdown-toggle" onClick={toggleUserDropdown}>
                  <div className="avatar-container">
                    <img
                      src={profilePicture || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="user-avatar"
                    />
                  </div>
                  <span className={`dropdown-arrow ${showUserDropdown ? 'open' : ''}`}>▾</span>
                </button>
                {/* Dropdown menu hiển thị khi nhấn vào avatar */}
                {showUserDropdown && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        <img src={profilePicture || 'https://via.placeholder.com/150'} alt="Profile" />
                      </div>
                      <div className="dropdown-user-details">
                        <span className="dropdown-username">{userName}</span>
                        <span className="dropdown-email">{userEmail}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate('/profile');
                        setShowUserDropdown(false);
                      }}
                    >
                      <span className="dropdown-icon">👤</span>
                      Hồ sơ cá nhân
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <span className="dropdown-icon">🚪</span>
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <button
                  className="btn btn-login"
                  onClick={() => navigate('/login')}
                >
                  Đăng Nhập
                </button>
                <button
                  className="btn btn-register"
                  onClick={() => navigate('/register')}
                >
                  Đăng Ký
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-header {
          background-color: #ffffff;
          position: relative;
          z-index: 1000;
          width: 100%;
          border-bottom: 1px solid #e6e6e6;
          padding: 10px 0;
          margin: 0;
          left: 0;
          right: 0;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .logo-text {
          font-size: 2rem;
          font-weight: 700;
          color: #003b6f;
          letter-spacing: 1px;
          font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .user-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          position: relative;
        }
        
        .avatar-container {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #e5e8ee;
          margin-right: 5px;
        }
        
        .user-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .user-dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .user-dropdown-toggle:hover {
          background-color: #f5f5f5;
        }
        
        .dropdown-arrow {
          font-size: 12px;
          transition: transform 0.2s ease;
          color: #666;
          margin-left: -5px;
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 300px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          margin-top: 10px;
          z-index: 1000;
          overflow: hidden;
          animation: fadeIn 0.2s ease;
        }
        
        .dropdown-header {
          padding: 16px;
          display: flex;
          align-items: center;
          background-color: #f9f9f9;
          border-bottom: 1px solid #eee;
        }
        
        .dropdown-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 12px;
          border: 2px solid #e5e8ee;
        }
        
        .dropdown-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .dropdown-user-details {
          display: flex;
          flex-direction: column;
        }
        
        .dropdown-username {
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }
        
        .dropdown-email {
          font-size: 12px;
          color: #666;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          text-align: left;
          padding: 14px 16px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s ease;
        }
        
        .dropdown-item:hover {
          background-color: #f5f5f5;
        }
        
        .dropdown-icon {
          margin-right: 10px;
          font-size: 16px;
        }
        
        .text-danger {
          color: #dc3545;
        }
        
        .dropdown-divider {
          height: 1px;
          background-color: #e6e6e6;
          margin: 0;
        }
        
        .auth-buttons {
          display: flex;
          gap: 10px;
        }
        
        .btn {
          padding: 8px 20px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-login {
          background-color: #003b6f;
          color: white;
          border: none;
        }
        
        .btn-login:hover {
          background-color: #002a50;
        }
        
        .btn-register {
          background-color: white;
          color: #003b6f;
          border: 1px solid #003b6f;
        }
        
        .btn-register:hover {
          background-color: #f5f5f5;
        }
        
        .btn-danger {
          background-color: #dc3545;
          color: white;
          border: none;
        }
        
        .btn-danger:hover {
          background-color: #c82333;
        }
        
        .btn-sm {
          padding: 8px 16px;
          font-size: 14px;
        }
      `}</style>
    </header>
  );
};

export default Header;