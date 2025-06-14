import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MainNavigation = () => {
    const navigate = useNavigate();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const role = localStorage.getItem('userRole');
        setIsLoggedIn(loggedIn);
        setUserRole(role);
    }, []);

    const handleDropdownToggle = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const requireLogin = (callback) => {
        if (!isLoggedIn) {
            if (window.location.pathname !== '/') {
                alert('Vui lòng đăng nhập để sử dụng tính năng này.');
                navigate('/login');
            } else {
                callback();
            }
        } else {
            callback();
        }
    };

    // Menu items cho từng loại người dùng
    const menuItems = {
        Guest: [
            {
                label: 'Trang Chủ',
                onClick: () => navigate('/')
            },
            {
                label: 'Giới Thiệu',
                items: [
                    { label: 'Về Chúng Tôi', onClick: () => navigate('/about') },
                    { label: 'Bảng Xếp Hạng', onClick: () => navigate('/rankings') },
                    { label: 'Blog Cộng Đồng', onClick: () => navigate('/blog') }
                ]
            },
            {
                label: 'Trợ Giúp',
                items: [
                    { label: 'Câu Hỏi Thường Gặp', onClick: () => navigate('/faq') },
                    { label: 'Liên Hệ', onClick: () => navigate('/support-chat') }
                ]
            }
        ],
        Member: [
            {
                label: 'Trang Chủ',
                onClick: () => navigate('/homepage-member')
            },
            {
                label: 'Công Cụ & Mẹo',
                items: [
                    { label: 'Theo Dõi Trạng Thái', onClick: () => navigate('/track-status') },
                    { label: 'Tạo Kế Hoạch', onClick: () => navigate('/dashboard-member') },
                    { label: 'Cách Cai Thuốc', onClick: () => navigate('/smoking-cessation') }
                ]
            },
            {
                label: 'Cộng Đồng',
                items: [
                    { label: 'Chia Sẻ Từ Chuyên Gia', onClick: () => navigate('/expert-advice') },
                    { label: 'Bảng Xếp Hạng', onClick: () => navigate('/rankings') },
                    { label: 'Blog Cộng Đồng', onClick: () => navigate('/blog') }
                ]
            },
            {
                label: 'Hỗ Trợ',
                items: [
                    { label: 'Đặt Lịch', onClick: () => requireLogin(() => navigate('/appointment')) },
                    { label: 'Bác Sĩ', onClick: () => requireLogin(() => navigate('/doctors')) },
                    { label: 'Nhắn Tin Hỗ Trợ', onClick: () => navigate('/support-chat') },
                    { label: 'Câu Hỏi Thường Gặp', onClick: () => navigate('/faq') }
                ]
            }
        ],
        Doctor: [
            {
                label: 'Trang Chủ',
                onClick: () => navigate('/homepage-doctor')
            },
            {
                label: 'Quản Lý Bệnh Nhân',
                items: [
                    { label: 'Theo Dõi Bệnh Nhân', onClick: () => navigate('/patient-monitoring') },
                    { label: 'Kế Hoạch Điều Trị', onClick: () => navigate('/patient-plans') }
                ]
            },
            {
                label: 'Lịch & Tư Vấn',
                items: [
                    { label: 'Lịch Làm Việc', onClick: () => navigate('/work-schedule') },
                    { label: 'Chat Với Bệnh Nhân', onClick: () => navigate('/patient-chat') }
                ]
            },
            {
                label: 'Cộng Đồng',
                items: [
                    { label: 'Hồ Sơ Cá Nhân', onClick: () => navigate('/profile') },
                    { label: 'Bảng Xếp Hạng', onClick: () => navigate('/rankings') },
                    { label: 'Blog Cộng Đồng', onClick: () => navigate('/blog') }
                ]
            }
        ],
        Staff: [
            {
                label: 'Trang Chủ',
                onClick: () => navigate('/dashboard-staff')
            },
            {
                label: 'Quản Lý',
                items: [
                    { label: 'Quản Lý Người Dùng', onClick: () => navigate('/user-management') },
                    { label: 'Quản Lý Blog', onClick: () => navigate('/blog-management') }
                ]
            },
            {
                label: 'Hỗ Trợ',
                items: [
                    { label: 'Hỗ Trợ Người Dùng', onClick: () => navigate('/support-chat') },
                    { label: 'FAQ', onClick: () => navigate('/faq') }
                ]
            }
        ],
        Admin: [
            {
                label: 'Trang Chủ',
                onClick: () => navigate('/admin')
            },
            {
                label: 'Quản Lý Hệ Thống',
                items: [
                    { label: 'Quản Lý Người Dùng', onClick: () => navigate('/user-management') },
                    { label: 'Quản Lý Nội Dung', onClick: () => navigate('/content-management') },
                    { label: 'Cấu Hình Hệ Thống', onClick: () => navigate('/system-settings') }
                ]
            },
            {
                label: 'Báo Cáo',
                items: [
                    { label: 'Thống Kê', onClick: () => navigate('/statistics') },
                    { label: 'Báo Cáo Hoạt Động', onClick: () => navigate('/activity-reports') }
                ]
            }
        ]
    };

    const currentMenu = isLoggedIn ? menuItems[userRole] || menuItems.Guest : menuItems.Guest;

    return (
        <nav className="main-navigation">
            <div className="container">
                <ul className="nav-list">
                    {currentMenu.map((item, index) => (
                        <li key={index} className="nav-item">
                            {item.items ? (
                                <>
                                    <button
                                        className="nav-link dropdown-toggle"
                                        onClick={() => handleDropdownToggle(index)}
                                    >
                                        {item.label} <span className="dropdown-arrow">▾</span>
                                    </button>
                                    {activeDropdown === index && (
                                        <div className="dropdown-menu">
                                            {item.items.map((subItem, subIndex) => (
                                                <button
                                                    key={subIndex}
                                                    className="dropdown-item"
                                                    onClick={subItem.onClick}
                                                >
                                                    {subItem.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    className="nav-link"
                                    onClick={item.onClick}
                                >
                                    {item.label}
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            <style jsx>{`
                .main-navigation {
                    background-color: #2C9085;
                    padding: 0;
                    width: 100%;
                    margin: 0;
                    left: 0;
                    right: 0;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
                }

                @media (max-width: 768px) {
                    .nav-list {
                        flex-direction: column;
                    }
                    
                    .dropdown-menu {
                        position: static;
                        width: 100%;
                        box-shadow: none;
                        border-radius: 0;
                    }
                    
                    .nav-link {
                        width: 100%;
                        text-align: left;
                    }
                }
            `}</style>
        </nav>
    );
};

export default MainNavigation; 