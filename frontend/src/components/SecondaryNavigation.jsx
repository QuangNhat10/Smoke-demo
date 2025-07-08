import React from 'react';
import { useNavigate } from 'react-router-dom';

// Component SecondaryNavigation dùng để hiển thị thanh điều hướng phụ cho người dùng thường
const SecondaryNavigation = () => {
  const navigate = useNavigate();

  // Hàm kiểm tra đăng nhập
  const requireLogin = (callback) => {
    const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!userLoggedIn) {
      alert('Vui lòng đăng nhập để sử dụng tính năng này.');
      navigate('/login');
    } else {
      callback();
    }
  };

  return (
    <nav className="secondary-navigation">
      <div className="container">
        <ul className="nav-list">
          {/* Trang chủ */}
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => {
                const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
                if (isLoggedIn) {
                  navigate('/homepage-member');
                } else {
                  navigate('/');
                }
              }}
            >
              Trang Chủ
            </button>
          </li>

          {/* Tạo kế hoạch */}
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => requireLogin(() => navigate('/create-plan'))}
            >
              Tạo Kế Hoạch
            </button>
          </li>

          {/* Theo dõi trạng thái */}
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => requireLogin(() => navigate('/track-status'))}
            >
              Theo Dõi Trạng Thái
            </button>
          </li>

          {/* Blog */}
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => navigate('/blog')}
            >
              Blog
            </button>
          </li>

          {/* Nhắn tin hỗ trợ */}
          <li className="nav-item">
            <button
              className="nav-link"
              onClick={() => requireLogin(() => navigate('/support-chat'))}
            >
              Nhắn Tin Hỗ Trợ
            </button>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .secondary-navigation {
          background-color: #2C9085;
          padding: 0;
          width: 100%;
          margin: 0;
          left: 0;
          right: 0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .nav-list {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
          justify-content: flex-start;
          gap: 1rem;
        }
        
        .nav-item {
          flex: none;
          text-align: left;
        }
        
        .nav-link {
          display: block;
          padding: 1rem 1.5rem;
          color: white;
          font-weight: 500;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          border-radius: 8px;
          margin: 0.25rem 0;
          white-space: nowrap;
        }
        
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.15);
          color: white;
          transform: translateY(-1px);
        }
        
        .nav-link:active {
          transform: translateY(0);
        }
        
                 /* Responsive design */
         @media (max-width: 768px) {
           .nav-list {
             flex-wrap: wrap;
             gap: 0.5rem;
           }
           
           .nav-item {
             flex: none;
             min-width: auto;
           }
           
           .nav-link {
             padding: 0.75rem 1rem;
             font-size: 0.9rem;
           }
         }
         
         @media (max-width: 480px) {
           .nav-list {
             flex-direction: column;
             gap: 0;
           }
           
           .nav-item {
             flex: none;
           }
           
           .nav-link {
             padding: 0.75rem 1rem;
             margin: 0;
             border-radius: 0;
           }
         }
      `}</style>
    </nav>
  );
};

export default SecondaryNavigation; 