import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

const SupportChat = () => {
    // State lưu trữ danh sách tin nhắn trong cuộc trò chuyện
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'staff',
            name: 'Nguyễn Văn A',
            message: 'Xin chào! Tôi là nhân viên hỗ trợ. Bạn cần giúp đỡ gì không?',
            timestamp: '10:30 AM'
        },
        {
            id: 2,
            sender: 'user',
            message: 'Tôi đang gặp khó khăn với cơn thèm thuốc lá.',
            timestamp: '10:32 AM'
        },
        {
            id: 3,
            sender: 'doctor',
            name: 'BS. Trần Văn B',
            message: 'Xin chào, tôi là bác sĩ hỗ trợ. Khi bạn gặp cơn thèm thuốc, hãy thử hít thở sâu và uống một ly nước. Bạn cũng có thể đi bộ nhẹ nhàng trong vài phút.',
            timestamp: '10:35 AM'
        }
    ]);

    // State lưu trữ tin nhắn mới mà người dùng đang nhập
    const [newMessage, setNewMessage] = useState('');

    // Ref để tham chiếu đến container chat, dùng để scroll tự động
    const chatContainerRef = useRef(null);

    // Effect để tự động scroll xuống tin nhắn mới nhất khi có tin nhắn mới
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Lấy userName từ localStorage nếu có
    const userName = localStorage.getItem('userName') || '';

    /**
     * Xử lý việc gửi tin nhắn mới
     * @param {Event} e - Event object từ form submit
     */
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        // Tạo tin nhắn mới từ người dùng
        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            message: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Thêm tin nhắn mới vào danh sách
        setMessages([...messages, userMessage]);
        setNewMessage('');

        // Giả lập phản hồi từ nhân viên hoặc bác sĩ sau 1 giây
        setTimeout(() => {
            const respondents = ['staff', 'doctor'];
            const respondentType = respondents[Math.floor(Math.random() * respondents.length)];

            let responseMessage = {
                id: messages.length + 2,
                sender: respondentType,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            // Tạo nội dung phản hồi dựa trên loại người trả lời
            if (respondentType === 'staff') {
                responseMessage.name = 'Nguyễn Văn A';
                responseMessage.message = 'Cảm ơn bạn đã chia sẻ. Chúng tôi sẽ hỗ trợ bạn trong hành trình cai thuốc lá. Bạn có thể thử một số bài tập thư giãn hoặc đọc một cuốn sách để chuyển hướng sự chú ý.';
            } else {
                responseMessage.name = 'BS. Trần Văn B';
                responseMessage.message = 'Tôi hiểu những khó khăn bạn đang trải qua. Việc cai thuốc lá không hề đơn giản. Hãy nhớ rằng mỗi ngày không hút thuốc lá là một chiến thắng. Tôi đề xuất bạn thử phương pháp 4D: Trì hoãn, Hít thở sâu, Uống nước và Chuyển hướng sự chú ý.';
            }

            setMessages(prevMessages => [...prevMessages, responseMessage]);
        }, 1000);
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                width: '100%',
                background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
                fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            {/* Header và SecondaryNavigation */}
            <Header userName={userName} />
            <SecondaryNavigation />

            {/* Nội dung chính */}
            <div
                style={{
                    maxWidth: '700px',
                    margin: '40px auto 0 auto',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                    padding: '2rem',
                    minHeight: '70vh',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '2rem'
                    }}
                >
                    <h1
                        style={{
                            fontSize: '2.2rem',
                            fontWeight: '700',
                            color: '#2c3e50',
                            margin: 0
                        }}
                    >
                        Trợ Giúp & Hỗ trợ
                    </h1>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    padding: '1.5rem',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    overflow: 'hidden'
                }}>
                    <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Chat Hỗ Trợ</h2>

                    <div
                        ref={chatContainerRef}
                        style={{
                            flex: 1,
                            overflow: 'auto',
                            padding: '1rem',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '10px',
                            marginBottom: '1rem'
                        }}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    marginBottom: '1rem'
                                }}
                            >
                                {msg.sender !== 'user' && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '0.3rem'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: msg.sender === 'staff' ? '#44b89d20' : '#0057b820',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: '0.5rem',
                                            fontSize: '1rem'
                                        }}>
                                            {msg.sender === 'staff' ? '👨‍💼' : '👨‍⚕️'}
                                        </div>
                                        <span style={{
                                            fontWeight: '600',
                                            color: msg.sender === 'staff' ? '#44b89d' : '#0057b8'
                                        }}>
                                            {msg.name}
                                        </span>
                                    </div>
                                )}

                                <div style={{
                                    backgroundColor: msg.sender === 'user' ? '#35a79c' : (msg.sender === 'staff' ? '#f0f7fa' : '#e6f7ff'),
                                    color: msg.sender === 'user' ? 'white' : '#2c3e50',
                                    padding: '0.8rem 1.2rem',
                                    borderRadius: '15px',
                                    borderBottomRightRadius: msg.sender === 'user' ? '5px' : '15px',
                                    borderBottomLeftRadius: msg.sender !== 'user' ? '5px' : '15px',
                                    maxWidth: '80%',
                                    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)'
                                }}>
                                    <p style={{
                                        margin: '0',
                                        lineHeight: '1.5'
                                    }}>{msg.message}</p>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        opacity: 0.8,
                                        marginTop: '0.3rem',
                                        display: 'block',
                                        textAlign: 'right'
                                    }}>{msg.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} style={{
                        display: 'flex',
                        gap: '1rem'
                    }}>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn của bạn..."
                            style={{
                                flex: 1,
                                padding: '0.8rem 1.2rem',
                                border: '1px solid #e0e0e0',
                                borderRadius: '10px',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#35a79c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '0 1.5rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <span>Gửi</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SupportChat; 