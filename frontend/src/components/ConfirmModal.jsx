import React from 'react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Xác nhận", cancelText = "Hủy" }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '15px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <h2 style={{
          color: '#e74c3c',
          marginBottom: '1rem',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          {title}
        </h2>
        
        <div style={{
          color: '#2c3e50',
          marginBottom: '2rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-line'
        }}>
          {message}
        </div>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              border: '2px solid #bdc3c7',
              backgroundColor: 'white',
              color: '#7f8c8d',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#ecf0f1';
              e.target.style.borderColor = '#95a5a6';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#bdc3c7';
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              backgroundColor: '#e74c3c',
              color: 'white',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#c0392b';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#e74c3c';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 