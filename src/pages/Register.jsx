// Import các thư viện và components cần thiết
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

// Component đăng ký tài khoản
const Register = () => {
  // Khai báo các state cần thiết
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý submit form đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Tạo tài khoản mới với firebase authentication
      await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      // Chuyển hướng về trang home sau khi đăng ký thành công
      navigate("/");
    } catch (err) {
      // Xử lý các loại lỗi từ Firebase
      let errorMessage = "Đã có lỗi xảy ra";
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
          errorMessage = "Mật khẩu không đủ mạnh";
          break;
      }
      setErrors(prev => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsLoading(false);
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

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
          
          <button disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>
        
        <p className="login-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>

      <style jsx>{`
        .formContainer {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f5f5f5;
        }

        .formWrapper {
          background-color: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }

        .logo {
          color: #5d5b8d;
          font-weight: bold;
          font-size: 24px;
          margin-bottom: 1rem;
          display: block;
          text-align: center;
        }

        .title {
          color: #5d5b8d;
          font-size: 18px;
          margin-bottom: 2rem;
          display: block;
          text-align: center;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          position: relative;
        }

        input {
          width: 100%;
          padding: 1rem;
          border: none;
          border: 1px solid #ddd;
          border-radius: 5px;
          outline: none;
          transition: border-color 0.3s;
        }

        input:focus {
          border-color: #5d5b8d;
        }

        input.error {
          border-color: #ff4d4f;
        }

        .error-message {
          color: #ff4d4f;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }

        .submit-error {
          text-align: center;
          margin-bottom: 1rem;
        }

        button {
          background-color: #5d5b8d;
          color: white;
          padding: 1rem;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        button:hover {
          background-color: #4a4873;
        }

        button:disabled {
          background-color: #9795b5;
          cursor: not-allowed;
        }

        .login-link {
          color: #5d5b8d;
          text-align: center;
          margin-top: 1rem;
        }

        .login-link a {
          color: #4a4873;
          text-decoration: none;
          font-weight: bold;
        }

        .login-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Register;