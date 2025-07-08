import React, { useState } from 'react';
import { toast } from 'react-toastify';
import authApi from '../api/authApi';

const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.oldPassword) newErrors.oldPassword = 'Vui lòng nhập mật khẩu hiện tại';
    if (!formData.newPassword) newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    else if (formData.confirmPassword !== formData.newPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      const response = await authApi.changePassword(formData.oldPassword, formData.newPassword, formData.confirmPassword);
      toast.success(response.data.message || 'Đổi mật khẩu thành công');
      
      // Reset form
      setFormData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data || 'Đã xảy ra lỗi khi đổi mật khẩu';
      toast.error(errorMessage);
      console.error('Change password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="password-form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="oldPassword">Mật Khẩu Hiện Tại</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            className={errors.oldPassword ? 'input-error' : ''}
            value={formData.oldPassword}
            onChange={handleChange}
          />
          {errors.oldPassword && <p className="error-message">{errors.oldPassword}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="newPassword">Mật Khẩu Mới</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className={errors.newPassword ? 'input-error' : ''}
            value={formData.newPassword}
            onChange={handleChange}
          />
          {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Xác Nhận Mật Khẩu Mới</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={errors.confirmPassword ? 'input-error' : ''}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
        </div>
        
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
        </button>
      </form>

      <style jsx>{`
        .password-form-container {
          width: 100%;
        }
        .form-group {
          margin-bottom: 1.2rem;
        }
        label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: all 0.3s;
        }
        input:focus {
          outline: none;
          border-color: #2c9085;
          box-shadow: 0 0 0 3px rgba(44, 144, 133, 0.1);
        }
        .input-error {
          border-color: #e53e3e;
        }
        .error-message {
          color: #e53e3e;
          font-size: 0.8rem;
          margin-top: 0.3rem;
        }
        .submit-button {
          width: 100%;
          background-color: #2c9085;
          color: white;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s;
          font-size: 1rem;
          margin-top: 0.5rem;
        }
        .submit-button:hover {
          background-color: #237b71;
        }
        .submit-button:disabled {
          background-color: #93d5ce;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordForm; 