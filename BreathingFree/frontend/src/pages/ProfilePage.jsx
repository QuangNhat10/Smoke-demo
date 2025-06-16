import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';

// Dữ liệu giả
const fakeMemberData = {
    member123: {
        name: 'John Smith',
        role: 'Member',
        email: 'john.smith@example.com',
        phone: '0912345678',
        address: 'Hà Nội, Việt Nam',
        dateOfBirth: '1990-05-15',
        gender: 'Nam',
        smokingHistory: '10 năm',
        cigarettesPerDay: 20,
        memberSince: '2023-01-15',
        membershipPlan: 'Premium',
        membershipExpires: '2024-01-15',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
};

const fakeDoctorData = {
    doctor123: {
        name: 'Emma Wilson',
        role: 'Doctor',
        email: 'emma.wilson@example.com',
        phone: '0987654321',
        address: 'Hồ Chí Minh, Việt Nam',
        specialization: 'Chuyên gia cai nghiện thuốc lá',
        experience: '8 năm',
        education: 'Tiến sĩ Y khoa - Đại học Y Hà Nội',
        certifications: ['Chứng chỉ tư vấn cai nghiện', 'Chứng nhận chuyên gia tâm lý học'],
        languages: ['Tiếng Việt', 'Tiếng Anh'],
        profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
        workingHours: 'Thứ 2 - Thứ 6: 8:00 - 17:00'
    }
};

function ProfilePage() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showImageOptions, setShowImageOptions] = useState(false);
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        // Kiểm tra đăng nhập
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        if (!userLoggedIn) {
            navigate('/login');
            return;
        }

        // Lấy thông tin người dùng từ localStorage
        const storedUserName = localStorage.getItem('userName');
        const storedUserRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');

        setUserName(storedUserName || '');
        setUserRole(storedUserRole || '');
        setUserId(storedUserId || '');

        // Lấy dữ liệu người dùng dựa vào vai trò và ID
        if (storedUserRole === 'Member' && storedUserId) {
            setUserData(fakeMemberData[storedUserId] || null);
            setFormData(fakeMemberData[storedUserId] || {});
        } else if (storedUserRole === 'Doctor' && storedUserId) {
            setUserData(fakeDoctorData[storedUserId] || null);
            setFormData(fakeDoctorData[storedUserId] || {});
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Trong thực tế, đây sẽ là API call để cập nhật thông tin
        const updatedData = { ...userData, ...formData };
        if (imagePreview) {
            updatedData.profilePicture = imagePreview;
            // Lưu ảnh đại diện vào localStorage để Header có thể sử dụng
            localStorage.setItem('profilePicture', imagePreview);
        }

        // Lưu các thông tin cá nhân vào localStorage để TrackStatus có thể sử dụng
        localStorage.setItem('gender', formData.gender || userData?.gender || '');
        localStorage.setItem('dateOfBirth', formData.dateOfBirth || userData?.dateOfBirth || '');
        localStorage.setItem('smokingHistory', formData.smokingHistory || userData?.smokingHistory || '');
        localStorage.setItem('phone', formData.phone || userData?.phone || '');
        localStorage.setItem('address', formData.address || userData?.address || '');
        localStorage.setItem('userEmail', formData.email || userData?.email || '');
        localStorage.setItem('cigarettesPerDay', formData.cigarettesPerDay || userData?.cigarettesPerDay || 0);

        setUserData(updatedData);
        setIsEditing(false);
        setShowImageOptions(false);
    };

    const handleImageClick = () => {
        if (isEditing) {
            setShowImageOptions(!showImageOptions);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setShowImageOptions(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleCaptureImage = () => {
        // Trong ứng dụng thực tế, đây sẽ yêu cầu quyền truy cập camera
        // và mở giao diện camera để chụp ảnh. Vì đây là demo nên
        // chúng ta sẽ chỉ giả lập bằng cách mở file picker.
        triggerFileInput();
    };

    const renderMemberProfile = () => (
        <div className="profile-details">
            <div className="profile-section">
                <h3>Thông tin cá nhân</h3>
                {isEditing ? (
                    <div className="form-group">
                        <div className="form-row">
                            <label>Họ và tên</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Số điện thoại</label>
                            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Địa chỉ</label>
                            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Ngày sinh</label>
                            <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Giới tính</label>
                            <select name="gender" value={formData.gender || ''} onChange={handleChange}>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">Họ và tên:</span>
                            <span className="value">{userData?.name}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Email:</span>
                            <span className="value">{userData?.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Số điện thoại:</span>
                            <span className="value">{userData?.phone}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Địa chỉ:</span>
                            <span className="value">{userData?.address}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Ngày sinh:</span>
                            <span className="value">{userData?.dateOfBirth}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Giới tính:</span>
                            <span className="value">{userData?.gender}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-section">
                <h3>Thông tin cai thuốc</h3>
                {isEditing ? (
                    <div className="form-group">
                        <div className="form-row">
                            <label>Thời gian hút thuốc</label>
                            <input type="text" name="smokingHistory" value={formData.smokingHistory || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Điếu thuốc/ngày</label>
                            <input type="number" name="cigarettesPerDay" value={formData.cigarettesPerDay || ''} onChange={handleChange} />
                        </div>
                    </div>
                ) : (
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">Thời gian hút thuốc:</span>
                            <span className="value">{userData?.smokingHistory}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Điếu thuốc/ngày:</span>
                            <span className="value">{userData?.cigarettesPerDay}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-section">
                <h3>Thông tin thành viên</h3>
                <div className="profile-info">
                    <div className="info-row">
                        <span className="label">Thành viên từ:</span>
                        <span className="value">{userData?.memberSince}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Gói thành viên:</span>
                        <span className="value">{userData?.membershipPlan}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Hết hạn:</span>
                        <span className="value">{userData?.membershipExpires}</span>
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                {isEditing ? (
                    <div>
                        <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
                        <button className="btn btn-secondary" onClick={() => {
                            setIsEditing(false);
                            setImagePreview('');
                            setShowImageOptions(false);
                        }}>Hủy</button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</button>
                )}
            </div>
        </div>
    );

    const renderDoctorProfile = () => (
        <div className="profile-details">
            <div className="profile-section">
                <h3>Thông tin cá nhân</h3>
                {isEditing ? (
                    <div className="form-group">
                        <div className="form-row">
                            <label>Họ và tên</label>
                            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Số điện thoại</label>
                            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Địa chỉ</label>
                            <input type="text" name="address" value={formData.address || ''} onChange={handleChange} />
                        </div>
                    </div>
                ) : (
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">Họ và tên:</span>
                            <span className="value">{userData?.name}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Email:</span>
                            <span className="value">{userData?.email}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Số điện thoại:</span>
                            <span className="value">{userData?.phone}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Địa chỉ:</span>
                            <span className="value">{userData?.address}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-section">
                <h3>Thông tin chuyên môn</h3>
                {isEditing ? (
                    <div className="form-group">
                        <div className="form-row">
                            <label>Chuyên môn</label>
                            <input type="text" name="specialization" value={formData.specialization || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Kinh nghiệm</label>
                            <input type="text" name="experience" value={formData.experience || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Học vấn</label>
                            <input type="text" name="education" value={formData.education || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Giờ làm việc</label>
                            <input type="text" name="workingHours" value={formData.workingHours || ''} onChange={handleChange} />
                        </div>
                    </div>
                ) : (
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">Chuyên môn:</span>
                            <span className="value">{userData?.specialization}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Kinh nghiệm:</span>
                            <span className="value">{userData?.experience}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Học vấn:</span>
                            <span className="value">{userData?.education}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Giờ làm việc:</span>
                            <span className="value">{userData?.workingHours}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="profile-section">
                <h3>Chứng chỉ và ngôn ngữ</h3>
                <div className="profile-info">
                    <div className="info-row">
                        <span className="label">Chứng chỉ:</span>
                        <span className="value">
                            {userData?.certifications?.map((cert, index) => (
                                <div key={index}>{cert}</div>
                            ))}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="label">Ngôn ngữ:</span>
                        <span className="value">
                            {userData?.languages?.map((lang, index) => (
                                <div key={index}>{lang}</div>
                            ))}
                        </span>
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                {isEditing ? (
                    <div>
                        <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
                        <button className="btn btn-secondary" onClick={() => {
                            setIsEditing(false);
                            setImagePreview('');
                            setShowImageOptions(false);
                        }}>Hủy</button>
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Chỉnh sửa thông tin</button>
                )}
            </div>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
            padding: '0',
            margin: '0',
            boxSizing: 'border-box',
            overflowX: 'hidden'
        }}>
            <div style={{
                width: '100%',
                margin: '0',
                padding: '0'
            }}>
                <Header userName={userName} />
                {userRole === 'Member' ? <SecondaryNavigation /> : <SecondaryNavigationDoctor />}
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                padding: '2rem',
                boxSizing: 'border-box'
            }}>
                <div className="profile-container">
                    <div className="profile-header">
                        <div className="avatar-section">
                            <div
                                className={`avatar ${isEditing ? 'editable' : ''}`}
                                onClick={handleImageClick}
                            >
                                <img
                                    src={imagePreview || userData?.profilePicture || 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                />
                                {isEditing && (
                                    <div className="avatar-overlay">
                                        <span>Chỉnh sửa</span>
                                    </div>
                                )}
                            </div>
                            {showImageOptions && (
                                <div className="image-options">
                                    <button className="image-option" onClick={triggerFileInput}>
                                        <span className="option-icon">📁</span>
                                        Tải ảnh lên
                                    </button>
                                    <button className="image-option" onClick={handleCaptureImage}>
                                        <span className="option-icon">📷</span>
                                        Chụp ảnh
                                    </button>
                                </div>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                accept="image/*"
                            />
                        </div>
                        <div className="header-info">
                            <h1>{userData?.name || 'Không có tên'}</h1>
                            <p>{userRole === 'Member' ? 'Thành viên' : 'Bác sĩ'}</p>
                        </div>
                    </div>

                    {userData ? (
                        userRole === 'Member' ? renderMemberProfile() : renderDoctorProfile()
                    ) : (
                        <div className="profile-loading">Đang tải thông tin hồ sơ...</div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .profile-container {
                    width: 100%;
                }
                
                .profile-header {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border-radius: 18px;
                    padding: 2rem;
                    box-shadow: 0 8px 25px rgba(53, 167, 156, 0.12);
                    margin-bottom: 2rem;
                    background-image: linear-gradient(to right, rgba(53, 167, 156, 0.05), rgba(53, 167, 156, 0.01));
                    position: relative;
                }

                .avatar-section {
                    margin-right: 2rem;
                    position: relative;
                }

                .avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 4px solid #35a79c;
                    position: relative;
                }

                .avatar.editable {
                    cursor: pointer;
                }

                .avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: filter 0.3s ease;
                }

                .avatar.editable:hover img {
                    filter: brightness(70%);
                }

                .avatar-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .avatar.editable:hover .avatar-overlay {
                    opacity: 1;
                }

                .avatar-overlay span {
                    color: white;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .image-options {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    width: 180px;
                    z-index: 100;
                    margin-top: 10px;
                    overflow: hidden;
                }

                .image-option {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding: 12px 16px;
                    border: none;
                    background-color: transparent;
                    cursor: pointer;
                    font-size: 0.9rem;
                    text-align: left;
                    transition: background-color 0.2s ease;
                }

                .image-option:hover {
                    background-color: #f5f5f5;
                }

                .option-icon {
                    margin-right: 10px;
                    font-size: 1.2rem;
                }

                .header-info {
                    flex: 1;
                }

                .header-info h1 {
                    font-size: 2.2rem;
                    color: #35a79c;
                    margin: 0 0 0.5rem 0;
                }

                .header-info p {
                    font-size: 1.1rem;
                    color: #5a6a6e;
                    margin: 0;
                }

                .profile-details {
                    background-color: white;
                    border-radius: 18px;
                    padding: 2rem;
                    box-shadow: 0 8px 25px rgba(53, 167, 156, 0.12);
                }

                .profile-section {
                    margin-bottom: 2rem;
                    border-bottom: 1px solid #e5e8ee;
                    padding-bottom: 1.5rem;
                }

                .profile-section:last-child {
                    border-bottom: none;
                }

                .profile-section h3 {
                    color: #35a79c;
                    font-size: 1.3rem;
                    margin-bottom: 1.2rem;
                }

                .profile-info {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                }

                .info-row {
                    display: flex;
                    margin-bottom: 0.5rem;
                }

                .label {
                    min-width: 170px;
                    font-weight: 500;
                    color: #5a6a6e;
                }

                .value {
                    color: #333;
                }

                .form-group {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }

                .form-row {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 1rem;
                }

                .form-row label {
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: #5a6a6e;
                }

                .form-row input, .form-row select {
                    padding: 0.8rem;
                    border: 1px solid #e5e8ee;
                    border-radius: 8px;
                    font-size: 1rem;
                }

                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 2rem;
                }

                .btn {
                    padding: 0.9rem 1.8rem;
                    border-radius: 50px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    font-size: 1rem;
                    transition: all 0.25s ease;
                }

                .btn-primary {
                    background-color: #35a79c;
                    color: white;
                    margin-right: 0.8rem;
                    box-shadow: 0 4px 12px rgba(53, 167, 156, 0.3);
                }

                .btn-primary:hover {
                    background-color: #2c9085;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(53, 167, 156, 0.4);
                }

                .btn-secondary {
                    background-color: #e5e8ee;
                    color: #5a6a6e;
                }

                .btn-secondary:hover {
                    background-color: #d8dde5;
                    transform: translateY(-3px);
                }

                .profile-loading {
                    text-align: center;
                    padding: 2rem;
                    color: #5a6a6e;
                }

                @media (max-width: 768px) {
                    .profile-header {
                        flex-direction: column;
                        text-align: center;
                    }

                    .avatar-section {
                        margin-right: 0;
                        margin-bottom: 1.5rem;
                    }

                    .form-group {
                        grid-template-columns: 1fr;
                    }

                    .info-row {
                        flex-direction: column;
                    }

                    .label {
                        min-width: auto;
                        margin-bottom: 0.2rem;
                    }

                    .value {
                        margin-left: 0;
                    }
                }
            `}</style>
        </div>
    );
}

export default ProfilePage;
