import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';
import Header from '../components/Header';

const WorkSchedulePage = () => {
    const [currentView, setCurrentView] = useState('week'); // 'day', 'week', or 'month'
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Sample schedule data
    const scheduleData = [
        { id: 1, title: 'Tư vấn: Nguyễn Văn A', date: '2023-09-15', time: '09:00 - 10:00', type: 'appointment', status: 'confirmed' },
        { id: 2, title: 'Tư vấn: Trần Thị B', date: '2023-09-15', time: '14:00 - 15:00', type: 'appointment', status: 'confirmed' },
        { id: 3, title: 'Theo dõi tiến độ: Lê Văn C', date: '2023-09-16', time: '10:00 - 11:00', type: 'follow-up', status: 'confirmed' },
        { id: 4, title: 'Hội nghị cai thuốc lá', date: '2023-09-18', time: '13:00 - 17:00', type: 'event', status: 'confirmed' },
        { id: 5, title: 'Tư vấn: Phạm Văn D', date: '2023-09-19', time: '09:30 - 10:30', type: 'appointment', status: 'pending' },
    ];

    return (
        <div className="work-schedule-page">
            <Header userName={userName} />
            <SecondaryNavigationDoctor />

            <div className="container py-5">
                <h1 className="page-title">Thông Tin Lịch Làm Việc</h1>
                <p className="page-description">
                    Xem và quản lý lịch làm việc, lịch tư vấn bệnh nhân của bạn
                </p>

                <div className="content-section mt-4">
                    <div className="schedule-header">
                        <div className="view-toggles">
                            <button
                                className={`view-toggle ${currentView === 'day' ? 'active' : ''}`}
                                onClick={() => setCurrentView('day')}
                            >
                                Ngày
                            </button>
                            <button
                                className={`view-toggle ${currentView === 'week' ? 'active' : ''}`}
                                onClick={() => setCurrentView('week')}
                            >
                                Tuần
                            </button>
                            <button
                                className={`view-toggle ${currentView === 'month' ? 'active' : ''}`}
                                onClick={() => setCurrentView('month')}
                            >
                                Tháng
                            </button>
                        </div>
                        <div className="date-navigation">
                            <button className="nav-button">«</button>
                            <span className="current-date">15 - 21 Tháng 9, 2023</span>
                            <button className="nav-button">»</button>
                        </div>
                        <button className="add-event-button">+ Thêm lịch</button>
                    </div>

                    <div className="schedule-grid mt-4">
                        <div className="time-column">
                            <div className="time-header">Giờ</div>
                            {Array.from({ length: 12 }).map((_, index) => (
                                <div key={index} className="time-slot">
                                    {index + 8}:00
                                </div>
                            ))}
                        </div>

                        {['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'].map((day, dayIndex) => (
                            <div key={dayIndex} className="day-column">
                                <div className="day-header">
                                    <div className="day-name">{day}</div>
                                    <div className="day-date">{15 + dayIndex}/09</div>
                                </div>

                                <div className="day-slots">
                                    {Array.from({ length: 12 }).map((_, hour) => (
                                        <div key={hour} className="hour-slot">
                                            {scheduleData
                                                .filter(event => {
                                                    const eventDay = parseInt(event.date.split('-')[2]);
                                                    return eventDay === 15 + dayIndex && parseInt(event.time.split(':')[0]) === hour + 8;
                                                })
                                                .map(event => (
                                                    <div key={event.id} className={`event-item ${event.type} ${event.status}`}>
                                                        <div className="event-time">{event.time}</div>
                                                        <div className="event-title">{event.title}</div>
                                                    </div>
                                                ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="upcoming-events mt-4">
                        <h3>Lịch sắp tới</h3>
                        <div className="events-list">
                            {scheduleData.map(event => (
                                <div key={event.id} className={`event-card ${event.type} ${event.status}`}>
                                    <div className="event-date">{event.date.replace(/-/g, '/')} • {event.time}</div>
                                    <div className="event-title">{event.title}</div>
                                    <div className="event-status">
                                        {event.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                                    </div>
                                    <div className="event-actions">
                                        <button className="action-button">Chi tiết</button>
                                        {event.status === 'pending' && (
                                            <button className="action-button confirm">Xác nhận</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .work-schedule-page {
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
                
                .page-title {
                    font-size: 2.2rem;
                    color: #35a79c;
                    margin-bottom: 0.5rem;
                    text-align: center;
                }
                
                .page-description {
                    color: #5a6a6e;
                    margin-bottom: 2rem;
                    text-align: center;
                    font-size: 1.1rem;
                }
                
                .content-section {
                    background: white;
                    border-radius: 8px;
                    padding: 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .mt-4 {
                    margin-top: 1.5rem;
                }
                
                .schedule-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .view-toggles {
                    display: flex;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    overflow: hidden;
                }
                
                .view-toggle {
                    background: #f8f9fa;
                    border: none;
                    padding: 0.5rem 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .view-toggle.active {
                    background: #35a79c;
                    color: white;
                }
                
                .date-navigation {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .nav-button {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: 1px solid #ddd;
                    background: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .nav-button:hover {
                    background: #f1f1f1;
                }
                
                .current-date {
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .add-event-button {
                    padding: 0.5rem 1rem;
                    background: #35a79c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                
                .add-event-button:hover {
                    background: #2c9085;
                }
                
                .schedule-grid {
                    display: flex;
                    overflow-x: auto;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                
                .time-column {
                    min-width: 80px;
                    border-right: 1px solid #ddd;
                    background: #f8f9fa;
                }
                
                .time-header, .day-header {
                    height: 80px;
                    padding: 0.5rem;
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    font-weight: 500;
                }
                
                .time-slot {
                    height: 60px;
                    padding: 0.5rem;
                    border-bottom: 1px solid #ddd;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #7f8c8d;
                    font-size: 0.9rem;
                }
                
                .day-column {
                    flex: 1;
                    min-width: 150px;
                    border-right: 1px solid #ddd;
                }
                
                .day-column:last-child {
                    border-right: none;
                }
                
                .day-name {
                    font-weight: 600;
                    color: #2c3e50;
                }
                
                .day-date {
                    font-size: 0.9rem;
                    color: #7f8c8d;
                    margin-top: 0.25rem;
                }
                
                .hour-slot {
                    height: 60px;
                    padding: 0.25rem;
                    border-bottom: 1px solid #ddd;
                    position: relative;
                }
                
                .event-item {
                    position: absolute;
                    left: 5px;
                    right: 5px;
                    min-height: 50px;
                    padding: 0.5rem;
                    border-radius: 4px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    font-size: 0.9rem;
                    overflow: hidden;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 1;
                }
                
                .event-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
                }
                
                .event-item.appointment {
                    background-color: rgba(52, 152, 219, 0.15);
                    border-left: 3px solid #3498db;
                }
                
                .event-item.follow-up {
                    background-color: rgba(155, 89, 182, 0.15);
                    border-left: 3px solid #9b59b6;
                }
                
                .event-item.event {
                    background-color: rgba(46, 204, 113, 0.15);
                    border-left: 3px solid #2ecc71;
                }
                
                .event-item.pending {
                    background-color: rgba(241, 196, 15, 0.15);
                    border-left: 3px solid #f1c40f;
                }
                
                .event-time {
                    font-size: 0.8rem;
                    color: #7f8c8d;
                    margin-bottom: 0.25rem;
                }
                
                .event-title {
                    font-weight: 500;
                    color: #2c3e50;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                
                .upcoming-events h3 {
                    font-size: 1.3rem;
                    color: #2c3e50;
                    margin-bottom: 1rem;
                }
                
                .events-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1rem;
                }
                
                .event-card {
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .event-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                }
                
                .event-card.appointment {
                    background-color: rgba(52, 152, 219, 0.05);
                    border-left: 3px solid #3498db;
                }
                
                .event-card.follow-up {
                    background-color: rgba(155, 89, 182, 0.05);
                    border-left: 3px solid #9b59b6;
                }
                
                .event-card.event {
                    background-color: rgba(46, 204, 113, 0.05);
                    border-left: 3px solid #2ecc71;
                }
                
                .event-card.pending {
                    background-color: rgba(241, 196, 15, 0.05);
                    border-left: 3px solid #f1c40f;
                }
                
                .event-date {
                    font-size: 0.9rem;
                    color: #7f8c8d;
                    margin-bottom: 0.5rem;
                }
                
                .event-status {
                    font-size: 0.85rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.75rem;
                    font-weight: 500;
                }
                
                .event-card.confirmed .event-status {
                    color: #27ae60;
                }
                
                .event-card.pending .event-status {
                    color: #f39c12;
                }
                
                .event-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }
                
                .action-button {
                    padding: 0.4rem 0.8rem;
                    border-radius: 4px;
                    background: #f8f9fa;
                    border: 1px solid #ddd;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .action-button:hover {
                    background: #f1f1f1;
                }
                
                .action-button.confirm {
                    background: #2ecc71;
                    border: 1px solid #27ae60;
                    color: white;
                }
                
                .action-button.confirm:hover {
                    background: #27ae60;
                }
                
                @media (max-width: 992px) {
                    .schedule-grid {
                        min-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default WorkSchedulePage; 