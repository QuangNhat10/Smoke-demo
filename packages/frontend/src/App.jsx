import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import PrivateRoute from './components/PrivateRoute';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AboutUs from './pages/AboutUs';
import FAQ from './pages/FAQ';
import CreatePlanPage from './pages/CreatePlanPage';

/**
 * Component chính của ứng dụng
 * Định nghĩa tất cả các route và điều hướng cho ứng dụng
 * Phân chia các route theo quyền truy cập: public, member, doctor, staff, admin
 * @returns {JSX.Element} Component ứng dụng với định tuyến
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Các route công khai - ai cũng có thể truy cập */}
        <Route path="/" element={<Home />} /> {/* Trang chủ chính của ứng dụng */}
        <Route path="/login" element={<Login />} /> {/* Trang đăng nhập */}
        <Route path="/register" element={<Register />} /> {/* Trang đăng ký */}
        <Route path="/unauthorized" element={<Unauthorized />} /> {/* Trang hiển thị khi không có quyền truy cập */}
        <Route path="/about" element={<AboutUs />} /> {/* Trang giới thiệu về công ty và đội ngũ bác sĩ */}
        <Route path="/faq" element={<FAQ />} /> {/* Trang câu hỏi thường gặp */}

        {/* Các route dành cho thành viên đã đăng nhập */}
        <Route path="/homepage-member" element={<HomepageMember />} /> {/* Trang chủ dành cho thành viên */}
        <Route path="/dashboard-member" element={<DashboardMember />} /> {/* Bảng điều khiển thành viên */}
        <Route path="/create-plan" element={<CreatePlanPage />} /> {/* Trang tạo kế hoạch cai thuốc */}
        <Route path="/track-status" element={<TrackStatus />} /> {/* Trang theo dõi tiến trình cai thuốc */}
        <Route path="/expert-advice" element={<ExpertAdvicePage />} /> {/* Trang tư vấn từ chuyên gia */}
        <Route path="/blog" element={<BlogPage />} /> {/* Trang bài viết blog */}
        <Route path="/smoking-cessation" element={<SmokingCessationPage />} /> {/* Trang cai thuốc lá */}
        <Route path="/support-chat" element={<SupportChat />} /> {/* Trò chuyện hỗ trợ */}
        <Route path="/membership" element={<MembershipPage />} /> {/* Trang mua gói thành viên để có quyền đánh giá bác sĩ */}
        <Route path="/payment" element={<PaymentPage />} /> {/* Trang thanh toán */}
        <Route path="/payment-success" element={<PaymentSuccessPage />} /> {/* Trang xác nhận thanh toán thành công */}
        <Route path="/appointment" element={<AppointmentPage />} /> {/* Trang đặt lịch hẹn */}
        <Route path="/rankings" element={<Rankings />} /> {/* Trang xếp hạng */}
        <Route path="/doctors" element={<DoctorPage />} /> {/* Trang hiển thị bác sĩ và cho phép thành viên đánh giá */}
        <Route path="/profile" element={<ProfilePage />} /> {/* Trang hồ sơ người dùng */}

        {/* Các route dành cho bác sĩ - chỉ bác sĩ mới có thể truy cập */}
        <Route element={<PrivateRoute allowedRoles="Doctor" />}>
          <Route path="/homepage-doctor" element={<HomepageDoctor />} /> {/* Trang chủ dành cho bác sĩ */}
          <Route path="/dashboard-doctor" element={<DashboardDoctor />} /> {/* Bảng điều khiển bác sĩ */}
          <Route path="/patient-monitoring" element={<PatientMonitoringPage />} /> {/* Trang theo dõi bệnh nhân */}
          <Route path="/patient-plans" element={<PatientPlansPage />} /> {/* Trang kế hoạch điều trị cho bệnh nhân */}
          <Route path="/work-schedule" element={<WorkSchedulePage />} /> {/* Trang lịch làm việc */}
          <Route path="/patient-chat" element={<PatientChatPage />} /> {/* Trang chat với bệnh nhân */}
        </Route>

        {/* Các route dành cho nhân viên - chỉ nhân viên mới có thể truy cập */}
        <Route element={<PrivateRoute allowedRoles="Staff" />}>
          <Route path="/dashboard-staff" element={<DashboardStaff />} /> {/* Bảng điều khiển nhân viên */}
        </Route>

        {/* Route dành cho admin - chỉ admin mới có thể truy cập */}
        <Route path="/admin" element={
          localStorage.getItem('userRole') === 'Admin' ?
            <AdminPage /> : <Navigate to="/unauthorized" replace />
        } /> {/* Trang quản trị */}

        {/* Cách khác để định nghĩa route admin sử dụng PrivateRoute
        <Route element={<PrivateRoute allowedRoles="Admin" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route> */}
      </Routes>
    </Router>
  );
}

export default App;
