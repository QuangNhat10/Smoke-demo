import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ userName }) => {
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra xem người dùng đã là thành viên chưa
    const membershipStatus = localStorage.getItem('isMember') === 'true';
    setIsMember(membershipStatus);

    // Lấy vai trò người dùng
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    // Kiểm tra đăng nhập
    const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('hasMembership');
    localStorage.removeItem('membershipPlan');
    navigate('/');
  };

  const handleLogoClick = () => {
    if (userRole === 'Doctor') {
      navigate('/homepage-doctor');
    } else if (userRole === 'Member') {
      navigate('/homepage-member');
    } else if (userRole === 'Admin') {
      navigate('/dashboard-admin');
    } else if (userRole === 'Staff') {
      navigate('/dashboard-staff');
    } else {
      navigate('/');
    }
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
              <div className="user-info">
                <span className="user-greeting">Xin chào, {userName}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger btn-sm"
                >
                  Đăng Xuất
                </button>
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
          z-index: 10;
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
          gap: 15px;
        }
        
        .user-greeting {
          font-weight: 600;
          color: #333;
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