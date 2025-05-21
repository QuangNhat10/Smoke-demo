import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/global.css';

const SecondaryNavigation = () => {
    const location = useLocation();
    const path = location.pathname;

    return (
        <nav className="secondary-navigation">
            <div className="container">
                <ul>
                    <li className={path === '/homepage-member' ? 'active' : ''}>
                        <Link to="/homepage-member">Dashboard</Link>
                    </li>
                    <li className={path === '/track-status' ? 'active' : ''}>
                        <Link to="/track-status">Track Status</Link>
                    </li>
                    <li className={path === '/doctor' ? 'active' : ''}>
                        <Link to="/doctor">Consult Doctor</Link>
                    </li>
                    <li className={path === '/community' ? 'active' : ''}>
                        <Link to="/community">Community</Link>
                    </li>
                    <li className={path === '/profile' ? 'active' : ''}>
                        <Link to="/profile">Profile</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default SecondaryNavigation; 