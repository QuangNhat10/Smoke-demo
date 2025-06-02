/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

const TrackStatus = () => {
    const navigate = useNavigate();
    const [memberInfo, setMemberInfo] = useState({
        name: '',
        gender: '',
        age: 0,
        smokingDuration: '',
        consultingDoctor: '',
        quittingDuration: '',
        achievement: '',
        chatMessages: []
    });
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Check if user is logged in
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        if (!userLoggedIn) {
            navigate('/login');
            return;
        }

        // In a real application, this would fetch data from an API
        // For demo purposes, we'll use localStorage or mock data
        const userName = localStorage.getItem('userName') || 'John Doe';
        const smokeFreeCount = localStorage.getItem('smokeFreeCount') || 0;

        // Mock data for demonstration
        setMemberInfo({
            name: userName,
            gender: 'Male',
            age: 35,
            smokingDuration: '15 years',
            consultingDoctor: 'Dr. Smith',
            quittingDuration: `${smokeFreeCount} days`,
            achievement: determineAchievement(smokeFreeCount),
            chatMessages: [
                { id: 1, sender: 'Dr. Smith', message: 'How are you feeling today?', time: '10:30 AM', date: '2023-06-10' },
                { id: 2, sender: 'You', message: 'I\'m doing great! No cravings today.', time: '10:45 AM', date: '2023-06-10' },
                { id: 3, sender: 'Dr. Smith', message: 'That\'s excellent progress! Keep going!', time: '11:00 AM', date: '2023-06-10' },
                { id: 4, sender: 'Dr. Smith', message: 'Have you experienced any withdrawal symptoms this week?', time: '09:15 AM', date: '2023-06-12' },
                { id: 5, sender: 'You', message: 'Just a mild headache yesterday, but it passed quickly.', time: '09:30 AM', date: '2023-06-12' },
                { id: 6, sender: 'Dr. Smith', message: 'That\'s normal. Make sure to stay hydrated and get plenty of rest. We\'ll discuss more strategies in our next session.', time: '09:45 AM', date: '2023-06-12' }
            ]
        });
    }, [navigate]);

    const determineAchievement = (days) => {
        if (days >= 30) return 'One Month Milestone';
        if (days >= 14) return 'Two Week Champion';
        if (days >= 7) return 'One Week Warrior';
        if (days >= 3) return 'First Steps';
        return 'Just Started';
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
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            padding: '2rem',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            <Header userName={memberInfo.name} />
            <SecondaryNavigation />

            <div style={{
                maxWidth: '100%',
                margin: '0 auto',
                width: '100%',
                boxSizing: 'border-box'
            }}>
                <div className="page-header" style={{
                    textAlign: 'center',
                    margin: '2rem 0 3rem',
                    position: 'relative'
                }}>
                    <h1 className="page-title" style={{
                        fontSize: '2.2rem',
                        color: '#35a79c',
                        position: 'relative',
                        display: 'inline-block',
                        marginBottom: '1rem',
                        fontWeight: '700'
                    }}>Theo Dõi Trạng Thái</h1>
                    <p className="page-description" style={{
                        color: '#7f8c8d',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>Theo dõi tiến trình và giữ liên lạc với đội ngũ hỗ trợ của bạn</p>
                </div>

                {/* Content Grid */}
                <div className="content-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Info Section */}
                    <div className="info-section" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2rem'
                    }}>
                        <div className="card" style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '2rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                        }}>
                            <h2 className="section-title" style={{
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: '#35a79c'
                            }}>Thông Tin Cá Nhân</h2>
                            <div className="info-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr',
                                gap: '1rem',
                                alignItems: 'center'
                            }}>
                                <div className="info-label" style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                }}>Tên:</div>
                                <div className="info-value" style={{
                                    color: '#7f8c8d'
                                }}>{memberInfo.name}</div>

                                <div className="info-label" style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                }}>Giới tính:</div>
                                <div className="info-value" style={{
                                    color: '#7f8c8d'
                                }}>{memberInfo.gender}</div>

                                <div className="info-label" style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                }}>Tuổi:</div>
                                <div className="info-value" style={{
                                    color: '#7f8c8d'
                                }}>{memberInfo.age}</div>

                                <div className="info-label" style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                }}>Thời gian hút thuốc:</div>
                                <div className="info-value" style={{
                                    color: '#7f8c8d'
                                }}>{memberInfo.smokingDuration}</div>
                            </div>
                        </div>

                        <div className="card" style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '2rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                        }}>
                            <h2 className="section-title" style={{
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: '#35a79c'
                            }}>Tiến Độ Của Bạn</h2>
                            <div className="info-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: 'auto 1fr',
                                gap: '1rem',
                                alignItems: 'center'
                            }}>
                                <div className="info-label" style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                }}>Bác sĩ tư vấn:</div>
                                <div className="info-value" style={{
                                    color: '#7f8c8d'
                                }}>{memberInfo.consultingDoctor}</div>

                                <div className="info-label" style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                }}>Thời gian cai thuốc:</div>
                                <div className="info-value" style={{
                                    color: '#7f8c8d'
                                }}>{memberInfo.quittingDuration}</div>

                                <div className="info-label" style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                }}>Thành tựu:</div>
                                <div className="info-value">
                                    <span className="achievement-badge" style={{
                                        backgroundColor: '#35a79c',
                                        color: 'white',
                                        fontWeight: '700',
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '50px',
                                        fontSize: '0.9rem',
                                        display: 'inline-block'
                                    }}>{memberInfo.achievement}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '2rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                        }}>
                            <h2 className="section-title" style={{
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: '#35a79c'
                            }}>Cải Thiện Sức Khỏe</h2>
                            <div className="timeline" style={{
                                position: 'relative',
                                paddingLeft: '20px',
                                marginLeft: '10px',
                                borderLeft: '2px solid #e5e8ee'
                            }}>
                                <div className="timeline-item" style={{
                                    position: 'relative',
                                    paddingBottom: '1.5rem'
                                }}>
                                    <div className="timeline-dot" style={{
                                        backgroundColor: '#e74c3c',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        left: '-27px',
                                        top: '5px'
                                    }}></div>
                                    <div className="timeline-content">
                                        <h3 style={{
                                            color: '#2c3e50',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>20 Phút</h3>
                                        <p style={{
                                            color: '#7f8c8d',
                                            margin: '0'
                                        }}>Nhịp tim và huyết áp của bạn giảm</p>
                                    </div>
                                </div>
                                <div className="timeline-item" style={{
                                    position: 'relative',
                                    paddingBottom: '1.5rem'
                                }}>
                                    <div className="timeline-dot" style={{
                                        backgroundColor: '#f39c12',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        left: '-27px',
                                        top: '5px'
                                    }}></div>
                                    <div className="timeline-content">
                                        <h3 style={{
                                            color: '#2c3e50',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>12 Giờ</h3>
                                        <p style={{
                                            color: '#7f8c8d',
                                            margin: '0'
                                        }}>Mức carbon monoxide trong máu của bạn trở về mức bình thường</p>
                                    </div>
                                </div>
                                <div className="timeline-item" style={{
                                    position: 'relative',
                                    paddingBottom: '1.5rem'
                                }}>
                                    <div className="timeline-dot" style={{
                                        backgroundColor: '#3498db',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        left: '-27px',
                                        top: '5px'
                                    }}></div>
                                    <div className="timeline-content">
                                        <h3 style={{
                                            color: '#2c3e50',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>2 Tuần đến 3 Tháng</h3>
                                        <p style={{
                                            color: '#7f8c8d',
                                            margin: '0'
                                        }}>Tuần hoàn của bạn được cải thiện và chức năng phổi tăng lên</p>
                                    </div>
                                </div>
                                <div className="timeline-item" style={{
                                    position: 'relative',
                                    paddingBottom: '1.5rem'
                                }}>
                                    <div className="timeline-dot" style={{
                                        backgroundColor: '#2ecc71',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        left: '-27px',
                                        top: '5px'
                                    }}></div>
                                    <div className="timeline-content">
                                        <h3 style={{
                                            color: '#2c3e50',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>1 đến 9 Tháng</h3>
                                        <p style={{
                                            color: '#7f8c8d',
                                            margin: '0'
                                        }}>Ho và khó thở giảm</p>
                                    </div>
                                </div>
                                <div className="timeline-item" style={{
                                    position: 'relative',
                                    paddingBottom: '0'
                                }}>
                                    <div className="timeline-dot" style={{
                                        backgroundColor: '#9b59b6',
                                        width: '12px',
                                        height: '12px',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        left: '-27px',
                                        top: '5px'
                                    }}></div>
                                    <div className="timeline-content">
                                        <h3 style={{
                                            color: '#2c3e50',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>1 Năm</h3>
                                        <p style={{
                                            color: '#7f8c8d',
                                            margin: '0'
                                        }}>Nguy cơ mắc bệnh tim mạch vành giảm một nửa so với người hút thuốc</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section - Moved back to bottom */}
                    <div className="chat-section">
                        <div className="card chat-card" style={{
                            backgroundColor: 'white',
                            borderRadius: '15px',
                            padding: '2rem',
                            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <h2 className="section-title" style={{
                                fontWeight: '600',
                                marginBottom: '1rem',
                                color: '#35a79c'
                            }}>Liên Lạc Với Bác Sĩ</h2>

                            <div className="chat-messages" style={{
                                flexGrow: 1,
                                overflowY: 'auto',
                                marginBottom: '1rem',
                                padding: '0.5rem',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '10px',
                                maxHeight: '500px'
                            }}>
                                {Object.entries(groupedChatMessages).map(([date, messages]) => (
                                    <div key={date} className="chat-date-group">
                                        <div className="chat-date-divider" style={{
                                            textAlign: 'center',
                                            margin: '1rem 0',
                                            position: 'relative'
                                        }}>
                                            <span style={{
                                                backgroundColor: '#f0f0f0',
                                                padding: '0.3rem 0.8rem',
                                                borderRadius: '50px',
                                                fontSize: '0.8rem',
                                                color: '#7f8c8d',
                                                display: 'inline-block'
                                            }}>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        {messages.map(message => (
                                            <div
                                                key={message.id}
                                                className={`chat-message ${message.sender === 'You' ? 'message-outgoing' : 'message-incoming'}`}
                                                style={{
                                                    marginBottom: '1rem',
                                                    maxWidth: '80%',
                                                    alignSelf: message.sender === 'You' ? 'flex-end' : 'flex-start',
                                                    marginLeft: message.sender === 'You' ? 'auto' : '0'
                                                }}
                                            >
                                                <div className="message-header" style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    marginBottom: '0.3rem'
                                                }}>
                                                    <span className="message-sender" style={{
                                                        fontWeight: '600',
                                                        color: message.sender === 'You' ? '#35a79c' : '#3498db'
                                                    }}>{message.sender === 'You' ? 'Bạn' : message.sender}</span>
                                                    <span className="message-time" style={{
                                                        fontSize: '0.8rem',
                                                        color: '#95a5a6'
                                                    }}>{message.time}</span>
                                                </div>
                                                <div className="message-body" style={{
                                                    backgroundColor: message.sender === 'You' ? '#35a79c' : '#f0f0f0',
                                                    color: message.sender === 'You' ? 'white' : '#2c3e50',
                                                    padding: '0.8rem 1rem',
                                                    borderRadius: '10px',
                                                    borderTopRightRadius: message.sender === 'You' ? '0' : '10px',
                                                    borderTopLeftRadius: message.sender === 'You' ? '10px' : '0',
                                                    lineHeight: '1.5'
                                                }}>{message.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <form className="chat-input-form" onSubmit={handleSendMessage} style={{
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <input
                                    type="text"
                                    placeholder="Nhập tin nhắn của bạn..."
                                    className="chat-input"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    style={{
                                        flexGrow: 1,
                                        padding: '0.8rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e8ee',
                                        outline: 'none'
                                    }}
                                />
                                <button type="submit" className="chat-send-button" style={{
                                    padding: '0.8rem 1.5rem',
                                    backgroundColor: '#35a79c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    boxShadow: '0 2px 4px rgba(53, 167, 156, 0.3)'
                                }}>
                                    Gửi
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackStatus; 