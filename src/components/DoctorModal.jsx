import React from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const handleContactDoctor = (doctorName) => {
        // Here you would typically open a specific contact form or chat for this doctor
        alert(`Bạn đã chọn liên hệ với ${doctorName}. Chúng tôi sẽ kết nối bạn với bác sĩ sớm nhất có thể.`);
        onClose();
    };

    const doctors = [
        {
            id: 1,
            name: 'Bác sĩ Nguyễn Đức Quảng',
            position: 'Phó Giám đốc Bệnh viện Phổi Hà Tĩnh',
            specialty: 'Chuyên tư vấn và hỗ trợ cai nghiện thuốc lá',
            avatar: '👨‍⚕️',
            avatarColor: '#44b89d22',
            buttonColor: '#44b89d',
            specialties: ['Cai thuốc lá', 'Bệnh phổi']
        },
        {
            id: 2,
            name: 'Bác sĩ Bùi Duy Anh',
            position: 'Phòng Quản lý Chất lượng Bệnh viện Y học cổ truyền Trung ương',
            specialty: 'Chuyên tư vấn và điều trị cai nghiện thuốc lá bằng phương pháp nhĩ châm và dưỡng sinh luyện thở',
            avatar: '👨‍⚕️',
            avatarColor: '#1976d222',
            buttonColor: '#1976d2',
            specialties: ['Cai thuốc lá', 'Y học cổ truyền', 'Nhĩ châm']
        }
    ];

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

                <p style={{
                    textAlign: 'center',
                    color: '#7f8c8d',
                    marginBottom: '2rem',
                    fontSize: '1.05rem',
                    lineHeight: '1.5',
                }}>
                    Các chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn trên hành trình cai thuốc lá
                </p>

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
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '1.5rem',
                                marginBottom: '1.2rem'
                            }}>
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
                                    <p style={{
                                        color: '#7f8c8d',
                                        fontSize: '0.95rem',
                                        lineHeight: '1.5',
                                        marginTop: 0,
                                        marginBottom: '0.5rem'
                                    }}>
                                        {doctor.specialty}
                                    </p>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginBottom: '1.2rem',
                                paddingLeft: 'calc(80px + 1.5rem)'
                            }}>
                                {doctor.specialties.map((specialty, idx) => (
                                    <span key={idx} style={{
                                        background: `${doctor.buttonColor}10`,
                                        color: doctor.buttonColor,
                                        borderRadius: '50px',
                                        padding: '0.3rem 0.8rem',
                                        fontSize: '0.85rem',
                                        fontWeight: '500',
                                    }}>
                                        {specialty}
                                    </span>
                                ))}
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '1rem',
                                borderTop: '1px solid #f1f1f1',
                                paddingTop: '1.2rem',
                            }}>
                                <button
                                    style={{
                                        background: 'white',
                                        color: '#7f8c8d',
                                        border: '1px solid #e5e8ee',
                                        borderRadius: '8px',
                                        padding: '0.7rem 1.2rem',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span style={{ fontSize: '1.1rem' }}>📋</span>
                                    Xem hồ sơ
                                </button>
                                <button
                                    onClick={() => handleContactDoctor(doctor.name)}
                                    style={{
                                        background: doctor.buttonColor,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.7rem 1.5rem',
                                        fontSize: '0.95rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        boxShadow: `0 4px 12px ${doctor.buttonColor}22`,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    Liên hệ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                }}>
                    <button
                        onClick={() => navigate('/doctors')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#1976d2',
                            fontWeight: '600',
                            padding: '0.5rem 1rem',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Xem tất cả bác sĩ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorModal; 