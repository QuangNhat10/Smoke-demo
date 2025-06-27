import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import SecondaryNavigationDoctor from '../components/SecondaryNavigationDoctor';
import authApi from '../api/authApi';

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
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const storedUserName = localStorage.getItem('userName');
        const storedUserRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');

        setUserName(storedUserName || '');
        setUserRole(storedUserRole || '');
        setUserId(storedUserId || '');

        fetchUserProfile();

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
            console.log('Profile response:', response);
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
            
            // Lưu thông tin vào localStorage
            localStorage.setItem('userName', profileData.fullName || '');
            localStorage.setItem('userEmail', profileData.email || '');
            
        } catch (err) {
            console.error("Error fetching profile:", err);
            setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
            if (err.response?.status === 401) {
                navigate('/login');
            }
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
        
        const profileUpdateData = {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            avatar: imagePreview || formData.avatar
        };
        
        try {
            const response = await authApi.updateUserProfile(profileUpdateData);
            console.log('Profile updated successfully:', response);
            
            // Refresh profile data after update
            await fetchUserProfile();
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setError('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageClick = () => {
        setShowImageOptions(!showImageOptions);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // TODO: Implement actual file upload to server
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } catch (error) {
                console.error('Error uploading image:', error);
                setError('Không thể tải lên ảnh. Vui lòng thử lại sau.');
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleChangePasswordClick = () => {
        navigate('/change-password');
    };

    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                Đang tải thông tin...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                color: 'red' 
            }}>
                <p>{error}</p>
                <button 
                    onClick={fetchUserProfile}
                    style={{
                        padding: '10px 20px',
                        marginTop: '20px',
                        cursor: 'pointer'
                    }}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <Header />
            {userRole === 'Doctor' ? <SecondaryNavigationDoctor /> : <SecondaryNavigation />}
            
            <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
                <h1 style={{ 
                    color: '#2c3e50',
                    borderBottom: '3px solid #44b89d',
                    paddingBottom: '0.5rem',
                    marginBottom: '2rem'
                }}>
                    Hồ sơ của tôi
                </h1>

                <div style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '2rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {/* Profile Picture Section */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '2rem'
                    }}>
                        <div
                            onClick={handleImageClick}
                            style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: '#e9ecef',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <span style={{ fontSize: '2rem' }}>👤</span>
                            )}
                        </div>
                        <div style={{ marginLeft: '1rem' }}>
                            <h2 style={{ margin: '0', color: '#2c3e50' }}>
                                {formData.fullName || 'Chưa cập nhật'}
                            </h2>
                            <p style={{ margin: '0.5rem 0', color: '#7f8c8d' }}>
                                {userRole === '2' ? 'Thành viên' : userRole === '3' ? 'Bác sĩ' : 'Người dùng'}
                            </p>
                        </div>
                    </div>

                    {/* Image Upload Options */}
                    {showImageOptions && (
                        <div style={{
                            marginBottom: '1rem',
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '8px'
                        }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                            <button
                                onClick={triggerFileInput}
                                style={{
                                    background: '#44b89d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Chọn ảnh mới
                            </button>
                        </div>
                    )}

                    {/* Profile Information */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                            color: '#2c3e50',
                            marginBottom: '1rem'
                        }}>
                            Thông tin cá nhân
                        </h3>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                color: '#7f8c8d',
                                marginBottom: '0.5rem'
                            }}>
                                UserID:
                            </label>
                            <div style={{
                                padding: '0.5rem',
                                background: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                {userData?.userID || 'N/A'}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                color: '#7f8c8d',
                                marginBottom: '0.5rem'
                            }}>
                                Họ và tên:
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    padding: '0.5rem',
                                    background: '#f8f9fa',
                                    borderRadius: '4px'
                                }}>
                                    {formData.fullName || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                color: '#7f8c8d',
                                marginBottom: '0.5rem'
                            }}>
                                Email:
                            </label>
                            <div style={{
                                padding: '0.5rem',
                                background: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                {formData.email || 'Chưa cập nhật'}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                color: '#7f8c8d',
                                marginBottom: '0.5rem'
                            }}>
                                Số điện thoại:
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    padding: '0.5rem',
                                    background: '#f8f9fa',
                                    borderRadius: '4px'
                                }}>
                                    {formData.phone || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                color: '#7f8c8d',
                                marginBottom: '0.5rem'
                            }}>
                                Địa chỉ:
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px'
                                    }}
                                />
                            ) : (
                                <div style={{
                                    padding: '0.5rem',
                                    background: '#f8f9fa',
                                    borderRadius: '4px'
                                }}>
                                    {formData.address || 'Chưa cập nhật'}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                color: '#7f8c8d',
                                marginBottom: '0.5rem'
                            }}>
                                Ngày sinh:
                            </label>
                            <div style={{
                                padding: '0.5rem',
                                background: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                {formData.dob || 'Chưa cập nhật'}
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{
                                display: 'block',
                                color: '#7f8c8d',
                                marginBottom: '0.5rem'
                            }}>
                                Giới tính:
                            </label>
                            <div style={{
                                padding: '0.5rem',
                                background: '#f8f9fa',
                                borderRadius: '4px'
                            }}>
                                {formData.gender || 'Chưa cập nhật'}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'flex-end'
                    }}>
                        <button
                            onClick={handleChangePasswordClick}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#e74c3c',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Đổi mật khẩu
                        </button>
                        
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#95a5a6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleSave}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: '#44b89d',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Lưu
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: '#44b89d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Chỉnh sửa
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
