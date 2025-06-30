import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

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
    const [doctors, setDoctors] = useState([]);
    const [expandedDoctor, setExpandedDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('/api/feedback/search');
                setDoctors(response.data);
                setLoading(false);
            } catch (err) {
                setError('Không thể tải thông tin bác sĩ');
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchDoctors();
        }
    }, [isOpen]);
    
    /**
     * Hàm xử lý khi người dùng liên hệ với bác sĩ
     * @param {string} doctorName - Tên của bác sĩ được chọn
     */
    const handleContactDoctor = (doctorName) => {
        alert(`Bạn đã chọn liên hệ với ${doctorName}. Chúng tôi sẽ kết nối bạn với bác sĩ sớm nhất có thể.`);
        onClose();
    };

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
                    {rating ? rating.toFixed(1) : 'Chưa có đánh giá'}
                </span>
            </div>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

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
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải thông tin...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>{error}</div>
                ) : (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.8rem'
                }}>
                    {doctors.map(doctor => (
                            <div key={doctor.userID} style={{
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
                                        background: '#44b89d22',
                                        borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                        fontSize: '2rem'
                                }}>
                                        {doctor.avatar || '👨‍⚕️'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            margin: '0 0 0.5rem 0',
                                            color: '#2c3e50',
                                            fontSize: '1.3rem'
                                        }}>
                                            {doctor.fullName}
                                        </h3>

                                        {doctor.position && (
                                            <p style={{
                                                margin: '0 0 0.5rem 0',
                                                color: '#34495e',
                                                fontSize: '1rem'
                                            }}>
                                                <strong>Chức vụ:</strong> {doctor.position}
                                            </p>
                                        )}

                                        {doctor.specialty && (
                                            <p style={{
                                                margin: '0 0 0.5rem 0',
                                                color: '#34495e',
                                                fontSize: '1rem'
                                            }}>
                                                <strong>Chuyên môn:</strong> {doctor.specialty}
                                            </p>
                                        )}

                                        {doctor.shortBio && (
                            <p style={{
                                                margin: '0.5rem 0',
                                                color: '#7f8c8d',
                                fontSize: '0.95rem',
                                                lineHeight: '1.5'
                            }}>
                                                {doctor.shortBio}
                            </p>
                                        )}

                            <div style={{
                                display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            marginTop: '1rem'
                            }}>
                                            {renderStars(doctor.rating || 0)}
                                            <span style={{
                                                color: '#7f8c8d',
                                                fontSize: '0.9rem'
                                    }}>
                                                ({doctor.reviews || 0} đánh giá)
                                    </span>
                                        </div>
                                    </div>
                            </div>

                            {/* Nút hiển thị/ẩn đánh giá */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <button
                                        onClick={() => toggleFeedback(doctor.userID)}
                                    style={{
                                            padding: '0.6rem 1.2rem',
                                            border: '1px solid #44b89d',
                                            borderRadius: '8px',
                                            background: 'white',
                                            color: '#44b89d',
                                            cursor: 'pointer',
                                            flex: 1,
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {expandedDoctor === doctor.userID ? 'Ẩn đánh giá' : 'Xem đánh giá'}
                            </button>
                                    <button
                                        onClick={() => handleContactDoctor(doctor.fullName)}
                                        style={{
                                            padding: '0.6rem 1.2rem',
                                            border: 'none',
                                            borderRadius: '8px',
                                            background: '#44b89d',
                                            color: 'white',
                                            cursor: 'pointer',
                                            flex: 1,
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        Liên hệ ngay
                                    </button>
                                </div>

                                {expandedDoctor === doctor.userID && doctor.feedback && doctor.feedback.length > 0 && (
                                    <div style={{
                                        marginTop: '1.5rem',
                                        padding: '1rem',
                                        background: '#f8f9fa',
                                        borderRadius: '8px'
                                    }}>
                                        <h4 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
                                            Đánh giá từ bệnh nhân
                                        </h4>
                                        {doctor.feedback.map(fb => (
                                            <div key={fb.feedbackID} style={{
                                                marginBottom: '1rem',
                                                padding: '0.8rem',
                                                background: 'white',
                                                borderRadius: '6px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                    marginBottom: '0.5rem'
                                            }}>
                                                    <strong style={{ color: '#34495e' }}>{fb.userName}</strong>
                                                    {renderStars(fb.rating)}
                                                </div>
                                                <p style={{
                                                    margin: '0.5rem 0',
                                                    color: '#7f8c8d',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    {fb.comment}
                                                </p>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: '#95a5a6',
                                                    marginTop: '0.5rem'
                                                }}>
                                                    {formatDate(fb.submittedAt)}
                                                </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                )}
            </div>

            {/* CSS Animation */}
            <style>
                {`
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
                `}
            </style>
        </div>
    );
};

export default DoctorModal; 