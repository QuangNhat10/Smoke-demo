import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

/**
 * Component trang Bác sĩ
 * Hiển thị danh sách bác sĩ và cho phép thành viên đánh giá
 * @returns {JSX.Element} Component trang Bác sĩ
 */
const DoctorPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all'); // State cho tab đang được chọn
    const [searchTerm, setSearchTerm] = useState(''); // State lưu từ khóa tìm kiếm
    const [isMember, setIsMember] = useState(false); // State kiểm tra người dùng có phải là thành viên
    const [showReviewForm, setShowReviewForm] = useState(false); // State hiển thị/ẩn form đánh giá
    const [currentDoctor, setCurrentDoctor] = useState(null); // State lưu thông tin bác sĩ đang được đánh giá
    const [userReview, setUserReview] = useState({
        rating: 5,
        comment: ''
    }); // State lưu thông tin đánh giá của người dùng
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Effect kiểm tra người dùng có phải là thành viên hay không
     * Được gọi khi component được render
     */
    useEffect(() => {
        const membershipStatus = localStorage.getItem('isMember') === 'true';
        setIsMember(membershipStatus);
        // Fetch doctors when component mounts
        fetchDoctors();
    }, []);

    // Fetch doctors from database
    const fetchDoctors = async (term = '') => {
        setIsLoading(true);
        try {
            console.log('Fetching doctors with term:', term);
            const response = await axiosInstance.get(`/feedback/search${term ? `?name=${encodeURIComponent(term)}` : ''}`);
            console.log('Response from API:', response.data);
            if (response.data) {
                setDoctors(response.data);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle search
    const handleSearch = () => {
        fetchDoctors(searchTerm);
    };

    /**
     * Hàm xử lý khi nhấn nút liên hệ với bác sĩ
     * @param {string} doctorName - Tên của bác sĩ cần liên hệ
     */
    const handleContactDoctor = (doctorName) => {
        alert(`Bạn đã chọn liên hệ với ${doctorName}. Chúng tôi sẽ kết nối bạn với bác sĩ trong thời gian sớm nhất.`);
    };

    /**
     * Hàm hiển thị đánh giá sao
     * @param {number} rating - Số sao đánh giá (1-5)
     * @returns {JSX.Element} Component hiển thị sao đánh giá
     */
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

    // State để lưu ID bác sĩ đang được hiển thị phản hồi
    const [expandedDoctor, setExpandedDoctor] = useState(null);

    /**
     * Hàm mở/đóng phần hiển thị phản hồi của bác sĩ
     * @param {number} doctorId - ID của bác sĩ cần mở/đóng phản hồi
     */
    const toggleFeedback = (doctorId) => {
        setExpandedDoctor(expandedDoctor === doctorId ? null : doctorId);
    };

    /**
     * Hàm xử lý khi người dùng thêm đánh giá mới
     * Kiểm tra quyền thành viên và cập nhật đánh giá
     */
    const handleAddReview = async () => {
        if (!isMember) {
            alert('Bạn cần mua gói thành viên để đánh giá bác sĩ.');
            navigate('/membership');
            return;
        }

        if (!currentDoctor || !userReview.comment.trim()) {
            alert('Vui lòng nhập đánh giá của bạn.');
            return;
        }

        try {
            const response = await axios.post('/api/feedback', {
                doctorID: currentDoctor.userID,
                rating: userReview.rating,
                feedbackText: userReview.comment,
                submittedAt: new Date().toISOString()
            });

            if (response.data) {
                alert('Đánh giá của bạn đã được gửi thành công!');
                setShowReviewForm(false);
                setUserReview({ rating: 5, comment: '' });
                // Refresh doctors list to show updated ratings
                fetchDoctors(searchTerm);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
        }
    };

    /**
     * Hàm mở form đánh giá cho một bác sĩ
     * @param {Object} doctor - Thông tin bác sĩ cần đánh giá
     */
    const openReviewForm = (doctor) => {
        if (!isMember) {
            alert('Bạn cần mua gói thành viên để đánh giá bác sĩ.');
            navigate('/membership');
            return;
        }
        setCurrentDoctor(doctor);
        setShowReviewForm(true);
    };

    /**
     * Component hiển thị form đánh giá bác sĩ
     * @returns {JSX.Element|null} Form đánh giá hoặc null nếu không hiển thị
     */
    const ReviewForm = () => {
        if (!showReviewForm) return null;

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
                    padding: '2rem',
                    maxWidth: '500px',
                    width: '90%',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                }}>
                    <button
                        onClick={() => setShowReviewForm(false)}
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
                        marginBottom: '1.5rem',
                        fontSize: '1.6rem',
                        color: currentDoctor?.buttonColor || '#44b89d',
                        fontWeight: '700',
                        position: 'relative',
                        paddingBottom: '15px'
                    }}>
                        Đánh Giá Bác Sĩ
                        <div style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '50px',
                            height: '3px',
                            background: currentDoctor?.buttonColor || '#44b89d',
                            borderRadius: '2px'
                        }}></div>
                    </h2>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '1.5rem',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: currentDoctor?.avatarColor || '#44b89d22',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                        }}>
                            {currentDoctor?.avatar ? (
                                <img src={currentDoctor.avatar} alt={currentDoctor.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            ) : '👨‍⚕️'}
                        </div>
                        <h3 style={{ margin: 0, color: '#2c3e50' }}>{currentDoctor?.fullName}</h3>
                        <p style={{ color: '#44b89d', fontWeight: '500', margin: '0 0 0.5rem' }}>
                            {currentDoctor?.position}
                        </p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Chuyên ngành</h4>
                        <p>{currentDoctor?.specialty}</p>
                        
                        <h4 style={{ color: '#2c3e50', marginBottom: '0.5rem', marginTop: '1rem' }}>Giới thiệu</h4>
                        <p style={{ lineHeight: '1.6' }}>{currentDoctor?.shortBio}</p>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#2c3e50',
                            fontWeight: '500'
                        }}>
                            Đánh giá của bạn:
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setUserReview({ ...userReview, rating: star })}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '2rem',
                                        cursor: 'pointer',
                                        color: star <= userReview.rating ? '#f39c12' : '#ddd',
                                    }}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            color: '#2c3e50',
                            fontWeight: '500'
                        }}>
                            Nhận xét:
                        </label>
                        <textarea
                            value={userReview.comment}
                            onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                            placeholder="Chia sẻ trải nghiệm của bạn với bác sĩ..."
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: '1.5px solid #e5e8ee',
                                fontSize: '1rem',
                                resize: 'vertical',
                                outline: 'none',
                                fontFamily: 'inherit',
                                minHeight: '120px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                            onClick={handleAddReview}
                            style={{
                                background: currentDoctor?.buttonColor || '#44b89d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: `0 4px 10px ${(currentDoctor?.buttonColor || '#44b89d') + '33'}`,
                            }}
                        >
                            Gửi Đánh Giá
                        </button>
                    </div>
                </div>
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

            {/* Search Section */}
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '3rem 2rem',
                width: '100%',
                boxSizing: 'border-box',
            }}>
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
                            <button 
                                onClick={handleSearch}
                                style={{
                                    background: '#44b89d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.75rem 1.5rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                }}
                            >
                                Tìm Kiếm
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
                    {isLoading ? (
                        <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#888', padding: '2rem'}}>
                            Đang tải danh sách bác sĩ...
                        </div>
                    ) : doctors.length === 0 ? (
                        <div style={{gridColumn: '1/-1', textAlign: 'center', color: '#888'}}>
                            Không có bác sĩ nào phù hợp.
                        </div>
                    ) : (
                        doctors.map(doctor => (
                            <div key={doctor.userID} style={{
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
                                        background: '#44b89d22',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '2.5rem',
                                        marginBottom: '1.5rem',
                                    }}>
                                        {doctor.avatar || '👨‍⚕️'}
                                    </div>
                                    <h3 style={{
                                        margin: '0 0 0.5rem 0',
                                        fontSize: '1.4rem',
                                        fontWeight: '700',
                                        color: '#2c3e50',
                                    }}>
                                        {doctor.fullName}
                                    </h3>
                                    {doctor.position && (
                                        <p style={{
                                            margin: '0 0 0.5rem 0',
                                            color: '#34495e',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                        }}>
                                            {doctor.position}
                                        </p>
                                    )}
                                    {doctor.specialty && (
                                        <p style={{
                                            margin: '0 0 0.5rem 0',
                                            color: '#7f8c8d',
                                            fontSize: '0.9rem',
                                        }}>
                                            {doctor.specialty}
                                        </p>
                                    )}
                                    {doctor.shortBio && (
                                        <p style={{
                                            margin: '0.5rem 0',
                                            color: '#7f8c8d',
                                            fontSize: '0.85rem',
                                            lineHeight: '1.4',
                                            maxHeight: '3.6em',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}>
                                            {doctor.shortBio}
                                        </p>
                                    )}
                                </div>
                                <div style={{
                                    padding: '1.5rem 2rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '1rem',
                                        width: '100%'
                                    }}>
                                        <button
                                            onClick={() => handleContactDoctor(doctor.fullName)}
                                            className="doctor-action-btn"
                                            style={{
                                                background: '#44b89d',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '0.75rem',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                boxShadow: '0 2px 8px rgba(68, 184, 157, 0.2)',
                                                height: '45px'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(68, 184, 157, 0.3)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 2px 8px rgba(68, 184, 157, 0.2)';
                                            }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
                                            </svg>
                                            Liên Hệ
                                        </button>
                                        <button
                                            onClick={() => {
                                                setCurrentDoctor(doctor);
                                                setShowReviewForm(true);
                                            }}
                                            className="doctor-action-btn"
                                            style={{
                                                background: '#f1c40f',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '0.75rem',
                                                fontWeight: '600',
                                                fontSize: '0.9rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                boxShadow: '0 2px 8px rgba(241, 196, 15, 0.2)',
                                                height: '45px'
                                            }}
                                            onMouseOver={(e) => {
                                                e.target.style.transform = 'translateY(-2px)';
                                                e.target.style.boxShadow = '0 4px 12px rgba(241, 196, 15, 0.3)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.target.style.transform = 'translateY(0)';
                                                e.target.style.boxShadow = '0 2px 8px rgba(241, 196, 15, 0.2)';
                                            }}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
                                            </svg>
                                            Đánh Giá
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Review Form Modal */}
            <ReviewForm />

            {/* Feedback Modal */}
            {showReviewForm && currentDoctor && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '2rem',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '500px',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => {
                                setShowReviewForm(false);
                                setUserReview({ rating: 5, comment: '' });
                            }}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                        <h3 style={{
                            margin: '0 0 1.5rem 0',
                            color: '#2c3e50',
                            fontSize: '1.3rem'
                        }}>
                            Đánh giá bác sĩ {currentDoctor.fullName}
                        </h3>
                        <div style={{
                            marginBottom: '1.5rem'
                        }}>
                            <p style={{
                                margin: '0 0 0.5rem 0',
                                color: '#666',
                                fontSize: '0.9rem'
                            }}>
                                Đánh giá của bạn:
                            </p>
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setUserReview({ ...userReview, rating: star })}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1.5rem',
                                            cursor: 'pointer',
                                            color: star <= userReview.rating ? '#f1c40f' : '#ddd'
                                        }}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{
                            marginBottom: '1.5rem'
                        }}>
                            <p style={{
                                margin: '0 0 0.5rem 0',
                                color: '#666',
                                fontSize: '0.9rem'
                            }}>
                                Nhận xét của bạn:
                            </p>
                            <textarea
                                value={userReview.comment}
                                onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                                placeholder="Chia sẻ trải nghiệm của bạn với bác sĩ..."
                                style={{
                                    width: '100%',
                                    minHeight: '100px',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1.5px solid #e5e8ee',
                                    fontSize: '0.9rem',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <button
                            onClick={handleAddReview}
                            style={{
                                width: '100%',
                                padding: '0.8rem',
                                background: '#44b89d',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            Gửi Đánh Giá
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorPage;