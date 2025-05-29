import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ userName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('hasMembership');
    localStorage.removeItem('membershipPlan');
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="container">
        <div className="header-content">
          <button
            onClick={() => navigate('/homepage-member')}
            className="logo-button"
          >
            <span className="logo-text">Breathing Free</span>
          </button>

          <div className="user-actions">
            <div className="user-info">
              <span className="user-greeting">Xin chào, {userName}</span>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
              >
                Đăng Xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-header {
          background-color: var(--white);
          box-shadow: 0 8px 32px 0 rgba(0,47,108,0.08);
          position: relative;
          z-index: 10;
          border-bottom: 1.5px solid var(--gray-200);
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 0 0.5rem;
        }
        
        .logo-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        
        .logo-text {
          font-size: 2.2rem;
          font-weight: 900;
          color: var(--primary-color);
          letter-spacing: 1px;
          font-family: 'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .user-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .user-greeting {
          font-weight: 600;
          color: var(--text-dark);
        }
        
        .btn-sm {
          padding: 0.4rem 1rem;
          font-size: 0.9rem;
          border-radius: var(--border-radius-sm);
        }
      `}</style>
    </header>
  );
};

export default Header; 