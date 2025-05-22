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
            name: 'Dr. Nguyen Duc Quang',
            position: 'Deputy Director of Ha Tinh Lung Hospital',
            specialty: 'Specialized in smoking cessation counseling and support',
            avatar: '👨‍⚕️',
            avatarColor: '#44b89d22',
            buttonColor: '#44b89d',
            specialties: ['Smoking Cessation', 'Pulmonology']
        },
        {
            id: 2,
            name: 'Dr. Bui Duy Anh',
            position: 'Quality Management Department of Traditional Medicine Hospital',
            specialty: 'Specialized in smoking cessation treatment using auricular acupuncture and breathing exercises',
            avatar: '👨‍⚕️',
            avatarColor: '#1976d222',
            buttonColor: '#1976d2',
            specialties: ['Smoking Cessation', 'Traditional Medicine', 'Auricular Acupuncture']
        },
        {
            id: 3,
            name: 'Dr. Pham Thi Huong',
            position: 'Head of Internal Medicine Department, Hanoi Medical University Hospital',
            specialty: 'Specialized in pulmonary issues and smoking cessation support',
            avatar: '👩‍⚕️',
            avatarColor: '#e74c3c22',
            buttonColor: '#e74c3c',
            specialties: ['Smoking Cessation', 'Pulmonology', 'Internal Medicine']
        }
    ];

    // Filter doctors by search term
    const filteredDoctors = doctors.filter(doctor => {
        const searchContent = `${doctor.name} ${doctor.position} ${doctor.specialty} ${doctor.specialties.join(' ')}`.toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
    });

    const handleContactDoctor = (doctorName) => {
        alert(`You have chosen to contact ${doctorName}. We will connect you with the doctor as soon as possible.`);
    };

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: '#f4f6f8',
            fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
            boxSizing: 'border-box',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Modern Header with Gradient */}
            <header style={{
                width: '100%',
                background: 'linear-gradient(135deg, #002f6c 0%, #0057b8 100%)',
                padding: '1.5rem 0',
                boxShadow: '0 4px 20px rgba(0, 47, 108, 0.2)',
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
                        Back to Dashboard
                    </button>

                    <div style={{
                        fontSize: '1.8rem',
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}>
                        <span style={{ color: '#44b89d' }}>Breathing</span>
                        <span style={{ color: '#35a79c' }}>Free</span>
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
                    color: '#002f6c',
                    margin: '0 0 1rem 0',
                    fontWeight: '700',
                    position: 'relative',
                    display: 'inline-block',
                }}>
                    Expert Doctor Team
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
                    Contact our expert doctors for counseling and support on your journey to quit smoking
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
                        }}>Search for doctors</h2>
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            width: '100%',
                        }}>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, specialty, or position..."
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
                                Search
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
                                All
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
                                Pulmonology
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
                                Traditional Medicine
                            </button>
                            <button
                                onClick={() => setActiveTab('internal')}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    border: 'none',
                                    background: activeTab === 'internal' ? '#44b89d' : '#e5e8ee',
                                    color: activeTab === 'internal' ? 'white' : '#2c3e50',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                Internal Medicine
                            </button>
                        </div>
                    </div>
                </div>

                {/* Doctor Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                    gap: '2rem',
                }}>
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor.id} style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            ':hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                            },
                            display: 'flex',
                            flexDirection: 'column',
                        }}>
                            {/* Doctor Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1.5rem',
                                borderBottom: '1px solid #f5f5f5',
                                gap: '1rem',
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
                                }}>
                                    {doctor.avatar}
                                </div>
                                <div>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        color: '#2c3e50',
                                        margin: '0 0 0.5rem 0',
                                    }}>
                                        {doctor.name}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.9rem',
                                        color: '#7f8c8d',
                                        margin: '0',
                                        lineHeight: '1.4',
                                    }}>
                                        {doctor.position}
                                    </p>
                                </div>
                            </div>

                            {/* Doctor Info */}
                            <div style={{
                                padding: '1.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            }}>
                                <p style={{
                                    fontSize: '1rem',
                                    color: '#2c3e50',
                                    lineHeight: '1.6',
                                    margin: '0 0 1.5rem 0',
                                }}>
                                    {doctor.specialty}
                                </p>

                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.5rem',
                                    marginBottom: '1.5rem',
                                }}>
                                    {doctor.specialties.map((specialty, index) => (
                                        <span key={index} style={{
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '20px',
                                            background: '#f5f7fa',
                                            color: '#44b89d',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                        }}>
                                            {specialty}
                                        </span>
                                    ))}
                                </div>

                                <div style={{ marginTop: 'auto' }}>
                                    <button
                                        onClick={() => handleContactDoctor(doctor.name)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            background: doctor.buttonColor,
                                            color: 'white',
                                            border: 'none',
                                            fontWeight: 'bold',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            height: '45px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1rem',
                                        }}
                                    >
                                        Contact Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredDoctors.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        color: '#7f8c8d',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <h3>No doctors match your search criteria</h3>
                        <p>Try different keywords or browse all doctors</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer style={{
                background: '#002f6c',
                padding: '2rem',
                color: 'white',
                marginTop: 'auto',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                }}>
                    <div>
                        <h2 style={{ margin: '0', color: '#44b89d' }}>BreathingFree</h2>
                        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255,255,255,0.7)' }}>
                            Your partner on the journey to quit smoking
                        </p>
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                    }}>
                        <button
                            onClick={() => navigate('/homepage-member')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.8)',
                                cursor: 'pointer',
                            }}
                        >
                            Dashboard
                        </button>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.8)',
                                cursor: 'pointer',
                            }}
                        >
                            About
                        </button>
                        <button
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'rgba(255,255,255,0.8)',
                                cursor: 'pointer',
                            }}
                        >
                            Contact
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default DoctorPage; 