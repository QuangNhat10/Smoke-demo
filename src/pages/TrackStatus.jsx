import React from 'react';
import { FaClock, FaUser, FaCalendarCheck, FaTrophy, FaComment, FaRegSmile } from 'react-icons/fa';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import '../styles/global.css';

const TrackStatus = () => {
    // Mock user data
    const userData = {
        name: 'John Doe',
        gender: 'Male',
        age: 35,
        smokingDuration: 15, // years
        consultingDoctor: 'Dr. Sarah Johnson',
        quittingDuration: 30, // days
        achievements: ['1 Week Smoke-Free', '1 Month Smoke-Free'],
        nextAchievement: '3 Months Smoke-Free',
        nextAchievementDays: 60
    };

    // Health improvement timeline data
    const timelineData = [
        {
            time: '20 minutes',
            title: 'Heart rate dropped',
            description: 'Your heart rate and blood pressure drop to normal.',
            achieved: true
        },
        {
            time: '12 hours',
            title: 'Carbon monoxide levels dropped',
            description: 'The carbon monoxide level in your blood drops to normal.',
            achieved: true
        },
        {
            time: '2-3 days',
            title: 'Taste and smell improved',
            description: 'Your sense of taste and smell improves.',
            achieved: true
        },
        {
            time: '2-3 weeks',
            title: 'Circulation improved',
            description: 'Your circulation improves and lung function increases.',
            achieved: true
        },
        {
            time: '1-9 months',
            title: 'Coughing and shortness of breath decreased',
            description: 'Your coughing and shortness of breath decrease.',
            achieved: userData.quittingDuration >= 30,
            current: userData.quittingDuration < 30 && userData.quittingDuration >= 28
        },
        {
            time: '1 year',
            title: 'Coronary heart disease risk reduced',
            description: 'Your risk of coronary heart disease is about half that of a smoker.',
            achieved: false,
            current: userData.quittingDuration >= 335 && userData.quittingDuration < 365
        },
        {
            time: '5 years',
            title: 'Stroke risk reduced',
            description: 'Your stroke risk is reduced to that of a nonsmoker.',
            achieved: false
        },
        {
            time: '10 years',
            title: 'Lung cancer risk reduced',
            description: 'Your risk of lung cancer falls to about half that of a smoker.',
            achieved: false
        },
        {
            time: '15 years',
            title: 'Heart disease risk normalized',
            description: 'Your risk of heart disease is that of a non-smoker.',
            achieved: false
        }
    ];

    // Mock chat messages
    const chatMessages = [
        {
            date: 'Today',
            messages: [
                {
                    id: 1,
                    sender: 'Dr. Sarah Johnson',
                    message: 'Hello John, how are you feeling today?',
                    time: '10:30 AM',
                    isUser: false
                },
                {
                    id: 2,
                    sender: 'You',
                    message: 'I\'m doing well. I haven\'t smoked for 30 days now!',
                    time: '10:35 AM',
                    isUser: true
                },
                {
                    id: 3,
                    sender: 'Dr. Sarah Johnson',
                    message: 'That\'s fantastic progress! How are you managing cravings?',
                    time: '10:38 AM',
                    isUser: false
                }
            ]
        },
        {
            date: 'Yesterday',
            messages: [
                {
                    id: 4,
                    sender: 'You',
                    message: 'I had a strong craving today after lunch. What should I do when this happens?',
                    time: '2:15 PM',
                    isUser: true
                },
                {
                    id: 5,
                    sender: 'Dr. Sarah Johnson',
                    message: 'Try the 4Ds: Delay, Deep breathe, Drink water, and Do something else. Cravings typically pass within 3-5 minutes.',
                    time: '2:20 PM',
                    isUser: false
                }
            ]
        }
    ];

    return (
        <div className="track-status-page">
            <Header isLoggedIn={true} />
            <SecondaryNavigation />

            <main className="container py-6">
                <h1 className="mb-6">Your Quitting Journey</h1>

                {/* Personal Information Section */}
                <div className="card shadow rounded-lg p-6 bg-white mb-6">
                    <h2 className="mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="info-item flex items-center mb-3">
                                <FaUser className="mr-2 text-primary" />
                                <span className="font-semibold mr-2">Name:</span>
                                <span>{userData.name}</span>
                            </div>
                            <div className="info-item flex items-center mb-3">
                                <span className="info-icon mr-2">♂</span>
                                <span className="font-semibold mr-2">Gender:</span>
                                <span>{userData.gender}</span>
                            </div>
                            <div className="info-item flex items-center mb-3">
                                <span className="info-icon mr-2">🎂</span>
                                <span className="font-semibold mr-2">Age:</span>
                                <span>{userData.age} years</span>
                            </div>
                            <div className="info-item flex items-center mb-3">
                                <span className="info-icon mr-2">🚬</span>
                                <span className="font-semibold mr-2">Smoking duration:</span>
                                <span>{userData.smokingDuration} years</span>
                            </div>
                        </div>
                        <div>
                            <div className="info-item flex items-center mb-3">
                                <span className="info-icon mr-2">👨‍⚕️</span>
                                <span className="font-semibold mr-2">Consulting doctor:</span>
                                <span>{userData.consultingDoctor}</span>
                            </div>
                            <div className="info-item flex items-center mb-3">
                                <FaClock className="mr-2 text-primary" />
                                <span className="font-semibold mr-2">Quitting for:</span>
                                <span>{userData.quittingDuration} days</span>
                            </div>
                            <div className="info-item flex items-center mb-3">
                                <FaTrophy className="mr-2 text-warning" />
                                <span className="font-semibold mr-2">Achievements:</span>
                                <span>{userData.achievements.join(', ')}</span>
                            </div>
                            <div className="info-item flex items-center mb-3">
                                <FaCalendarCheck className="mr-2 text-secondary" />
                                <span className="font-semibold mr-2">Next achievement:</span>
                                <span>{userData.nextAchievement} (in {userData.nextAchievementDays} days)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Improvements Timeline */}
                <div className="card shadow rounded-lg p-6 bg-white mb-6">
                    <h2 className="mb-4">Health Improvements Timeline</h2>
                    <div className="timeline">
                        {timelineData.map((item, index) => (
                            <div
                                key={index}
                                className={`timeline-item ${item.achieved ? 'achieved' : ''} ${item.current ? 'current' : ''}`}
                            >
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h3 className="timeline-title">
                                        {item.time}: {item.title}
                                        {item.achieved && <FaRegSmile className="ml-2 text-secondary" />}
                                    </h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat with Doctor */}
                <div className="card shadow rounded-lg p-6 bg-white">
                    <h2 className="mb-4 flex items-center">
                        <FaComment className="mr-2" />
                        Chat with Doctor
                    </h2>
                    <div className="chat-container">
                        {chatMessages.map((dateGroup, groupIndex) => (
                            <div key={groupIndex} className="chat-date-group">
                                <div className="chat-date-divider">
                                    <span>{dateGroup.date}</span>
                                </div>
                                {dateGroup.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`chat-message ${message.isUser ? 'user-message' : 'doctor-message'}`}
                                    >
                                        <div className="message-sender">{message.sender}</div>
                                        <div className="message-bubble">{message.message}</div>
                                        <div className="message-time">{message.time}</div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="chat-input-container mt-4">
                        <input
                            type="text"
                            className="chat-input w-full p-3 border rounded-lg"
                            placeholder="Type your message here..."
                        />
                        <button className="btn btn-primary mt-2 w-full">Send Message</button>
                    </div>
                </div>
            </main>

            <style jsx>{`
        /* Timeline styling */
        .timeline {
          position: relative;
          padding-left: 2rem;
          margin-left: 1rem;
          border-left: 2px solid var(--gray-200);
        }
        
        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
        }
        
        .timeline-marker {
          position: absolute;
          left: -2.7rem;
          top: 0.2rem;
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
          background-color: var(--gray-300);
          border: 2px solid var(--white);
        }
        
        .timeline-item.achieved .timeline-marker {
          background-color: var(--secondary);
        }
        
        .timeline-item.current .timeline-marker {
          background-color: var(--primary);
          animation: pulse 2s infinite;
        }
        
        .timeline-title {
          display: flex;
          align-items: center;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        /* Chat styling */
        .chat-container {
          max-height: 400px;
          overflow-y: auto;
          padding-right: 1rem;
          margin-bottom: 1rem;
        }
        
        .chat-date-divider {
          text-align: center;
          margin: 1rem 0;
          position: relative;
        }
        
        .chat-date-divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background-color: var(--gray-200);
          z-index: 1;
        }
        
        .chat-date-divider span {
          background-color: var(--white);
          padding: 0 1rem;
          position: relative;
          z-index: 2;
          color: var(--gray-600);
          font-size: 0.9rem;
        }
        
        .chat-message {
          margin-bottom: 1rem;
          max-width: 80%;
        }
        
        .user-message {
          margin-left: auto;
          text-align: right;
        }
        
        .doctor-message {
          margin-right: auto;
        }
        
        .message-sender {
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
          color: var(--gray-600);
        }
        
        .message-bubble {
          padding: 0.8rem 1rem;
          border-radius: var(--border-radius-lg);
          display: inline-block;
        }
        
        .user-message .message-bubble {
          background-color: var(--primary-light);
          color: var(--primary-dark);
          border-radius: var(--border-radius-lg) 0 var(--border-radius-lg) var(--border-radius-lg);
        }
        
        .doctor-message .message-bubble {
          background-color: var(--gray-100);
          color: var(--gray-800);
          border-radius: 0 var(--border-radius-lg) var(--border-radius-lg) var(--border-radius-lg);
        }
        
        .message-time {
          font-size: 0.8rem;
          color: var(--gray-500);
          margin-top: 0.3rem;
        }
        
        .info-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          color: var(--primary);
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
      `}</style>
        </div>
    );
};

export default TrackStatus; 