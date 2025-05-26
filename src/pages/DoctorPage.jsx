/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const DoctorPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const doctors = [
        {
            id: 1,
            name: 'BS. Nguyễn Đức Quang',
            position: 'Phó Giám đốc Bệnh viện Phổi Hà Tĩnh',
            specialty: 'Chuyên về tư vấn và hỗ trợ cai thuốc lá',
            avatar: '👨‍⚕️',
            avatarColor: '#44b89d22',
            buttonColor: '#44b89d',
            specialties: ['Cai Thuốc Lá', 'Phổi học']
        },
        {
            id: 2,
            name: 'BS. Bùi Duy Anh',
            position: 'Khoa Quản lý Chất lượng Bệnh viện Y học Cổ truyền',
            specialty: 'Chuyên về điều trị cai thuốc lá bằng châm cứu tai và các bài tập thở',
            avatar: '👨‍⚕️',
            avatarColor: '#1976d222',
            buttonColor: '#1976d2',
            specialties: ['Cai Thuốc Lá', 'Y học Cổ truyền', 'Châm cứu Tai']
        },
        {
            id: 3,
            name: 'BS. Phạm Thị Hương',
            position: 'Trưởng khoa Nội, Bệnh viện Đại học Y Hà Nội',
            specialty: 'Chuyên về các vấn đề phổi và hỗ trợ cai thuốc lá',
            avatar: '👩‍⚕️',
            avatarColor: '#e74c3c22',
            buttonColor: '#e74c3c',
            specialties: ['Cai Thuốc Lá', 'Phổi học', 'Nội khoa']
        }
    ];

    // Filter doctors by search term
    const filteredDoctors = doctors.filter(doctor => {
        const searchContent = `${doctor.name} ${doctor.position} ${doctor.specialty} ${doctor.specialties.join(' ')}`.toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
    });

    const handleContactDoctor = (doctorName) => {
        alert(`Bạn đã chọn liên hệ với ${doctorName}. Chúng tôi sẽ kết nối bạn với bác sĩ trong thời gian sớm nhất.`);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            boxSizing: 'border-box',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Modern Header with Gradient */}
            <header style={{
                width: '100%',
                background: 'linear-gradient(135deg, #35a79c 0%, #44b89d 100%)',
                padding: '1.5rem 0',
                boxShadow: '0 4px 20px rgba(53, 167, 156, 0.2)',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle at 20% 150%, rgba(255,255,255,0.1) 0%, transparent 60%)',
                    zIndex: 1,
                }}></div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    position: 'relative',
                    zIndex: 2,
                }}>
                    <button
                        onClick={() => navigate('/homepage-member')}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            border: 'none',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backdropFilter: 'blur(5px)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>←</span>
                        Quay Lại Trang Chủ
                    </button>

                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                        <span style={{ color: '#ffffff' }}>Breathing</span>
                        <span style={{ color: '#ffffff' }}>Free</span>
                    </div>

                    <div style={{ width: '120px' }}></div> {/* Placeholder for balance */}
                </div>
            </header>

            {/* Title Banner */}
            <div style={{
                background: 'white',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                position: 'relative',
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#35a79c',
                    margin: '0 0 1rem 0',
                    fontWeight: '700',
                    position: 'relative',
                    display: 'inline-block',
                }}>
                    Đội Ngũ Bác Sĩ Chuyên Gia
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '4px',
                        background: '#44b89d',
                        borderRadius: '2px',
                    }}></div>
                </h1>

                <p style={{
                    color: '#7f8c8d',
                    fontSize: '1.1rem',
                    maxWidth: '800px',
                    margin: '1.5rem auto 0',
                    lineHeight: '1.6',
                }}>
                    Liên hệ với đội ngũ bác sĩ chuyên gia của chúng tôi để được tư vấn và hỗ trợ trong hành trình cai thuốc lá của bạn
                </p>
            </div>

            {/* Doctor Content */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '3rem 2rem',
                width: '100%',
                boxSizing: 'border-box',
            }}>
                {/* Search and Filters */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    marginBottom: '3rem',
                    background: 'white',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}>
                        <h2 style={{
                            fontSize: '1.3rem',
                            color: '#2c3e50',
                            margin: '0',
                        }}>Tìm kiếm bác sĩ</h2>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Tìm theo tên, chuyên môn hoặc chức vụ..."
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: '1.5px solid #e5e8ee',
                                    fontSize: '1rem',
                                    outline: 'none',
                                }}
                            />
                            <button style={{
                                background: '#44b89d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 1.5rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                            }}>
                                Tìm Kiếm
                            </button>
                        </div>
                    </div>

                    <div>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            overflowX: 'auto',
                            paddingBottom: '0.5rem',
                        }}>
                            <button
                                onClick={() => setActiveTab('all')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeTab === 'all' ? '#44b89d' : '#e5e8ee',
                                    color: activeTab === 'all' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Tất Cả
                            </button>
                            <button
                                onClick={() => setActiveTab('smoking')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeTab === 'smoking' ? '#44b89d' : '#e5e8ee',
                                    color: activeTab === 'smoking' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Chuyên Gia Cai Thuốc Lá
                            </button>
                            <button
                                onClick={() => setActiveTab('pulmonology')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeTab === 'pulmonology' ? '#44b89d' : '#e5e8ee',
                                    color: activeTab === 'pulmonology' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Phổi Học
                            </button>
                            <button
                                onClick={() => setActiveTab('traditional')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeTab === 'traditional' ? '#44b89d' : '#e5e8ee',
                                    color: activeTab === 'traditional' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Y Học Cổ Truyền
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctor Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '2rem',
                }}>
                    {filteredDoctors.map(doctor => (
                        <div key={doctor.id} style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            <div style={{
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                borderBottom: '1px solid #f0f0f0',
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: doctor.avatarColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2.5rem',
                                    marginBottom: '1.5rem',
                                }}>
                                    {doctor.avatar}
                                </div>
                                <h3 style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.4rem',
                                    fontWeight: '700',
                                    color: '#2c3e50',
                                }}>
                                    {doctor.name}
                                </h3>
                                <p style={{
                                    margin: '0 0 1rem 0',
                                    color: '#7f8c8d',
                                    fontSize: '0.95rem',
                                    height: '40px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    {doctor.position}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    justifyContent: 'center',
                                    minHeight: '32px',
                                }}>
                                    {doctor.specialties.map((specialty, i) => (
                                        <span key={i} style={{
                                            padding: '0.3rem 0.8rem',
                                            background: `${doctor.buttonColor}22`,
                                            color: doctor.buttonColor,
                                            borderRadius: '20px',
                                            fontSize: '0.85rem',
                                            fontWeight: '500',
                                        }}>
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                padding: '1.5rem 2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                flexGrow: 1,
                            }}>
                                <p style={{
                                    margin: '0 0 1.5rem 0',
                                    color: '#7f8c8d',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    height: '60px',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '3',
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {doctor.specialty}
                                </p>
                                <button
                                    onClick={() => handleContactDoctor(doctor.name)}
                                    style={{
                                        width: '100%',
                                        padding: '0.8rem',
                                        background: doctor.buttonColor,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: `0 4px 10px ${doctor.buttonColor}33`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        height: '45px',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.background = `${doctor.buttonColor}dd`;
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = `0 6px 15px ${doctor.buttonColor}55`;
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.background = doctor.buttonColor;
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = `0 4px 10px ${doctor.buttonColor}33`;
                                    }}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="white" />
                                    </svg>
                                    Liên Hệ Bác Sĩ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorPage; 