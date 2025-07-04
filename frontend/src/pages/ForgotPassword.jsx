import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: enter email, 2: enter code+new password
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      await authService.forgotPassword(email);
      toast.success('Mã xác nhận đã được gửi tới email của bạn');
      setStep(2);
    } catch (err) {
      toast.error(err.message || 'Không thể gửi mã xác nhận');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code.trim() || !newPassword.trim()) {
      toast.error('Vui lòng nhập đầy đủ mã và mật khẩu mới');
      return;
    }
    try {
      await authService.resetPassword(email, code, newPassword);
      toast.success('Đặt lại mật khẩu thành công, vui lòng đăng nhập');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(err.message || 'Không thể đặt lại mật khẩu');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)', padding: '2rem' }}>
      <form onSubmit={step === 1 ? handleSendCode : handleResetPassword} style={{ background: '#fff', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2 style={{ textAlign: 'center', color: '#35a79c' }}>{step === 1 ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}</h2>

        {/* Step 1: nhập email */}
        {step === 1 && (
          <>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Nhập email" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
            <button type="submit" style={{ padding: '0.9rem', background: '#35a79c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Gửi mã xác nhận</button>
            <button type="button" onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#35a79c', cursor: 'pointer' }}>Quay lại đăng nhập</button>
          </>
        )}

        {/* Step 2: nhập mã + mật khẩu mới */}
        {step === 2 && (
          <>
            <div style={{ fontSize: '0.9rem', color: '#555' }}>Mã xác nhận đã gửi tới <b>{email}</b></div>
            <label>Mã xác nhận</label>
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Nhập mã 6 số" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
            <label>Mật khẩu mới</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Nhập mật khẩu mới" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc' }} required />
            <button type="submit" style={{ padding: '0.9rem', background: '#35a79c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Đặt lại mật khẩu</button>
            <button type="button" onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#35a79c', cursor: 'pointer' }}>Gửi lại email khác</button>
          </>
        )}
      </form>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword; 