import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Component PrivateRoute dùng để bảo vệ route, chỉ cho phép người dùng đã đăng nhập và có vai trò phù hợp truy cập
const PrivateRoute = ({ allowedRoles }) => {
    // Trạng thái kiểm tra đang loading hay không
    const [isLoading, setIsLoading] = useState(true);
    // Trạng thái xác định người dùng đã đăng nhập chưa
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // Trạng thái xác định người dùng có vai trò phù hợp không
    const [hasRequiredRole, setHasRequiredRole] = useState(false);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập từ localStorage
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');

        setIsAuthenticated(userLoggedIn);

        // Kiểm tra vai trò của người dùng có nằm trong allowedRoles không
        if (Array.isArray(allowedRoles)) {
            setHasRequiredRole(allowedRoles.includes(userRole));
        } else if (typeof allowedRoles === 'string') {
            setHasRequiredRole(allowedRoles === userRole);
        }

        setIsLoading(false);
    }, [allowedRoles]);

    if (isLoading) {
        // Hiển thị trạng thái loading khi đang kiểm tra quyền truy cập
        return <div>Đang tải...</div>;
    }

    // Nếu chưa đăng nhập, chuyển hướng sang trang đăng nhập
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập nhưng không có vai trò phù hợp, chuyển hướng sang trang không có quyền truy cập
    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Nếu đủ điều kiện, render các route con bên trong
    return <Outlet />;
};

export default PrivateRoute; 