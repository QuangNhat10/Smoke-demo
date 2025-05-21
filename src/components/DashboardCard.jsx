import React from 'react';
import '../styles/global.css';

const DashboardCard = ({ title, value, description, icon, color }) => {
  return (
    <div className="dashboard-card">
      <div className="card-icon" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-value" style={{ color }}>{value}</div>
        {description && <p className="card-description">{description}</p>}
      </div>
    </div>
  );
};

export default DashboardCard;
