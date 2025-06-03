import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardMember from './pages/DashboardMember';
import DashboardCoach from './pages/DashboardCoach';
import DashboardDoctor from './pages/DashboardDoctor';
import DoctorPage from './pages/DoctorPage';
import HomepageMember from './pages/HomepageMember';
import TrackStatus from './pages/TrackStatus';
import ExpertAdvicePage from './pages/ExpertAdvicePage';
import BlogPage from './pages/BlogPage';
import SmokingCessationPage from './pages/SmokingCessationPage';
import SupportChat from './pages/SupportChat';
import MembershipPage from './pages/MembershipPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AppointmentPage from './pages/AppointmentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-member" element={<DashboardMember />} />
        <Route path="/dashboard-coach" element={<DashboardCoach />} />
        <Route path="/dashboard-doctor" element={<DashboardDoctor />} />
        <Route path="/doctors" element={<DoctorPage />} />
        <Route path="/homepage-member" element={<HomepageMember />} />
        <Route path="/track-status" element={<TrackStatus />} />
        <Route path="/expert-advice" element={<ExpertAdvicePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/smoking-cessation" element={<SmokingCessationPage />} />
        <Route path="/support-chat" element={<SupportChat />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
