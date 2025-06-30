import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

/**
 * Component trang Bác sĩ
 * Hiển thị danh sách bác sĩ và cho phép thành viên đánh giá
 * @returns {JSX.Element} Component trang Bác sĩ
 */
const decodeText = (text) => {
    try {
        return decodeURIComponent(escape(text));
    } catch {
        return text;
    }
};

const encodeText = (text) => {
    try {
        return unescape(encodeURIComponent(text));
    } catch {
        return text;
    }
};

const ReviewFormInput = ({ value, onChange, placeholder }) => {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.setAttribute('lang', 'vi');
            textareaRef.current.setAttribute('spellcheck', 'false');
            textareaRef.current.setAttribute('inputmode', 'text');
        }
    }, []);

    const handleInput = (e) => {
        const text = e.target.value;
        // Normalize Vietnamese text to composed form (NFC)
        const normalizedText = text.normalize('NFC');
        onChange(normalizedText);
    };

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            placeholder={placeholder}
            style={{
                width: '100%',
                minHeight: '120px',
                padding: '0.75rem 1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                lineHeight: '1.5',
                resize: 'vertical',
                fontFamily: 'inherit'
            }}
        />
    );
};

// Hàm để chuẩn hóa và hiển thị text tiếng Việt
const normalizeVietnameseText = (text) => {
    if (!text) return '';
    return text.normalize('NFC');
};

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
    });

    const [reviewFormData, setReviewFormData] = useState({
        rating: 5,
        comment: ''
    });

    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [doctorFeedbacks, setDoctorFeedbacks] = useState({});

    useEffect(() => {
        const checkAuthAndMembership = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                try {
                    const response = await axiosInstance.get('/membership/current');
                    setIsMember(response.data && response.data.isActive);
                } catch (error) {
                    console.error('Error checking membership:', error);
                    setIsMember(false);
                }
            } else {
                setIsAuthenticated(false);
                setIsMember(false);
            }
        };

        checkAuthAndMembership();
        fetchDoctors();
    }, []);

    useEffect(() => {
        if (showReviewForm) {
            setReviewFormData({
                rating: 5,
                comment: ''
            });
        }
    }, [showReviewForm]);

    // Fetch doctors from database
    const fetchDoctors = async (term = '') => {
        setIsLoading(true);
        try {
            const endpoint = `/feedback/doctors${term ? `?name=${encodeURIComponent(term)}` : ''}`;
            const response = await axiosInstance.get(endpoint);
            if (response.data) {
                const doctorsData = response.data;
                setDoctors(doctorsData);
                
                // Fetch feedbacks for each doctor
                for (const doctor of doctorsData) {
                    await fetchDoctorFeedbacks(doctor.userID);
                }
            } else {
                setDoctors([]);
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch feedbacks for a specific doctor
    const fetchDoctorFeedbacks = async (doctorId) => {
        try {
            const response = await axiosInstance.get(`/feedback/doctors/${doctorId}`);
            if (response.data) {
                setDoctorFeedbacks(prev => ({
                    ...prev,
                    [doctorId]: response.data
                }));
            }
        } catch (error) {
            console.error(`Error fetching feedbacks for doctor ${doctorId}:`, error);
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

    const handleCommentChange = (value) => {
        setReviewFormData(prev => ({
            ...prev,
            comment: value
        }));
    };

    const handleAddReview = async () => {
        try {
            if (!currentDoctor) {
                alert('Vui lòng chọn bác sĩ để đánh giá.');
                return;
            }

            const normalizedComment = reviewFormData.comment.trim().normalize('NFC');
            if (!normalizedComment) {
                alert('Vui lòng nhập nhận xét của bạn.');
                return;
            }

            const userId = localStorage.getItem('userId');
            if (!userId) {
                const confirmLogin = window.confirm('Bạn cần đăng nhập để đánh giá bác sĩ. Bạn có muốn đăng nhập không?');
                if (confirmLogin) {
                    navigate('/login');
                }
                return;
            }

            const response = await axiosInstance.post('/feedback/doctors', {
                userID: parseInt(userId),
                doctorID: currentDoctor.userID,
                rating: reviewFormData.rating,
                feedbackText: normalizedComment,
                submittedAt: new Date().toISOString()
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });

            if (response.data) {
                alert('Đánh giá của bạn đã được gửi thành công!');
                setShowReviewForm(false);
                setReviewFormData({ rating: 5, comment: '' });
                await fetchDoctors(searchTerm);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            if (error.response) {
                if (error.response.status === 401) {
                    const confirmLogin = window.confirm('Phiên đăng nhập đã hết hạn. Bạn có muốn đăng nhập lại không?');
                    if (confirmLogin) {
                        navigate('/login');
                    }
                } else if (error.response.status === 403) {
                    const confirmUpgrade = window.confirm('Bạn cần có gói thành viên để đánh giá bác sĩ. Bạn có muốn xem các gói thành viên không?');
                    if (confirmUpgrade) {
                        navigate('/membership');
                    }
                } else {
                    alert(error.response.data.message || 'Có lỗi xảy ra khi gửi đánh giá.');
                }
            } else {
                alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.');
            }
        }
    };

    /**
     * Hàm mở form đánh giá cho một bác sĩ
     * @param {Object} doctor - Thông tin bác sĩ cần đánh giá
     */
    const openReviewForm = async (doctor) => {
        if (!isAuthenticated) {
            const confirmLogin = window.confirm('Bạn cần đăng nhập để đánh giá bác sĩ. Bạn có muốn đăng nhập không?');
            if (confirmLogin) {
                navigate('/login');
            }
            return;
        }

        if (!isMember) {
            const confirmUpgrade = window.confirm('Bạn cần có gói thành viên để đánh giá bác sĩ. Bạn có muốn xem các gói thành viên không?');
            if (confirmUpgrade) {
                navigate('/membership');
            }
            return;
        }

        setCurrentDoctor(doctor);
        setShowReviewForm(true);
    };

    // Show all feedbacks modal
    const showAllFeedbacks = (doctor) => {
        setSelectedDoctor(doctor);
        setShowFeedbackModal(true);
    };

    // Feedback Modal Component
    const FeedbackModal = () => {
        if (!showFeedbackModal || !selectedDoctor) return null;

        const feedbacks = doctorFeedbacks[selectedDoctor.userID] || [];

        const normalizeAndDisplay = (text) => {
            if (!text) return '';
            try {
                // First try to normalize the text
                return text.normalize('NFC');
            } catch (e) {
                console.error('Error normalizing text:', e);
                return text;
            }
        };

        return (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    width: '90%',
                    maxWidth: '800px',
                    maxHeight: '80vh',
                    overflow: 'auto',
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                    }}>
                        <h2 style={{ margin: 0 }}>Đánh giá về bác sĩ {normalizeAndDisplay(selectedDoctor.fullName)}</h2>
                        <button
                            onClick={() => setShowFeedbackModal(false)}
                            style={{
                                background: 'none',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                padding: '0.5rem',
                            }}
                        >
                            ×
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}>
                        {feedbacks.length === 0 ? (
                            <p>Chưa có đánh giá nào.</p>
                        ) : (
                            feedbacks.map((feedback, index) => (
                                <div key={index} style={{
                                    padding: '1rem',
                                    background: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #e9ecef',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem',
                                    }}>
                                        <div>
                                            <strong>{normalizeAndDisplay(feedback.userName)}</strong>
                                            <div>{renderStars(feedback.rating)}</div>
                                        </div>
                                        <div style={{
                                            color: '#666',
                                            fontSize: '0.9rem',
                                        }}>
                                            {new Date(feedback.submittedAt).toLocaleDateString('vi-VN')}
                                        </div>
                                    </div>
                                    <p style={{
                                        margin: '0.5rem 0 0 0',
                                        color: '#444',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                    }}>
                                        {normalizeAndDisplay(feedback.feedbackText)}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const ReviewForm = () => {
        if (!showReviewForm || !currentDoctor) return null;

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
                        onClick={() => {
                            if (reviewFormData.comment.trim()) {
                                if (window.confirm('Bạn có chắc muốn hủy đánh giá này không?')) {
                                    setShowReviewForm(false);
                                    setReviewFormData({ rating: 5, comment: '' });
                                }
                            } else {
                                setShowReviewForm(false);
                                setReviewFormData({ rating: 5, comment: '' });
                            }
                        }}
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
                        color: '#44b89d',
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
                            background: '#44b89d',
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
                            background: '#44b89d22',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            overflow: 'hidden',
                        }}>
                            {currentDoctor.avatar ? (
                                <img 
                                    src={currentDoctor.avatar} 
                                    alt={currentDoctor.fullName} 
                                    style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover'
                                    }} 
                                />
                            ) : '👨‍⚕️'}
                        </div>
                        <h3 style={{ margin: 0, color: '#2c3e50' }}>{currentDoctor.fullName}</h3>
                        <p style={{ color: '#44b89d', fontWeight: '500', margin: '0 0 0.5rem' }}>
                            {currentDoctor.position}
                        </p>
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
                                    onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '2rem',
                                        cursor: 'pointer',
                                        color: star <= reviewFormData.rating ? '#f39c12' : '#ddd',
                                        transition: 'color 0.2s',
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
                            Nhận xét của bạn:
                        </label>
                        <ReviewFormInput
                            value={reviewFormData.comment}
                            onChange={(text) => setReviewFormData(prev => ({ ...prev, comment: text }))}
                            placeholder="Chia sẻ trải nghiệm của bạn với bác sĩ..."
                        />
                    </div>

                    {reviewFormData.comment.trim() && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#2c3e50',
                                fontWeight: '500'
                            }}>
                                Xem trước:
                            </label>
                            <div style={{
                                padding: '0.75rem 1rem',
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                            }}>
                                {reviewFormData.comment}
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button
                            onClick={() => {
                                setShowReviewForm(false);
                                setReviewFormData({ rating: 5, comment: '' });
                            }}
                            style={{
                                background: '#e0e0e0',
                                color: '#666',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleAddReview}
                            disabled={!reviewFormData.comment.trim()}
                            style={{
                                background: reviewFormData.comment.trim() ? '#44b89d' : '#a0a0a0',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: reviewFormData.comment.trim() ? 'pointer' : 'not-allowed',
                                boxShadow: reviewFormData.comment.trim() ? '0 4px 10px rgba(68, 184, 157, 0.2)' : 'none',
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
            {/* Header */}
            <Header />
            
            {/* Secondary Navigation */}
            <SecondaryNavigation />

            {/* Title Section */}
            <div style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                background: 'white',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
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
                margin: '3rem auto',
                padding: '0 2rem',
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
                            }}>
                                {/* Doctor Info Section */}
                                <div style={{
                                    padding: '2rem',
                                    borderBottom: '1px solid #f0f0f0',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1.5rem',
                                        marginBottom: '1.5rem',
                                    }}>
                                        <div style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            background: '#f0f0f0',
                                        }}>
                                            {doctor.avatar ? (
                                                <img
                                                    src={doctor.avatar}
                                                    alt={doctor.fullName}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '2.5rem',
                                                    color: '#44b89d',
                                                }}>
                                                    👨‍⚕️
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 style={{
                                                margin: '0 0 0.5rem 0',
                                                fontSize: '1.4rem',
                                                color: '#2c3e50',
                                            }}>
                                                {doctor.fullName}
                                            </h3>
                                            {doctor.position && (
                                                <p style={{
                                                    margin: '0 0 0.25rem 0',
                                                    color: '#44b89d',
                                                    fontWeight: '500',
                                                }}>
                                                    {doctor.position}
                                                </p>
                                            )}
                                            {doctor.specialty && (
                                                <p style={{
                                                    margin: '0',
                                                    color: '#7f8c8d',
                                                    fontSize: '0.9rem',
                                                }}>
                                                    {doctor.specialty}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Doctor Bio */}
                                    {doctor.shortBio && (
                                        <div style={{
                                            marginBottom: '1.5rem',
                                            color: '#666',
                                            fontSize: '0.95rem',
                                            lineHeight: '1.6',
                                        }}>
                                            {doctor.shortBio}
                                        </div>
                                    )}

                                    {/* Contact Info */}
                                    {(doctor.phone || doctor.email || doctor.address) && (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem',
                                            color: '#666',
                                        }}>
                                            {doctor.phone && (
                                                <div>📞 {doctor.phone}</div>
                                            )}
                                            {doctor.email && (
                                                <div>📧 {doctor.email}</div>
                                            )}
                                            {doctor.address && (
                                                <div>📍 {doctor.address}</div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Ratings Section */}
                                <div style={{
                                    padding: '1rem 2rem',
                                    background: '#f8f9fa',
                                    borderBottom: '1px solid #f0f0f0',
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}>
                                        <div>
                                            <div style={{
                                                fontSize: '0.9rem',
                                                color: '#666',
                                                marginBottom: '0.25rem',
                                            }}>
                                                Đánh giá trung bình
                                            </div>
                                            {renderStars(doctor.averageRating || 0)}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            gap: '0.5rem',
                                        }}>
                                            <div style={{
                                                fontSize: '0.9rem',
                                                color: '#666',
                                            }}>
                                                {doctor.reviewCount || 0} đánh giá
                                            </div>
                                            {doctor.reviewCount > 0 && (
                                                <button
                                                    onClick={() => showAllFeedbacks(doctor)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#44b89d',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        padding: 0,
                                                        textDecoration: 'underline',
                                                    }}
                                                >
                                                    Xem tất cả
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{
                                    padding: '1.5rem 2rem',
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1rem',
                                }}>
                                    <button
                                        onClick={() => handleContactDoctor(doctor.fullName)}
                                        style={{
                                            background: '#44b89d',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '0.75rem',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8L12 13L20 8V18ZM12 11L4 6H20L12 11Z" fill="currentColor"/>
                                        </svg>
                                        Liên Hệ
                                    </button>
                                    <button
                                        onClick={() => openReviewForm(doctor)}
                                        style={{
                                            background: '#f1c40f',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '0.75rem',
                                            fontWeight: '600',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="currentColor"/>
                                        </svg>
                                        Đánh Giá
                                    </button>
                                </div>

                                {/* Recent Reviews Preview */}
                                {doctorFeedbacks[doctor.userID]?.length > 0 && (
                                    <div style={{
                                        padding: '1.5rem 2rem',
                                        borderTop: '1px solid #f0f0f0',
                                    }}>
                                        <h4 style={{
                                            margin: '0 0 1rem 0',
                                            color: '#2c3e50',
                                            fontSize: '1.1rem',
                                        }}>
                                            Đánh giá gần đây
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '1rem',
                                        }}>
                                            {doctorFeedbacks[doctor.userID].slice(0, 2).map((feedback, index) => (
                                                <div key={index} style={{
                                                    padding: '1rem',
                                                    background: '#f8f9fa',
                                                    borderRadius: '8px',
                                                }}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        marginBottom: '0.5rem',
                                                    }}>
                                                        <div>
                                                            <div style={{
                                                                fontWeight: '500',
                                                                marginBottom: '0.25rem',
                                                            }}>
                                                                {feedback.userName}
                                                            </div>
                                                            {renderStars(feedback.rating)}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '0.85rem',
                                                            color: '#999',
                                                        }}>
                                                            {new Date(feedback.submittedAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <p style={{
                                                        margin: '0',
                                                        fontSize: '0.95rem',
                                                        color: '#666',
                                                        lineHeight: '1.5',
                                                    }}>
                                                        {feedback.feedbackText}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Review Form Modal */}
            <ReviewForm />

            {/* Feedback Modal */}
            <FeedbackModal />
        </div>
    );
};

export default DoctorPage;