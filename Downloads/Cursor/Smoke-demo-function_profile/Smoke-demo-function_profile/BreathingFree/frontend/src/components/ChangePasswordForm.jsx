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
      const response = await authApi.changePassword(formData.oldPassword, formData.newPassword);
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
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Đổi Mật Khẩu</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="oldPassword">
            Mật Khẩu Hiện Tại
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            className={`w-full px-3 py-2 border rounded-md ${errors.oldPassword ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.oldPassword}
            onChange={handleChange}
          />
          {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            Mật Khẩu Mới
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            className={`w-full px-3 py-2 border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.newPassword}
            onChange={handleChange}
          />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Xác Nhận Mật Khẩu Mới
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đổi Mật Khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm; 