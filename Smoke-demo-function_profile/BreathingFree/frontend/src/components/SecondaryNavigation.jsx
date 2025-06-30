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

    // Styles
    const styles = {
        secondaryNavigation: {
            backgroundColor: '#2C9085',
            padding: 0,
            width: '100%',
            margin: 0,
            left: 0,
            right: 0,
        },
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px',
        },
        navList: {
            display: 'flex',
            listStyle: 'none',
            padding: 0,
            margin: 0,
        },
        navItem: {
            position: 'relative',
        },
        navLink: {
            display: 'block',
            padding: '1rem 1.5rem',
            color: 'white',
            fontWeight: 500,
            textDecoration: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        navLinkHover: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
        },
        blogMenuItem: {
            color: 'white',
            fontWeight: 500,
        },
        dropdownToggle: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        dropdownArrow: {
            fontSize: '0.8rem',
            transition: 'transform 0.3s ease',
        },
        dropdownMenu: {
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            minWidth: '220px',
            zIndex: 1000,
            padding: '0.5rem 0',
            animation: 'fadeIn 0.2s ease-out',
        },
        dropdownItem: {
            display: 'block',
            width: '100%',
            padding: '0.75rem 1.5rem',
            clear: 'both',
            fontWeight: 500,
            color: '#2C9085',
            textAlign: 'left',
            backgroundColor: 'transparent',
            border: 0,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        dropdownItemHover: {
            backgroundColor: '#f0f9f8',
            color: '#2C9085',
        }
    };

    return (
        <nav style={styles.secondaryNavigation}>
            <div style={styles.container}>
                <ul style={styles.navList}>
                    {/* Các mục điều hướng chính */}
                    <li style={styles.navItem}>
                        <button
                            style={styles.navLink}
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
                    <li style={styles.navItem}>
                        <button
                            style={{...styles.navLink, ...styles.dropdownToggle}}
                            onClick={() => handleDropdownToggle('tools')}
                        >
                            Công Cụ & Mẹo <span style={styles.dropdownArrow}>▾</span>
                        </button>
                        {activeDropdown === 'tools' && (
                            <div style={styles.dropdownMenu}>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => navigate('/track-status')}
                                >
                                    Theo Dõi Trạng Thái
                                </button>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => navigate('/dashboard-member')}
                                >
                                    Tạo Kế Hoạch
                                </button>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => navigate('/smoking-cessation')}
                                >
                                    Cách Cai Thuốc
                                </button>
                            </div>
                        )}
                    </li>

                    {/* Dropdown Về Chúng Tôi */}
                    <li style={styles.navItem}>
                        <button
                            style={{...styles.navLink, ...styles.dropdownToggle}}
                            onClick={() => handleDropdownToggle('about')}
                        >
                            Về Chúng Tôi <span style={styles.dropdownArrow}>▾</span>
                        </button>
                        {activeDropdown === 'about' && (
                            <div style={styles.dropdownMenu}>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => navigate('/expert-advice')}
                                >
                                    Chia Sẻ Từ Chuyên Gia
                                </button>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => navigate('/rankings')}
                                >
                                    Bảng Xếp Hạng
                                </button>
                                <button
                                    style={{...styles.dropdownItem, ...styles.blogMenuItem}}
                                    onClick={() => navigate('/blog')}
                                >
                                    Blog Cộng Đồng
                                </button>
                            </div>
                        )}
                    </li>

                    {/* Dropdown Trợ Giúp & Hỗ Trợ */}
                    <li style={styles.navItem}>
                        <button
                            style={{...styles.navLink, ...styles.dropdownToggle}}
                            onClick={() => handleDropdownToggle('help')}
                        >
                            Trợ Giúp & Hỗ Trợ <span style={styles.dropdownArrow}>▾</span>
                        </button>
                        {activeDropdown === 'help' && (
                            <div style={styles.dropdownMenu}>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => requireLogin(() => navigate('/appointment'))}
                                >
                                    Đặt Lịch
                                </button>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => requireLogin(() => navigate('/doctors'))}
                                >
                                    Bác Sĩ
                                </button>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => navigate('/support-chat')}
                                >
                                    Nhắn Tin Hỗ Trợ
                                </button>
                                <button
                                    style={styles.dropdownItem}
                                    onClick={() => navigate('/faq')}
                                >
                                    Câu Hỏi Thường Gặp
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </div>
            
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                `}
            </style>
        </nav>
    );
};

export default SecondaryNavigation; 