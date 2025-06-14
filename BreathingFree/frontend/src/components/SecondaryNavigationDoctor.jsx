import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Component SecondaryNavigationDoctor dùng để hiển thị thanh điều hướng phụ cho bác sĩ
const SecondaryNavigationDoctor = () => {
    const navigate = useNavigate();
    // Trạng thái xác định dropdown nào đang được mở
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Hàm xử lý khi người dùng nhấn vào một dropdown
    const handleDropdownToggle = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    return (
        <nav className="secondary-navigation">
            <div className="container">
                <ul className="nav-list">
                    {/* Các mục điều hướng chính */}
                    <li className="nav-item">
                        <button
                            className="nav-link"
                            onClick={() => navigate('/homepage-doctor')}
                        >
                            Trang Chủ
                        </button>
                    </li>

                    {/* Dropdown Công Cụ & Mẹo */}
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

                    {/* Dropdown Về Chúng Tôi */}
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
                                    onClick={() => navigate('/profile')}
                                >
                                    Hồ Sơ Cá Nhân
                                </button>
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

                    {/* Dropdown Trợ Giúp & Hỗ Trợ */}
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
          background-color: #2C9085;
          padding: 0;
          width: 100%;
          margin: 0;
          left: 0;
          right: 0;
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
          color: white;
          font-weight: 500;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .blog-menu-item {
          color: white;
          font-weight: 500;
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
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-width: 220px;
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
          color: #2C9085;
          text-align: left;
          background-color: transparent;
          border: 0;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .dropdown-item:hover {
          background-color: #f0f9f8;
          color: #2C9085;
        }
      `}</style>
        </nav>
    );
};

export default SecondaryNavigationDoctor; 