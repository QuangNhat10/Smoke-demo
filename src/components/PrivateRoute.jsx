import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// PrivateRoute component that checks if user is authenticated and has the required role
const PrivateRoute = ({ allowedRoles }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [hasRequiredRole, setHasRequiredRole] = useState(false);

    useEffect(() => {
        // Check authentication status
        const userLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
        const userRole = localStorage.getItem('userRole');

        setIsAuthenticated(userLoggedIn);

        // Check if user has the required role
        if (Array.isArray(allowedRoles)) {
            setHasRequiredRole(allowedRoles.includes(userRole));
        } else if (typeof allowedRoles === 'string') {
            setHasRequiredRole(allowedRoles === userRole);
        }

        setIsLoading(false);
    }, [allowedRoles]);

    if (isLoading) {
        // Loading state while checking authentication
        return <div>Đang tải...</div>;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated but doesn't have the required role, redirect to unauthorized
    if (!hasRequiredRole) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If authenticated and has the required role, render the child routes
    return <Outlet />;
};

export default PrivateRoute; 