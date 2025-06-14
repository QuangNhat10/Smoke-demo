/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

// Dữ liệu giả về người dùng Member (chỉ dùng nếu không có dữ liệu trong localStorage)
const fakeMemberData = {
    name: 'John Smith',
    gender: 'Nam',
    age: 35,
    dateOfBirth: '1990-05-15',
    smokingDuration: '15 năm',
    email: 'john.smith@example.com',
    phone: '0912345678',
    address: 'Hà Nội, Việt Nam'
};

/**
 * TrackStatus - Trang theo dõi trạng thái cai thuốc
 * 
 * Component này hiển thị thông tin chi tiết về tiến trình cai thuốc của thành viên:
 * - Thông tin cá nhân và lịch sử hút thuốc
 * - Tiến độ và thành tựu đạt được
 * - Lịch sử trò chuyện với bác sĩ tư vấn
 */
const TrackStatus = () => {
    const navigate = useNavigate();
    const [memberInfo, setMemberInfo] = useState({
        name: '',
        gender: '',
        age: 0,
        dateOfBirth: '',
        smokingDuration: '',
        consultingDoctor: '',
        quittingDuration: '',
        achievement: '',
        chatMessages: [],
        email: '',
        phone: '',
        address: ''
    });
    const [newMessage, setNewMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'chat', 'achievements'

    useEffect(() => {
        // Check if user is logged in
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        if (!userLoggedIn) {
            navigate('/login');
            return;
        }

        const storedUserName = localStorage.getItem('userName') || fakeMemberData.name;
        setUserName(storedUserName);

        // Lấy dữ liệu từ localStorage
        const userAge = calculateAge(localStorage.getItem('dateOfBirth') || fakeMemberData.dateOfBirth);
        const smokeFreeCount = localStorage.getItem('smokeFreeCount') || 0;

        // Tạo đối tượng thông tin thành viên
        const memberData = {
            name: storedUserName,
            gender: localStorage.getItem('gender') || fakeMemberData.gender,
            age: userAge,
            dateOfBirth: localStorage.getItem('dateOfBirth') || fakeMemberData.dateOfBirth,
            smokingDuration: localStorage.getItem('smokingHistory') || fakeMemberData.smokingDuration,
            email: localStorage.getItem('userEmail') || fakeMemberData.email,
            phone: localStorage.getItem('phone') || fakeMemberData.phone,
            address: localStorage.getItem('address') || fakeMemberData.address,
            consultingDoctor: 'Dr. Smith',
            quittingDuration: `${smokeFreeCount} ngày`,
            achievement: determineAchievement(smokeFreeCount),
            chatMessages: [
                { id: 1, sender: 'Dr. Smith', message: 'Bạn cảm thấy thế nào hôm nay?', time: '10:30 AM', date: '2023-06-10' },
                { id: 2, sender: 'You', message: 'Tôi cảm thấy tuyệt vời! Không thèm thuốc lá chút nào.', time: '10:45 AM', date: '2023-06-10' },
                { id: 3, sender: 'Dr. Smith', message: 'Tuyệt vời! Hãy tiếp tục nhé!', time: '11:00 AM', date: '2023-06-10' },
                { id: 4, sender: 'Dr. Smith', message: 'Bạn có trải qua các triệu chứng cai nghiện trong tuần này không?', time: '09:15 AM', date: '2023-06-12' },
                { id: 5, sender: 'You', message: 'Chỉ có một chút đau đầu hôm qua, nhưng nó nhanh chóng qua đi.', time: '09:30 AM', date: '2023-06-12' },
                { id: 6, sender: 'Dr. Smith', message: 'Điều đó bình thường. Hãy đảm bảo uống đủ nước và nghỉ ngơi đầy đủ. Chúng ta sẽ thảo luận thêm các chiến lược trong phiên tới.', time: '09:45 AM', date: '2023-06-12' }
            ]
        };

        setMemberInfo(memberData);
    }, [navigate]);

    // Hàm tính tuổi từ ngày sinh
    const calculateAge = (birthDate) => {
        if (!birthDate) return 30;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const determineAchievement = (days) => {
        if (days >= 30) return 'Cột mốc một tháng';
        if (days >= 14) return 'Quán quân hai tuần';
        if (days >= 7) return 'Chiến binh một tuần';
        if (days >= 3) return 'Bước đầu tiên';
        return 'Mới bắt đầu';
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateString = now.toISOString().split('T')[0];

        const newChatMessage = {
            id: memberInfo.chatMessages.length + 1,
            sender: 'You',
            message: newMessage,
            time: timeString,
            date: dateString
        };

        setMemberInfo(prev => ({
            ...prev,
            chatMessages: [...prev.chatMessages, newChatMessage]
        }));

        setNewMessage('');
    };

    // Group chat messages by date
    const groupedChatMessages = memberInfo.chatMessages.reduce((groups, message) => {
        const date = message.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif'
        }}>
            <Header userName={userName} />
            <SecondaryNavigation />

            <div style={{
                maxWidth: '1200px',
                margin: '2rem auto',
                padding: '0 2rem'
            }}>
                {/* Header Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2rem',
                    marginBottom: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: '#35a79c22',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem'
                    }}>
                        👤
                    </div>
                    <div style={{ flex: 1 }}>
                        <h1 style={{
                            margin: '0 0 0.5rem 0',
                            color: '#2c3e50',
                            fontSize: '2rem'
                        }}>
                            {memberInfo.name}
                        </h1>
                        <div style={{
                            display: 'flex',
                            gap: '2rem',
                            color: '#7f8c8d'
                        }}>
                            <span>🎯 {memberInfo.quittingDuration} không hút thuốc</span>
                            <span>🏆 {memberInfo.achievement}</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <button
                        onClick={() => setActiveTab('overview')}
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'overview' ? '#35a79c' : 'white',
                            color: activeTab === 'overview' ? 'white' : '#2c3e50',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Tổng Quan
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'chat' ? '#35a79c' : 'white',
                            color: activeTab === 'chat' ? 'white' : '#2c3e50',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Trò Chuyện
                    </button>
                    <button
                        onClick={() => setActiveTab('achievements')}
                        style={{
                            padding: '1rem 2rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: activeTab === 'achievements' ? '#35a79c' : 'white',
                            color: activeTab === 'achievements' ? 'white' : '#2c3e50',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Thành Tựu
                    </button>
                </div>

                {/* Content Area */}
                <div style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
                }}>
                    {activeTab === 'overview' && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem'
                        }}>
                            {/* Personal Information */}
                            <div className="info-card" style={{
                                background: '#f8fafb',
                                borderRadius: '15px',
                                padding: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#35a79c',
                                    marginBottom: '1rem',
                                    fontSize: '1.2rem'
                                }}>Thông Tin Cá Nhân</h3>
                                <div style={{
                                    display: 'grid',
                                    gap: '1rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#7f8c8d' }}>Giới tính</span>
                                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{memberInfo.gender}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#7f8c8d' }}>Tuổi</span>
                                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{memberInfo.age}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#7f8c8d' }}>Email</span>
                                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{memberInfo.email}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#7f8c8d' }}>Điện thoại</span>
                                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{memberInfo.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Smoking History */}
                            <div className="info-card" style={{
                                background: '#f8fafb',
                                borderRadius: '15px',
                                padding: '1.5rem'
                            }}>
                                <h3 style={{
                                    color: '#35a79c',
                                    marginBottom: '1rem',
                                    fontSize: '1.2rem'
                                }}>Lịch Sử Hút Thuốc</h3>
                                <div style={{
                                    display: 'grid',
                                    gap: '1rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#7f8c8d' }}>Thời gian hút thuốc</span>
                                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{memberInfo.smokingDuration}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#7f8c8d' }}>Thời gian cai thuốc</span>
                                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{memberInfo.quittingDuration}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#7f8c8d' }}>Thành tựu hiện tại</span>
                                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{memberInfo.achievement}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#7f8c8d' }}>Bác sĩ tư vấn</span>
                                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{memberInfo.consultingDoctor}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <div style={{ maxHeight: '600px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            {/* Chat Messages */}
                            <div style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '1rem',
                                marginBottom: '1rem'
                            }}>
                                {Object.entries(groupedChatMessages).map(([date, messages]) => (
                                    <div key={date} style={{ marginBottom: '2rem' }}>
                                        <div style={{
                                            textAlign: 'center',
                                            margin: '1rem 0',
                                            position: 'relative'
                                        }}>
                                            <span style={{
                                                background: '#f0f2f5',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '15px',
                                                fontSize: '0.9rem',
                                                color: '#7f8c8d'
                                            }}>
                                                {new Date(date).toLocaleDateString('vi-VN', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        {messages.map((message) => (
                                            <div
                                                key={message.id}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: message.sender === 'You' ? 'flex-end' : 'flex-start',
                                                    marginBottom: '1rem'
                                                }}
                                            >
                                                <div style={{
                                                    maxWidth: '70%',
                                                    background: message.sender === 'You' ? '#35a79c' : '#f0f2f5',
                                                    color: message.sender === 'You' ? 'white' : '#2c3e50',
                                                    padding: '1rem',
                                                    borderRadius: '15px',
                                                    position: 'relative'
                                                }}>
                                                    <div style={{
                                                        fontSize: '0.9rem',
                                                        marginBottom: '0.3rem',
                                                        color: message.sender === 'You' ? '#e0f7fa' : '#7f8c8d'
                                                    }}>
                                                        {message.sender === 'You' ? 'Bạn' : message.sender}
                                                    </div>
                                                    <div style={{ lineHeight: '1.5' }}>
                                                        {message.message}
                                                    </div>
                                                    <div style={{
                                                        fontSize: '0.8rem',
                                                        marginTop: '0.5rem',
                                                        color: message.sender === 'You' ? '#e0f7fa' : '#95a5a6'
                                                    }}>
                                                        {message.time}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1rem',
                                borderTop: '1px solid #eee'
                            }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Nhập tin nhắn..."
                                    style={{
                                        flex: 1,
                                        padding: '1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #e0e0e0',
                                        outline: 'none',
                                        fontSize: '1rem'
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        padding: '1rem 2rem',
                                        background: '#35a79c',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontWeight: '600'
                                    }}
                                >
                                    Gửi
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'achievements' && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '2rem'
                        }}>
                            <div className="achievement-card" style={{
                                background: '#f8fafb',
                                borderRadius: '15px',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: '#35a79c22',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    margin: '0 auto 1rem'
                                }}>
                                    🌟
                                </div>
                                <h3 style={{ color: '#35a79c', marginBottom: '0.5rem' }}>
                                    {memberInfo.achievement}
                                </h3>
                                <p style={{ color: '#7f8c8d' }}>
                                    {memberInfo.quittingDuration} không hút thuốc
                                </p>
                            </div>

                            <div className="achievement-card" style={{
                                background: '#f8fafb',
                                borderRadius: '15px',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: '#e74c3c22',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    margin: '0 auto 1rem'
                                }}>
                                    💪
                                </div>
                                <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>
                                    Quyết Tâm
                                </h3>
                                <p style={{ color: '#7f8c8d' }}>
                                    Kiên trì với mục tiêu cai thuốc
                                </p>
                            </div>

                            <div className="achievement-card" style={{
                                background: '#f8fafb',
                                borderRadius: '15px',
                                padding: '1.5rem',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: '#3498db22',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    margin: '0 auto 1rem'
                                }}>
                                    🎯
                                </div>
                                <h3 style={{ color: '#3498db', marginBottom: '0.5rem' }}>
                                    Mục Tiêu Tiếp Theo
                                </h3>
                                <p style={{ color: '#7f8c8d' }}>
                                    30 ngày không hút thuốc
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackStatus; 