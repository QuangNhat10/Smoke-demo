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
    const [message, setMessage] = useState(''); // Nội dung tin nhắn hiện tại
    const [activePatient, setActivePatient] = useState(1); // ID của bệnh nhân đang chat hiện tại
    const navigate = useNavigate();
    const [userName, setUserName] = useState(''); // Tên người dùng bác sĩ

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Dữ liệu mẫu danh sách bệnh nhân
    const patients = [
        { id: 1, name: 'Nguyễn Văn A', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', lastMessage: 'Bác sĩ ơi, tôi đang gặp khó khăn khi cai thuốc', time: '10:30', unread: 2 },
        { id: 2, name: 'Trần Thị B', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', lastMessage: 'Xin cảm ơn bác sĩ', time: '09:15', unread: 0 },
        { id: 3, name: 'Lê Văn C', avatar: 'https://randomuser.me/api/portraits/men/67.jpg', lastMessage: 'Tôi sẽ thực hiện theo kế hoạch', time: 'Hôm qua', unread: 0 },
        { id: 4, name: 'Phạm Thị D', avatar: 'https://randomuser.me/api/portraits/women/33.jpg', lastMessage: 'Tôi đã được 1 tuần không hút thuốc', time: 'Hôm qua', unread: 0 },
        { id: 5, name: 'Hoàng Văn E', avatar: 'https://randomuser.me/api/portraits/men/81.jpg', lastMessage: 'Bác sĩ có thể tư vấn thêm cho tôi được không?', time: '04-09', unread: 1 },
    ];

    // Dữ liệu mẫu cuộc trò chuyện cho từng bệnh nhân
    const conversations = {
        1: [
            { id: 1, sender: 'patient', text: 'Xin chào bác sĩ, tôi là Nguyễn Văn A', time: '10:00' },
            { id: 2, sender: 'doctor', text: 'Chào anh A, tôi có thể giúp gì cho anh?', time: '10:05' },
            { id: 3, sender: 'patient', text: 'Tôi đang thực hiện kế hoạch cai thuốc lá, nhưng gặp khó khăn vào ngày thứ 3', time: '10:10' },
            { id: 4, sender: 'patient', text: 'Tôi cảm thấy rất khó chịu và thèm thuốc', time: '10:12' },
            { id: 5, sender: 'doctor', text: 'Đây là phản ứng hoàn toàn bình thường, anh A. Cơ thể đang thích nghi với việc không có nicotine.', time: '10:20' },
            { id: 6, sender: 'doctor', text: 'Tôi gợi ý anh thử các phương pháp thay thế như: nhai kẹo cao su không đường, uống nhiều nước, và tập thể dục nhẹ nhàng khi cảm thấy thèm thuốc.', time: '10:22' },
            { id: 7, sender: 'patient', text: 'Bác sĩ ơi, tôi đang gặp khó khăn khi cai thuốc', time: '10:30' },
        ],
        2: [
            { id: 1, sender: 'doctor', text: 'Chào chị B, hôm nay chị cảm thấy thế nào?', time: '09:00' },
            { id: 2, sender: 'patient', text: 'Chào bác sĩ, hôm nay tôi cảm thấy tốt hơn nhiều', time: '09:05' },
            { id: 3, sender: 'doctor', text: 'Tuyệt vời! Chị đã thực hiện kế hoạch cai thuốc được bao lâu rồi?', time: '09:07' },
            { id: 4, sender: 'patient', text: 'Được 2 tuần rồi bác sĩ ạ. Những ngày đầu rất khó khăn, nhưng bây giờ tôi đã quen dần.', time: '09:10' },
            { id: 5, sender: 'doctor', text: 'Chị đã làm rất tốt. Hãy tiếp tục duy trì và thông báo cho tôi nếu gặp bất kỳ khó khăn nào.', time: '09:12' },
            { id: 6, sender: 'patient', text: 'Xin cảm ơn bác sĩ', time: '09:15' },
        ]
    };

    /**
     * Xử lý gửi tin nhắn
     * Kiểm tra nội dung tin nhắn không rỗng và gửi tin nhắn
     * Trong ứng dụng thực tế, sẽ gửi tin nhắn đến server
     */
    const handleSendMessage = () => {
        if (message.trim() === '') return;

        // Trong ứng dụng thực tế, sẽ gửi tin nhắn đến server
        // Hiện tại chỉ xóa nội dung input
        setMessage('');
    };

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
                            />
                        </div>

                        <div className="patient-list">
                            {patients.map(patient => (
                                <div
                                    key={patient.id}
                                    className={`patient-item ${activePatient === patient.id ? 'active' : ''}`}
                                    onClick={() => setActivePatient(patient.id)}
                                >
                                    <div className="avatar-container">
                                        <img
                                            src={patient.avatar}
                                            alt={patient.name}
                                            className="patient-avatar"
                                        />
                                        {patient.unread > 0 && (
                                            <span className="unread-badge">{patient.unread}</span>
                                        )}
                                    </div>
                                    <div className="patient-info">
                                        <div className="patient-header">
                                            <span className="patient-name">{patient.name}</span>
                                            <span className="message-time">{patient.time}</span>
                                        </div>
                                        <p className="last-message">{patient.lastMessage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="chat-main">
                        <div className="chat-header">
                            <img
                                src={patients.find(p => p.id === activePatient)?.avatar}
                                alt={patients.find(p => p.id === activePatient)?.name}
                                className="header-avatar"
                            />
                            <div className="header-info">
                                <h3 className="header-name">{patients.find(p => p.id === activePatient)?.name}</h3>
                                <span className="header-status online">Trực tuyến</span>
                            </div>
                            <div className="header-actions">
                                <button className="action-button">
                                    <i className="fas fa-phone"></i>
                                </button>
                                <button className="action-button">
                                    <i className="fas fa-video"></i>
                                </button>
                                <button className="action-button">
                                    <i className="fas fa-info-circle"></i>
                                </button>
                            </div>
                        </div>

                        <div className="chat-messages">
                            {conversations[activePatient]?.map(msg => (
                                <div key={msg.id} className={`message ${msg.sender === 'doctor' ? 'sent' : 'received'}`}>
                                    {msg.sender === 'patient' && (
                                        <img
                                            src={patients.find(p => p.id === activePatient)?.avatar}
                                            alt="avatar"
                                            className="message-avatar"
                                        />
                                    )}
                                    <div className="message-content">
                                        <p className="message-text">{msg.text}</p>
                                        <span className="message-time">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="chat-input">
                            <button className="attachment-button">
                                <i className="fas fa-paperclip"></i>
                            </button>
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
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>

                    <div className="patient-details">
                        <h3 className="details-header">Thông tin bệnh nhân</h3>

                        <div className="patient-profile">
                            <img
                                src={patients.find(p => p.id === activePatient)?.avatar}
                                alt={patients.find(p => p.id === activePatient)?.name}
                                className="profile-avatar"
                            />
                            <h4 className="profile-name">{patients.find(p => p.id === activePatient)?.name}</h4>
                            <p className="profile-status online">Trực tuyến</p>
                        </div>

                        <div className="details-section">
                            <h5 className="section-title">Thông tin cá nhân</h5>
                            <div className="detail-item">
                                <span className="detail-label">Tuổi:</span>
                                <span className="detail-value">45</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Giới tính:</span>
                                <span className="detail-value">Nam</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Điện thoại:</span>
                                <span className="detail-value">0912 345 678</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">nguyenvana@gmail.com</span>
                            </div>
                        </div>

                        <div className="details-section">
                            <h5 className="section-title">Thông tin cai thuốc</h5>
                            <div className="detail-item">
                                <span className="detail-label">Thời gian cai:</span>
                                <span className="detail-value">30 ngày</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Loại kế hoạch:</span>
                                <span className="detail-value">Cai thuốc lá dần dần</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Tiến độ:</span>
                                <div className="progress-container">
                                    <div className="progress-bar">
                                        <div className="progress" style={{ width: '70%' }}></div>
                                    </div>
                                    <span className="progress-value">70%</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-actions">
                            <button className="detail-button view-plan">Xem kế hoạch</button>
                            <button className="detail-button view-profile">Hồ sơ đầy đủ</button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
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
                
                .unread-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background-color: #e74c3c;
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 0.75rem;
                    font-weight: 600;
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