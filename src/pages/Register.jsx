import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    dob: '',
    gender: '',
    job: '',
    email: '',
    password: '',
  });
  const [showPasswordError, setShowPasswordError] = useState(false);

  // Capitalize each word in name
  const capitalizeName = (value) =>
    value.replace(/\b\w/g, (char) => char.toUpperCase());

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setForm((prev) => ({ ...prev, [name]: capitalizeName(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validatePassword = (pw) => {
    // At least 1 uppercase, 1 special char, 1 number, min 8 chars
    return /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw) && pw.length >= 8;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validatePassword(form.password)) {
      setShowPasswordError(true);
      return;
    }
    setShowPasswordError(false);
    // Xử lý đăng ký ở đây
    // ...
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#f4f6f8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
    }}>
      <button onClick={() => navigate('/')} style={{
        fontSize: '2.4rem',
        fontWeight: 900,
        color: '#002f6c',
        letterSpacing: '1px',
        marginBottom: '2.5rem',
        fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
        textShadow: '0 2px 8px #e5e8ee',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
      }}>
        Breathing Free
      </button>
      <form onSubmit={handleSubmit} style={{
        background: '#fff',
        padding: '2.5rem 2rem',
        borderRadius: '18px',
        boxShadow: '0 4px 24px #002f6c11',
        minWidth: '340px',
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'stretch',
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#002f6c', marginBottom: '0.5rem', lineHeight: 1.1, fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif" }}>
          Tạo tài khoản của bạn
        </div>
        <input
          type="text"
          name="name"
          placeholder="Họ và tên"
          value={form.name}
          onChange={handleChange}
          style={{
            padding: '0.9rem 1.2rem',
            borderRadius: '8px',
            border: '1.5px solid #e5e8ee',
            fontSize: '1.08rem',
            outline: 'none',
            textTransform: 'capitalize',
          }}
        />
        <input
          type="date"
          name="dob"
          placeholder="Ngày sinh"
          value={form.dob}
          onChange={handleChange}
          style={{
            padding: '0.9rem 1.2rem',
            borderRadius: '8px',
            border: '1.5px solid #e5e8ee',
            fontSize: '1.08rem',
            outline: 'none',
            color: form.dob ? '#222' : '#888',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', margin: '0.5rem 0 0.5rem 0' }}>
          <span style={{ color: '#002f6c', fontWeight: 600 }}>Giới tính:</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, color: '#002f6c' }}>
            <input type="radio" name="gender" value="Male" checked={form.gender === 'Male'} onChange={handleChange} /> Nam
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, color: '#002f6c' }}>
            <input type="radio" name="gender" value="Female" checked={form.gender === 'Female'} onChange={handleChange} /> Nữ
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, color: '#002f6c' }}>
            <input type="radio" name="gender" value="Other" checked={form.gender === 'Other'} onChange={handleChange} /> Khác
          </label>
        </div>
        <input
          type="text"
          name="job"
          placeholder="Nghề nghiệp"
          value={form.job}
          onChange={handleChange}
          style={{
            padding: '0.9rem 1.2rem',
            borderRadius: '8px',
            border: '1.5px solid #e5e8ee',
            fontSize: '1.08rem',
            outline: 'none',
          }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{
            padding: '0.9rem 1.2rem',
            borderRadius: '8px',
            border: '1.5px solid #e5e8ee',
            fontSize: '1.08rem',
            outline: 'none',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu (tối thiểu 8 ký tự, 1 chữ hoa, 1 số, 1 ký tự đặc biệt)"
            value={form.password}
            onChange={handleChange}
            style={{
              padding: '0.9rem 1.2rem',
              borderRadius: '8px',
              border: showPasswordError ? '1.5px solid #e53935' : '1.5px solid #e5e8ee',
              fontSize: '1.08rem',
              outline: 'none',
            }}
          />
          <div style={{
            color: showPasswordError ? '#e53935' : '#888',
            fontWeight: 500,
            fontSize: '0.98rem',
            marginTop: '0.2rem',
            marginBottom: showPasswordError ? '-0.5rem' : '0',
            minHeight: '1.2em',
          }}>
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa, 1 số và 1 ký tự đặc biệt.
          </div>
        </div>
        <button type="submit" style={{
          background: '#0057b8',
          color: '#fff',
          fontWeight: 700,
          fontSize: '1.1rem',
          border: 'none',
          borderRadius: '8px',
          padding: '0.9rem 1.2rem',
          marginTop: '0.5rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px #002f6c22',
          transition: 'background 0.2s',
        }}>Đăng Ký</button>
        <div style={{ textAlign: 'center', color: '#002f6c', fontWeight: 500, marginTop: '0.5rem' }}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={{ color: '#1976d2', fontWeight: 700, textDecoration: 'underline' }}>Đăng Nhập</Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
