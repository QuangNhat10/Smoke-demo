import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';

// Component tạo kế hoạch cai thuốc mới
const CreatePlanPage = () => {
    const navigate = useNavigate();
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
        otherTrigger: '' // Yếu tố kích thích khác
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
    const handleSubmit = (e) => {
        e.preventDefault();
        // Tính toán chi phí và chuẩn bị dữ liệu
        const dailyCost = calculateDailyCost();
        const planData = {
            ...formData,
            dailyCost,
            createdAt: new Date().toISOString()
        };

        // Lưu kế hoạch vào localStorage
        localStorage.setItem('smokingPlan', JSON.stringify(planData));
        // Chuyển hướng về trang dashboard
        navigate('/dashboard-member');
    };

    return (
        // Container chính với gradient background
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)'
        }}>
            <Header />
            <SecondaryNavigation />

            {/* Form tạo kế hoạch */}
            <div style={{
                maxWidth: '800px',
                margin: '2rem auto',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
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
            </div>
        </div>
    );
};

export default CreatePlanPage; 