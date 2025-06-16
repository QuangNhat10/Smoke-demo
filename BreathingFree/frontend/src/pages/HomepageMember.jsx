/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import MembershipPlans from '../components/MembershipPlans';
import DashboardCard from '../components/DashboardCard';

/**
 * HomepageMember - Trang chủ cho thành viên
 * 
 * Component này hiển thị trang chính sau khi thành viên đăng nhập vào hệ thống với:
 * - Thông tin cá nhân và trạng thái thành viên
 * - Tổng quan về tiến độ cai thuốc (ngày không hút, tiền tiết kiệm, v.v.)
 * - Các hành động nhanh (theo dõi trạng thái, cập nhật kế hoạch, tìm bác sĩ)
 * - Phần trợ giúp và hỗ trợ
 * - Phần lời khuyên từ chuyên gia
 */
function HomepageMember() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(''); // Tên người dùng
    const [showMembershipModal, setShowMembershipModal] = useState(false); // Hiển thị modal gói thành viên
    const [hasMembership, setHasMembership] = useState(false); // Trạng thái đã mua gói thành viên chưa
    const [membershipPlan, setMembershipPlan] = useState(''); // Loại gói thành viên đã mua
    const [smokeFreeCount, setSmokeFreeCount] = useState(0); // Số ngày không hút thuốc
    const [cigarettesPerDay, setCigarettesPerDay] = useState(0); // Số điếu thuốc hút mỗi ngày
    const [pricePerPack, setPricePerPack] = useState(0); // Giá một gói thuốc
    const [cigarettesPerPack, setCigarettesPerPack] = useState(0); // Số điếu thuốc trong một gói

    /**
     * Lấy thông tin người dùng và trạng thái cai thuốc từ localStorage khi trang được tải
     * - Kiểm tra trạng thái đăng nhập
     * - Lấy thông tin gói thành viên
     * - Lấy thông tin thống kê về cai thuốc
     */
    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const storedUserName = localStorage.getItem('userName');

        if (storedUserName) {
            setUserName(storedUserName);
        } else {
            navigate('/login');
        }

        // Kiểm tra người dùng đã mua gói thành viên chưa
        const membership = localStorage.getItem('hasMembership') === 'true';
        const plan = localStorage.getItem('membershipPlan');
        setHasMembership(membership);
        setMembershipPlan(plan || '');

        // Lấy thông tin thống kê cai thuốc
        const count = localStorage.getItem('smokeFreeCount');
        const perDay = localStorage.getItem('cigarettesPerDay');
        const price = localStorage.getItem('pricePerPack');
        const perPack = localStorage.getItem('cigarettesPerPack');

        setSmokeFreeCount(count ? parseInt(count, 10) : 0);
        setCigarettesPerDay(perDay ? parseInt(perDay, 10) : 20);
        setPricePerPack(price ? parseInt(price, 10) : 35000);
        setCigarettesPerPack(perPack ? parseInt(perPack, 10) : 20);
    }, [navigate]);

    /**
     * Xử lý sự kiện khi người dùng muốn quản lý gói thành viên
     * - Nếu đã có gói thành viên: hiển thị modal quản lý
     * - Nếu chưa có: chuyển hướng đến trang đăng ký gói
     */
    const handleManageMembership = () => {
        if (hasMembership) {
            setShowMembershipModal(true);
        } else {
            navigate('/membership');
        }
    };

    /**
     * Tính toán số tiền tiết kiệm được từ việc không hút thuốc
     * Công thức: số ngày không hút * số điếu mỗi ngày * giá mỗi điếu
     * @returns {number} Số tiền tiết kiệm được (đơn vị: VND)
     */
    const calculateMoneySaved = () => {
        const cigaretteCost = pricePerPack / cigarettesPerPack;
        return Math.round(smokeFreeCount * cigarettesPerDay * cigaretteCost);
    };

    /**
     * Tính toán số điếu thuốc không hút được
     * Công thức: số ngày không hút * số điếu mỗi ngày
     * @returns {number} Số điếu thuốc không hút
     */
    const calculateCigarettesNotSmoked = () => {
        return smokeFreeCount * cigarettesPerDay;
    };

    /**
     * Tính toán thời gian sống thêm (ước tính)
     * Dựa trên nghiên cứu: mỗi điếu thuốc giảm 11 phút tuổi thọ
     * @returns {number} Số ngày sống thêm
     */
    const calculateTimeAdded = () => {
        // Ước tính: Mỗi điếu thuốc giảm tuổi thọ 11 phút
        const minutesSaved = calculateCigarettesNotSmoked() * 11;
        const days = Math.floor(minutesSaved / (60 * 24));
        return days;
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            padding: '0',
            margin: '0',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            <div style={{
                width: '100%',
                margin: '0',
                padding: '0'
            }}>
                <Header userName={userName} />
                <SecondaryNavigation />
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                padding: '2rem',
                boxSizing: 'border-box'
            }}>
                <section style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    marginTop: '2rem',
                    marginBottom: '2rem',
                    padding: '2.5rem 3rem',
                    borderRadius: '18px',
                    boxShadow: '0 8px 25px rgba(53, 167, 156, 0.12)',
                    backgroundImage: 'linear-gradient(to right, rgba(53, 167, 156, 0.05), rgba(53, 167, 156, 0.01))',
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '180px',
                        height: '180px',
                        background: 'radial-gradient(circle at center, rgba(53, 167, 156, 0.15), transparent 70%)',
                        borderRadius: '50%',
                        transform: 'translate(30%, -30%)',
                        zIndex: 1
                    }}></div>

                    <div style={{
                        zIndex: 2,
                        maxWidth: '650px',
                        width: '100%'
                    }}>
                        <h1 style={{
                            marginBottom: '1.2rem',
                            color: '#35a79c',
                            fontSize: '2.5rem',
                            fontWeight: '700',
                            lineHeight: '1.2'
                        }}>Xin chào, {userName}!</h1>
                        <p style={{
                            color: '#5a6a6e',
                            marginBottom: '2rem',
                            lineHeight: '1.7',
                            fontSize: '1.1rem'
                        }}>Hành trình cai thuốc lá của bạn đang tiến triển. Dưới đây là tiến độ hiện tại và thông tin thành viên của bạn.</p>

                        <div style={{
                            display: 'flex',
                            gap: '1.2rem',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={handleManageMembership}
                                style={{
                                    padding: '0.9rem 1.8rem',
                                    backgroundColor: '#35a79c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(53, 167, 156, 0.3)',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.7rem',
                                    transition: 'all 0.25s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#2c9085';
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 8px 20px rgba(53, 167, 156, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#35a79c';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(53, 167, 156, 0.3)';
                                }}
                            >
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z" fill="white" />
                                    <path d="M13 10H11V12H9V14H11V16H13V14H15V12H13V10Z" fill="white" />
                                </svg>
                                {hasMembership ? 'Quản Lý Gói Thành Viên' : 'Đăng Ký Gói Thành Viên'}
                            </button>

                            {/* Add a direct payment button for membership renewals or upgrades */}
                            {hasMembership && (
                                <button
                                    onClick={() => navigate('/payment', {
                                        state: {
                                            packageInfo: {
                                                duration: membershipPlan,
                                                price: membershipPlan === '1 Tháng' ? 600000 :
                                                    membershipPlan === '6 Tháng' ? 3000000 : 5400000,
                                                discount: membershipPlan === '6 Tháng' ? 16 :
                                                    membershipPlan === '1 Năm' ? 25 : 0
                                            }
                                        }
                                    })}
                                    style={{
                                        padding: '0.9rem 1.8rem',
                                        backgroundColor: '#3498db',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '1rem',
                                        boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.7rem',
                                        transition: 'all 0.25s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#2980b9';
                                        e.target.style.transform = 'translateY(-3px)';
                                        e.target.style.boxShadow = '0 8px 20px rgba(52, 152, 219, 0.4)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#3498db';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.3)';
                                    }}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z" fill="white" />
                                        <path d="M6 14H18V16H6V14Z" fill="white" />
                                    </svg>
                                    Thanh Toán
                                </button>
                            )}
                        </div>
                    </div>

                    <div style={{
                        width: '220px',
                        height: '220px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2,
                        marginLeft: '20px',
                        flexShrink: 0
                    }}>
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/2947/2947903.png"
                            alt="Breathing Free"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                opacity: 0.9,
                                filter: 'drop-shadow(0 8px 15px rgba(53, 167, 156, 0.2))'
                            }}
                        />
                    </div>
                </section>

                {hasMembership && (
                    <section style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        marginBottom: '2rem',
                        padding: '2rem 3rem',
                        borderRadius: '18px',
                        borderLeft: '4px solid #35a79c',
                        boxShadow: '0 8px 25px rgba(53, 167, 156, 0.12)',
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundImage: 'linear-gradient(to right, rgba(53, 167, 156, 0.02), rgba(53, 167, 156, 0))'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem'
                        }}>
                            <div style={{
                                backgroundColor: '#35a79c15',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19Z" fill="#35a79c" />
                                    <path d="M13 10H11V12H9V14H11V16H13V14H15V12H13V10Z" fill="#35a79c" />
                                </svg>
                            </div>
                            <div>
                                <span style={{
                                    fontWeight: '600',
                                    color: '#2c3e50',
                                    fontSize: '1.1rem'
                                }}>Gói Thành Viên Hiện Tại:</span>
                                <span style={{
                                    backgroundColor: '#35a79c',
                                    color: 'white',
                                    fontWeight: '700',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '50px',
                                    fontSize: '0.95rem',
                                    marginLeft: '0.8rem'
                                }}>{membershipPlan}</span>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleManageMembership}
                                style={{
                                    padding: '0.7rem 1.2rem',
                                    backgroundColor: 'transparent',
                                    color: '#35a79c',
                                    border: '1.5px solid #35a79c',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#f0f7f5';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = 'transparent';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                Quản Lý Gói
                            </button>

                            <button
                                onClick={() => navigate('/payment', {
                                    state: {
                                        packageInfo: {
                                            duration: membershipPlan,
                                            price: membershipPlan === '1 Tháng' ? 600000 :
                                                membershipPlan === '6 Tháng' ? 3000000 : 5400000,
                                            discount: membershipPlan === '6 Tháng' ? 16 :
                                                membershipPlan === '1 Năm' ? 25 : 0
                                        }
                                    }
                                })}
                                style={{
                                    padding: '0.7rem 1.2rem',
                                    backgroundColor: '#3498db',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    boxShadow: '0 4px 10px rgba(52, 152, 219, 0.2)',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#2980b9';
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 6px 15px rgba(52, 152, 219, 0.3)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#3498db';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 10px rgba(52, 152, 219, 0.2)';
                                }}
                            >
                                Thanh Toán
                            </button>
                        </div>
                    </section>
                )}

                <section style={{
                    marginBottom: '2.5rem'
                }}>
                    <h2 style={{
                        fontWeight: '600',
                        marginBottom: '1.2rem',
                        color: '#35a79c',
                        fontSize: '1.6rem'
                    }}>Tiến Độ Của Bạn</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        <DashboardCard
                            title="Ngày Không Hút Thuốc"
                            value={smokeFreeCount}
                            description="Cố gắng lên! Mỗi ngày đều quan trọng."
                            icon="🎯"
                            color="#44b89d"
                        />
                        <DashboardCard
                            title="Tiền Tiết Kiệm Được"
                            value={`${calculateMoneySaved().toLocaleString()} VND`}
                            description="Tiết kiệm từ việc không mua thuốc lá"
                            icon="💰"
                            color="#0057b8"
                        />
                        <DashboardCard
                            title="Điếu Thuốc Không Hút"
                            value={calculateCigarettesNotSmoked()}
                            description="Đó là rất nhiều hóa chất độc hại đã tránh được!"
                            icon="🚭"
                            color="#ff9800"
                        />
                        <DashboardCard
                            title="Thời Gian Sống Thêm"
                            value={`${calculateTimeAdded()} ngày`}
                            description="Thời gian ước tính thêm vào cuộc sống của bạn"
                            icon="⏱️"
                            color="#e74c3c"
                        />
                    </div>
                </section>

                <section style={{
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontWeight: '600',
                        marginBottom: '1.2rem',
                        color: '#35a79c',
                        fontSize: '1.6rem'
                    }}>Hành Động Nhanh</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        <div onClick={() => navigate('/track-status')} style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '1.8rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(53, 167, 156, 0.05)'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.05)';
                            }}>
                            <div style={{
                                backgroundColor: '#44b89d20',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0
                            }}>📊</div>
                            <div>
                                <h3 style={{
                                    margin: '0 0 0.7rem 0',
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1.3rem'
                                }}>Theo Dõi Trạng Thái</h3>
                                <p style={{
                                    margin: '0',
                                    color: '#7f8c8d',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem'
                                }}>Xem thông tin chi tiết về hành trình cai thuốc và trò chuyện với bác sĩ của bạn.</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/dashboard-member')} style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '1.8rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(53, 167, 156, 0.05)'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.05)';
                            }}>
                            <div style={{
                                backgroundColor: '#0057b820',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0
                            }}>📝</div>
                            <div>
                                <h3 style={{
                                    margin: '0 0 0.7rem 0',
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1.3rem'
                                }}>Tạo Hoặc Cập Nhật Kế Hoạch</h3>
                                <p style={{
                                    margin: '0',
                                    color: '#7f8c8d',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem'
                                }}>Thiết lập kế hoạch cai thuốc cá nhân hoặc cập nhật kế hoạch hiện tại của bạn.</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/doctors')} style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '1.8rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(53, 167, 156, 0.05)'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.05)';
                            }}>
                            <div style={{
                                backgroundColor: '#e74c3c20',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0
                            }}>👨‍⚕️</div>
                            <div>
                                <h3 style={{
                                    margin: '0 0 0.7rem 0',
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1.3rem'
                                }}>Tìm Bác Sĩ</h3>
                                <p style={{
                                    margin: '0',
                                    color: '#7f8c8d',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem'
                                }}>Kết nối với các bác sĩ chuyên khoa để được hỗ trợ cho hành trình của bạn.</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/expert-advice')} style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '1.8rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(53, 167, 156, 0.05)'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.05)';
                            }}>
                            <div style={{
                                backgroundColor: '#9c27b020',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0
                            }}>📚</div>
                            <div>
                                <h3 style={{
                                    margin: '0 0 0.7rem 0',
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1.3rem'
                                }}>Lời Khuyên Từ Chuyên Gia</h3>
                                <p style={{
                                    margin: '0',
                                    color: '#7f8c8d',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem'
                                }}>Đọc những lời khuyên và kinh nghiệm quý báu từ các chuyên gia về cai thuốc lá.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Help & Support Section */}
                <section style={{
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontWeight: '600',
                        marginBottom: '1.2rem',
                        color: '#35a79c',
                        fontSize: '1.6rem'
                    }}>Trợ Giúp & Hỗ trợ</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        <div onClick={() => navigate('/support-chat')} style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '1.8rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(53, 167, 156, 0.05)'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.05)';
                            }}>
                            <div style={{
                                backgroundColor: '#0057b820',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0
                            }}>💬</div>
                            <div>
                                <h3 style={{
                                    margin: '0 0 0.7rem 0',
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1.3rem'
                                }}>Chat Hỗ Trợ</h3>
                                <p style={{
                                    margin: '0',
                                    color: '#7f8c8d',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem'
                                }}>Nhận hỗ trợ trực tuyến từ nhân viên và bác sĩ của chúng tôi.</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/faq')} style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '1.8rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(53, 167, 156, 0.05)'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.05)';
                            }}>
                            <div style={{
                                backgroundColor: '#9c27b020',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0
                            }}>❓</div>
                            <div>
                                <h3 style={{
                                    margin: '0 0 0.7rem 0',
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1.3rem'
                                }}>Câu Hỏi Thường Gặp</h3>
                                <p style={{
                                    margin: '0',
                                    color: '#7f8c8d',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem'
                                }}>Tìm câu trả lời cho những câu hỏi phổ biến về cai thuốc lá.</p>
                            </div>
                        </div>
                        <div onClick={() => navigate('/contact')} style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '1.8rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.2rem',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(53, 167, 156, 0.05)'
                        }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
                                e.currentTarget.style.borderColor = 'rgba(53, 167, 156, 0.05)';
                            }}>
                            <div style={{
                                backgroundColor: '#e74c3c20',
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                flexShrink: 0
                            }}>📞</div>
                            <div>
                                <h3 style={{
                                    margin: '0 0 0.7rem 0',
                                    color: '#2c3e50',
                                    fontWeight: '600',
                                    fontSize: '1.3rem'
                                }}>Liên Hệ</h3>
                                <p style={{
                                    margin: '0',
                                    color: '#7f8c8d',
                                    lineHeight: '1.5',
                                    fontSize: '0.95rem'
                                }}>Liên hệ với chúng tôi qua email hoặc điện thoại.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Expert Advice Section */}
                <section style={{
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        fontWeight: '600',
                        marginBottom: '1.2rem',
                        color: '#35a79c',
                        fontSize: '1.6rem'
                    }}>Lời Khuyên Từ Chuyên Gia</h2>

                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        padding: '2rem',
                        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                        marginBottom: '1.5rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '1.5rem',
                        }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                background: '#44b89d22',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                flexShrink: 0
                            }}>
                                👨‍⚕️
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '0.5rem'
                                }}>
                                    <div>
                                        <h3 style={{
                                            fontSize: '1.3rem',
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            margin: '0 0 0.3rem 0'
                                        }}>
                                            BS. Nguyễn Đức Quảng
                                        </h3>
                                        <p style={{
                                            color: '#44b89d',
                                            fontSize: '0.9rem',
                                            margin: '0'
                                        }}>
                                            Phó Giám đốc Bệnh viện Phổi Hà Tĩnh
                                        </p>
                                    </div>
                                    <span style={{
                                        fontSize: '0.9rem',
                                        color: '#7f8c8d'
                                    }}>
                                        15/06/2023
                                    </span>
                                </div>

                                <h4 style={{
                                    color: '#44b89d',
                                    fontSize: '1.3rem',
                                    fontWeight: '600',
                                    margin: '1rem 0 0.8rem 0'
                                }}>
                                    Giải pháp hỗ trợ khi gặp cơn thèm thuốc lá
                                </h4>

                                <p style={{
                                    color: '#2c3e50',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    margin: '0 0 1.5rem 0'
                                }}>
                                    Khi bạn gặp cơn thèm thuốc lá, điều quan trọng là phân tán sự chú ý của bạn. Hãy thử phương pháp 4D: Delay (Trì hoãn) - hãy đợi 5-10 phút, cơn thèm thuốc sẽ qua đi; Deep breathing (Hít thở sâu) - hít thở sâu và chậm; Drink water (Uống nước) - uống từng ngụm nhỏ nước; Distract (Chuyển hướng) - làm việc gì đó để phân tán sự chú ý...
                                </p>

                                <button
                                    onClick={() => navigate('/expert-advice')}
                                    style={{
                                        backgroundColor: '#44b89d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.8rem 1.5rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 10px rgba(68, 184, 157, 0.3)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.backgroundColor = '#399b8d';
                                        e.target.style.transform = 'translateY(-2px)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.backgroundColor = '#44b89d';
                                        e.target.style.transform = 'translateY(0)';
                                    }}
                                >
                                    Đọc Tiếp
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={() => navigate('/expert-advice')}
                            style={{
                                backgroundColor: 'white',
                                color: '#35a79c',
                                border: '2px solid #35a79c',
                                borderRadius: '10px',
                                padding: '0.8rem 2rem',
                                fontWeight: '700',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f0f7f5';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = 'white';
                            }}
                        >
                            Xem Tất Cả Lời Khuyên
                        </button>
                    </div>
                </section>
            </div>

            {/* Membership Modal */}
            {showMembershipModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        padding: '2rem',
                        maxWidth: '900px',
                        width: '90%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
                    }}>
                        <MembershipPlans onClose={() => setShowMembershipModal(false)} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default HomepageMember; 