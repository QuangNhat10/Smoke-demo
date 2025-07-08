import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import { quitPlanApi } from '../api/quitPlanApi';

// Component tạo kế hoạch cai thuốc mới
const CreatePlanPage = () => {
    const navigate = useNavigate();
    // State quản lý trạng thái kế hoạch hiện có
    const [hasExistingPlan, setHasExistingPlan] = useState(false);
    const [loading, setLoading] = useState(true);
    const [existingPlan, setExistingPlan] = useState(null);
    // State quản lý hiển thị phần tùy chọn nâng cao
    const [showAdvanced, setShowAdvanced] = useState(false);
    // State quản lý dữ liệu form
    const [formData, setFormData] = useState({
        cigarettesPerDay: '', // Số điếu hút mỗi ngày
        cigarettesPerPack: 20, // Số điếu trong một gói
        pricePerPack: '', // Giá một gói
        yearsSmoked: '', // Số năm đã hút
        quitDate: '', // Ngày dự kiến cai
        reasons: [], // Lý do cai thuốc
        otherReason: '', // Lý do khác
        difficulty: 'medium', // Mức độ khó khăn
        supportNeeded: [], // Hình thức hỗ trợ cần thiết
        triggers: [], // Yếu tố kích thích hút thuốc
        otherTrigger: '', // Yếu tố kích thích khác
        motivation: '' // Động lực cai thuốc
    });

    // Danh sách các lý do cai thuốc
    const reasonOptions = [
        'Sức khỏe',
        'Tiết kiệm chi phí',
        'Gia đình',
        'Ngoại hình',
        'Áp lực xã hội',
        'Mùi hôi',
        'Khác'
    ];

    // Danh sách các hình thức hỗ trợ
    const supportOptions = [
        'Tư vấn bác sĩ',
        'Hỗ trợ gia đình',
        'Nhóm hỗ trợ trực tuyến',
        'Nicotine thay thế',
        'Thuốc kê đơn'
    ];

    // Danh sách các yếu tố kích thích
    const triggerOptions = [
        'Stress/Căng thẳng',
        'Sau bữa ăn',
        'Cà phê',
        'Rượu bia',
        'Bạn bè hút thuốc',
        'Thói quen buổi sáng',
        'Khác'
    ];

    // Kiểm tra kế hoạch đang hoạt động khi component load
    useEffect(() => {
        const checkExistingPlan = async () => {
            try {
                setLoading(true);
                const result = await quitPlanApi.getActiveQuitPlan();
                if (result && result.data) {
                    setHasExistingPlan(true);
                    setExistingPlan(result.data);
                } else {
                    setHasExistingPlan(false);
                    setExistingPlan(null);
                }
            } catch (error) {
                console.error('Error checking existing plan:', error);
                // Nếu lỗi 404 (không có kế hoạch) thì cho phép tạo mới
                if (error.response?.status === 404) {
                    setHasExistingPlan(false);
                    setExistingPlan(null);
                } else {
                    // Các lỗi khác có thể do authentication
                    console.error('Error loading plan:', error);
                }
            } finally {
                setLoading(false);
            }
        };

        checkExistingPlan();
    }, []);

    // Xử lý thay đổi giá trị input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Xử lý thay đổi checkbox
    const handleCheckboxChange = (e, category) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [category]: checked
                ? [...prev[category], value]
                : prev[category].filter(item => item !== value)
        }));
    };

    // Tính toán chi phí hút thuốc hàng ngày
    const calculateDailyCost = () => {
        const cigarettesPerDay = parseFloat(formData.cigarettesPerDay) || 0;
        const pricePerPack = parseFloat(formData.pricePerPack) || 0;
        const cigarettesPerPack = parseFloat(formData.cigarettesPerPack) || 20;
        return (cigarettesPerDay * pricePerPack / cigarettesPerPack).toFixed(2);
    };

    // Xử lý khi submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Chuẩn bị dữ liệu để gửi lên API
            const planData = {
                cigarettesPerDay: parseInt(formData.cigarettesPerDay),
                cigarettesPerPack: parseInt(formData.cigarettesPerPack),
                pricePerPack: parseFloat(formData.pricePerPack),
                yearsSmoked: parseInt(formData.yearsSmoked),
                quitDate: formData.quitDate || null,
                reasons: formData.reasons,
                otherReason: formData.otherReason,
                difficulty: formData.difficulty,
                supportNeeded: formData.supportNeeded,
                triggers: formData.triggers,
                otherTrigger: formData.otherTrigger,
                motivation: formData.motivation
            };

            // Gọi API để tạo kế hoạch
            const response = await quitPlanApi.createQuitPlan(planData);

            // Hiển thị thông báo thành công
            alert(response.message || 'Tạo kế hoạch cai thuốc thành công!');

            // Chuyển hướng về trang dashboard
            navigate('/dashboard-member');

        } catch (error) {
            console.error('Lỗi khi tạo kế hoạch:', error);
            const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo kế hoạch. Vui lòng thử lại.';
            alert(errorMessage);
        }
    };

    return (
        // Container chính với gradient background
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)'
        }}>
            <Header />
            <SecondaryNavigation />

            {/* Container nội dung */}
            <div style={{
                maxWidth: '800px',
                margin: '2rem auto',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                {loading ? (
                    // Loading state
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem'
                    }}>
                        <h2 style={{ color: '#2C9085', marginBottom: '1rem' }}>Đang kiểm tra...</h2>
                        <p style={{ color: '#7f8c8d' }}>Vui lòng chờ trong giây lát</p>
                    </div>
                ) : hasExistingPlan ? (
                    // Hiển thị khi đã có kế hoạch
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h1 style={{
                            color: '#2C9085',
                            marginBottom: '2rem'
                        }}>Bạn Đã Có Kế Hoạch Cai Thuốc</h1>

                        <div style={{
                            backgroundColor: '#f0f9f8',
                            padding: '2rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            border: '2px solid #2C9085'
                        }}>
                            <h3 style={{
                                color: '#2C9085',
                                marginBottom: '1rem',
                                fontSize: '1.5rem'
                            }}>
                                🎯 Kế Hoạch Đang Hoạt Động
                            </h3>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <h4 style={{ color: '#2C9085', marginBottom: '0.5rem' }}>Ngày không hút thuốc</h4>
                                    <p style={{
                                        fontSize: '2rem',
                                        fontWeight: 'bold',
                                        color: '#27ae60',
                                        margin: 0
                                    }}>
                                        {existingPlan?.daysSmokeFree || 0}
                                    </p>
                                </div>

                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <h4 style={{ color: '#2C9085', marginBottom: '0.5rem' }}>Tiền tiết kiệm</h4>
                                    <p style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#f39c12',
                                        margin: 0
                                    }}>
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND'
                                        }).format(existingPlan?.totalMoneySaved || 0)}
                                    </p>
                                </div>
                            </div>

                            <p style={{
                                color: '#7f8c8d',
                                fontSize: '1.1rem',
                                marginBottom: '2rem'
                            }}>
                                Bạn đã có một kế hoạch cai thuốc đang hoạt động.
                                Hãy tiếp tục theo dõi tiến trình của mình tại Dashboard!
                            </p>
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={() => navigate('/dashboard-member')}
                                style={{
                                    padding: '1rem 2rem',
                                    backgroundColor: '#2C9085',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(44, 144, 133, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#25807a';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#2C9085';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                📊 Về Dashboard
                            </button>

                            <button
                                onClick={() => navigate('/track-status')}
                                style={{
                                    padding: '1rem 2rem',
                                    backgroundColor: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '1.1rem',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = '#229954';
                                    e.target.style.transform = 'translateY(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = '#27ae60';
                                    e.target.style.transform = 'translateY(0)';
                                }}
                            >
                                📈 Theo Dõi Tiến Trình
                            </button>
                        </div>
                    </div>
                ) : (
                    // Hiển thị form tạo kế hoạch mới
                    <>
                        <h1 style={{
                            color: '#2C9085',
                            marginBottom: '2rem',
                            textAlign: 'center'
                        }}>Tạo Kế Hoạch Cai Thuốc</h1>

                        <form onSubmit={handleSubmit}>
                            {/* Phần thông tin cơ bản */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{
                                    color: '#2C9085',
                                    fontSize: '1.5rem',
                                    marginBottom: '1.5rem'
                                }}>Thông Tin Cơ Bản</h2>

                                <div style={{
                                    display: 'grid',
                                    gap: '1rem',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
                                }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: '#4a5568',
                                            fontWeight: '500'
                                        }}>
                                            Số điếu thuốc hút mỗi ngày
                                        </label>
                                        <input
                                            type="number"
                                            name="cigarettesPerDay"
                                            value={formData.cigarettesPerDay}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: '#4a5568',
                                            fontWeight: '500'
                                        }}>
                                            Số điếu trong một gói
                                        </label>
                                        <input
                                            type="number"
                                            name="cigarettesPerPack"
                                            value={formData.cigarettesPerPack}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: '#4a5568',
                                            fontWeight: '500'
                                        }}>
                                            Giá một gói thuốc (VNĐ)
                                        </label>
                                        <input
                                            type="number"
                                            name="pricePerPack"
                                            value={formData.pricePerPack}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '0.5rem',
                                            color: '#4a5568',
                                            fontWeight: '500'
                                        }}>
                                            Số năm đã hút thuốc
                                        </label>
                                        <input
                                            type="number"
                                            name="yearsSmoked"
                                            value={formData.yearsSmoked}
                                            onChange={handleInputChange}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Chi phí hàng ngày */}
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '1rem',
                                    backgroundColor: '#f7fafc',
                                    borderRadius: '8px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ color: '#4a5568' }}>Chi phí hút thuốc mỗi ngày:</p>
                                    <p style={{
                                        color: '#2C9085',
                                        fontSize: '1.5rem',
                                        fontWeight: '600'
                                    }}>
                                        {calculateDailyCost()} VNĐ
                                    </p>
                                </div>
                            </div>

                            {/* Nút hiển thị tùy chọn nâng cao */}
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    marginBottom: '2rem',
                                    backgroundColor: '#f7fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    color: '#2C9085',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                {showAdvanced ? 'Ẩn tùy chọn nâng cao' : 'Hiện tùy chọn nâng cao'}
                                <span style={{
                                    transform: showAdvanced ? 'rotate(180deg)' : 'rotate(0)',
                                    transition: 'transform 0.3s ease'
                                }}>▾</span>
                            </button>

                            {/* Phần tùy chọn nâng cao */}
                            {showAdvanced && (
                                <div style={{ marginBottom: '2rem' }}>
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{
                                            color: '#2C9085',
                                            marginBottom: '1rem'
                                        }}>Ngày Dự Kiến Cai Thuốc</h3>
                                        <input
                                            type="date"
                                            name="quitDate"
                                            value={formData.quitDate}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '1rem'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{
                                            color: '#2C9085',
                                            marginBottom: '1rem'
                                        }}>Lý Do Cai Thuốc</h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '1rem'
                                        }}>
                                            {reasonOptions.map(reason => (
                                                <label key={reason} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        value={reason}
                                                        checked={formData.reasons.includes(reason)}
                                                        onChange={(e) => handleCheckboxChange(e, 'reasons')}
                                                    />
                                                    {reason}
                                                </label>
                                            ))}
                                        </div>
                                        {formData.reasons.includes('Khác') && (
                                            <input
                                                type="text"
                                                name="otherReason"
                                                value={formData.otherReason}
                                                onChange={handleInputChange}
                                                placeholder="Nhập lý do khác..."
                                                style={{
                                                    width: '100%',
                                                    marginTop: '1rem',
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{
                                            color: '#2C9085',
                                            marginBottom: '1rem'
                                        }}>Mức Độ Khó Khăn Dự Kiến</h3>
                                        <select
                                            name="difficulty"
                                            value={formData.difficulty}
                                            onChange={handleInputChange}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            <option value="easy">Dễ - Tôi đã sẵn sàng</option>
                                            <option value="medium">Trung bình - Cần nỗ lực</option>
                                            <option value="hard">Khó - Cần nhiều hỗ trợ</option>
                                        </select>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{
                                            color: '#2C9085',
                                            marginBottom: '1rem'
                                        }}>Hình Thức Hỗ Trợ Mong Muốn</h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '1rem'
                                        }}>
                                            {supportOptions.map(support => (
                                                <label key={support} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        value={support}
                                                        checked={formData.supportNeeded.includes(support)}
                                                        onChange={(e) => handleCheckboxChange(e, 'supportNeeded')}
                                                    />
                                                    {support}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{
                                            color: '#2C9085',
                                            marginBottom: '1rem'
                                        }}>Yếu Tố Kích Thích Hút Thuốc</h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                            gap: '1rem'
                                        }}>
                                            {triggerOptions.map(trigger => (
                                                <label key={trigger} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <input
                                                        type="checkbox"
                                                        value={trigger}
                                                        checked={formData.triggers.includes(trigger)}
                                                        onChange={(e) => handleCheckboxChange(e, 'triggers')}
                                                    />
                                                    {trigger}
                                                </label>
                                            ))}
                                        </div>
                                        {formData.triggers.includes('Khác') && (
                                            <input
                                                type="text"
                                                name="otherTrigger"
                                                value={formData.otherTrigger}
                                                onChange={handleInputChange}
                                                placeholder="Nhập yếu tố khác..."
                                                style={{
                                                    width: '100%',
                                                    marginTop: '1rem',
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                            />
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '2rem' }}>
                                        <h3 style={{
                                            color: '#2C9085',
                                            marginBottom: '1rem'
                                        }}>Động Lực Cai Thuốc</h3>
                                        <textarea
                                            name="motivation"
                                            value={formData.motivation}
                                            onChange={handleInputChange}
                                            placeholder="Hãy viết về động lực của bạn để cai thuốc..."
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '1rem',
                                                minHeight: '100px',
                                                resize: 'vertical'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Các nút điều khiển */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                justifyContent: 'center'
                            }}>
                                {/* Nút hủy */}
                                <button
                                    type="button"
                                    onClick={() => navigate('/dashboard-member')}
                                    style={{
                                        padding: '1rem 2rem',
                                        borderRadius: '8px',
                                        border: '1px solid #2C9085',
                                        backgroundColor: 'white',
                                        color: '#2C9085',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Hủy
                                </button>
                                {/* Nút tạo kế hoạch */}
                                <button
                                    type="submit"
                                    style={{
                                        padding: '1rem 2rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#2C9085',
                                        color: 'white',
                                        fontWeight: '500',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Tạo Kế Hoạch
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default CreatePlanPage; 