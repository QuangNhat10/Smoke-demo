import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import { HubConnectionBuilder } from '@microsoft/signalr';

const SupportChat = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [doctors, setDoctors] = useState([]);
    const [userId, setUserId] = useState(null);
    const connectionRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        axiosInstance.get('/doctor')
            .then(res => setDoctors(res.data))
            .catch(err => console.error(err));

        // Lấy userId từ localStorage (giả sử lưu user khi login)
        const user = JSON.parse(localStorage.getItem('user'));
        setUserId(user?.userId);
    }, []);

    useEffect(() => {
        if (!selectedDoctorId || !userId) return;
        axiosInstance.get(`/support/conversation/${selectedDoctorId}`)
            .then(res => {
                if (res.status === 200) {
                    setMessages(res.data.map(m => ({
                        id: m.chatID,
                        sender: m.fromUserID === userId ? 'user' : 'doctor',
                        name: m.fromUserID === userId ? 'Bạn' : doctors.find(d => d.userId == selectedDoctorId)?.fullName || 'Bác sĩ',
                        message: m.messageContent,
                        timestamp: new Date(m.sentAt).toLocaleString()
                    })));
                }
            })
            .catch(err => console.error(err));
    }, [selectedDoctorId, userId, doctors]);

    // Establish SignalR connection once userId & token are available
    useEffect(() => {
        if (!userId || !localStorage.getItem('token')) return;

        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5050/chathub', {
                accessTokenFactory: () => localStorage.getItem('token')
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log('SignalR connected (SupportChat)');
                connection.on('ReceiveMessage', (fromUserId, message) => {
                    console.log('SignalR ReceiveMessage (SupportChat):', { fromUserId, message });
                    setMessages(prev => [
                        ...prev,
                        {
                            id: Date.now(),
                            sender: fromUserId == userId ? 'user' : 'doctor',
                            name: fromUserId == userId ? 'Bạn' : (doctors.find(d => d.userId == fromUserId)?.fullName || 'Bác sĩ'),
                            message: message,
                            timestamp: new Date().toLocaleString()
                        }
                    ]);
                });
            })
            .catch(err => console.error('SignalR connection error (SupportChat):', err));

        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, [userId, doctors]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !selectedDoctorId) return;

        try {
            await axiosInstance.post('/support/send', {
                toUserId: Number(selectedDoctorId),
                content: newMessage
            });
            setNewMessage('');
            // Fetch lại hội thoại
            axiosInstance.get(`/support/conversation/${selectedDoctorId}`, {
                headers: { 'Cache-Control': 'no-cache' }
            })
                .then(res => {
                    if (res.status === 200) {
                        setMessages(res.data.map(m => ({
                            id: m.chatID,
                            sender: m.fromUserID === userId ? 'user' : 'doctor',
                            name: m.fromUserID === userId ? 'Bạn' : doctors.find(d => d.userId == selectedDoctorId)?.fullName || 'Bác sĩ',
                            message: m.messageContent,
                            timestamp: new Date(m.sentAt).toLocaleString()
                        })));
                    }
                });
        } catch (err) {
            console.error(err);
            // Có thể hiển thị thông báo lỗi cho người dùng
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            padding: '2rem',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                height: 'calc(100vh - 4rem)',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        color: '#2c3e50',
                        margin: 0
                    }}>Trợ Giúp & Hỗ trợ</h1>
                    <Link to="/homepage-member" style={{
                        padding: '0.5rem 1.5rem',
                        backgroundColor: '#35a79c',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '50px',
                        fontWeight: '500',
                        boxShadow: '0 4px 6px rgba(53, 167, 156, 0.2)'
                    }}>Quay Lại Trang Chủ</Link>
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
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontWeight: '600', marginRight: '1rem' }}>Chọn bác sĩ:</label>
                            <select value={selectedDoctorId} onChange={e => setSelectedDoctorId(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px' }}>
                                <option value="">-- Chọn bác sĩ để chat --</option>
                                {doctors.map(doc => (
                                    <option key={doc.userId} value={doc.userId}>{doc.fullName}</option>
                                ))}
                            </select>
                        </div>
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