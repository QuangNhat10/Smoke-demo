import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

/**
 * Component trang quản trị viên
 * Cung cấp giao diện quản lý cho admin với các tab: quản lý slot bác sĩ, lịch hẹn, người dùng và đánh giá
 * @returns {JSX.Element} Component trang Admin
 */
const AdminPage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [activeTab, setActiveTab] = useState('doctor-slots'); // State lưu tab đang kích hoạt

    // Dữ liệu mẫu về bác sĩ
    const [doctors, setDoctors] = useState([
        { id: 1, name: 'Bs. Nguyễn Văn A', specialty: 'Tim mạch', workDays: ['Thứ 2', 'Thứ 3', 'Thứ 5'] },
        { id: 2, name: 'Bs. Trần Thị B', specialty: 'Hô hấp', workDays: ['Thứ 4', 'Thứ 6', 'Thứ 7'] },
        { id: 3, name: 'Bs. Lê Văn C', specialty: 'Tâm lý', workDays: ['Thứ 2', 'Thứ 4', 'Thứ 6'] },
    ]);

    // Dữ liệu mẫu về các cuộc hẹn
    const [appointments, setAppointments] = useState([
        { id: 1, doctorId: 1, patientName: 'Nguyễn Văn D', date: '2023-10-15', time: '09:00', status: 'confirmed' },
        { id: 2, doctorId: 2, patientName: 'Trần Thị E', date: '2023-10-16', time: '10:30', status: 'pending' },
        { id: 3, doctorId: 3, patientName: 'Lê Văn F', date: '2023-10-17', time: '14:00', status: 'confirmed' },
    ]);

    // Dữ liệu mẫu về người dùng
    const [users, setUsers] = useState([
        { id: 1, username: 'doctor1', fullName: 'Nguyễn Văn A', role: 'Doctor', status: 'active' },
        { id: 2, username: 'doctor2', fullName: 'Trần Thị B', role: 'Doctor', status: 'active' },
        { id: 3, username: 'patient1', fullName: 'Nguyễn Văn D', role: 'Member', status: 'active' },
        { id: 4, username: 'admin', fullName: 'Admin', role: 'Admin', status: 'active' },
    ]);

    // Khung giờ làm việc
    const [timeSlots, setTimeSlots] = useState([
        '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
    ]);

    // Các ngày trong tuần
    const [weekDays, setWeekDays] = useState([
        'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'
    ]);

    // State cho phản hồi và đánh giá
    const [feedback, setFeedback] = useState([
        { id: 1, userId: 3, userName: 'Nguyễn Văn D', doctorId: 1, doctorName: 'Bs. Nguyễn Văn A', rating: 5, comment: 'Bác sĩ rất tận tâm và chuyên nghiệp', date: '2023-10-14', status: 'published' },
        { id: 2, userId: 3, userName: 'Nguyễn Văn D', doctorId: 2, doctorName: 'Bs. Trần Thị B', rating: 4, comment: 'Tư vấn rất hiệu quả', date: '2023-10-12', status: 'published' },
        { id: 3, userId: 5, userName: 'Lê Thị G', doctorId: 3, doctorName: 'Bs. Lê Văn C', rating: 3, comment: 'Dịch vụ tạm được, cần cải thiện thêm', date: '2023-10-10', status: 'pending' },
        { id: 4, userId: 6, userName: 'Phạm Văn H', doctorId: 1, doctorName: 'Bs. Nguyễn Văn A', rating: 2, comment: 'Thời gian chờ đợi quá lâu', date: '2023-09-28', status: 'pending' },
    ]);

    // State cho form tạo feedback mới
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [newFeedback, setNewFeedback] = useState({
        userId: 3,
        userName: '',
        doctorId: 1,
        doctorName: '',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
    });

    /**
     * Effect kiểm tra người dùng có quyền admin không
     * Nếu không phải admin sẽ chuyển hướng về trang đăng nhập
     */
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

    /**
     * Hàm  - ID của bác sĩ
     * @param {string} day cập nhật slot làm việc của bác sĩ
     * @param {number} doctorId- Ngày trong tuần (Thứ 2, Thứ 3, v.v.)
     * @param {boolean} available - Trạng thái có/không có lịch
     */
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

    /**
     * Hàm cập nhật trạng thái lịch hẹn (đã xác nhận, đang chờ, đã hủy)
     * @param {number} appointmentId - ID của cuộc hẹn
     * @param {string} status - Trạng thái mới (confirmed, pending, cancelled)
     */
    const handleUpdateAppointment = (appointmentId, status) => {
        // Logic cập nhật trạng thái lịch hẹn
        setAppointments(appointments.map(app =>
            app.id === appointmentId ? { ...app, status } : app
        ));
    };

    /**
     * Hàm cập nhật vai trò của người dùng (Admin, Doctor, Member)
     * @param {number} userId - ID của người dùng
     * @param {string} role - Vai trò mới (Admin, Doctor, Member)
     */
    const handleUpdateUserRole = (userId, role) => {
        // Logic cập nhật vai trò người dùng
        setUsers(users.map(user =>
            user.id === userId ? { ...user, role } : user
        ));
    };

    /**
     * Hàm xử lý khi tạo slot làm việc mới
     * @param {Event} e - Event submit form
     */
    const handleCreateSlot = (e) => {
        e.preventDefault();
        // Logic tạo slot mới
        console.log("Tạo slot mới");
    };

    /**
     * Hàm cập nhật trạng thái phản hồi (đã đăng, đang chờ)
     * @param {number} feedbackId - ID của phản hồi
     * @param {string} status - Trạng thái mới (published, pending)
     */
    const handleUpdateFeedbackStatus = (feedbackId, status) => {
        // Logic cập nhật trạng thái phản hồi
        setFeedback(feedback.map(item =>
            item.id === feedbackId ? { ...item, status } : item
        ));
    };

    /**
     * Hàm xóa phản hồi
     * @param {number} feedbackId - ID của phản hồi cần xóa
     */
    const handleDeleteFeedback = (feedbackId) => {
        // Logic xóa phản hồi
        setFeedback(feedback.filter(item => item.id !== feedbackId));
    };

    /**
     * Hàm xử lý tạo phản hồi mới
     * @param {Event} e - Event submit form
     */
    const handleCreateFeedback = (e) => {
        e.preventDefault();

        // Lấy tên bác sĩ dựa trên doctorId
        const selectedDoctor = doctors.find(doctor => doctor.id === newFeedback.doctorId);

        // Tạo feedback mới với ID tự động tăng
        const newFeedbackItem = {
            ...newFeedback,
            id: feedback.length > 0 ? Math.max(...feedback.map(item => item.id)) + 1 : 1,
            doctorName: selectedDoctor ? selectedDoctor.name : '',
            date: new Date().toISOString().split('T')[0]
        };

        // Thêm feedback mới vào danh sách
        setFeedback([...feedback, newFeedbackItem]);

        // Reset form
        setNewFeedback({
            userId: 3,
            userName: '',
            doctorId: 1,
            doctorName: '',
            rating: 5,
            comment: '',
            date: new Date().toISOString().split('T')[0],
            status: 'pending'
        });

        // Đóng form
        setShowFeedbackForm(false);
    };

    return (
        <div className="admin-page">
            <Header userName={userName} />

            <div className="container py-5">
                <h1 className="page-title">Trang Quản Trị</h1>

                {/* Các tab quản trị */}
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
                    <button
                        className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
                        onClick={() => setActiveTab('feedback')}
                    >
                        Quản lý Đánh giá & Phản hồi
                    </button>
                </div>

                <div className="content-section mt-4">
                    {/* Tab quản lý slot bác sĩ */}
                    {activeTab === 'doctor-slots' && (
                        <div className="doctor-slots-section">
                            <div className="section-header">
                                <h2>Quản lý Slot làm việc của Bác sĩ</h2>
                                <button className="create-button" onClick={() => document.getElementById('create-slot-form').style.display = 'block'}>
                                    + Tạo Slot mới
                                </button>
                            </div>

                            {/* Form tạo slot mới */}
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

                            {/* Bảng hiển thị slot làm việc của bác sĩ */}
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

                    {/* Tab quản lý lịch hẹn */}
                    {activeTab === 'appointments' && (
                        <div className="appointments-section">
                            <h2>Quản lý Lịch hẹn</h2>

                            {/* Thanh tìm kiếm và lọc lịch hẹn */}
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

                            {/* Bảng hiển thị lịch hẹn */}
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

                            {/* Nút tạo lịch hẹn mới */}
                            <div className="create-appointment">
                                <button className="create-button">
                                    + Tạo lịch hẹn mới
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab quản lý người dùng */}
                    {activeTab === 'users' && (
                        <div className="users-section">
                            <h2>Quản lý Người dùng và Phân quyền</h2>

                            {/* Thanh tìm kiếm và lọc người dùng */}
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

                            {/* Bảng hiển thị người dùng */}
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

                            {/* Nút tạo người dùng mới */}
                            <div className="create-user">
                                <button className="create-button">
                                    + Tạo người dùng mới
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tab quản lý đánh giá và phản hồi */}
                    {activeTab === 'feedback' && (
                        <div className="feedback-section">
                            <h2>Quản lý Đánh giá và Phản hồi</h2>

                            {/* Thanh tìm kiếm và lọc đánh giá */}
                            <div className="filters">
                                <div className="search-box">
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm đánh giá..."
                                        className="search-input"
                                    />
                                    <button className="search-button">Tìm</button>
                                </div>
                                <div className="filter-options">
                                    <select className="filter-select">
                                        <option value="">Tất cả trạng thái</option>
                                        <option value="published">Đã được đăng</option>
                                        <option value="pending">Đang chờ</option>
                                    </select>
                                </div>
                            </div>

                            {/* Bảng hiển thị đánh giá và phản hồi */}
                            <div className="feedback-table-container">
                                <table className="feedback-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Bệnh nhân</th>
                                            <th>Bác sĩ</th>
                                            <th>Đánh giá</th>
                                            <th>Nội dung</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {feedback.map(item => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.userName}</td>
                                                <td>{item.doctorName}</td>
                                                <td>
                                                    <div className="rating-stars">
                                                        {Array.from({ length: item.rating }, (_, i) => (
                                                            <span key={i}>★</span>
                                                        ))}
                                                        {Array.from({ length: 5 - item.rating }, (_, i) => (
                                                            <span key={i + item.rating} style={{ color: '#ddd' }}>★</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>{item.comment}</td>
                                                <td>
                                                    <span className={`status-badge ${item.status}`}>
                                                        {item.status === 'published' ? 'Đã được đăng' : 'Đang chờ'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        {item.status === 'pending' && (
                                                            <button
                                                                className="action-button approve"
                                                                onClick={() => handleUpdateFeedbackStatus(item.id, 'published')}
                                                            >
                                                                Đăng
                                                            </button>
                                                        )}
                                                        <button
                                                            className="action-button delete"
                                                            onClick={() => handleDeleteFeedback(item.id)}
                                                        >
                                                            Xóa
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Nút tạo đánh giá mới */}
                            <div className="create-feedback">
                                <button className="create-button" onClick={() => setShowFeedbackForm(true)}>
                                    + Tạo đánh giá mới
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Form tạo đánh giá mới */}
            {showFeedbackForm && (
                <div className="feedback-form">
                    <h2>Tạo đánh giá mới</h2>
                    <form onSubmit={handleCreateFeedback}>
                        <div className="form-group">
                            <label>Bệnh nhân:</label>
                            <input
                                type="text"
                                value={newFeedback.userName}
                                onChange={(e) => setNewFeedback({ ...newFeedback, userName: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Bác sĩ:</label>
                            <select
                                value={newFeedback.doctorId}
                                onChange={(e) => setNewFeedback({ ...newFeedback, doctorId: parseInt(e.target.value) })}
                                className="form-control"
                            >
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Đánh giá:</label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={newFeedback.rating}
                                onChange={(e) => setNewFeedback({ ...newFeedback, rating: parseInt(e.target.value) })}
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label>Nội dung:</label>
                            <textarea
                                value={newFeedback.comment}
                                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                                className="form-control"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="save-button">Lưu</button>
                            <button type="button" className="cancel-button" onClick={() => setShowFeedbackForm(false)}>
                                Huỷ
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* CSS Styles */}
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

                /* Feedback styles */
                .feedback-section {
                    margin-top: 1rem;
                }

                .feedback-table-container {
                    overflow-x: auto;
                    margin-top: 1.5rem;
                }
                
                .feedback-table {
                    width: 100%;
                    border-collapse: collapse;
                }
                
                .feedback-table th, .feedback-table td {
                    border: 1px solid #ddd;
                    padding: 0.75rem;
                    text-align: left;
                }
                
                .feedback-table th {
                    background-color: #f8f9fa;
                }

                .action-button.approve {
                    background-color: #27ae60;
                    color: white;
                }
                
                .action-button.delete {
                    background-color: #e74c3c;
                    color: white;
                }
                
                .status-badge.published {
                    background-color: rgba(39, 174, 96, 0.1);
                    color: #27ae60;
                }
                
                .status-badge.pending {
                    background-color: rgba(243, 156, 18, 0.1);
                    color: #f39c12;
                }
                
                /* Display stars for ratings */
                .rating-stars {
                    color: #f39c12;
                    font-size: 18px;
                }
                
                .create-feedback {
                    margin-top: 1.5rem;
                    display: flex;
                    justify-content: flex-end;
                }

                /* Feedback form styles */
                .feedback-form {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .feedback-form h2 {
                    color: white;
                    margin-bottom: 1rem;
                }
                
                .feedback-form form {
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    width: 500px;
                }
                
                .feedback-form .form-group {
                    margin-bottom: 1rem;
                }
                
                .feedback-form .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                }
                
                .feedback-form .form-control {
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                }
                
                .feedback-form .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 1rem;
                }
                
                .feedback-form .save-button {
                    padding: 0.6rem 1.2rem;
                    background-color: #35a79c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
                
                .feedback-form .cancel-button {
                    padding: 0.6rem 1.2rem;
                    background-color: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                }
            `}</style>
        </div>
    );
};

export default AdminPage;
