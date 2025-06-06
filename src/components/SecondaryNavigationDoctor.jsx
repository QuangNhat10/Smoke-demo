import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SecondaryNavigationDoctor = () => {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);

    const handleDropdownToggle = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    return (
        <nav className="secondary-navigation">
            <div className="container">
                <ul className="nav-list">
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            onClick={() => navigate('/homepage-doctor')}
                        >
                            Trang Chủ
                        </button>
                    </li>

                    <li className="nav-item dropdown">
                        <button
                            className="nav-link dropdown-toggle"
                            onClick={() => handleDropdownToggle('tools')}
                        >
                            Công Cụ & Mẹo <span className="dropdown-arrow">▾</span>
                        </button>
                        {activeDropdown === 'tools' && (
                            <div className="dropdown-menu">
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/patient-monitoring')}
                                >
                                    Theo Dõi Bệnh Nhân
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/patient-plans')}
                                >
                                    Xem Kế Hoạch Bệnh Nhân
                                </button>
                            </div>
                        )}
                    </li>

                    <li className="nav-item dropdown">
                        <button
                            className="nav-link dropdown-toggle"
                            onClick={() => handleDropdownToggle('about')}
                        >
                            Về Chúng Tôi <span className="dropdown-arrow">▾</span>
                        </button>
                        {activeDropdown === 'about' && (
                            <div className="dropdown-menu">
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/rankings')}
                                >
                                    Bảng Xếp Hạng
                                </button>
                                <button
                                    className="dropdown-item blog-menu-item"
                                    onClick={() => navigate('/blog')}
                                >
                                    Blog Cộng Đồng
                                </button>
                            </div>
                        )}
                    </li>

                    <li className="nav-item dropdown">
                        <button
                            className="nav-link dropdown-toggle"
                            onClick={() => handleDropdownToggle('help')}
                        >
                            Trợ Giúp & Hỗ Trợ <span className="dropdown-arrow">▾</span>
                        </button>
                        {activeDropdown === 'help' && (
                            <div className="dropdown-menu">
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/work-schedule')}
                                >
                                    Thông Tin Lịch Làm Việc
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/patient-chat')}
                                >
                                    Nhắn Tin Với Bệnh Nhân
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </div>

            <style jsx>{`
        .secondary-navigation {
          background-color: var(--white);
          border-bottom: 2px solid var(--gray-200);
          padding: 0;
        }
        
        .nav-list {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .nav-item {
          position: relative;
        }
        
        .nav-link {
          display: block;
          padding: 1rem 1.5rem;
          color: var(--text-dark);
          font-weight: 600;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .nav-link:hover {
          color: var(--secondary-color);
        }
        
        .blog-menu-item {
          color: #3498db;
          font-weight: 600;
        }
        
        .dropdown-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .dropdown-arrow {
          font-size: 0.8rem;
          transition: transform 0.3s ease;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          min-width: 200px;
          z-index: 1000;
          padding: 0.5rem 0;
          animation: fadeIn 0.2s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.75rem 1.5rem;
          clear: both;
          font-weight: 500;
          color: var(--text-dark);
          text-align: left;
          background-color: transparent;
          border: 0;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .dropdown-item:hover {
          background-color: var(--gray-100);
          color: var(--secondary-color);
        }
      `}</style>
        </nav>
    );
};

export default SecondaryNavigationDoctor; 