import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const roles = [
  'Guest',
  'Member',
  'Coach',
  'Admin',
];

function Login() {
  const [selectedRole, setSelectedRole] = useState('Member');
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowDropdown(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (selectedRole === 'Member') {
      if (selectedRole === 'member') {
        localStorage.setItem('user', JSON.stringify({ username: selectedRole, role: 'member' }));
        navigate('/homepage-member');
      } else {
        setError('Invalid username or password');
      }
    } else if (selectedRole === 'Coach') {
      if (selectedRole === 'coach') {
        localStorage.setItem('user', JSON.stringify({ username: selectedRole, role: 'coach' }));
        navigate('/dashboard-coach');
      } else {
        setError('Invalid username or password');
      }
    } else if (selectedRole === 'Admin') {
      localStorage.setItem('user', JSON.stringify({ username: selectedRole, role: 'admin' }));
      navigate('/dashboard-member');
    } else {
      setError('Invalid role');
    }
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
        fontSize: '2.6rem',
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
      <form onSubmit={handleLogin} style={{
        background: '#fff',
        padding: '2.5rem 2rem',
        borderRadius: '18px',
        boxShadow: '0 4px 24px #002f6c11',
        minWidth: '340px',
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.2rem',
        alignItems: 'stretch',
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: '#002f6c', marginBottom: '0.5rem', lineHeight: 1.1, fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif" }}>
          Welcome back!
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: '#888', fontWeight: 500, fontSize: '1.08rem', marginRight: 8 }}>I'm a</span>
          <div style={{ display: 'inline-block', position: 'relative', minWidth: 180 }}>
            <button
              type="button"
              onClick={() => setShowDropdown((v) => !v)}
              style={{
                background: '#f4f6f8',
                border: '2px solid #002f6c',
                color: '#002f6c',
                fontWeight: 700,
                fontSize: '1.08rem',
                borderRadius: '8px',
                padding: '0.7rem 1.2rem',
                minWidth: 180,
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: showDropdown ? '0 2px 8px #002f6c22' : 'none',
                transition: 'box-shadow 0.2s',
                fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
              }}
            >
              <span>{selectedRole}</span>
              <span style={{ marginLeft: 12, fontSize: 18, color: '#002f6c' }}>▼</span>
            </button>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '110%',
                left: 0,
                background: '#fff',
                border: '1.5px solid #e5e8ee',
                borderRadius: '10px',
                boxShadow: '0 4px 16px #002f6c22',
                minWidth: 180,
                zIndex: 10,
                marginTop: 4,
                fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
              }}>
                {roles.map((role) => (
                  <div
                    key={role}
                    onClick={() => handleRoleSelect(role)}
                    style={{
                      padding: '0.9rem 1.2rem',
                      cursor: 'pointer',
                      background: selectedRole === role ? '#e5e8ee' : '#fff',
                      color: selectedRole === role ? '#002f6c' : '#222',
                      fontWeight: selectedRole === role ? 700 : 500,
                      borderRadius: '8px',
                      margin: '2px 4px',
                      transition: 'background 0.2s',
                      fontFamily: "'Brasika', 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif",
                    }}
                  >
                    {role}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <input type="text" placeholder="Username" style={{
          padding: '0.9rem 1.2rem',
          borderRadius: '8px',
          border: '1.5px solid #e5e8ee',
          fontSize: '1.08rem',
          outline: 'none',
        }} />
        <input type="password" placeholder="Password" style={{
          padding: '0.9rem 1.2rem',
          borderRadius: '8px',
          border: '1.5px solid #e5e8ee',
          fontSize: '1.08rem',
          outline: 'none',
        }} />
        <button type="submit" style={{
          background: '#002f6c',
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
        }}>Login</button>
        <div style={{ textAlign: 'center', color: '#002f6c', fontWeight: 500, marginTop: '0.5rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#0057b8', fontWeight: 700, textDecoration: 'underline' }}>Register</Link>
        </div>
        {error && (
          <div style={{ textAlign: 'center', color: 'red', fontWeight: 500, marginTop: '0.5rem' }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
