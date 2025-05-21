import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/global.css';

const Header = ({ isLoggedIn }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xử lý đăng xuất
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <header className="main-header">
            <div className="container header-container">
                <div className="logo">
                    <Link to="/">
                        <h1>SmokeFree</h1>
                    </Link>
                </div>
                <nav className="main-nav">
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <>
                            <Link to="/homepage-member" className="btn btn-primary">Dashboard</Link>
                            <button onClick={handleLogout} className="btn btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header; 