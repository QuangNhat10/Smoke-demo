import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardMember from './pages/DashboardMember';
import DashboardDoctor from './pages/DashboardDoctor';
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
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Member routes */}
        <Route path="/homepage-member" element={<HomepageMember />} />
        <Route path="/dashboard-member" element={<DashboardMember />} />
        <Route path="/track-status" element={<TrackStatus />} />
        <Route path="/expert-advice" element={<ExpertAdvicePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/smoking-cessation" element={<SmokingCessationPage />} />
        <Route path="/support-chat" element={<SupportChat />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/doctors" element={<DoctorPage />} />

        {/* Doctor routes */}
        <Route element={<PrivateRoute allowedRoles="Doctor" />}>
          <Route path="/homepage-doctor" element={<HomepageDoctor />} />
          <Route path="/dashboard-doctor" element={<DashboardDoctor />} />
          <Route path="/patient-monitoring" element={<PatientMonitoringPage />} />
          <Route path="/patient-plans" element={<PatientPlansPage />} />
          <Route path="/work-schedule" element={<WorkSchedulePage />} />
          <Route path="/patient-chat" element={<PatientChatPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
