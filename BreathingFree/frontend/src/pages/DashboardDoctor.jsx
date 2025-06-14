import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component bảng điều khiển dành cho bác sĩ
 * Hiển thị tổng quan về danh sách bệnh nhân, lịch tư vấn, và hồ sơ y tế
 * @returns {JSX.Element} Component bảng điều khiển bác sĩ
 */
const DashboardDoctor = () => (
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
            {/* Tiêu đề và nút quay lại */}
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
                }}>Doctor Dashboard</h1>
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

            {/* Lưới các thẻ thông tin */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem',
                width: '100%'
            }}>
                {/* Thẻ danh sách bệnh nhân */}
                <div style={{
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                }}>
                    <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Patient List</h2>
                    <ul style={{ color: '#7f8c8d', lineHeight: '1.6', listStylePosition: 'inside' }}>
                        <li>Nguyen Van A - 15 days smoke-free</li>
                        <li>Tran Thi B - 3 days smoke-free</li>
                    </ul>
                </div>

                {/* Thẻ lịch tư vấn */}
                <div style={{
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                }}>
                    <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Schedule Consultation</h2>
                    <button style={{
                        backgroundColor: '#35a79c',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(53, 167, 156, 0.2)'
                    }}>
                        Schedule New
                    </button>
                </div>

                {/* Thẻ hồ sơ y tế */}
                <div style={{
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)'
                }}>
                    <h2 style={{ fontWeight: '600', marginBottom: '1rem', color: '#35a79c' }}>Medical Records</h2>
                    <p style={{ color: '#7f8c8d', lineHeight: '1.6' }}>
                        Patient progress: 78%<br />
                        Active patients: 25<br />
                        Average smoke-free days: 12
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default DashboardDoctor; 