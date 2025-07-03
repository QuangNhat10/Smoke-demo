import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

/**
 * Component trang đặt lịch hẹn
 * Cho phép người dùng đặt lịch tư vấn với bác sĩ
 * @returns {JSX.Element} Component trang đặt lịch hẹn
 */
const AppointmentPage = () => {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(localStorage.getItem('userName') || ''); // Tên người dùng từ localStorage

    // State lưu dữ liệu form đặt lịch
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        doctorType: '',
        message: ''
    });

    // State thông báo thành công và lỗi
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Danh sách các khung giờ có sẵn
    const availableTimeSlots = [
        '09:00 - 10:00',
        '10:00 - 11:00',
        '11:00 - 12:00',
        '14:00 - 15:00',
        '15:00 - 16:00',
        '16:00 - 17:00'
    ];

    // Danh sách loại bác sĩ/chuyên khoa
    const doctorTypes = [
        'Chuyên khoa Cai nghiện',
        'Tâm lý học',
        'Chuyên gia dinh dưỡng',
        'Hô hấp',
        'Y học cổ truyền'
    ];

    /**
     * Hàm xử lý khi thay đổi giá trị input form
     * @param {Event} e - Sự kiện onChange của input
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    /**
     * Hàm xử lý khi submit form đặt lịch
     * Kiểm tra tính hợp lệ của form và hiển thị thông báo phù hợp
     * @param {Event} e - Sự kiện submit form
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra tính hợp lệ của form
        if (!formData.name || !formData.email || !formData.phone || !formData.date || !formData.time || !formData.doctorType) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Mô phỏng gửi dữ liệu đặt lịch
        setTimeout(() => {
            setSuccessMessage('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.');
            setErrorMessage('');
            setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                time: '',
                doctorType: '',
                message: ''
            });
        }, 1000);
    };

    // Tính toán ngày hiện tại cho giá trị min của input date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            padding: '0',
            margin: '0',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            {/* Header và điều hướng phụ */}
            <div style={{
                width: '100%',
                margin: '0',
                padding: '0'
            }}>
                <Header userName={userName} />
                <SecondaryNavigation />
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                padding: '2rem',
                boxSizing: 'border-box'
            }}>
                {/* Phần đặt lịch hẹn */}
                <section style={{
                    backgroundColor: 'white',
                    marginTop: '2rem',
                    marginBottom: '2rem',
                    padding: '2.5rem 3rem',
                    borderRadius: '18px',
                    boxShadow: '0 8px 25px rgba(53, 167, 156, 0.12)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h1 style={{
                        marginBottom: '1.5rem',
                        color: '#35a79c',
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        textAlign: 'center'
                    }}>Đặt Lịch Tư Vấn</h1>

                    <p style={{
                        color: '#5a6a6e',
                        marginBottom: '2rem',
                        lineHeight: '1.7',
                        fontSize: '1.1rem',
                        textAlign: 'center',
                        maxWidth: '800px',
                        margin: '0 auto 2.5rem'
                    }}>
                        Đặt lịch hẹn với đội ngũ chuyên gia của chúng tôi để được tư vấn cá nhân
                        và hỗ trợ trong hành trình cai thuốc lá của bạn.
                    </p>

                    {/* Hiển thị thông báo thành công */}
                    {successMessage && (
                        <div style={{
                            backgroundColor: '#d4edda',
                            color: '#155724',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '2rem',
                            textAlign: 'center',
                            fontWeight: '500'
                        }}>
                            {successMessage}
                        </div>
                    )}

                    {/* Hiển thị thông báo lỗi */}
                    {errorMessage && (
                        <div style={{
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '2rem',
                            textAlign: 'center',
                            fontWeight: '500'
                        }}>
                            {errorMessage}
                        </div>
                    )}

                    {/* Form đặt lịch hẹn */}
                    <form onSubmit={handleSubmit} style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {/* Trường nhập họ tên */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#2c3e50'
                            }}>
                                Họ và tên *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        {/* Trường nhập email */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#2c3e50'
                            }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        {/* Trường nhập số điện thoại */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#2c3e50'
                            }}>
                                Số điện thoại *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        {/* Trường chọn ngày hẹn */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#2c3e50'
                            }}>
                                Ngày hẹn *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                min={today}
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        {/* Trường chọn giờ hẹn */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#2c3e50'
                            }}>
                                Thời gian *
                            </label>
                            <select
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    backgroundColor: 'white'
                                }}
                                required
                            >
                                <option value="">-- Chọn thời gian --</option>
                                {availableTimeSlots.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        {/* Trường chọn loại chuyên gia */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <label style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#2c3e50'
                            }}>
                                Loại chuyên gia *
                            </label>
                            <select
                                name="doctorType"
                                value={formData.doctorType}
                                onChange={handleInputChange}
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    backgroundColor: 'white'
                                }}
                                required
                            >
                                <option value="">-- Chọn chuyên khoa --</option>
                                {doctorTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Trường nhập nội dung tư vấn */}
                        <div style={{
                            gridColumn: '1 / -1',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <label style={{
                                fontWeight: '600',
                                marginBottom: '0.5rem',
                                color: '#2c3e50'
                            }}>
                                Nội dung tư vấn
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                style={{
                                    padding: '0.8rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    minHeight: '150px',
                                    resize: 'vertical'
                                }}
                                placeholder="Mô tả ngắn gọn nội dung bạn muốn tư vấn..."
                            ></textarea>
                        </div>

                        {/* Nút đặt lịch */}
                        <div style={{
                            gridColumn: '1 / -1',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '1rem'
                        }}>
                            <button
                                type="submit"
                                style={{
                                    padding: '1rem 3rem',
                                    backgroundColor: '#35a79c',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    boxShadow: '0 4px 12px rgba(53, 167, 156, 0.3)',
                                    transition: 'all 0.25s ease'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#2c9085';
                                    e.target.style.transform = 'translateY(-3px)';
                                    e.target.style.boxShadow = '0 8px 20px rgba(53, 167, 156, 0.4)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#35a79c';
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 4px 12px rgba(53, 167, 156, 0.3)';
                                }}
                            >
                                Đặt Lịch Ngay
                            </button>
                        </div>
                    </form>
                </section>

                {/* Phần lưu ý khi đặt lịch */}
                <section style={{
                    backgroundColor: 'white',
                    marginBottom: '2rem',
                    padding: '2.5rem 3rem',
                    borderRadius: '18px',
                    boxShadow: '0 8px 25px rgba(53, 167, 156, 0.12)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <h2 style={{
                        marginBottom: '1.5rem',
                        color: '#35a79c',
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        textAlign: 'center'
                    }}>Lưu Ý Khi Đặt Lịch</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem',
                        marginTop: '2rem'
                    }}>
                        {/* Lưu ý về thời gian */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                backgroundColor: '#35a79c15',
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                                fontSize: '2rem'
                            }}>⏰</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '0.8rem'
                            }}>Đúng Giờ</h3>
                            <p style={{
                                color: '#5a6a6e',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                            }}>
                                Vui lòng đến trước giờ hẹn 15 phút để hoàn tất thủ tục.
                            </p>
                        </div>

                        {/* Lưu ý về chuẩn bị thông tin */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                backgroundColor: '#35a79c15',
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                                fontSize: '2rem'
                            }}>📋</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '0.8rem'
                            }}>Chuẩn Bị Thông Tin</h3>
                            <p style={{
                                color: '#5a6a6e',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                            }}>
                                Mang theo hồ sơ bệnh án, thông tin về thuốc đang sử dụng.
                            </p>
                        </div>

                        {/* Lưu ý về liên lạc */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                backgroundColor: '#35a79c15',
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                                fontSize: '2rem'
                            }}>📱</div>
                            <h3 style={{
                                fontSize: '1.3rem',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '0.8rem'
                            }}>Giữ Liên Lạc</h3>
                            <p style={{
                                color: '#5a6a6e',
                                fontSize: '1rem',
                                lineHeight: '1.6'
                            }}>
                                Bật điện thoại để nhận thông báo xác nhận lịch hẹn.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AppointmentPage; 