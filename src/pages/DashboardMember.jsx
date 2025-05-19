import React from 'react';
import { Link } from 'react-router-dom';

const DashboardMember = () => (
  <div style={{
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)',
    fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
    padding: '2rem',
    boxSizing: 'border-box',
    overflowX: 'hidden'
  }}>
    <div style={{
      maxWidth: '100%',
      margin: '0 auto',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: '700',
          color: '#2c3e50',
          margin: 0
        }}>Member Dashboard</h1>
        <Link to="/" style={{
          padding: '0.5rem 1.5rem',
          backgroundColor: '#35a79c',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '50px',
          fontWeight: '500',
          boxShadow: '0 4px 6px rgba(53, 167, 156, 0.2)'
        }}>Back to Home</Link>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        width: '100%'
      }}>
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Current Plan</h2>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Details of your smoking cessation plan...</p>
        </div>
        
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Progress</h2>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>Smoke-free days: 10, Money saved: $500...</p>
        </div>
        
        <div style={{
          padding: '2rem',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Achievements</h2>
          <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>🏅 1-day smoke free</p>
        </div>
      </div>
    </div>
  </div>
);

// ✅ QUAN TRỌNG:
export default DashboardMember;
