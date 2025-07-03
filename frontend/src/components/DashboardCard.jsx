import React from 'react';

// Component DashboardCard dùng để hiển thị một thẻ thông tin trên dashboard
// Các props: title (tiêu đề), value (giá trị), description (mô tả), icon (biểu tượng), color (màu sắc)
const DashboardCard = ({ title, value, description, icon, color }) => {
  return (
    <div className="dashboard-card">
      {/* Biểu tượng của thẻ */}
      <div className="card-icon" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div className="card-content">
        {/* Tiêu đề thẻ */}
        <h3 className="card-title">{title}</h3>
        {/* Giá trị chính của thẻ */}
        <div className="card-value" style={{ color }}>{value}</div>
        {/* Mô tả bổ sung nếu có */}
        {description && <p className="card-description">{description}</p>}
      </div>

      {/* CSS nội bộ cho component */}
      <style jsx>{`
        .dashboard-card {
          background-color: var(--white);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--box-shadow);
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          transition: var(--transition);
        }
        
        .dashboard-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--box-shadow-lg);
        }
        
        .card-icon {
          width: 3.5rem;
          height: 3.5rem;
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }
        
        .card-content {
          flex: 1;
        }
        
        .card-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-600);
          margin-bottom: 0.5rem;
        }
        
        .card-value {
          font-size: 1.8rem;
          font-weight: 800;
          margin-bottom: 0.25rem;
        }
        
        .card-description {
          font-size: 0.9rem;
          color: var(--gray-600);
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default DashboardCard;