import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AdminPage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [activeTab, setActiveTab] = useState('doctor-slots');
    const [doctors, setDoctors] = useState([
        { id: 1, name: 'Bs. Nguyễn Văn A', specialty: 'Tim mạch', workDays: ['Thứ 2', 'Thứ 3', 'Thứ 5'] },
        { id: 2, name: 'Bs. Trần Thị B', specialty: 'Hô hấp', workDays: ['Thứ 4', 'Thứ 6', 'Thứ 7'] },
        { id: 3, name: 'Bs. Lê Văn C', specialty: 'Tâm lý', workDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'] },
    ]);

    const [appointments, setAppointments] = useState([
        { id: 1, doctorId: 1, patientName: 'Nguyễn Văn D', date: '2023-10-15', time: '09:00', status: 'confirmed' },
        { id: 2, doctorId: 2, patientName: 'Trần Thị E', date: '2023-10-16', time: '10:30', status: 'pending' },
        { id: 3, doctorId: 3, patientName: 'Lê Văn F', date: '2023-10-17', time: '14:00', status: 'confirmed' },
    ]);

    const [users, setUsers] = useState([
        { id: 1, username: 'doctor1', fullName: 'Nguyễn Văn A', role: 'Doctor', status: 'active' },
        { id: 2, username: 'doctor2', fullName: 'Trần Thị B', role: 'Doctor', status: 'active' },
        { id: 3, username: 'patient1', fullName: 'Nguyễn Văn D', role: 'Member', status: 'active' },
        { id: 4, username: 'admin', fullName: 'Admin', role: 'Admin', status: 'active' },
    ]);

    const [timeSlots, setTimeSlots] = useState([
        '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
    ]);

    const [weekDays, setWeekDays] = useState([
        'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'
    ]);

    useEffect(() => {
        // Kiểm tra người dùng có phải là admin không
        const storedUserName = localStorage.getItem('userName');
        const userRole = localStorage.getItem('userRole');

        if (storedUserName && userRole === 'Admin') {
            setUserName(storedUserName);
        } else {
            // Nếu không phải admin, chuyển về trang login
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdateDoctorSlot = (doctorId, day, available) => {
        // Logic cập nhật slot cho bác sĩ
        setDoctors(doctors.map(doctor => {
            if (doctor.id === doctorId) {
                const updatedWorkDays = available
                    ? [...doctor.workDays, day]
                    : doctor.workDays.filter(d => d !== day);

                return {
                    ...doctor,
                    workDays: updatedWorkDays
                };
            }
            return doctor;
        }));
    };

    const handleUpdateAppointment = (appointmentId, status) => {
        // Logic cập nhật trạng thái lịch hẹn
        setAppointments(appointments.map(app =>
            app.id === appointmentId ? { ...app, status } : app
        ));
    };

    const handleUpdateUserRole = (userId, role) => {
        // Logic cập nhật vai trò người dùng
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role } : user
        ));
    };

    const handleCreateSlot = (e) => {
        e.preventDefault();
        // Logic tạo slot mới
        console.log("Tạo slot mới");
    };

    return (
        <div className="admin-page">
            <Header userName={userName} />

            <div className="container py-5">
                <h1 className="page-title">Trang Quản Trị</h1>

                <div className="admin-tabs">
                    <button
                        className={`tab-button ${activeTab === 'doctor-slots' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doctor-slots')}
                    >
                        Quản lý Slot Bác sĩ
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'appointments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        Quản lý Lịch hẹn
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Quản lý Người dùng
                    </button>
                </div>

                <div className="content-section mt-4">
                    {/* Quản lý slot bác sĩ */}
                    {activeTab === 'doctor-slots' && (
                        <div className="doctor-slots-section">
                            <div className="section-header">
                                <h2>Quản lý Slot làm việc của Bác sĩ</h2>
                                <button className="create-button" onClick={() => document.getElementById('create-slot-form').style.display = 'block'}>
                                    + Tạo Slot mới
                                </button>
                            </div>

                            {/* Form tạo slot */}
                            <div id="create-slot-form" className="create-form" style={{ display: 'none' }}>
                                <h3>Tạo slot mới</h3>
                                <form onSubmit={handleCreateSlot}>
                                    <div className="form-group">
                                        <label>Bác sĩ:</label>
                                        <select className="form-control">
                                            {doctors.map(doctor => (
                                                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày:</label>
                                        <select className="form-control">
                                            {weekDays.map(day => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Thời gian:</label>
                                        <div className="time-slots">
                                            {timeSlots.map(time => (
                                                <div key={time} className="time-slot-checkbox">
                                                    <input type="checkbox" id={`time-${time}`} />
                                                    <label htmlFor={`time-${time}`}>{time}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="save-button">Lưu</button>
                                        <button type="button" className="cancel-button" onClick={() => document.getElementById('create-slot-form').style.display = 'none'}>
                                            Huỷ
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Bảng slot bác sĩ */}
                            <div className="doctor-schedule-grid">
                                <table className="schedule-table">
                                    <thead>
                                        <tr>
                                            <th>Bác sĩ</th>
                                            {weekDays.map(day => (
                                                <th key={day}>{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {doctors.map(doctor => (
                                            <tr key={doctor.id}>
                                                <td>{doctor.name}<br /><small>{doctor.specialty}</small></td>
                                                {weekDays.map(day => (
                                                    <td key={day} className={doctor.workDays.includes(day) ? 'available' : 'unavailable'}>
                                                        <div className="slot-status">
                                                            {doctor.workDays.includes(day) ? 'Có lịch' : 'Không có lịch'}
                                                        </div>
                                                        <button
                                                            className={`slot-toggle-button ${doctor.workDays.includes(day) ? 'remove' : 'add'}`}
                                                            onClick={() => handleUpdateDoctorSlot(doctor.id, day, !doctor.workDays.includes(day))}
                                                        >
                                                            {doctor.workDays.includes(day) ? 'Huỷ lịch' : 'Thêm lịch'}
                                                        </button>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Quản lý lịch hẹn */}
                    {activeTab === 'appointments' && (
                        <div className="appointments-section">
                            <h2>Quản lý Lịch hẹn</h2>

                            <div className="filters">
                                <div className="search-box">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm lịch hẹn..."
                                        className="search-input"
                                    />
                                    <button className="search-button">Tìm</button>
                                </div>
                                <div className="filter-options">
                                    <select className="filter-select">
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="confirmed">Đã xác nhận</option>
                                        <option value="pending">Đang chờ</option>
                                        <option value="cancelled">Đã hủy</option>
                                    </select>
                                </div>
                            </div>

                            <div className="appointments-table-container">
                                <table className="appointments-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Bệnh nhân</th>
                                            <th>Bác sĩ</th>
                                            <th>Ngày</th>
                                            <th>Giờ</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map(appointment => {
                                            const doctor = doctors.find(d => d.id === appointment.doctorId);
                                            return (
                                                <tr key={appointment.id}>
                                                    <td>{appointment.id}</td>
                                                    <td>{appointment.patientName}</td>
                                                    <td>{doctor?.name || 'N/A'}</td>
                                                    <td>{appointment.date}</td>
                                                    <td>{appointment.time}</td>
                                                    <td>
                                                        <span className={`status-badge ${appointment.status}`}>
                                                            {appointment.status === 'confirmed' ? 'Đã xác nhận' :
                                                                appointment.status === 'pending' ? 'Đang chờ' : 'Đã hủy'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            {appointment.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        className="action-button confirm"
                                                                        onClick={() => handleUpdateAppointment(appointment.id, 'confirmed')}
                                                                    >
                                                                        Xác nhận
                                                                    </button>
                                                                    <button
                                                                        className="action-button cancel"
                                                                        onClick={() => handleUpdateAppointment(appointment.id, 'cancelled')}
                                                                    >
                                                                        Hủy
                                                                    </button>
                                                                </>
                                                            )}
                                                            {appointment.status === 'confirmed' && (
                                                                <button
                                                                    className="action-button cancel"
                                                                    onClick={() => handleUpdateAppointment(appointment.id, 'cancelled')}
                                                                >
                                                                    Hủy
                                                                </button>
                                                            )}
                                                            <button className="action-button view">Xem chi tiết</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="create-appointment">
                                <button className="create-button">
                                    + Tạo lịch hẹn mới
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quản lý người dùng và phân quyền */}
                    {activeTab === 'users' && (
                        <div className="users-section">
                            <h2>Quản lý Người dùng và Phân quyền</h2>

                            <div className="filters">
                                <div className="search-box">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm người dùng..."
                                        className="search-input"
                                    />
                                    <button className="search-button">Tìm</button>
                                </div>
                                <div className="filter-options">
                                    <select className="filter-select">
                                        <option value="">Tất cả vai trò</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Doctor">Bác sĩ</option>
                                        <option value="Member">Bệnh nhân</option>
                                    </select>
                                </div>
                            </div>

                            <div className="users-table-container">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tên đăng nhập</th>
                                            <th>Họ tên</th>
                                            <th>Vai trò</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.fullName}</td>
                                                <td>
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                                        className="role-select"
                                                    >
                                                        <option value="Admin">Admin</option>
                                                        <option value="Doctor">Bác sĩ</option>
                                                        <option value="Member">Bệnh nhân</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${user.status}`}>
                                                        {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="action-button edit">Sửa</button>
                                                        {user.status === 'active' ? (
                                                            <button className="action-button block">Khóa</button>
                                                        ) : (
                                                            <button className="action-button activate">Mở khóa</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="create-user">
                                <button className="create-button">
                                    + Tạo người dùng mới
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .admin-page {
                    min-height: 100vh;
                    background-color: #f8f9fa;
                }
                
                .container {
                    max-width: 1200px;
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
                    margin-bottom: 1.5rem;
                    text-align: center;
                }
                
                .admin-tabs {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    gap: 1rem;
                    flex-wrap: wrap;
                }
                
                .tab-button {
                    padding: 0.75rem 1.5rem;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .tab-button:hover {
                    background: #f0f0f0;
                }
                
                .tab-button.active {
                    background: #35a79c;
                    color: white;
                    border-color: #35a79c;
                }
                
                .content-section {
                    background: white;
                    border-radius: 8px;
                    padding: 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }
                
                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                
                h2 {
                    font-size: 1.5rem;
                    color: #2c3e50;
                    margin: 0;
                }
                
                .create-button {
                    padding: 0.6rem 1.2rem;
                    background-color: #35a79c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                
                .create-button:hover {
                    background-color: #2c9085;
                }
                
                .mt-4 {
                    margin-top: 1.5rem;
                }
                
                /* Doctor schedule styles */
                .doctor-schedule-grid {
                    overflow-x: auto;
                }
                
                .schedule-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .schedule-table th, .schedule-table td {
                    border: 1px solid #ddd;
                    padding: 0.75rem;
                    text-align: center;
                }
                
                .schedule-table th {
                    background-color: #f8f9fa;
                }
                
                .schedule-table td.available {
                    background-color: rgba(39, 174, 96, 0.1);
                }
                
                .schedule-table td.unavailable {
                    background-color: rgba(231, 76, 60, 0.05);
                }
                
                .slot-status {
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }
                
                .slot-toggle-button {
                    padding: 0.3rem 0.6rem;
                    border-radius: 4px;
                    border: none;
                    font-size: 0.8rem;
                    cursor: pointer;
                }
                
                .slot-toggle-button.remove {
                    background-color: #e74c3c;
                    color: white;
                }
                
                .slot-toggle-button.add {
                    background-color: #27ae60;
                    color: white;
                }
                
                /* Create Form Styles */
                .create-form {
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    border: 1px solid #ddd;
                }
                
                .create-form h3 {
                    margin-top: 0;
                    margin-bottom: 1rem;
                    color: #2c3e50;
                }
                
                .form-group {
                    margin-bottom: 1rem;
                }
                
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                
                .form-control {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                
                .time-slots {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.5rem;
                }
                
                .time-slot-checkbox {
                    display: flex;
                    align-items: center;
                }
                
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                
                .save-button {
                    padding: 0.6rem 1.2rem;
                    background-color: #35a79c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
                
                .cancel-button {
                    padding: 0.6rem 1.2rem;
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
                
                /* Appointments and Users Table Styles */
                .appointments-table-container,
                .users-table-container {
                    overflow-x: auto;
                    margin-top: 1.5rem;
                }
                
                .appointments-table,
                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .appointments-table th, .appointments-table td,
                .users-table th, .users-table td {
                    border: 1px solid #ddd;
                    padding: 0.75rem;
                }
                
                .appointments-table th,
                .users-table th {
                    background-color: #f8f9fa;
                    text-align: left;
                }
                
                .status-badge {
                    padding: 0.3rem 0.6rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                
                .status-badge.confirmed,
                .status-badge.active {
                    background-color: rgba(39, 174, 96, 0.1);
                    color: #27ae60;
                }
                
                .status-badge.pending {
                    background-color: rgba(243, 156, 18, 0.1);
                    color: #f39c12;
                }
                
                .status-badge.cancelled,
                .status-badge.inactive {
                    background-color: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                }
                
                .action-button {
                    padding: 0.3rem 0.6rem;
                    border-radius: 4px;
                    border: none;
                    font-size: 0.8rem;
                    cursor: pointer;
                }
                
                .action-button.confirm {
                    background-color: #27ae60;
                    color: white;
                }
                
                .action-button.cancel,
                .action-button.block {
                    background-color: #e74c3c;
                    color: white;
                }
                
                .action-button.view,
                .action-button.edit {
                    background-color: #3498db;
                    color: white;
                }
                
                .action-button.activate {
                    background-color: #27ae60;
                    color: white;
                }
                
                .role-select {
                    padding: 0.3rem;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                
                /* Filter styles */
                .filters {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                    gap: 1rem;
                }
                
                .search-box {
                    display: flex;
                    flex-grow: 1;
                    max-width: 400px;
                }
                
                .search-input {
                    flex-grow: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px 0 0 8px;
                    font-size: 1rem;
                }
                
                .search-button {
                    padding: 0.75rem 1.5rem;
                    background: #35a79c;
                    color: white;
                    border: none;
                    border-radius: 0 8px 8px 0;
                    cursor: pointer;
                }
                
                .filter-options {
                    display: flex;
                    gap: 1rem;
                }
                
                .filter-select {
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                
                @media (max-width: 768px) {
                    .admin-tabs {
                        flex-direction: column;
                    }
                    
                    .time-slots {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminPage;
