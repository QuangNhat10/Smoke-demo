import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Component bảng điều khiển dành cho bác sĩ
 * Hiển thị tổng quan về danh sách bệnh nhân, lịch tư vấn, và hồ sơ y tế
 * 
 * Tính năng chính:
 * - Hiển thị danh sách bệnh nhân với tiến trình cai thuốc
 * - Nút lập lịch tư vấn mới
 * - Thống kê hồ sơ y tế và tiến trình chung
 * - Giao diện responsive với thiết kế hiện đại
 * 
 * @returns {JSX.Element} Component bảng điều khiển bác sĩ
 */
const DashboardDoctor = () => (
    <div style={{
        // Container chính - full height và responsive design
        minHeight: '100vh',        // Đảm bảo chiều cao tối thiểu là toàn màn hình
        width: '100%',            // Chiều rộng 100% của container parent
        background: 'linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)', // Gradient xanh nhạt tạo cảm giác thư thái
        fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',    // Font stack modern và dễ đọc
        padding: '2rem',          // Padding đều cho toàn bộ container
        boxSizing: 'border-box',  // Padding được tính trong kích thước tổng
        overflowX: 'hidden'       // Ẩn thanh cuộn ngang nếu content vượt quá
    }}>
        {/* Wrapper container để giới hạn max-width và center content */}
        <div style={{
            maxWidth: '100%',         // Không giới hạn width tối đa để responsive
            margin: '0 auto',         // Center horizontally
            width: '100%',           // Full width của parent
            boxSizing: 'border-box'  // Box model consistency
        }}>
            {/* Header Section - Tiêu đề và navigation */}
            <div style={{
                display: 'flex',           // Flexbox layout để align items
                justifyContent: 'space-between', // Đẩy title và button về 2 đầu
                alignItems: 'center',      // Vertical alignment ở giữa
                marginBottom: '2rem',      // Khoảng cách với content bên dưới
                flexWrap: 'wrap',         // Cho phép wrap trên mobile
                gap: '1rem'               // Khoảng cách giữa các items khi wrap
            }}>
                {/* Tiêu đề chính của dashboard */}
                <h1 style={{
                    fontSize: '2.2rem',    // Kích thước font lớn để prominent
                    fontWeight: '700',     // Font weight đậm
                    color: '#2c3e50',     // Màu xám đậm professional
                    margin: 0             // Remove default margin của h1
                }}>Doctor Dashboard</h1>
                
                {/* Nút quay lại trang chủ */}
                <Link to="/" style={{
                    padding: '0.5rem 1.5rem',           // Padding tạo kích thước button
                    backgroundColor: '#35a79c',          // Màu primary brand
                    color: 'white',                      // Text màu trắng contrast
                    textDecoration: 'none',             // Remove underline default của link
                    borderRadius: '50px',               // Border radius tròn hoàn toàn
                    fontWeight: '500',                  // Font weight vừa phải
                    boxShadow: '0 4px 6px rgba(53, 167, 156, 0.2)' // Shadow nhẹ cho depth
                }}>Back to Home</Link>

                <Link to="/doctor-chat" style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#0057b8',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '50px',
                    fontWeight: '500',
                    boxShadow: '0 4px 6px rgba(0, 87, 184, 0.2)'
                }}>Chat với bệnh nhân</Link>
            </div>

            {/* Main Content Grid - Lưới hiển thị các thẻ thông tin */}
            <div style={{
                display: 'grid',                                        // CSS Grid layout
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // Responsive columns, min 300px
                gap: '2rem',                                           // Khoảng cách đều giữa các grid items
                width: '100%'                                         // Full width của container
            }}>
                {/* Card 1: Danh sách bệnh nhân */}
                <div style={{
                    padding: '2rem',                    // Padding đều bên trong card
                    backgroundColor: 'white',           // Background trắng clean
                    borderRadius: '15px',              // Bo góc mềm mại
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' // Shadow nhẹ tạo floating effect
                }}>
                    {/* Tiêu đề của card */}
                    <h2 style={{ 
                        fontWeight: '600',      // Font weight semibold
                        marginBottom: '1rem',   // Khoảng cách với content
                        color: '#35a79c'       // Màu brand consistency
                    }}>Patient List</h2>
                    
                    {/* Danh sách bệnh nhân mẫu */}
                    <ul style={{ 
                        color: '#7f8c8d',           // Màu xám nhạt cho text phụ
                        lineHeight: '1.6',          // Line height thoải mái cho việc đọc
                        listStylePosition: 'inside' // Bullet points bên trong để alignment đẹp
                    }}>
                        <li>Nguyen Van A - 15 days smoke-free</li> {/* Hiển thị tên và tiến trình */}
                        <li>Tran Thi B - 3 days smoke-free</li>
                    </ul>
                </div>

                {/* Card 2: Lập lịch tư vấn */}
                <div style={{
                    padding: '2rem',                    // Padding consistency với card khác
                    backgroundColor: 'white',           // Background trắng
                    borderRadius: '15px',              // Border radius consistency
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' // Shadow consistency
                }}>
                    {/* Tiêu đề card */}
                    <h2 style={{ 
                        fontWeight: '600', 
                        marginBottom: '1rem', 
                        color: '#35a79c' 
                    }}>Schedule Consultation</h2>
                    
                    {/* Button lập lịch mới */}
                    <button style={{
                        backgroundColor: '#35a79c',     // Màu primary button
                        color: 'white',                // Text trắng contrast
                        padding: '0.75rem 1.5rem',     // Padding tạo kích thước button hợp lý
                        border: 'none',                // Remove default border
                        borderRadius: '8px',           // Bo góc nhẹ
                        fontWeight: '600',             // Font weight đậm cho CTA
                        fontSize: '1rem',              // Font size standard
                        cursor: 'pointer',             // Pointer cursor cho interaction
                        boxShadow: '0 4px 10px rgba(53, 167, 156, 0.2)' // Shadow tạo depth và hover effect
                    }}>
                        Schedule New
                    </button>
                </div>

                {/* Card 3: Thống kê hồ sơ y tế */}
                <div style={{
                    padding: '2rem',                    // Padding consistency
                    backgroundColor: 'white',           // Background consistency
                    borderRadius: '15px',              // Border radius consistency
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)' // Shadow consistency
                }}>
                    {/* Tiêu đề card */}
                    <h2 style={{ 
                        fontWeight: '600', 
                        marginBottom: '1rem', 
                        color: '#35a79c' 
                    }}>Medical Records</h2>
                    
                    {/* Thống kê tổng quan */}
                    <p style={{ 
                        color: '#7f8c8d',     // Màu text phụ
                        lineHeight: '1.6'     // Line height dễ đọc
                    }}>
                        Patient progress: 78%<br />      {/* Tiến trình trung bình của bệnh nhân */}
                        Active patients: 25<br />        {/* Số bệnh nhân đang active */}
                        Average smoke-free days: 12      {/* Số ngày trung bình không hút thuốc */}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default DashboardDoctor; 