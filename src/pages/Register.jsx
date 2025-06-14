// Import các thư viện và components cần thiết
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import "../styles/Register.css";
import authApi from "../api/authApi";

// Component đăng ký tài khoản
const Register = () => {
  // Khai báo các state cần thiết
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi người dùng bắt đầu gõ
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Hàm validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate email
    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Validate username
    if (!formData.username) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
    } else if (formData.username.length < 3) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới";
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // Validate fullName 
    if (!formData.fullName) {
      newErrors.fullName = "Họ và tên là bắt buộc";
    }

    // Validate phone (optional)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm kiểm tra và khởi tạo Firebase Auth
  const initFirebaseAuth = async () => {
    try {
      if (!auth) {
        throw new Error("Firebase auth chưa được khởi tạo");
      }

      // Đợi auth state thay đổi
      return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(true);
        }, (error) => {
          console.error("Firebase auth error:", error);
          resolve(false);
        });
      });
    } catch (error) {
      console.error("Firebase init error:", error);
      return false;
    }
  };

  // Hàm kiểm tra trạng thái Firebase auth
  const checkFirebaseAuth = () => {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        unsubscribe(); // Ngắt listener sau lần đầu
        console.log("Current Firebase user:", user ? "exists" : "none");
        resolve(!!user); // Trả về true nếu đã đăng nhập
      });
    });
  };

  // Hàm xử lý submit form đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Reset errors

    try {
      setIsSubmitting(true);
      setErrors({});

      // Khởi tạo Firebase Auth
      const isInitialized = await initFirebaseAuth();
      if (!isInitialized) {
        throw new Error("Không thể khởi tạo Firebase Authentication");
      }

      // Đăng xuất user hiện tại nếu có
      if (auth.currentUser) {
        await auth.signOut();
      }

      console.log("Bắt đầu đăng ký Firebase với:", {
        email: formData.email,
        passwordLength: formData.password.length
      });

      // Thử đăng ký với Firebase
      let firebaseResult;
      try {
        firebaseResult = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        console.log("Firebase registration successful:", firebaseResult.user.uid);
      } catch (firebaseError) {
        console.error("Firebase registration error:", {
          code: firebaseError.code,
          message: firebaseError.message,
          email: formData.email
        });
        
        // Xử lý lỗi Firebase cụ thể
        if (firebaseError.code === 'auth/invalid-api-key') {
          throw new Error('Lỗi cấu hình Firebase. Vui lòng thử lại sau.');
        } else {
          throw firebaseError;
        }
      }
      
      // Đăng ký với Backend API
      const response = await authApi.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        firebaseUid: firebaseResult.user.uid
      }).catch(error => {
        console.error("Backend error:", error.response || error);
        throw error;
      });

      if (!response?.data?.data?.token) {
        throw new Error("Token không hợp lệ từ backend");
      }

      // Lưu token vào localStorage
      localStorage.setItem('token', response.data.data.token);
      
      // Chuyển hướng về trang home sau khi đăng ký thành công
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      // Xử lý các loại lỗi chi tiết hơn
      let errorMessage = "Đã có lỗi xảy ra";
      
      if (err.code) {
        // Xử lý lỗi Firebase
        console.error("Firebase error details:", {
          code: err.code,
          message: err.message,
          email: formData.email
        });

        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = "Email này đã được sử dụng";
            break;
          case 'auth/invalid-email':
            errorMessage = "Email không hợp lệ";
            break;
          case 'auth/operation-not-allowed':
            errorMessage = "Đăng ký tài khoản tạm thời không khả dụng";
            break;
          case 'auth/weak-password':
            errorMessage = "Mật khẩu phải có ít nhất 6 ký tự và bao gồm cả chữ và số";
            break;
          case 'auth/network-request-failed':
            errorMessage = "Lỗi kết nối mạng, vui lòng kiểm tra lại kết nối internet";
            break;
          case 'auth/internal-error':
            errorMessage = "Lỗi hệ thống, vui lòng thử lại sau";
            break;
          case 'auth/invalid-password':
            errorMessage = "Mật khẩu không hợp lệ";
            break;
          case 'auth/user-disabled':
            errorMessage = "Tài khoản đã bị vô hiệu hóa";
            break;
          default:
            errorMessage = `Lỗi xác thực: ${err.message}`;
            break;
        }
      } else if (err.response) {
        // Xử lý lỗi từ Backend API
        const backendError = err.response.data;
        if (backendError.message.includes("Email")) {
          errorMessage = "Email này đã được sử dụng";
        } else if (backendError.message.includes("username")) {
          errorMessage = "Tên đăng nhập này đã được sử dụng";
        } else {
          errorMessage = backendError.message || "Lỗi kết nối với server";
        }
      } else if (err.request) {
        // Lỗi không nhận được response
        errorMessage = "Không thể kết nối đến server, vui lòng thử lại sau";
      } else if (err.message) {
        // Lỗi khác
        errorMessage = err.message;
      }
      
      setErrors(prev => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  // Render giao diện đăng ký
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Smoke Chat</span>
        <span className="title">Đăng Ký</span>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? "error" : ""}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? "error" : ""}
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại (không bắt buộc)"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
          
          <button 
            disabled={isLoading || isSubmitting}
            className={isLoading || isSubmitting ? "loading" : ""}
          >
            {isLoading ? "Đang xử lý..." : 
             isSubmitting ? "Đang đăng ký..." : 
             "Đăng ký"}
          </button>
        </form>
        
        <p className="login-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>


    </div>
  );
};

export default Register;