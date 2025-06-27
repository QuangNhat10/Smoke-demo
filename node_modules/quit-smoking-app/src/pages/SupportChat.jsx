import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

const SupportChat = () => {
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
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);
    
    // Lấy tên người dùng từ localStorage
    const userName = localStorage.getItem('userName') || '';

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            message: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, userMessage]);
        setNewMessage('');

        // Simulate staff or doctor response after a short delay
        setTimeout(() => {
            const respondents = ['staff', 'doctor'];
            const respondentType = respondents[Math.floor(Math.random() * respondents.length)];

            let responseMessage = {
                id: messages.length + 2,
                sender: respondentType,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            if (respondentType === 'staff') {
                responseMessage.name = 'Nguyễn Văn A';
                responseMessage.message = 'Cảm ơn bạn đã chia sẻ. Chúng tôi sẽ hỗ trợ bạn trong hành trình cai thuốc lá. Bạn có thể thử một số bài tập thư giãn hoặc đọc một cuốn sách để chuyển hướng sự chú ý.';
            } else {
                responseMessage.name = 'BS. Trần Văn B';
                responseMessage.message = 'Tôi hiểu những khó khăn bạn đang trải qua. Việc cai thuốc lá không hề đơn giản. Hãy nhớ rằng mỗi ngày không hút thuốc là một chiến thắng. Tôi đề xuất bạn thử phương pháp 4D: Trì hoãn, Hít thở sâu, Uống nước và Chuyển hướng sự chú ý.';
            }

            setMessages(prevMessages => [...prevMessages, responseMessage]);
        }, 1000);
    };

    return (
        <div className="support-chat-page">
            {/* Header Component */}
            <Header userName={userName} />
            
            {/* Secondary Navigation */}
            <SecondaryNavigation />
            
            <div className="support-content">
                <div className="content-header">
                    <h1>Trợ Giúp & Hỗ trợ</h1>
                    <Link to="/homepage-member" className="back-button">Quay Lại Trang Chủ</Link>
                </div>

                <div className="chat-container">
                    <h2>Chat Hỗ Trợ</h2>

                    <div className="messages-container" ref={chatContainerRef}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message-wrapper ${msg.sender === 'user' ? 'user-message' : 'support-message'}`}
                            >
                                {msg.sender !== 'user' && (
                                    <div className="sender-info">
                                        <div className={`sender-avatar ${msg.sender}`}>
                                            {msg.sender === 'staff' ? '👨‍💼' : '👨‍⚕️'}
                                        </div>
                                        <span className={`sender-name ${msg.sender}`}>
                                            {msg.name}
                                        </span>
                                    </div>
                                )}

                                <div className={`message ${msg.sender}`}>
                                    <p>{msg.message}</p>
                                    <span className="timestamp">{msg.timestamp}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="message-form">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Nhập tin nhắn của bạn..."
                            className="message-input"
                        />
                        <button type="submit" className="send-button">
                            <span>Gửi</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .support-chat-page {
                    min-height: 100vh;
                    width: 100%;
                    background: linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%);
                    font-family: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif';
                }
                
                .support-content {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                    box-sizing: border-box;
                }
                
                .content-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .content-header h1 {
                    font-size: 2.2rem;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0;
                }
                
                .back-button {
                    padding: 0.5rem 1.5rem;
                    background-color: #35a79c;
                    color: white;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 500;
                    box-shadow: 0 4px 6px rgba(53, 167, 156, 0.2);
                }
                
                .chat-container {
                    background-color: white;
                    border-radius: 15px;
                    padding: 1.5rem;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 200px);
                    overflow: hidden;
                }
                
                .chat-container h2 {
                    font-weight: 600;
                    margin-bottom: 1rem;
                    color: #35a79c;
                }
                
                .messages-container {
                    flex: 1;
                    overflow: auto;
                    padding: 1rem;
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    margin-bottom: 1rem;
                }
                
                .message-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }
                
                .user-message {
                    align-items: flex-end;
                }
                
                .sender-info {
                    display: flex;
                    align-items: center;
                    margin-bottom: 0.3rem;
                }
                
                .sender-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 0.5rem;
                    font-size: 1rem;
                }
                
                .sender-avatar.staff {
                    background-color: #44b89d20;
                }
                
                .sender-avatar.doctor {
                    background-color: #0057b820;
                }
                
                .sender-name {
                    font-weight: 600;
                }
                
                .sender-name.staff {
                    color: #44b89d;
                }
                
                .sender-name.doctor {
                    color: #0057b8;
                }
                
                .message {
                    padding: 0.8rem 1.2rem;
                    border-radius: 15px;
                    max-width: 80%;
                    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
                }
                
                .message.user {
                    background-color: #35a79c;
                    color: white;
                    border-bottom-right-radius: 5px;
                }
                
                .message.staff {
                    background-color: #f0f7fa;
                    color: #2c3e50;
                    border-bottom-left-radius: 5px;
                }
                
                .message.doctor {
                    background-color: #e6f7ff;
                    color: #2c3e50;
                    border-bottom-left-radius: 5px;
                }
                
                .message p {
                    margin: 0;
                    line-height: 1.5;
                }
                
                .timestamp {
                    font-size: 0.8rem;
                    opacity: 0.8;
                    margin-top: 0.3rem;
                    display: block;
                    text-align: right;
                }
                
                .message-form {
                    display: flex;
                    gap: 1rem;
                }
                
                .message-input {
                    flex: 1;
                    padding: 0.8rem 1.2rem;
                    border: 1px solid #e0e0e0;
                    border-radius: 10px;
                    font-size: 1rem;
                    outline: none;
                }
                
                .send-button {
                    background-color: #35a79c;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    padding: 0 1.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `}</style>
        </div>
    );
};

export default SupportChat; 