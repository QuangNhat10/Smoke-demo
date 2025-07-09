import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

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

    // Lấy tên người dùng từ localStorage
    const userName = localStorage.getItem('userName') || '';

    /**
     * Effect kiểm tra người dùng có phải là thành viên hay không
     * Được gọi khi component được render
     */
    useEffect(() => {
        const membershipStatus = localStorage.getItem('isMember') === 'true';
        setIsMember(membershipStatus);
    }, []);

    // Danh sách bác sĩ - sẽ được load từ API
    const [doctors, setDoctors] = useState([]);

    /**
     * Lọc danh sách bác sĩ dựa trên từ khóa tìm kiếm
     * @returns {Array} Danh sách bác sĩ đã lọc
     */
    const filteredDoctors = doctors.filter(doctor => {
        const searchContent = `${doctor.name} ${doctor.position} ${doctor.specialty} ${doctor.specialties.join(' ')}`.toLowerCase();
        return searchContent.includes(searchTerm.toLowerCase());
    });

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
    const handleAddReview = () => {
        if (!isMember) {
            alert('Bạn cần mua gói thành viên để đánh giá bác sĩ.');
            navigate('/membership');
            return;
        }

        if (!currentDoctor || !userReview.comment.trim()) {
            alert('Vui lòng nhập đánh giá của bạn.');
            return;
        }

        const userName = localStorage.getItem('userName') || 'Người dùng';
        const newReview = {
            id: Date.now(),
            userName: userName,
            rating: userReview.rating,
            comment: userReview.comment
        };

        // Trong ứng dụng thực tế, sẽ gọi API để cập nhật đánh giá
        try {
            // TODO: Call API to submit review
            // await doctorApi.submitReview(currentDoctor.id, newReview);
            alert('Đánh giá của bạn đã được gửi thành công!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
        }

        // Reset form
        setShowReviewForm(false);
        setUserReview({
            rating: 5,
            comment: ''
        });
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
                            {currentDoctor?.avatar}
                        </div>
                        <h3 style={{ margin: 0, color: '#2c3e50' }}>{currentDoctor?.name}</h3>
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
        <div className="doctor-page">
            {/* Header Component */}
            <Header userName={userName} />
            
            {/* Secondary Navigation */}
            <SecondaryNavigation />
            
            {/* Banner Header */}
            <div className="page-header">
                <h1>Các Bác Sĩ Hỗ Trợ</h1>
                <p>Đội ngũ bác sĩ chuyên nghiệp sẽ hỗ trợ bạn trong hành trình cai thuốc lá</p>
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

                                {/* Đánh giá và Feedback */}
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {renderStars(doctor.rating)}
                                        <span style={{
                                            color: '#7f8c8d',
                                            fontSize: '14px'
                                        }}>
                                            {doctor.reviews} đánh giá
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <button
                                            onClick={() => toggleFeedback(doctor.id)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                color: doctor.buttonColor,
                                                fontSize: '14px',
                                                padding: '0',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            {expandedDoctor === doctor.id ? 'Ẩn đánh giá' : 'Xem đánh giá'}
                                            <span>{expandedDoctor === doctor.id ? '▲' : '▼'}</span>
                                        </button>

                                        {isMember && (
                                            <button
                                                onClick={() => openReviewForm(doctor)}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: doctor.buttonColor,
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    padding: '0',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                + Thêm đánh giá
                                            </button>
                                        )}
                                    </div>

                                    {expandedDoctor === doctor.id && (
                                        <div style={{
                                            marginTop: '10px',
                                            padding: '10px',
                                            background: '#f9f9f9',
                                            borderRadius: '8px'
                                        }}>
                                            {doctor.feedback.map(item => (
                                                <div key={item.id} style={{
                                                    padding: '8px 0',
                                                    borderBottom: item.id < doctor.feedback.length ? '1px solid #eee' : 'none',
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '4px'
                                                    }}>
                                                        <strong style={{ fontSize: '14px' }}>{item.userName}</strong>
                                                        <div style={{ display: 'flex' }}>
                                                            {[...Array(5)].map((_, i) => (
                                                                <span key={i} style={{
                                                                    color: i < item.rating ? '#f39c12' : '#ddd',
                                                                    fontSize: '12px'
                                                                }}>★</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p style={{
                                                        margin: '0',
                                                        fontSize: '14px',
                                                        color: '#555'
                                                    }}>{item.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

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

            {/* Review Form Modal */}
            <ReviewForm />

            {/* Inline styles for components */}
            <style jsx>{`
                .doctor-page {
                    min-height: 100vh;
                    width: 100%;
                    background: linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%);
                    font-family: "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif;
                    overflow-x: hidden;
                }
                
                .page-header {
                    background: white;
                    padding: 2.5rem 2rem;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    position: relative;
                }
                
                .page-header h1 {
                    font-size: 2.5rem;
                    color: #35a79c;
                    margin: 0 0 1rem 0;
                    font-weight: 700;
                    position: relative;
                    display: inline-block;
                }
                
                .page-header h1:after {
                    content: "";
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 4px;
                    background: #35a79c;
                    border-radius: 2px;
                }
                
                .page-header p {
                    color: #7f8c8d;
                    font-size: 1.1rem;
                    max-width: 800px;
                    margin: 1.5rem auto 0;
                    line-height: 1.6;
                }
            `}</style>
        </div>
    );
};

export default DoctorPage; 