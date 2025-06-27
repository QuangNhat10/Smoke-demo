import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Component SecondaryNavigation dùng để hiển thị thanh điều hướng phụ cho người dùng thường
const SecondaryNavigation = () => {
    const navigate = useNavigate();
    // Trạng thái xác định dropdown nào đang được mở
    const [activeDropdown, setActiveDropdown] = useState(null);

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
                                    onClick={() => navigate('/track-status')}
                                >
                                    Theo Dõi Trạng Thái
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/dashboard-member')}
                                >
                                    Tạo Kế Hoạch
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/smoking-cessation')}
                                >
                                    Cách Cai Thuốc
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
                                    onClick={() => navigate('/expert-advice')}
                                >
                                    Chia Sẻ Từ Chuyên Gia
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
                                    onClick={() => requireLogin(() => navigate('/appointment'))}
                                >
                                    Đặt Lịch
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => requireLogin(() => navigate('/doctors'))}
                                >
                                    Bác Sĩ
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/support-chat')}
                                >
                                    Nhắn Tin Hỗ Trợ
                                </button>
                                <button
                                    className="dropdown-item"
                                    onClick={() => navigate('/faq')}
                                >
                                    Câu Hỏi Thường Gặp
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

export default SecondaryNavigation; 