import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Component hiển thị modal danh sách bác sĩ
 * Cho phép hiển thị thông tin và đánh giá của các bác sĩ trong modal
 * @param {Object} props - Props của component
 * @param {boolean} props.isOpen - Trạng thái mở/đóng của modal
 * @param {Function} props.onClose - Hàm xử lý khi đóng modal
 * @returns {JSX.Element|null} - Component Modal hoặc null nếu đóng
 */
const DoctorModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    
    /**
     * Hàm xử lý khi người dùng liên hệ với bác sĩ
     * @param {string} doctorName - Tên của bác sĩ được chọn
     */
    const handleContactDoctor = (doctorName) => {
        // Thông thường sẽ mở form liên hệ cụ thể hoặc chat với bác sĩ này
        alert(`Bạn đã chọn liên hệ với ${doctorName}. Chúng tôi sẽ kết nối bạn với bác sĩ sớm nhất có thể.`);
        onClose();
    };

    // State để hiển thị đánh giá
    const [expandedDoctor, setExpandedDoctor] = useState(null);

    /**
     * Hàm chuyển đổi hiển thị phản hồi của một bác sĩ
     * @param {number} doctorId - ID của bác sĩ cần hiển thị/ẩn phản hồi
     */
    const toggleFeedback = (doctorId) => {
        setExpandedDoctor(expandedDoctor === doctorId ? null : doctorId);
    };

    /**
     * Hàm hiển thị đánh giá sao
     * @param {number} rating - Số sao đánh giá (1-5)
     * @returns {JSX.Element} - Component hiển thị sao
     */
    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < Math.floor(rating) ? '#f39c12' : '#ddd', fontSize: '14px' }}>★</span>
                ))}
                <span style={{ color: '#7f8c8d', marginLeft: '5px', fontSize: '12px' }}>
                    {rating.toFixed(1)}
                </span>
            </div>
        );
    };

    // Dữ liệu mẫu về bác sĩ
    const doctors = [
        {
            id: 1,
            name: 'Bác sĩ Nguyễn Đức Quảng',
            position: 'Phó Giám đốc Bệnh viện Phổi Hà Tĩnh',
            specialty: 'Chuyên tư vấn và hỗ trợ cai nghiện thuốc lá',
            avatar: '👨‍⚕️',
            avatarColor: '#44b89d22',
            buttonColor: '#44b89d',
            specialties: ['Cai thuốc lá', 'Bệnh phổi'],
            rating: 4.8,
            reviews: 124,
            feedback: [
                { id: 1, userName: 'Nguyễn Văn A', rating: 5, comment: 'Bác sĩ rất tận tâm, giải thích rõ ràng và dễ hiểu!' },
                { id: 2, userName: 'Trần Thị B', rating: 4, comment: 'Tư vấn hiệu quả, tôi đã giảm được hút thuốc đáng kể.' }
            ]
        },
        {
            id: 2,
            name: 'Bác sĩ Bùi Duy Anh',
            position: 'Phòng Quản lý Chất lượng Bệnh viện Y học cổ truyền Trung ương',
            specialty: 'Chuyên tư vấn và điều trị cai nghiện thuốc lá bằng phương pháp nhĩ châm và dưỡng sinh luyện thở',
            avatar: '👨‍⚕️',
            avatarColor: '#1976d222',
            buttonColor: '#1976d2',
            specialties: ['Cai thuốc lá', 'Y học cổ truyền', 'Nhĩ châm'],
            rating: 4.6,
            reviews: 98,
            feedback: [
                { id: 1, userName: 'Lê Thị C', rating: 5, comment: 'Phương pháp nhĩ châm rất hiệu quả trong giảm cơn thèm thuốc.' },
                { id: 2, userName: 'Phạm Văn D', rating: 4, comment: 'Bác sĩ chuyên môn cao, rất tận tâm với bệnh nhân.' }
            ]
        }
    ];

    // Không hiển thị modal nếu isOpen là false
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)',
        }}>
            {/* Container chính của modal */}
            <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2.5rem',
                maxWidth: '700px',
                width: '90%',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                animation: 'fadeInUp 0.3s ease-out',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                {/* Nút đóng modal */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'rgba(0,0,0,0.05)',
                        border: 'none',
                        fontSize: '1.2rem',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#666',
                        transition: 'all 0.2s',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                    }}
                >
                    ✕
                </button>

                {/* Tiêu đề modal */}
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    fontSize: '1.8rem',
                    color: '#002f6c',
                    fontWeight: '700',
                    position: 'relative',
                    paddingBottom: '15px'
                }}>
                    CHUYÊN GIA Y TẾ
                    <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '60px',
                        height: '4px',
                        background: '#44b89d',
                        borderRadius: '2px'
                    }}></div>
                </h2>

                {/* Mô tả */}
                <p style={{
                    textAlign: 'center',
                    color: '#7f8c8d',
                    marginBottom: '2rem',
                    fontSize: '1.05rem',
                    lineHeight: '1.5',
                }}>
                    Các chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn trên hành trình cai thuốc lá
                </p>

                {/* Danh sách bác sĩ */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.8rem'
                }}>
                    {doctors.map(doctor => (
                        <div key={doctor.id} style={{
                            background: 'linear-gradient(to right, #f8f9fa, white)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid #e5e8ee',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        }}>
                            {/* Thông tin bác sĩ */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1.5rem',
                                marginBottom: '1.2rem'
                            }}>
                                {/* Avatar */}
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '12px',
                                    background: doctor.avatarColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.5rem',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
                                    border: '2px solid white',
                                }}>
                                    {doctor.avatar}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        color: '#2c3e50',
                                        fontWeight: '600',
                                        marginBottom: '0.4rem',
                                        marginTop: 0,
                                    }}>
                                        {doctor.name}
                                    </h3>
                                    <p style={{
                                        color: doctor.buttonColor,
                                        fontSize: '0.95rem',
                                        marginBottom: '0.4rem',
                                        marginTop: 0,
                                        fontWeight: '500',
                                    }}>
                                        {doctor.position}
                                    </p>
                                    <div style={{ marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {renderStars(doctor.rating)}
                                        <span style={{ color: '#7f8c8d', fontSize: '13px' }}>
                                            ({doctor.reviews} đánh giá)
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chuyên môn */}
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#555',
                                lineHeight: '1.5',
                                marginBottom: '1rem'
                            }}>
                                {doctor.specialty}
                            </p>

                            {/* Chuyên ngành */}
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginBottom: '1.2rem'
                            }}>
                                {doctor.specialties.map((specialty, index) => (
                                    <span key={index} style={{
                                        background: `${doctor.buttonColor}22`,
                                        color: doctor.buttonColor,
                                        padding: '0.3rem 0.7rem',
                                        borderRadius: '6px',
                                        fontSize: '0.8rem',
                                        fontWeight: '500'
                                    }}>
                                        {specialty}
                                    </span>
                                ))}
                            </div>

                            {/* Nút hiển thị/ẩn đánh giá */}
                            <button
                                onClick={() => toggleFeedback(doctor.id)}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    background: '#f5f5f5',
                                    padding: '0.7rem',
                                    borderRadius: '8px',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    marginBottom: '1rem',
                                    fontSize: '0.9rem',
                                    color: '#444',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                {expandedDoctor === doctor.id ? 'Ẩn đánh giá' : 'Xem đánh giá'}
                                <svg
                                    width="12"
                                    height="12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    style={{
                                        transform: expandedDoctor === doctor.id ? 'rotate(180deg)' : '',
                                        transition: 'transform 0.2s ease',
                                        color: '#666',
                                    }}
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15.25 10.75L12 14.25L8.75 10.75"
                                    ></path>
                                </svg>
                            </button>

                            {/* Phần hiển thị các đánh giá */}
                            {expandedDoctor === doctor.id && (
                                <div>
                                    {doctor.feedback.map(item => (
                                        <div key={item.id} style={{
                                            padding: '0.8rem',
                                            background: '#f9f9f9',
                                            borderRadius: '8px',
                                            marginBottom: '0.6rem',
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                marginBottom: '0.4rem',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                                                    {item.userName}
                                                </span>
                                                <div style={{ display: 'flex' }}>
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} style={{
                                                            color: i < Math.floor(item.rating) ? '#f39c12' : '#ddd',
                                                            fontSize: '12px'
                                                        }}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <p style={{ margin: '0', fontSize: '0.85rem', color: '#555' }}>
                                                {item.comment}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Nút liên hệ bác sĩ */}
                            <button
                                onClick={() => handleContactDoctor(doctor.name)}
                                style={{
                                    background: doctor.buttonColor,
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.8rem',
                                    width: '100%',
                                    fontWeight: '600',
                                    fontSize: '0.95rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                Liên hệ tư vấn
                            </button>
                        </div>
                    ))}
                </div>

                {/* Nút xem thêm bác sĩ */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        onClick={() => {
                            onClose();
                            navigate('/doctors');
                        }}
                        style={{
                            background: 'transparent',
                            border: '2px solid #44b89d',
                            color: '#44b89d',
                            borderRadius: '8px',
                            padding: '0.8rem 1.5rem',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        Xem tất cả chuyên gia
                    </button>
                </div>
            </div>

            {/* CSS Animation */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.05);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>
        </div>
    );
};

export default DoctorModal; 