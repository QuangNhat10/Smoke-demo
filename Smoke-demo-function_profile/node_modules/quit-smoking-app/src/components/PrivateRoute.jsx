import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import authApi from '../api/authApi';

// Component PrivateRoute dùng để bảo vệ route, chỉ cho phép người dùng đã đăng nhập và có vai trò phù hợp truy cập
const PrivateRoute = ({ allowedRoles, children }) => {
    const location = useLocation();
    // Trạng thái kiểm tra đang loading hay không
    const [isLoading, setIsLoading] = useState(true);
    // Trạng thái xác định người dùng đã đăng nhập chưa
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Trạng thái xác định người dùng có vai trò phù hợp không
    const [hasRequiredRole, setHasRequiredRole] = useState(false);

    // Trang profile luôn được truy cập (chỉ bảo vệ trang khác)
    const isProfilePage = location.pathname === '/profile';

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
                const isAuthenticatedLocal = localStorage.getItem('isAuthenticated') === 'true';

                console.log('Checking auth:', { token, userRole, isAuthenticatedLocal });

                if (!token || !isAuthenticatedLocal) {
                    console.log('No token or not authenticated');
                    setIsAuthenticated(false);
                    setIsLoading(false);
                    return;
                }

                setIsAuthenticated(true);

                // Check role
        if (Array.isArray(allowedRoles)) {
            setHasRequiredRole(allowedRoles.includes(userRole));
        } else if (typeof allowedRoles === 'string') {
            setHasRequiredRole(allowedRoles === userRole);
        }

                console.log('Auth check complete:', { 
                    isAuthenticated: true, 
                    hasRequiredRole: allowedRoles.includes(userRole),
                    userRole,
                    allowedRoles 
                });

            } catch (error) {
                console.error('Auth verification failed:', error);
                localStorage.clear(); // Clear all auth data on error
                setIsAuthenticated(false);
                setHasRequiredRole(false);
            } finally {
        setIsLoading(false);
            }
        };

        checkAuth();
    }, [allowedRoles]);

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    // Nếu đang ở trang profile, không cần kiểm tra đăng nhập
    if (isProfilePage) {
        return <Outlet />;
    }

    // Nếu chưa đăng nhập, chuyển hướng sang trang đăng nhập
    if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Nếu đã đăng nhập nhưng không có vai trò phù hợp, chuyển hướng sang trang không có quyền truy cập
    if (!hasRequiredRole) {
        console.log('Does not have required role, redirecting to unauthorized');
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default PrivateRoute; 