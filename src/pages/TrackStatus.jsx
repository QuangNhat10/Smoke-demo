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
        <div className="track-status-page">
            <Header userName={memberInfo.name} />
            <SecondaryNavigation />

            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Track Your Status</h1>
                    <p className="page-description">Monitor your progress and stay connected with your support team</p>
                </div>

                <div className="content-grid">
                    <div className="info-section">
                        <div className="card">
                            <h2 className="section-title">Personal Information</h2>
                            <div className="info-grid">
                                <div className="info-label">Name:</div>
                                <div className="info-value">{memberInfo.name}</div>

                                <div className="info-label">Gender:</div>
                                <div className="info-value">{memberInfo.gender}</div>

                                <div className="info-label">Age:</div>
                                <div className="info-value">{memberInfo.age}</div>

                                <div className="info-label">Smoking Duration:</div>
                                <div className="info-value">{memberInfo.smokingDuration}</div>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="section-title">Your Progress</h2>
                            <div className="info-grid">
                                <div className="info-label">Consulting Doctor:</div>
                                <div className="info-value">{memberInfo.consultingDoctor}</div>

                                <div className="info-label">Quitting Duration:</div>
                                <div className="info-value">{memberInfo.quittingDuration}</div>

                                <div className="info-label">Achievement:</div>
                                <div className="info-value">
                                    <span className="achievement-badge">{memberInfo.achievement}</span>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h2 className="section-title">Health Improvements</h2>
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-dot" style={{ backgroundColor: '#e74c3c' }}></div>
                                    <div className="timeline-content">
                                        <h3>20 Minutes</h3>
                                        <p>Your heart rate and blood pressure drop</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot" style={{ backgroundColor: '#f39c12' }}></div>
                                    <div className="timeline-content">
                                        <h3>12 Hours</h3>
                                        <p>Carbon monoxide level in your blood drops to normal</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot" style={{ backgroundColor: '#3498db' }}></div>
                                    <div className="timeline-content">
                                        <h3>2 Weeks to 3 Months</h3>
                                        <p>Your circulation improves and lung function increases</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot" style={{ backgroundColor: '#2ecc71' }}></div>
                                    <div className="timeline-content">
                                        <h3>1 to 9 Months</h3>
                                        <p>Coughing and shortness of breath decrease</p>
                                    </div>
                                </div>
                                <div className="timeline-item">
                                    <div className="timeline-dot" style={{ backgroundColor: '#9b59b6' }}></div>
                                    <div className="timeline-content">
                                        <h3>1 Year</h3>
                                        <p>Risk of coronary heart disease is half that of a smoker</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Doctor Cards */}
                    <div className="chat-section">
                        <div className="card chat-card">
                            <h2 className="section-title">Communication with Doctor</h2>

                            <div className="chat-messages">
                                {Object.entries(groupedChatMessages).map(([date, messages]) => (
                                    <div key={date} className="chat-date-group">
                                        <div className="chat-date-divider">
                                            <span>{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        {messages.map(message => (
                                            <div
                                                key={message.id}
                                                className={`chat-message ${message.sender === 'You' ? 'message-outgoing' : 'message-incoming'}`}
                                            >
                                                <div className="message-header">
                                                    <span className="message-sender">{message.sender}</span>
                                                    <span className="message-time">{message.time}</span>
                                                </div>
                                                <div className="message-body">{message.message}</div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>

                            <form className="chat-input-form" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="chat-input"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="chat-send-button">
                                    Send
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .track-status-page {
                    min-height: 100vh;
                    background-color: var(--background-color);
                }
                
                .page-header {
                    text-align: center;
                    margin: 2rem 0 3rem;
                    position: relative;
                }
                
                .page-title {
                    font-size: 2.2rem;
                    color: var(--primary-color);
                    position: relative;
                    display: inline-block;
                    margin-bottom: 1rem;
                    font-weight: 700;
                }
                
                .page-title::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 4px;
                    background-color: var(--secondary-color);
                    border-radius: 2px;
                }
                
                .page-description {
                    color: var(--text-light);
                    max-width: 600px;
                    margin: 0 auto;
                    font-size: 1.1rem;
                }
                
                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 2rem;
                    margin-bottom: 3rem;
                }
                
                @media (max-width: 992px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                }
                
                .card {
                    background-color: var(--white);
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--box-shadow);
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: 150px 1fr;
                    row-gap: 1rem;
                    font-size: 1.1rem;
                }
                
                .info-label {
                    font-weight: 600;
                    color: var(--gray-700);
                }
                
                .achievement-badge {
                    display: inline-block;
                    padding: 0.35rem 0.75rem;
                    background-color: var(--secondary-light);
                    color: var(--secondary-color);
                    font-weight: 700;
                    border-radius: var(--border-radius-pill);
                    font-size: 0.9rem;
                }
                
                .timeline {
                    margin-top: 1.5rem;
                }
                
                .timeline-item {
                    display: flex;
                    margin-bottom: 1.5rem;
                    position: relative;
                }
                
                .timeline-item:not(:last-child)::after {
                    content: '';
                    position: absolute;
                    top: 30px;
                    left: 14px;
                    width: 2px;
                    height: calc(100% - 10px);
                    background-color: var(--gray-200);
                }
                
                .timeline-dot {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    margin-right: 1rem;
                    flex-shrink: 0;
                    z-index: 1;
                }
                
                .timeline-content h3 {
                    font-size: 1.1rem;
                    margin-bottom: 0.25rem;
                    color: var(--text-dark);
                }
                
                .timeline-content p {
                    margin: 0;
                    font-size: 0.95rem;
                    color: var(--text-light);
                }
                
                .chat-section {
                    margin-bottom: 1.5rem;
                }
                
                .chat-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    padding: 1.5rem;
                    box-shadow: var(--box-shadow);
                    background-color: var(--white);
                    border-radius: var(--border-radius-lg);
                }
                
                .chat-messages {
                    flex-grow: 1;
                    overflow-y: auto;
                    max-height: 500px;
                    margin-bottom: 1rem;
                    padding-right: 0.5rem;
                }
                
                .chat-date-group {
                    margin-bottom: 1rem;
                }
                
                .chat-date-divider {
                    text-align: center;
                    position: relative;
                    margin: 1.5rem 0;
                }
                
                .chat-date-divider::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background-color: var(--gray-200);
                    z-index: 1;
                }
                
                .chat-date-divider span {
                    display: inline-block;
                    background-color: var(--white);
                    padding: 0 1rem;
                    position: relative;
                    z-index: 2;
                    font-size: 0.85rem;
                    color: var(--gray-600);
                    font-weight: 500;
                }
                
                .chat-message {
                    display: flex;
                    flex-direction: column;
                    padding: 1rem;
                    border-radius: var(--border-radius);
                    margin-bottom: 1rem;
                    max-width: 80%;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                
                .message-incoming {
                    background-color: var(--gray-100);
                    align-self: flex-start;
                    border-top-left-radius: 0;
                    border-left: 3px solid var(--primary-color);
                }
                
                .message-outgoing {
                    background-color: var(--secondary-light);
                    align-self: flex-end;
                    margin-left: auto;
                    border-top-right-radius: 0;
                    border-right: 3px solid var(--secondary-color);
                }
                
                .message-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }
                
                .message-sender {
                    font-weight: 600;
                    color: var(--text-dark);
                }
                
                .message-time {
                    color: var(--gray-600);
                }
                
                .message-body {
                    font-size: 1rem;
                    color: var(--text-dark);
                    word-wrap: break-word;
                }
                
                .chat-input-form {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 1rem;
                    position: relative;
                    border-top: 1px solid var(--gray-200);
                    padding-top: 1rem;
                }
                
                .chat-input {
                    flex: 1;
                    padding: 0.8rem 1.2rem;
                    border-radius: 30px;
                    border: 1px solid var(--gray-200);
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.3s;
                    background-color: var(--gray-50);
                }
                
                .chat-input:focus {
                    border-color: var(--secondary-color);
                    box-shadow: 0 0 0 2px rgba(68, 184, 157, 0.2);
                    background-color: white;
                }
                
                .chat-send-button {
                    background-color: var(--secondary-color);
                    color: white;
                    border: none;
                    border-radius: 30px;
                    padding: 0.8rem 1.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    box-shadow: 0 2px 4px rgba(53, 167, 156, 0.3);
                }
                
                .chat-send-button:hover {
                    background-color: #35a79c;
                }
            `}</style>
        </div>
    );
};

export default TrackStatus; 