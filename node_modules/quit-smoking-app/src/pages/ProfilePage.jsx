import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import SecondaryNavigation from "../components/SecondaryNavigation";
import SecondaryNavigationDoctor from "../components/SecondaryNavigationDoctor";
import authApi from "../api/authApi";

// Dữ liệu giả cho trường hợp API không hoạt động
const fakeMemberData = {
  member123: {
    name: "John Smith",
    role: "Member",
    email: "john.smith@example.com",
    phone: "0912345678",
    address: "Hà Nội, Việt Nam",
    dateOfBirth: "1990-05-15",
    gender: "Nam",
    smokingHistory: "10 năm",
    cigarettesPerDay: 20,
    memberSince: "2023-01-15",
    membershipPlan: "Premium",
    membershipExpires: "2024-01-15",
    profilePicture: "https://randomuser.me/api/portraits/men/32.jpg",
  },
};

const fakeDoctorData = {
  doctor123: {
    name: "Emma Wilson",
    role: "Doctor",
    email: "emma.wilson@example.com",
    phone: "0987654321",
    address: "Hồ Chí Minh, Việt Nam",
    specialization: "Chuyên gia cai nghiện thuốc lá",
    experience: "8 năm",
    education: "Tiến sĩ Y khoa - Đại học Y Hà Nội",
    certifications: [
      "Chứng chỉ tư vấn cai nghiện",
      "Chứng nhận chuyên gia tâm lý học",
    ],
    languages: ["Tiếng Việt", "Tiếng Anh"],
    profilePicture: "https://randomuser.me/api/portraits/women/44.jpg",
    workingHours: "Thứ 2 - Thứ 6: 8:00 - 17:00",
  },
};

function ProfilePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showImageOptions, setShowImageOptions] = useState(false);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Kiểm tra đăng nhập - Đơn giản hóa kiểm tra để đảm bảo người dùng có thể xem trang này
    const storedUserName = localStorage.getItem("userName");
    const storedUserRole = localStorage.getItem("userRole");
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserName) {
      // Nếu không có tên người dùng trong localStorage, vẫn cho phép xem nhưng hiển thị dữ liệu giả
      console.log("Không tìm thấy thông tin người dùng - sử dụng dữ liệu giả");
    }

    setUserName(storedUserName || "User");
    setUserRole(storedUserRole || "Member");
    setUserId(storedUserId || "member123");

    // Không chuyển hướng đến /login nếu không tìm thấy token

    // Gọi API để lấy thông tin profile nếu có token
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile();
    } else {
      // Sử dụng dữ liệu giả nếu không có token
      setUserData(fakeMemberData.member123);
      setFormData({
        fullName: fakeMemberData.member123.name,
        email: fakeMemberData.member123.email,
        phone: fakeMemberData.member123.phone,
        address: fakeMemberData.member123.address,
        gender: fakeMemberData.member123.gender,
        dob: fakeMemberData.member123.dateOfBirth,
        avatar: fakeMemberData.member123.profilePicture,
        // Các trường đặc biệt dành cho bác sĩ (empty for member)
        specialty: "",
        degrees: "",
        workplace: "",
        treatmentMethods: "",
        successRate: "",
        patientCount: "",
        researchPublications: "",
        responseTimes: "",
        biography: "",
        workingHours: "",
        languages: "",
      });
      setIsLoading(false);
    }

    // Nếu có profilePicture trong localStorage, cập nhật preview
    const storedProfilePicture = localStorage.getItem("profilePicture");
    if (storedProfilePicture) {
      setImagePreview(storedProfilePicture);
    }

    // Listen for storage events để cập nhật UI khi localStorage thay đổi
    const handleStorageChange = () => {
      console.log("Storage changed, updating profile page");

      // Refresh lại dữ liệu hiển thị nếu thay đổi đến từ một tab khác
      const newProfilePicture = localStorage.getItem("profilePicture");
      if (newProfilePicture && newProfilePicture !== imagePreview) {
        setImagePreview(newProfilePicture);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Debug useEffect để theo dõi userData changes
  useEffect(() => {
    console.log("userData changed:", userData);
    console.log("isLoading:", isLoading);
    console.log("error:", error);
  }, [userData, isLoading, error]);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError("");

    try {
      const profileData = await authApi.getUserProfile();
      console.log("Profile data received:", profileData);
      console.log("Setting userData with:", profileData);

      setUserData(profileData);
      console.log("userData set successfully");
      setFormData({
        fullName: profileData.fullName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
        gender: profileData.gender || "",
        dob: profileData.dob
          ? new Date(profileData.dob).toISOString().split("T")[0]
          : "",
        avatar: profileData.avatar || "",
        // Các trường đặc biệt dành cho bác sĩ
        specialty: profileData.specialty || "",
        degrees: profileData.degrees || "",
        workplace: profileData.workplace || "",
        treatmentMethods: profileData.treatmentMethods || "",
        successRate: profileData.successRate || "",
        patientCount: profileData.patientCount || "",
        researchPublications: profileData.researchPublications || "",
        responseTimes: profileData.responseTimes || "",
        biography: profileData.biography || "",
        workingHours: profileData.workingHours || "",
        languages: profileData.languages || "",
      });

      if (profileData.avatar) {
        setImagePreview(profileData.avatar);
      }

      // Lưu một số thông tin vào localStorage để các component khác có thể sử dụng
      localStorage.setItem("userName", profileData.fullName || "");
      localStorage.setItem("userEmail", profileData.email || "");
      
      console.log("Profile loaded successfully:", profileData);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(
        "Không thể tải thông tin hồ sơ. Hiện đang hiển thị dữ liệu mẫu."
      );

      // Fallback to using mock data if API fails
      setUserData(fakeMemberData.member123);
      setFormData({
        fullName: fakeMemberData.member123.name,
        email: fakeMemberData.member123.email,
        phone: fakeMemberData.member123.phone,
        address: fakeMemberData.member123.address,
        gender: fakeMemberData.member123.gender,
        dob: fakeMemberData.member123.dateOfBirth,
        avatar: fakeMemberData.member123.profilePicture,
        // Các trường đặc biệt dành cho bác sĩ (empty for member)
        specialty: "",
        degrees: "",
        workplace: "",
        treatmentMethods: "",
        successRate: "",
        patientCount: "",
        researchPublications: "",
        responseTimes: "",
        biography: "",
        workingHours: "",
        languages: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");

    // Chuẩn bị dữ liệu để gửi đến API
    const profileUpdateData = {
      fullName: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      avatar: imagePreview || formData.avatar,
    };

    // Thêm các trường đặc biệt cho bác sĩ nếu user là bác sĩ
    if (userRole === "Doctor") {
      profileUpdateData.specialty = formData.specialty;
      profileUpdateData.degrees = formData.degrees;
      profileUpdateData.workplace = formData.workplace;
      profileUpdateData.treatmentMethods = formData.treatmentMethods;
      profileUpdateData.successRate = formData.successRate;
      profileUpdateData.patientCount = formData.patientCount;
      profileUpdateData.researchPublications = formData.researchPublications;
      profileUpdateData.responseTimes = formData.responseTimes;
      profileUpdateData.biography = formData.biography;
      profileUpdateData.workingHours = formData.workingHours;
      profileUpdateData.languages = formData.languages;
    }

    try {
      // Thử gọi API để cập nhật thông tin
      try {
        await authApi.updateUserProfile(profileUpdateData);
        console.log("Profile updated via API");
      } catch (apiError) {
        console.log("API update failed, using local storage instead", apiError);
        // Nếu API không hoạt động, cập nhật trực tiếp vào localStorage để demo
      }

      // Cập nhật dữ liệu cho ứng dụng ngay cả khi API không hoạt động
      const updatedUserData = {
        ...userData,
        fullName: profileUpdateData.fullName,
        name: profileUpdateData.fullName,
        phone: profileUpdateData.phone,
        address: profileUpdateData.address,
        avatar: profileUpdateData.avatar,
        profilePicture: profileUpdateData.avatar,
      };

      setUserData(updatedUserData);

      // Lưu vào localStorage để các component khác có thể sử dụng
      localStorage.setItem("userName", profileUpdateData.fullName || "");
      localStorage.setItem("userEmail", formData.email || "");
      localStorage.setItem("profilePicture", profileUpdateData.avatar || "");
      localStorage.setItem("avatar", profileUpdateData.avatar || "");

      // Cập nhật Header và components khác
      window.dispatchEvent(new Event("storage"));

      setIsEditing(false);
      setShowImageOptions(false);
      
      // Hiển thị thông báo cập nhật thành công
      toast.success("Cập nhật thông tin cá nhân thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Không thể cập nhật hồ sơ. Vui lòng thử lại sau.");
      toast.error("Không thể cập nhật hồ sơ. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      setShowImageOptions(!showImageOptions);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setShowImageOptions(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const renderDoctorProfile = () => (
    <div className="profile-details">
      {error && <div className="error-message">{error}</div>}

      <div className="profile-section">
        <h3>Thông tin cá nhân</h3>
        {isEditing ? (
          <div className="form-group">
            <div className="form-row">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                readOnly
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-row">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Họ và tên:</span>
              <span className="value">
                {userData?.fullName || userData?.name || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">
                {userData?.email || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Số điện thoại:</span>
              <span className="value">
                {userData?.phone || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Địa chỉ:</span>
              <span className="value">
                {userData?.address || "Chưa cập nhật"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Thông tin chuyên môn</h3>
        {isEditing ? (
          <div className="form-group">
            <div className="form-row">
              <label>Chuyên khoa</label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Tâm lý học, Hô hấp..."
              />
            </div>
            <div className="form-row">
              <label>Bằng cấp</label>
              <textarea
                name="degrees"
                value={formData.degrees || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Tiến sĩ Y khoa - Đại học Y Hà Nội"
                rows="3"
              />
            </div>
            <div className="form-row">
              <label>Nơi làm việc</label>
              <input
                type="text"
                name="workplace"
                value={formData.workplace || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Bệnh viện Bạch Mai"
              />
            </div>
            <div className="form-row">
              <label>Phương pháp điều trị</label>
              <textarea
                name="treatmentMethods"
                value={formData.treatmentMethods || ""}
                onChange={handleChange}
                placeholder="Mô tả các phương pháp điều trị chuyên môn"
                rows="3"
              />
            </div>
            <div className="form-row">
              <label>Tỷ lệ thành công (%)</label>
              <input
                type="number"
                name="successRate"
                value={formData.successRate || ""}
                onChange={handleChange}
                placeholder="Ví dụ: 85"
                min="0"
                max="100"
              />
            </div>
            <div className="form-row">
              <label>Số bệnh nhân đã điều trị</label>
              <input
                type="number"
                name="patientCount"
                value={formData.patientCount || ""}
                onChange={handleChange}
                placeholder="Ví dụ: 150"
                min="0"
              />
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Chuyên khoa:</span>
              <span className="value">
                {userData?.specialty || formData.specialty || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Bằng cấp:</span>
              <span className="value">
                {userData?.degrees || formData.degrees || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Nơi làm việc:</span>
              <span className="value">
                {userData?.workplace || formData.workplace || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Phương pháp điều trị:</span>
              <span className="value">
                {userData?.treatmentMethods || formData.treatmentMethods || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Tỷ lệ thành công:</span>
              <span className="value">
                {userData?.successRate || formData.successRate ? `${userData?.successRate || formData.successRate}%` : "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Số bệnh nhân đã điều trị:</span>
              <span className="value">
                {userData?.patientCount || formData.patientCount || "Chưa cập nhật"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="profile-section">
        <h3>Thông tin bổ sung</h3>
        {isEditing ? (
          <div className="form-group">
            <div className="form-row">
              <label>Nghiên cứu và công bố</label>
              <textarea
                name="researchPublications"
                value={formData.researchPublications || ""}
                onChange={handleChange}
                placeholder="Các nghiên cứu, bài báo khoa học đã công bố"
                rows="3"
              />
            </div>
            <div className="form-row">
              <label>Thời gian phản hồi</label>
              <input
                type="text"
                name="responseTimes"
                value={formData.responseTimes || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Trong vòng 2-4 giờ"
              />
            </div>
            <div className="form-row">
              <label>Tiểu sử</label>
              <textarea
                name="biography"
                value={formData.biography || ""}
                onChange={handleChange}
                placeholder="Giới thiệu về bản thân, kinh nghiệm..."
                rows="4"
              />
            </div>
            <div className="form-row">
              <label>Giờ làm việc</label>
              <input
                type="text"
                name="workingHours"
                value={formData.workingHours || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Thứ 2-6: 8:00-17:00"
              />
            </div>
            <div className="form-row">
              <label>Ngôn ngữ</label>
              <input
                type="text"
                name="languages"
                value={formData.languages || ""}
                onChange={handleChange}
                placeholder="Ví dụ: Tiếng Việt, Tiếng Anh"
              />
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Nghiên cứu và công bố:</span>
              <span className="value">
                {userData?.researchPublications || formData.researchPublications || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Thời gian phản hồi:</span>
              <span className="value">
                {userData?.responseTimes || formData.responseTimes || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Tiểu sử:</span>
              <span className="value">
                {userData?.biography || formData.biography || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Giờ làm việc:</span>
              <span className="value">
                {userData?.workingHours || formData.workingHours || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Ngôn ngữ:</span>
              <span className="value">
                {userData?.languages || formData.languages || "Chưa cập nhật"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons action-buttons-separated single-edit-btn">
        {isEditing ? (
          <div className="action-card">
            <button
              className="btn-track"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        ) : (
          <div className="action-card edit-button-card">
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Chỉnh Sửa
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderMemberProfile = () => (
    <div className="profile-details">
      {error && <div className="error-message">{error}</div>}

      <div className="profile-section">
        <h3>Thông tin cá nhân</h3>
        {isEditing ? (
          <div className="form-group">
            <div className="form-row">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                readOnly
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-row">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dob"
                value={formData.dob || ""}
                readOnly
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-row">
              <label>Giới tính</label>
              <select
                name="gender"
                value={formData.gender || ""}
                disabled
                className="disabled-input"
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <div className="info-row">
              <span className="label">Họ và tên:</span>
              <span className="value">
                {userData?.fullName || userData?.name || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">
                {userData?.email || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Số điện thoại:</span>
              <span className="value">
                {userData?.phone || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Địa chỉ:</span>
              <span className="value">
                {userData?.address || "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Ngày sinh:</span>
              <span className="value">
                {userData?.dob
                  ? new Date(userData.dob).toLocaleDateString("vi-VN")
                  : userData?.dateOfBirth
                  ? userData.dateOfBirth
                  : "Chưa cập nhật"}
              </span>
            </div>
            <div className="info-row">
              <span className="label">Giới tính:</span>
              <span className="value">
                {userData?.gender || "Chưa cập nhật"}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="action-buttons action-buttons-separated single-edit-btn">
        {isEditing ? (
          <div className="action-card">
            <button
              className="btn-track"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        ) : (
          <div className="action-card edit-button-card">
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              Chỉnh Sửa
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <Header userName={userName} />

      {userRole === "Doctor" ? (
        <SecondaryNavigationDoctor />
      ) : (
        <SecondaryNavigation />
      )}

      <div className="content-container">
        <div className="profile-container">
          <h2 className="page-title">Hồ sơ của tôi</h2>

          {isLoading && <div className="loading">Đang tải...</div>}

          <div className="profile-header">
            <div className="avatar-section">
              <div
                className={`avatar ${isEditing ? "editable" : ""}`}
                onClick={handleImageClick}
              >
                <img
                  src={
                    imagePreview ||
                    userData?.avatar ||
                    "https://via.placeholder.com/150"
                  }
                  alt={userData?.fullName || "User"}
                />
                {isEditing && (
                  <div className="edit-overlay">
                    <i className="fas fa-camera"></i>
                  </div>
                )}
              </div>

              {showImageOptions && (
                <div className="image-options">
                  <button onClick={triggerFileInput}>Chọn ảnh</button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
            <div className="header-info">
              <h1>{userData?.fullName || userData?.name || "Không có tên"}</h1>
              <p>{userRole === "Member" ? "Thành viên" : "Bác sĩ"}</p>
            </div>
          </div>

          {userData
            ? (userRole === "Doctor" ? renderDoctorProfile() : renderMemberProfile())
            : !isLoading && (
                <div className="profile-loading">Không có thông tin hồ sơ.</div>
              )}
        </div>
      </div>

      <style jsx>{`
        .profile-container {
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
          background: #f6fcfc;
          border-radius: 32px;
          box-shadow: 0 8px 32px rgba(44, 144, 133, 0.13);
          padding: 2.5rem 2rem 2rem 2rem;
        }
        .profile-header {
          display: flex;
          align-items: center;
          background: none;
          border-radius: 18px;
          padding: 0;
          box-shadow: none;
          margin-bottom: 2rem;
          position: relative;
        }
        .avatar-section {
          margin-right: 2rem;
          position: relative;
        }
        .avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #2c9085;
          background: #fff;
          box-shadow: 0 2px 12px rgba(44, 144, 133, 0.1);
          position: relative;
        }
        .avatar.editable {
          cursor: pointer;
        }
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.3s ease;
        }
        .edit-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(44, 144, 133, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .avatar.editable:hover .edit-overlay {
          opacity: 1;
        }
        .image-options {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(44, 144, 133, 0.15);
          padding: 0.5rem;
          z-index: 10;
          margin-top: 0.5rem;
        }
        .image-options button {
          width: 100%;
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
        }
        .image-options button:hover {
          background-color: #f0f0f0;
        }
        .header-info h1 {
          margin: 0;
          font-size: 1.7rem;
          color: #2c9085;
          font-weight: 700;
        }
        .header-info p {
          margin: 0.5rem 0 0;
          color: #2c9085;
          font-weight: 500;
        }
        .profile-details {
          padding: 0.5rem 0 0 0;
        }
        .profile-section {
          background-color: #fff;
          border-radius: 18px;
          padding: 1.5rem 1.2rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 4px 15px rgba(44, 144, 133, 0.07);
        }
        .profile-section h3 {
          margin-top: 0;
          color: #2c9085;
          font-size: 1.15rem;
          border-bottom: 1px solid #e0f2f1;
          padding-bottom: 0.7rem;
          margin-bottom: 1.2rem;
          font-weight: 700;
        }
        .profile-info .info-row {
          display: flex;
          margin-bottom: 1rem;
        }
        .profile-info .label {
          width: 150px;
          font-weight: 500;
          color: #2c9085;
        }
        .profile-info .value {
          flex: 1;
          color: #333;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-row {
          display: flex;
          flex-direction: column;
        }
        .form-row label {
          margin-bottom: 0.3rem;
          font-weight: 500;
          color: #2c9085;
        }
        .form-row input,
        .form-row select,
        .form-row textarea {
          padding: 0.7rem;
          border: 1px solid #b2dfdb;
          border-radius: 8px;
          font-size: 0.97rem;
          background: #f6fcfc;
          font-family: inherit;
          resize: vertical;
        }
        .form-row input:focus,
        .form-row select:focus,
        .form-row textarea:focus {
          outline: none;
          border-color: #2c9085;
          box-shadow: 0 0 0 2px rgba(44, 144, 133, 0.13);
        }
        .form-row textarea {
          min-height: 80px;
        }
        .disabled-input {
          background-color: #f0f0f0;
          cursor: not-allowed;
        }
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 1.2rem;
          margin-top: 1.2rem;
        }
        .action-buttons.action-buttons-separated {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          gap: 3.5rem;
          margin-top: 2.2rem;
        }
        .action-buttons.action-buttons-separated.single-edit-btn {
          justify-content: flex-end;
          gap: 0;
        }
        .action-card {
          background: #fff;
          border-radius: 22px;
          box-shadow: 0 6px 32px rgba(44, 144, 133, 0.13),
            0 1.5px 6px rgba(44, 144, 133, 0.07);
          padding: 1.3rem 2.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 180px;
          min-height: 68px;
          transition: box-shadow 0.22s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.18s;
          margin: 0 0.5rem;
        }
        .edit-button-card {
          background: #2c9085;
          padding: 0.8rem 1.5rem;
          min-height: 60px;
        }
        .action-card:hover {
          box-shadow: 0 12px 36px rgba(44, 144, 133, 0.18),
            0 2px 8px rgba(44, 144, 133, 0.1);
          transform: translateY(-2px) scale(1.03);
        }
        .action-card button {
          width: 100%;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.13rem;
          font-weight: 700;
          letter-spacing: 0.01em;
        }
        .btn-track,
        .btn-secondary {
          background: #fff;
          color: #2c9085;
          border: 2.5px solid #2c9085;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.13rem;
          padding: 0.95rem 2.5rem;
          box-shadow: 0 2px 8px rgba(44, 144, 133, 0.08);
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          cursor: pointer;
        }
        .btn-edit {
          background: #2c9085;
          color: #fff;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.13rem;
          padding: 0.8rem 2rem;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(44, 144, 133, 0.2);
        }
        .btn-edit:hover {
          background: #35a79c;
          box-shadow: 0 6px 15px rgba(44, 144, 133, 0.3);
          transform: translateY(-1px);
        }
        .btn-track:hover,
        .btn-track:focus,
        .btn-secondary:hover,
        .btn-secondary:focus {
          background: linear-gradient(90deg, #2c9085 80%, #35a79c 100%);
          color: #fff;
          box-shadow: 0 6px 24px rgba(44, 144, 133, 0.18);
          border-color: #2c9085;
        }
        .btn-track:active,
        .btn-secondary:active {
          transform: scale(0.97);
        }
        .btn-track:disabled {
          background: #e0f2f1;
          color: #b2dfdb;
          border-color: #b2dfdb;
          cursor: not-allowed;
        }
        .error-message {
          background-color: #ffebee;
          color: #d32f2f;
          padding: 0.8rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          font-style: italic;
          color: #666;
        }
      `}</style>
      
      {/* Toast Container để hiển thị thông báo */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default ProfilePage;
