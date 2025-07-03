import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';
import { HubConnectionBuilder } from '@microsoft/signalr';
import Header from '../components/Header';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';

const DoctorChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);
    const bottomRef = useRef(null);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [patients, setPatients] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userName, setUserName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const connectionRef = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    useEffect(() => {
        axiosInstance.get('/support/patients')
            .then(res => setPatients(res.data))
            .catch(err => console.error(err));
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUserId(user.userId);
            setUserName(user.name || user.userName || '');
        }
    }, []);

    useEffect(() => {
        if (!selectedPatientId || !userId) return;
        axiosInstance.get(`/support/conversation/${selectedPatientId}`)
            .then(res => {
                if (res.status === 200) {
                    setMessages(res.data.map(m => ({
                        id: m.chatID,
                        sender: m.fromUserID === userId ? 'doctor' : 'patient',
                        name: m.fromUserID === userId ? 'Bạn' : patients.find(p => p.userId == selectedPatientId)?.name || 'Bệnh nhân',
                        message: m.messageContent,
                        timestamp: new Date(m.sentAt).toLocaleString()
                    })));
                }
            })
            .catch(err => console.error(err));
    }, [selectedPatientId, userId, patients]);

    useEffect(() => {
        if (!userId || !localStorage.getItem('token')) {
            return;
        }
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5050/chathub', {
                accessTokenFactory: () => localStorage.getItem('token')
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log('SignalR Connected');
                connection.on('ReceiveMessage', (fromUserId, message) => {
                    console.log('SignalR ReceivedMessage:', { fromUserId, message });
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now(),
                            sender: fromUserId == userId ? 'doctor' : 'patient',
                            name: fromUserId == userId ? 'Bạn' : (patients.find(p => p.userId == fromUserId)?.name || 'Bệnh nhân'),
                            message: message,
                            timestamp: new Date().toLocaleString()
                        }
                    ]);
                });
            })
            .catch(err => {
                console.error('SignalR Connection Error:', err);
            });

        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, [userId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedPatientId) return;
        try {
            await axiosInstance.post('/support/send', {
                toUserId: Number(selectedPatientId),
                content: newMessage
            });
            setNewMessage('');
        } catch (err) {
            console.error(err);
        }
    };

    // Detect scrolling to determine if user is at bottom
    const handleScroll = () => {
        const el = chatContainerRef.current;
        if (!el) return;
        const threshold = 5; // only count as bottom if ~<=5px from bottom
        const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
        // Cập nhật state chỉ khi thay đổi để tránh render dư thừa
        setIsAtBottom(prev => (prev !== atBottom ? atBottom : prev));
    };

    // Auto scroll only when at bottom
    useEffect(() => {
        const el = chatContainerRef.current;
        if (isAtBottom && el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages, isAtBottom]);

    // Filter and sort patients
    const filteredPatients = patients
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            const tA = a.lastMessageTime ? new Date(a.lastMessageTime).getTime() : 0;
            const tB = b.lastMessageTime ? new Date(b.lastMessageTime).getTime() : 0;
            return tB - tA;
        });

    return (
        <div className="doctor-chat-page">
            <Header userName={userName} />
            <SecondaryNavigationDoctor />

            <div className="container py-5">
                <div className="chat-container">
                    {/* Sidebar patient list */}
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
                                    className={`patient-item ${selectedPatientId == patient.userId ? 'active' : ''}`}
                                    onClick={() => setSelectedPatientId(patient.userId)}
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
                                            {patient.lastMessageTime && (
                                                <span className="message-time">
                                                    {new Date(patient.lastMessageTime).toLocaleTimeString()}
                                                </span>
                                            )}
                                        </div>
                                        <p className="last-message">{patient.lastMessageSnippet || ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main chat area */}
                    <div className="chat-main">
                        {selectedPatientId ? (
                            <>
                                <div className="chat-header">
                                    <img
                                        src={(patients.find(p => p.userId == selectedPatientId)?.avatar) || '/default-avatar.png'}
                                        alt="avatar"
                                        className="header-avatar"
                                    />
                                    <div className="header-info">
                                        <h4 className="header-name">
                                            {patients.find(p => p.userId == selectedPatientId)?.name || 'Bệnh nhân'}
                                        </h4>
                                    </div>
                                </div>

                                <div className="chat-messages" ref={chatContainerRef} onScroll={handleScroll}>
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`message-row ${msg.sender === 'doctor' ? 'sent' : 'received'}`}>
                                            <div className="message-bubble">
                                                <p className="message-text">{msg.message}</p>
                                                <span className="message-time">{msg.timestamp}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={bottomRef}></div>
                                </div>

                                <form className="chat-input" onSubmit={handleSendMessage}>
                                    <input
                                        type="text"
                                        className="message-input"
                                        placeholder="Nhập tin nhắn..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" className="send-button" style={{ opacity: newMessage.trim() ? 1 : 0.5 }}>
                                        <i className="fa-solid fa-paper-plane"></i>
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="no-patient-selected">
                                <p>Chọn bệnh nhân để bắt đầu trò chuyện</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Styles */}
            <style>{`
                .doctor-chat-page {
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
                    grid-template-columns: 280px 1fr;
                    height: 80vh;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                    overflow: hidden;
                }

                /* Sidebar */
                .chat-sidebar {
                    border-right: 1px solid #eee;
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
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
                    min-height: 0;
                }

                .patient-item {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    border-bottom: 1px solid #f1f1f1;
                }

                .patient-item:hover {
                    background-color: #f8f9fa;
                }

                .patient-item.active {
                    background-color: rgba(53, 167, 156, 0.1);
                }

                .avatar-container {
                    margin-right: 1rem;
                }

                .patient-avatar {
                    width: 48px;
                    height: 48px;
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

                /* Main chat */
                .chat-main {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    min-height: 0;
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

                .header-name {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #2c3e50;
                }

                .chat-messages {
                    flex-grow: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    background-color: #f9f9f9;
                    min-height: 0;
                }

                .message-row {
                    display: flex;
                    margin-bottom: 1rem;
                }

                .message-row.sent {
                    justify-content: flex-end;
                }

                .message-row.received {
                    justify-content: flex-start;
                }

                .message-bubble {
                    background-color: #35a79c;
                    color: white;
                    padding: 0.8rem 1.2rem;
                    border-radius: 15px;
                    max-width: 70%;
                    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
                }

                .message-row.received .message-bubble {
                    background-color: #e6f7ff;
                    color: #2c3e50;
                }

                .message-bubble .message-time {
                    display: block;
                    font-size: 0.75rem;
                    opacity: 0.8;
                    margin-top: 0.3rem;
                    text-align: right;
                }

                .chat-input {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border-top: 1px solid #eee;
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
                    transition: background 0.3s ease;
                }

                .send-button:hover {
                    background-color: #2c9085;
                }

                .send-button:disabled {
                    background-color: #35a79c;
                    cursor: not-allowed;
                }

                @media (max-width: 992px) {
                    .chat-container {
                        grid-template-columns: 1fr;
                    }

                    .chat-sidebar {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default DoctorChat; 