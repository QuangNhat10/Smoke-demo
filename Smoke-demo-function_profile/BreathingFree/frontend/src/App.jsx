import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardMember from './pages/DashboardMember';
import DashboardDoctor from './pages/DashboardDoctor';
import DashboardStaff from './pages/DashboardStaff';
import DoctorPage from './pages/DoctorPage';
import HomepageMember from './pages/HomepageMember';
import HomepageDoctor from './pages/HomepageDoctor';
import TrackStatus from './pages/TrackStatus';
import ExpertAdvicePage from './pages/ExpertAdvicePage';
import BlogPage from './pages/BlogPage';
import SmokingCessationPage from './pages/SmokingCessationPage';
import SupportChat from './pages/SupportChat';
import MembershipPage from './pages/MembershipPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AppointmentPage from './pages/AppointmentPage';
import Rankings from './pages/Rankings';
import PatientMonitoringPage from './pages/PatientMonitoringPage';
import PatientPlansPage from './pages/PatientPlansPage';
import WorkSchedulePage from './pages/WorkSchedulePage';
import PatientChatPage from './pages/PatientChatPage';
import Unauthorized from './pages/Unauthorized';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import CreatePlanPage from './pages/CreatePlanPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

/**
 * Component chính của ứng dụng
 * Định nghĩa tất cả các route và điều hướng cho ứng dụng
 * Phân chia các route theo quyền truy cập: public, member, doctor, staff, admin
 * @returns {JSX.Element} Component ứng dụng với định tuyến
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('userRole');
      const isAuthenticatedLocal = localStorage.getItem('isAuthenticated') === 'true';

      setIsAuthenticated(!!token && isAuthenticatedLocal);
      setUserRole(role);
      setIsLoading(false);
    };

    checkAuthStatus();
    
    // Chỉ lắng nghe sự kiện storage khi cần thiết
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'userRole' || e.key === 'isAuthenticated') {
        checkAuthStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Redirect to appropriate homepage based on role
  const getHomePage = () => {
    if (!isAuthenticated) return '/';
    
    switch (userRole) {
      case 'Member':
        return '/homepage-member';
      case 'Doctor':
        return '/homepage-doctor';
      case 'Staff':
        return '/dashboard-staff';
      case 'Admin':
        return '/admin';
      default:
        return '/';
    }
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  // Public Route wrapper - redirects to user's homepage if already authenticated
  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    // Đặc biệt cho trang login và register, chỉ chuyển hướng khi đã xác thực
    const currentPath = window.location.pathname;
    if (isAuthenticated && (currentPath === '/login' || currentPath === '/register')) {
      return <Navigate to={getHomePage()} replace />;
    } else if (isAuthenticated && currentPath === '/') {
      return <Navigate to={getHomePage()} replace />;
    }

    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<BlogPage />} />
        
        {/* Member routes */}
        <Route path="/homepage-member" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <HomepageMember />
          </ProtectedRoute>
        } />
        <Route path="/dashboard-member" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <DashboardMember />
          </ProtectedRoute>
        } />
        <Route path="/create-plan" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <CreatePlanPage />
          </ProtectedRoute>
        } />
        <Route path="/track-status" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <TrackStatus />
          </ProtectedRoute>
        } />
        <Route path="/expert-advice" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <ExpertAdvicePage />
          </ProtectedRoute>
        } />
        <Route path="/smoking-cessation" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <SmokingCessationPage />
          </ProtectedRoute>
        } />
        <Route path="/support-chat" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <SupportChat />
          </ProtectedRoute>
        } />
        <Route path="/membership" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <MembershipPage />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <PaymentPage />
          </ProtectedRoute>
        } />
        <Route path="/payment-success" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <PaymentSuccessPage />
          </ProtectedRoute>
        } />
        <Route path="/appointment" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <AppointmentPage />
          </ProtectedRoute>
        } />
        <Route path="/rankings" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <Rankings />
          </ProtectedRoute>
        } />
        <Route path="/doctors" element={
          <ProtectedRoute allowedRoles={['Member']}>
            <DoctorPage />
          </ProtectedRoute>
        } />

        {/* Doctor routes */}
        <Route path="/homepage-doctor" element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <HomepageDoctor />
          </ProtectedRoute>
        } />
        <Route path="/dashboard-doctor" element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <DashboardDoctor />
          </ProtectedRoute>
        } />
        <Route path="/patient-monitoring" element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <PatientMonitoringPage />
          </ProtectedRoute>
        } />
        <Route path="/patient-plans" element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <PatientPlansPage />
          </ProtectedRoute>
        } />
        <Route path="/work-schedule" element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <WorkSchedulePage />
          </ProtectedRoute>
        } />
        <Route path="/patient-chat" element={
          <ProtectedRoute allowedRoles={['Doctor']}>
            <PatientChatPage />
          </ProtectedRoute>
        } />

        {/* Staff routes */}
        <Route path="/dashboard-staff" element={
          <ProtectedRoute allowedRoles={['Staff']}>
            <DashboardStaff />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <AdminPage />
          </ProtectedRoute>
        } />

        {/* Protected routes for all authenticated users */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['Member', 'Doctor', 'Staff', 'Admin']}>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/change-password" element={
          <ProtectedRoute allowedRoles={['Member', 'Doctor', 'Staff', 'Admin']}>
            <ChangePasswordPage />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to appropriate homepage or login */}
        <Route path="*" element={<Navigate to={getHomePage()} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
