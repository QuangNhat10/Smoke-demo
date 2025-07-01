import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';
import Header from '../components/Header';

/**
 * PatientChatPage - Trang chat với bệnh nhân dành cho bác sĩ
 * 
 * Component này hiển thị giao diện trò chuyện giữa bác sĩ và bệnh nhân, giúp:
 * - Bác sĩ có thể nhắn tin trực tiếp với bệnh nhân đang cai thuốc
 * - Xem danh sách bệnh nhân và lịch sử trò chuyện
 * - Xem thông tin chi tiết về từng bệnh nhân và tiến độ cai thuốc
 * - Gửi tin nhắn hỗ trợ và theo dõi quá trình điều trị
 */
const PatientChatPage = () => {
    const [message, setMessage] = useState('');
    const [activePatient, setActivePatient] = useState(null);
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [patients, setPatients] = useState([]);
    const [messages, setMessages] = useState([]);
    const [myUserId, setMyUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        const userId = localStorage.getItem('userId');
        if (storedUserName && userId) {
            setUserName(storedUserName);
            setMyUserId(Number(userId));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPatients = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('/api/support/patients', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPatients(data);
                    if (data.length > 0) setActivePatient(data[0].userId);
                }
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        if (!activePatient) return;
        const fetchConversation = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch(`/api/support/conversation/${activePatient}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMessages(data);
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchConversation();
    }, [activePatient]);

    const handleSendMessage = async () => {
        if (message.trim() === '') return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('/api/support/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    toUserId: activePatient,
                    content: message
                })
            });
            if (res.ok) {
                setMessage('');
                // Fetch lại hội thoại để cập nhật tin nhắn mới nhất
                const convRes = await fetch(`/api/support/conversation/${activePatient}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (convRes.ok) {
                    const convData = await convRes.json();
                    setMessages(convData);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Gửi tin nhắn thất bại');
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="patient-chat-page">
            <Header userName={userName} />
            <SecondaryNavigationDoctor />

            <div className="container py-5">
                <div className="chat-container">
                    <div className="chat-sidebar">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Tìm kiếm bệnh nhân..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="patient-list">
                            {filteredPatients.map(patient => (
                                <div
                                    key={patient.userId}
                                    className={`patient-item ${activePatient === patient.userId ? 'active' : ''}`}
                                    onClick={() => setActivePatient(patient.userId)}
                                >
                                    <div className="avatar-container">
                                        <img
                                            src={patient.avatar || '/default-avatar.png'}
                                            alt={patient.name}
                                            className="patient-avatar"
                                        />
                                    </div>
                                    <div className="patient-info">
                                        <div className="patient-header">
                                            <span className="patient-name">{patient.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chat-main">
                        {activePatient && (
                            <>
                                <div className="chat-header">
                                    <img
                                        src={patients.find(p => p.userId === activePatient)?.avatar || '/default-avatar.png'}
                                        alt={patients.find(p => p.userId === activePatient)?.name}
                                        className="header-avatar"
                                    />
                                    <div className="header-info">
                                        <h3 className="header-name">
                                            {patients.find(p => p.userId === activePatient)?.name}
                                        </h3>
                                        <span className="header-status online">Trực tuyến</span>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {messages.map(msg => (
                                        <div key={msg.chatID} className={`message ${msg.fromUserID === myUserId ? 'sent' : 'received'}`}>
                                            {msg.fromUserID !== myUserId && (
                                                <img
                                                    src={patients.find(p => p.userId === msg.fromUserID)?.avatar || '/default-avatar.png'}
                                                    alt="avatar"
                                                    className="message-avatar"
                                                />
                                            )}
                                            <div className="message-content">
                                                <p className="message-text">{msg.messageContent}</p>
                                                <span className="message-time">
                                                    {new Date(msg.sentAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="chat-input">
                                    <input
                                        type="text"
                                        placeholder="Nhập tin nhắn..."
                                        className="message-input"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    />
                                    <button
                                        className="send-button"
                                        onClick={handleSendMessage}
                                        disabled={!message.trim()}
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style >{`
                .patient-chat-page {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .container {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }
                
                .py-5 {
                    padding-top: 3rem;
                    padding-bottom: 3rem;
                }
                
                .chat-container {
                    display: grid;
                    grid-template-columns: 300px 1fr 300px;
                    height: 80vh;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    overflow: hidden;
                }
                
                /* Sidebar styles */
                .chat-sidebar {
                    border-right: 1px solid #eee;
                    display: flex;
                    flex-direction: column;
                }
                
                .search-box {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                }
                
                .search-input {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 0.9rem;
                }
                
                .patient-list {
                    flex-grow: 1;
                    overflow-y: auto;
                }
                
                .patient-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border-bottom: 1px solid #f1f1f1;
                }
                
                .patient-item:hover {
                    background-color: #f8f9fa;
                }
                
                .patient-item.active {
                    background-color: rgba(53, 167, 156, 0.1);
                }
                
                .avatar-container {
                    position: relative;
                    margin-right: 1rem;
                }
                
                .patient-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .patient-info {
                    flex-grow: 1;
                    min-width: 0;
                }
                
                .patient-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.25rem;
                }
                
                .patient-name {
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .message-time {
                    font-size: 0.8rem;
                    color: #7f8c8d;
                }
                
                .last-message {
                    margin: 0;
                    font-size: 0.85rem;
                    color: #7f8c8d;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                /* Main chat area styles */
                .chat-main {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }
                
                .chat-header {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                }
                
                .header-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 1rem;
                    object-fit: cover;
                }
                
                .header-info {
                    flex-grow: 1;
                }
                
                .header-name {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #2c3e50;
                }
                
                .header-status {
                    font-size: 0.8rem;
                }
                
                .online {
                    color: #27ae60;
                }
                
                .header-actions {
                    display: flex;
                    gap: 0.75rem;
                }
                
                .action-button {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    border: none;
                    background-color: #f8f9fa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .action-button:hover {
                    background-color: #eee;
                }
                
                .chat-messages {
                    flex-grow: 1;
                    padding: 1rem;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .message {
                    display: flex;
                    max-width: 80%;
                }
                
                .message.sent {
                    align-self: flex-end;
                    flex-direction: row-reverse;
                }
                
                .message.received {
                    align-self: flex-start;
                }
                
                .message-avatar {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    margin: 0 0.5rem;
                    object-fit: cover;
                }
                
                .message-content {
                    background-color: #f1f1f1;
                    padding: 0.75rem;
                    border-radius: 8px;
                }
                
                .sent .message-content {
                    background-color: #35a79c;
                    color: white;
                    border-top-right-radius: 0;
                }
                
                .received .message-content {
                    background-color: #f1f1f1;
                    border-top-left-radius: 0;
                }
                
                .message-text {
                    margin: 0;
                    font-size: 0.95rem;
                }
                
                .message-time {
                    display: block;
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                    opacity: 0.8;
                    text-align: right;
                }
                
                .chat-input {
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    border-top: 1px solid #eee;
                }
                
                .attachment-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background-color: #f8f9fa;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .message-input {
                    flex-grow: 1;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    font-size: 0.95rem;
                }
                
                .send-button {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background-color: #35a79c;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .send-button:hover {
                    background-color: #2c9085;
                }
                
                /* Patient details styles */
                .patient-details {
                    border-left: 1px solid #eee;
                    padding: 1.5rem;
                    overflow-y: auto;
                }
                
                .details-header {
                    margin-top: 0;
                    margin-bottom: 1.5rem;
                    color: #2c3e50;
                    font-size: 1.2rem;
                }
                
                .patient-profile {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                
                .profile-avatar {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-bottom: 1rem;
                }
                
                .profile-name {
                    margin: 0;
                    margin-bottom: 0.5rem;
                    font-size: 1.1rem;
                    color: #2c3e50;
                }
                
                .profile-status {
                    font-size: 0.9rem;
                    margin: 0;
                }
                
                .details-section {
                    margin-bottom: 1.5rem;
                    padding-bottom: 1.5rem;
                    border-bottom: 1px solid #eee;
                }
                
                .section-title {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    font-size: 1rem;
                    color: #2c3e50;
                }
                
                .detail-item {
                    display: flex;
                    margin-bottom: 0.75rem;
                    font-size: 0.9rem;
                }
                
                .detail-label {
                    font-weight: 600;
                    color: #7f8c8d;
                    min-width: 100px;
                }
                
                .progress-container {
                    display: flex;
                    align-items: center;
                    flex-grow: 1;
                }
                
                .progress-bar {
                    flex-grow: 1;
                    height: 10px;
                    background-color: #f1f1f1;
                    border-radius: 5px;
                    margin-right: 0.5rem;
                    overflow: hidden;
                }
                
                .progress {
                    height: 100%;
                    background-color: #27ae60;
                    border-radius: 5px;
                }
                
                .progress-value {
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #27ae60;
                }
                
                .detail-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .detail-button {
                    padding: 0.75rem;
                    border-radius: 8px;
                    font-weight: 600;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .view-plan {
                    background-color: #35a79c;
                    color: white;
                }
                
                .view-plan:hover {
                    background-color: #2c9085;
                }
                
                .view-profile {
                    background-color: #f8f9fa;
                    color: #2c3e50;
                    border: 1px solid #ddd;
                }
                
                .view-profile:hover {
                    background-color: #f1f1f1;
                }
                
                @media (max-width: 1200px) {
                    .chat-container {
                        grid-template-columns: 250px 1fr 250px;
                    }
                }
                
                @media (max-width: 992px) {
                    .chat-container {
                        grid-template-columns: 250px 1fr;
                    }
                    
                    .patient-details {
                        display: none;
                    }
                }
                
                @media (max-width: 768px) {
                    .chat-container {
                        grid-template-columns: 1fr;
                        height: auto;
                    }
                    
                    .chat-sidebar {
                        display: none;
                    }
                    
                    .chat-main {
                        height: 80vh;
                    }
                }
            `}</style>
        </div>
    );
};

export default PatientChatPage; 