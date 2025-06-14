/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// Trang Về Chúng Tôi - giới thiệu về công ty và đội ngũ bác sĩ
// Trang này cũng có thông báo cho thành viên về khả năng đánh giá bác sĩ
// và nút điều hướng đến trang bác sĩ để thực hiện đánh giá
const AboutUs = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State lưu trạng thái đăng nhập
    const [userName, setUserName] = useState(''); // State lưu tên người dùng
    const [isMember, setIsMember] = useState(false); // State kiểm tra người dùng có phải là thành viên hay không

    // Kiểm tra trạng thái đăng nhập và thành viên khi trang được tải
    // Chỉ những người dùng đã mua gói thành viên mới thấy thông báo về đánh giá bác sĩ
    useEffect(() => {
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const storedUserName = localStorage.getItem('userName');
        const membershipStatus = localStorage.getItem('isMember') === 'true';

        setIsLoggedIn(userLoggedIn);
        setIsMember(membershipStatus);

        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const team = [
        {
            id: 1,
            name: 'BS. Nguyễn Đức Quang',
            position: 'Phó Giám đốc Bệnh viện Phổi Hà Tĩnh',
            specialty: 'Chuyên về tư vấn và hỗ trợ cai thuốc lá',
            avatar: '👨‍⚕️',
            avatarColor: '#44b89d22',
            bio: 'BS. Nguyễn Đức Quang có hơn 15 năm kinh nghiệm trong lĩnh vực y tế công cộng và điều trị cai nghiện thuốc lá. Ông đã giúp hàng nghìn bệnh nhân cai thuốc lá thành công thông qua phương pháp kết hợp y học hiện đại và hỗ trợ tâm lý.'
        },
        {
            id: 2,
            name: 'BS. Bùi Duy Anh',
            position: 'Khoa Quản lý Chất lượng Bệnh viện Y học Cổ truyền',
            specialty: 'Chuyên về điều trị cai thuốc lá bằng châm cứu tai và các bài tập thở',
            avatar: '👨‍⚕️',
            avatarColor: '#1976d222',
            bio: 'BS. Bùi Duy Anh là chuyên gia hàng đầu về y học cổ truyền và phương pháp không dùng thuốc để cai nghiện thuốc lá. Với kiến thức sâu rộng về châm cứu tai và các bài tập thở, ông đã giúp nhiều người cai thuốc lá hiệu quả và bền vững.'
        },
        {
            id: 3,
            name: 'BS. Phạm Thị Hương',
            position: 'Trưởng khoa Nội, Bệnh viện Đại học Y Hà Nội',
            specialty: 'Chuyên về các vấn đề phổi và hỗ trợ cai thuốc lá',
            avatar: '👩‍⚕️',
            avatarColor: '#e74c3c22',
            bio: 'BS. Phạm Thị Hương là một bác sĩ nội khoa giàu kinh nghiệm, với kiến thức chuyên sâu về các vấn đề hô hấp và phổi. Tiến sĩ Hương đã công bố nhiều nghiên cứu về tác động của thuốc lá đối với sức khỏe hô hấp và các phương pháp cai nghiện hiệu quả.'
        },
        {
            id: 4,
            name: 'Ths. Trần Văn Minh',
            position: 'Chuyên viên tâm lý học trị liệu',
            specialty: 'Chuyên về tư vấn tâm lý và hỗ trợ thay đổi hành vi',
            avatar: '👨‍💼',
            avatarColor: '#f39c1222',
            bio: 'Ths. Trần Văn Minh có hơn 10 năm kinh nghiệm trong lĩnh vực tâm lý học trị liệu. Ông đã phát triển nhiều chương trình can thiệp tâm lý hiệu quả để giúp người nghiện thuốc lá vượt qua các rào cản tâm lý và thay đổi hành vi.'
        },
        {
            id: 5,
            name: 'CN. Lê Thị Mai Anh',
            position: 'Điều dưỡng viên chuyên khoa hô hấp',
            specialty: 'Chăm sóc và hỗ trợ bệnh nhân cai thuốc lá',
            avatar: '👩‍⚕️',
            avatarColor: '#9b59b622',
            bio: 'CN. Lê Thị Mai Anh là điều dưỡng viên có nhiều năm kinh nghiệm làm việc với bệnh nhân mắc các bệnh hô hấp. Chị đã được đào tạo đặc biệt về các kỹ thuật hỗ trợ cai thuốc lá và quản lý triệu chứng cai nghiện.'
        }
    ];

    // Render star ratings
    const renderStars = (rating) => {
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: i < Math.floor(rating) ? '#f39c12' : '#ddd', fontSize: '16px' }}>★</span>
                ))}
                <span style={{ color: '#7f8c8d', marginLeft: '8px', fontSize: '14px' }}>
                    {rating.toFixed(1)}
                </span>
            </div>
        );
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
            {/* Header */}
            {isLoggedIn ? (
                <Header userName={userName} />
            ) : (
                <header style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #35a79c 0%, #44b89d 100%)',
                    padding: '1.5rem 0',
                    boxShadow: '0 4px 20px rgba(53, 167, 156, 0.2)',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: '0 2rem',
                    }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '1.8rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                        >
                            <span>Breathing</span>
                            <span>Free</span>
                        </button>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    background: 'rgba(255,255,255,0.15)',
                                    border: 'none',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(5px)',
                                    transition: 'all 0.2s',
                                }}
                            >
                                Đăng Nhập
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                style={{
                                    background: 'white',
                                    border: 'none',
                                    color: '#35a79c',
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '30px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                Đăng Ký
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* Hero Section */}
            <div style={{
                background: 'white',
                padding: '4rem 2rem',
                textAlign: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#35a79c',
                    margin: '0 0 1.5rem 0',
                    fontWeight: '700',
                }}>
                    Về Chúng Tôi
                </h1>

                <p style={{
                    color: '#7f8c8d',
                    fontSize: '1.2rem',
                    maxWidth: '800px',
                    margin: '0 auto 2rem',
                    lineHeight: '1.8',
                }}>
                    BreathingFree là nền tảng hỗ trợ cai thuốc lá hàng đầu Việt Nam, sử dụng công nghệ kết hợp với kinh nghiệm y khoa để mang đến
                    phương pháp cai thuốc lá hiệu quả và bền vững. Chúng tôi tin rằng mọi người đều xứng đáng có một cuộc sống
                    khỏe mạnh và tự do, không phụ thuộc vào thuốc lá.
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                }}>
                    <button
                        onClick={() => navigate('/membership')}
                        style={{
                            background: '#44b89d',
                            color: 'white',
                            border: 'none',
                            padding: '0.8rem 2rem',
                            borderRadius: '30px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(53, 167, 156, 0.3)',
                        }}
                    >
                        Tham Gia Ngay
                    </button>
                    <button
                        onClick={() => navigate('/doctors')}
                        style={{
                            background: 'white',
                            color: '#44b89d',
                            border: '2px solid #44b89d',
                            padding: '0.8rem 2rem',
                            borderRadius: '30px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                    >
                        Gặp Đội Ngũ Bác Sĩ
                    </button>
                </div>
            </div>

            {/* Mission Section */}
            <div style={{
                padding: '4rem 2rem',
                maxWidth: '1200px',
                margin: '0 auto',
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                }}>
                    <h2 style={{
                        fontSize: '2.2rem',
                        color: '#35a79c',
                        margin: '0 0 1rem 0',
                        fontWeight: '700',
                    }}>
                        Sứ Mệnh Của Chúng Tôi
                    </h2>
                    <p style={{
                        color: '#7f8c8d',
                        fontSize: '1.1rem',
                        maxWidth: '800px',
                        margin: '0 auto',
                        lineHeight: '1.6',
                    }}>
                        Chúng tôi cam kết giúp đỡ mọi người giành lại quyền kiểm soát cuộc sống của họ từ sự phụ thuộc vào thuốc lá
                        thông qua nền tảng hỗ trợ toàn diện và cá nhân hóa.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem',
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: '#44b89d22',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            marginBottom: '1rem',
                        }}>
                            🔬
                        </div>
                        <h3 style={{
                            fontSize: '1.4rem',
                            color: '#35a79c',
                            margin: '0 0 1rem 0',
                        }}>
                            Khoa Học
                        </h3>
                        <p style={{
                            color: '#7f8c8d',
                            lineHeight: '1.6',
                        }}>
                            Mọi phương pháp và công cụ của chúng tôi đều dựa trên nghiên cứu y khoa mới nhất về cai nghiện và thay đổi hành vi.
                        </p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: '#1976d222',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            marginBottom: '1rem',
                        }}>
                            👥
                        </div>
                        <h3 style={{
                            fontSize: '1.4rem',
                            color: '#1976d2',
                            margin: '0 0 1rem 0',
                        }}>
                            Cộng Đồng
                        </h3>
                        <p style={{
                            color: '#7f8c8d',
                            lineHeight: '1.6',
                        }}>
                            Chúng tôi tạo ra một mạng lưới hỗ trợ tích cực, nơi mọi người có thể chia sẻ kinh nghiệm và động viên nhau.
                        </p>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '2rem',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '50%',
                            background: '#e74c3c22',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            marginBottom: '1rem',
                        }}>
                            ⚕️
                        </div>
                        <h3 style={{
                            fontSize: '1.4rem',
                            color: '#e74c3c',
                            margin: '0 0 1rem 0',
                        }}>
                            Chuyên Môn
                        </h3>
                        <p style={{
                            color: '#7f8c8d',
                            lineHeight: '1.6',
                        }}>
                            Đội ngũ của chúng tôi bao gồm các chuyên gia y tế, tâm lý học và huấn luyện viên sức khỏe hàng đầu.
                        </p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div style={{
                padding: '4rem 2rem',
                background: 'white',
            }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    maxWidth: '800px',
                    margin: '0 auto 3rem',
                }}>
                    <h2 style={{
                        fontSize: '2.2rem',
                        color: '#35a79c',
                        margin: '0 0 1rem 0',
                        fontWeight: '700',
                    }}>
                        Đội Ngũ Chuyên Gia
                    </h2>
                    <p style={{
                        color: '#7f8c8d',
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                    }}>
                        Gặp gỡ những chuyên gia tận tâm đứng sau BreathingFree, những người đang nỗ lực không ngừng để giúp bạn
                        có một cuộc sống khỏe mạnh hơn mà không có thuốc lá.
                    </p>

                    {/* Phần thông báo đặc biệt chỉ hiển thị cho người dùng đã mua gói thành viên */}
                    {isMember && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            background: '#f0f9ff',
                            borderRadius: '8px',
                            border: '1px solid #3498db',
                        }}>
                            <p style={{
                                margin: '0',
                                color: '#3498db',
                                fontWeight: '500',
                            }}>
                                {/* Thông báo về quyền đánh giá bác sĩ dành cho thành viên */}
                                Với tư cách là thành viên, bạn có thể đánh giá bác sĩ và chuyên gia của chúng tôi!
                                <button
                                    onClick={() => navigate('/doctors')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#3498db',
                                        fontWeight: 'bold',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        marginLeft: '5px',
                                    }}
                                >
                                    {/* Nút điều hướng đến trang bác sĩ để thực hiện đánh giá */}
                                    Đến trang bác sĩ để đánh giá
                                </button>
                            </p>
                        </div>
                    )}
                </div>

                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                }}>
                    {team.map(member => (
                        <div key={member.id} style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #f0f0f0',
                        }}>
                            <div style={{
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    background: member.avatarColor,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '3rem',
                                    marginBottom: '1.5rem',
                                }}>
                                    {member.avatar}
                                </div>
                                <h3 style={{
                                    margin: '0 0 0.5rem 0',
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#2c3e50',
                                }}>
                                    {member.name}
                                </h3>
                                <p style={{
                                    margin: '0 0 0.5rem 0',
                                    color: '#7f8c8d',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                }}>
                                    {member.position}
                                </p>
                                <p style={{
                                    margin: '0 0 1rem 0',
                                    color: '#35a79c',
                                    fontSize: '0.9rem',
                                    fontWeight: '500',
                                }}>
                                    {member.specialty}
                                </p>
                                <p style={{
                                    color: '#7f8c8d',
                                    lineHeight: '1.6',
                                    fontSize: '0.95rem',
                                }}>
                                    {member.bio}
                                </p>
                            </div>

                            <div style={{
                                borderTop: '1px solid #f0f0f0',
                                padding: '1rem 2rem',
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <button
                                    onClick={() => navigate('/doctors')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#3498db',
                                        fontWeight: '600',
                                        fontSize: '0.95rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                    }}
                                >
                                    Xem chi tiết
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 12h14M12 5l7 7-7 7" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div style={{
                padding: '4rem 2rem',
                background: 'linear-gradient(135deg, #35a79c 0%, #44b89d 100%)',
                color: 'white',
                textAlign: 'center',
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                }}>
                    <h2 style={{
                        fontSize: '2.2rem',
                        margin: '0 0 1.5rem 0',
                        fontWeight: '700',
                    }}>
                        Bắt Đầu Hành Trình Cai Thuốc Lá Của Bạn
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        margin: '0 0 2rem 0',
                        opacity: 0.9,
                    }}>
                        Hãy tham gia với chúng tôi ngay hôm nay và trở thành phiên bản tốt nhất của bản thân mà không phụ thuộc vào thuốc lá.
                        Chúng tôi sẽ đồng hành cùng bạn trong từng bước của hành trình này.
                    </p>

                    <button
                        onClick={() => navigate('/register')}
                        style={{
                            background: 'white',
                            color: '#35a79c',
                            border: 'none',
                            padding: '0.8rem 2rem',
                            borderRadius: '30px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                        }}
                    >
                        Đăng Ký Ngay
                    </button>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                background: '#2c3e50',
                color: 'white',
                padding: '3rem 2rem',
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '3rem',
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem' }}>Breathing Free</h3>
                        <p style={{ lineHeight: '1.6', opacity: 0.8 }}>
                            Trang web hỗ trợ cai thuốc lá hàng đầu, cung cấp hỗ trợ, công cụ và tài nguyên cá nhân hóa để giúp bạn thành công trong hành trình cai thuốc lá.
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Liên kết hữu ích</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '0.8rem' }}>
                                <button
                                    onClick={() => navigate('/blog')}
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    Blog
                                </button>
                            </li>
                            <li style={{ marginBottom: '0.8rem' }}>
                                <button
                                    onClick={() => navigate('/doctors')}
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    Đội ngũ
                                </button>
                            </li>
                            <li style={{ marginBottom: '0.8rem' }}>
                                <button
                                    style={{
                                        color: 'white',
                                        textDecoration: 'none',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    Chính sách riêng tư
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Liên hệ chúng tôi</h3>
                        <p style={{ marginBottom: '0.8rem', opacity: 0.8 }}>Email: contact@breathingfree.com</p>
                        <p style={{ marginBottom: '0.8rem', opacity: 0.8 }}>Điện thoại: +84 12 345 6789</p>
                    </div>
                </div>

                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    paddingTop: '2rem',
                    marginTop: '2rem',
                    opacity: 0.7,
                }}>
                    <p>© 2025 Breathing Free. Tất cả quyền được bảo lưu.</p>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs; 