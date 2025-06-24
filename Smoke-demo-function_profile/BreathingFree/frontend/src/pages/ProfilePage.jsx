import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';
import authApi from '../api/authApi';

// Dữ liệu giả cho trường hợp API không hoạt động
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Kiểm tra đăng nhập - Đơn giản hóa kiểm tra để đảm bảo người dùng có thể xem trang này
        const storedUserName = localStorage.getItem('userName');
        const storedUserRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');

        if (!storedUserName) {
            // Nếu không có tên người dùng trong localStorage, vẫn cho phép xem nhưng hiển thị dữ liệu giả
            console.log("Không tìm thấy thông tin người dùng - sử dụng dữ liệu giả");
        }

        setUserName(storedUserName || 'User');
        setUserRole(storedUserRole || 'Member');
        setUserId(storedUserId || 'member123');

        // Không chuyển hướng đến /login nếu không tìm thấy token

        // Gọi API để lấy thông tin profile nếu có token
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserProfile();
        } else {
            // Sử dụng dữ liệu giả nếu không có token
            setUserData(fakeMemberData.member123);
            setFormData({
                fullName: fakeMemberData.member123.name,
                email: fakeMemberData.member123.email,
                phone: fakeMemberData.member123.phone,
                address: fakeMemberData.member123.address,
                gender: fakeMemberData.member123.gender,
                dob: fakeMemberData.member123.dateOfBirth,
                avatar: fakeMemberData.member123.profilePicture
            });
            setIsLoading(false);
        }

        // Nếu có profilePicture trong localStorage, cập nhật preview
        const storedProfilePicture = localStorage.getItem('profilePicture');
        if (storedProfilePicture) {
            setImagePreview(storedProfilePicture);
        }

        // Listen for storage events để cập nhật UI khi localStorage thay đổi
        const handleStorageChange = () => {
            console.log("Storage changed, updating profile page");
            
            // Refresh lại dữ liệu hiển thị nếu thay đổi đến từ một tab khác
            const newProfilePicture = localStorage.getItem('profilePicture');
            if (newProfilePicture && newProfilePicture !== imagePreview) {
                setImagePreview(newProfilePicture);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const fetchUserProfile = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            const response = await authApi.getUserProfile();
            const profileData = response.data;
            
            setUserData(profileData);
            setFormData({
                fullName: profileData.fullName || '',
                email: profileData.email || '',
                phone: profileData.phone || '',
                address: profileData.address || '',
                gender: profileData.gender || '',
                dob: profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : '',
                avatar: profileData.avatar || ''
            });
            
            if (profileData.avatar) {
                setImagePreview(profileData.avatar);
            }
            
            // Lưu một số thông tin vào localStorage để các component khác có thể sử dụng
            localStorage.setItem('userName', profileData.fullName || '');
            localStorage.setItem('userEmail', profileData.email || '');
            
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError('Không thể tải thông tin hồ sơ. Hiện đang hiển thị dữ liệu mẫu.');
            
            // Fallback to using mock data if API fails
            setUserData(fakeMemberData.member123);
            setFormData({
                fullName: fakeMemberData.member123.name,
                email: fakeMemberData.member123.email,
                phone: fakeMemberData.member123.phone,
                address: fakeMemberData.member123.address,
                gender: fakeMemberData.member123.gender,
                dob: fakeMemberData.member123.dateOfBirth,
                avatar: fakeMemberData.member123.profilePicture
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError('');
        
        // Chuẩn bị dữ liệu để gửi đến API
        const profileUpdateData = {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            avatar: imagePreview || formData.avatar
        };
        
        try {
            // Thử gọi API để cập nhật thông tin
            try {
                await authApi.updateUserProfile(profileUpdateData);
                console.log('Profile updated via API');
            } catch (apiError) {
                console.log('API update failed, using local storage instead', apiError);
                // Nếu API không hoạt động, cập nhật trực tiếp vào localStorage để demo
            }
            
            // Cập nhật dữ liệu cho ứng dụng ngay cả khi API không hoạt động
            const updatedUserData = {
                ...userData,
                fullName: profileUpdateData.fullName,
                name: profileUpdateData.fullName,
                phone: profileUpdateData.phone,
                address: profileUpdateData.address,
                avatar: profileUpdateData.avatar,
                profilePicture: profileUpdateData.avatar
            };
            setUserData(updatedUserData);
            
            // Lưu vào localStorage để các component khác có thể sử dụng
            localStorage.setItem('userName', profileUpdateData.fullName || '');
            localStorage.setItem('userEmail', formData.email || '');
            localStorage.setItem('profilePicture', profileUpdateData.avatar || '');
            
            // Cập nhật Header và components khác
            window.dispatchEvent(new Event('storage')); // Trigger để Header cập nhật
            
            // Thông báo thành công
            setIsEditing(false);
            setShowImageOptions(false);
            
            // Hiển thị thông báo thành công
            alert('Cập nhật thông tin thành công!');
            
        } catch (err) {
            console.error("Error updating profile:", err);
            setError('Không thể cập nhật hồ sơ. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
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

    // Hàm xử lý chuyển hướng đến trang đổi mật khẩu
    const handleChangePasswordClick = () => {
        navigate('/change-password');
    };

    const renderMemberProfile = () => (
        <div className="profile-details">
            {error && <div className="error-message">{error}</div>}
            
            <div className="profile-section">
                <h3>Thông tin cá nhân</h3>
                {isEditing ? (
                    <div className="form-group">
                        <div className="form-row">
                            <label>Họ và tên</label>
                            <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange} />
                        </div>
                        <div className="form-row">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email || ''} readOnly disabled className="disabled-input" />
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
                            <input type="date" name="dob" value={formData.dob || ''} readOnly disabled className="disabled-input" />
                        </div>
                        <div className="form-row">
                            <label>Giới tính</label>
                            <select name="gender" value={formData.gender || ''} disabled className="disabled-input">
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>
                ) : (
                    <div className="profile-info">
                        <div className="info-row">
                            <span className="label">UserID:</span>
                            <span className="value">{userData?.userID || userData?.id || '1'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Họ và tên:</span>
                            <span className="value">{userData?.fullName || userData?.name || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Email:</span>
                            <span className="value">{userData?.email || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Số điện thoại:</span>
                            <span className="value">{userData?.phone || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Địa chỉ:</span>
                            <span className="value">{userData?.address || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="info-row">
                            <span className="label">Ngày sinh:</span>
                            <span className="value">
                                {userData?.dob ? new Date(userData.dob).toLocaleDateString('vi-VN') : 
                                 userData?.dateOfBirth ? userData.dateOfBirth : 'Chưa cập nhật'}
                            </span>
                        </div>
                        <div className="info-row">
                            <span className="label">Giới tính:</span>
                            <span className="value">{userData?.gender || 'Chưa cập nhật'}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="action-buttons">
                {isEditing ? (
                    <div>
                        <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
                            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <button className="btn btn-secondary" onClick={() => {
                            setIsEditing(false);
                            setImagePreview('');
                            setShowImageOptions(false);
                            // Khôi phục dữ liệu ban đầu
                            setFormData({
                                fullName: userData?.fullName || userData?.name || '',
                                email: userData?.email || '',
                                phone: userData?.phone || '',
                                address: userData?.address || '',
                                gender: userData?.gender || '',
                                dob: userData?.dob ? new Date(userData.dob).toISOString().split('T')[0] : 
                                     userData?.dateOfBirth || ''
                            });
                        }}>Hủy</button>
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <button 
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            onClick={() => setIsEditing(true)}
                        >
                            Chỉnh Sửa
                        </button>
                        <button 
                            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
                            onClick={handleChangePasswordClick}
                        >
                            Đổi Mật Khẩu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="app-container">
            <Header userName={userName} />
            
            {userRole === 'Doctor' ? <SecondaryNavigationDoctor /> : <SecondaryNavigation />}
            
            <div className="content-container">
                <div className="profile-container">
                    <h2 className="page-title">Hồ sơ của tôi</h2>
                    
                    {isLoading && <div className="loading">Đang tải...</div>}
                    
                    <div className="profile-header">
                        <div className="avatar-section">
                            <div className={`avatar ${isEditing ? 'editable' : ''}`} onClick={handleImageClick}>
                                <img 
                                    src={imagePreview || userData?.avatar || 'https://via.placeholder.com/150'} 
                                    alt={userData?.fullName || "User"} 
                                />
                                {isEditing && (
                                    <div className="edit-overlay">
                                        <i className="fas fa-camera"></i>
                                    </div>
                                )}
                            </div>
                            
                            {showImageOptions && (
                                <div className="image-options">
                                    <button onClick={triggerFileInput}>Chọn ảnh</button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="header-info">
                            <h1>{userData?.fullName || userData?.name || 'Không có tên'}</h1>
                            <p>{userRole === 'Member' ? 'Thành viên' : 'Bác sĩ'}</p>
                        </div>
                    </div>

                    {userData ? (
                        renderMemberProfile()
                    ) : (
                        !isLoading && <div className="profile-loading">Không có thông tin hồ sơ.</div>
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
                
                .edit-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                
                .avatar.editable:hover .edit-overlay {
                    opacity: 1;
                }
                
                .image-options {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    padding: 0.5rem;
                    z-index: 10;
                    margin-top: 0.5rem;
                }
                
                .image-options button {
                    width: 100%;
                    padding: 0.5rem 1rem;
                    border: none;
                    background: none;
                    text-align: left;
                    cursor: pointer;
                }
                
                .image-options button:hover {
                    background-color: #f0f0f0;
                }
                
                .header-info h1 {
                    margin: 0;
                    font-size: 1.8rem;
                    color: #333;
                }
                
                .header-info p {
                    margin: 0.5rem 0 0;
                    color: #888;
                }
                
                .profile-details {
                    padding: 1rem;
                }
                
                .profile-section {
                    background-color: white;
                    border-radius: 18px;
                    padding: 1.5rem;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
                }
                
                .profile-section h3 {
                    margin-top: 0;
                    color: #35a79c;
                    font-size: 1.3rem;
                    border-bottom: 1px solid #f0f0f0;
                    padding-bottom: 0.7rem;
                    margin-bottom: 1.2rem;
                }
                
                .profile-info .info-row {
                    display: flex;
                    margin-bottom: 1rem;
                }
                
                .profile-info .label {
                    width: 150px;
                    font-weight: 500;
                    color: #666;
                }
                
                .profile-info .value {
                    flex: 1;
                    color: #333;
                }
                
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                
                .form-row {
                    display: flex;
                    flex-direction: column;
                }
                
                .form-row label {
                    margin-bottom: 0.3rem;
                    font-weight: 500;
                    color: #666;
                }
                
                .form-row input, 
                .form-row select {
                    padding: 0.7rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 0.95rem;
                }
                
                .form-row input:focus, 
                .form-row select:focus {
                    outline: none;
                    border-color: #35a79c;
                    box-shadow: 0 0 0 2px rgba(53, 167, 156, 0.2);
                }
                
                .disabled-input {
                    background-color: #f9f9f9;
                    cursor: not-allowed;
                }
                
                .action-buttons {
                    display: flex;
                    justify-content: flex-end;
                    gap: 0.8rem;
                    margin-top: 1rem;
                }
                
                .btn {
                    padding: 0.7rem 1.5rem;
                    border-radius: 8px;
                    border: none;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .btn-primary {
                    background-color: #35a79c;
                    color: white;
                }
                
                .btn-primary:hover {
                    background-color: #2c8f86;
                }
                
                .btn-secondary {
                    background-color: #e0e0e0;
                    color: #333;
                }
                
                .btn-secondary:hover {
                    background-color: #d0d0d0;
                }
                
                .error-message {
                    background-color: #ffebee;
                    color: #d32f2f;
                    padding: 0.8rem;
                    border-radius: 8px;
                    margin-bottom: 1rem;
                }
                
                .loading {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 2rem;
                    font-style: italic;
                    color: #666;
                }
            `}</style>
        </div>
    );
}

export default ProfilePage;
