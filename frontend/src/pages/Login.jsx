import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import authService from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập cả email và mật khẩu");
      return;
    }

    try {
      const response = await authService.login(email, password);
      if (response && response.token) {
        // Hiển thị thông báo đăng nhập thành công
        toast.success('Đăng nhập thành công! Chào mừng bạn quay trở lại.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Điều hướng dựa trên role từ database
        const userRole = localStorage.getItem('userRole');
        
        // Chờ một chút để hiển thị toast rồi mới chuyển trang
        setTimeout(() => {
          switch (userRole) {
            case 'Doctor':
              window.location.href = '/homepage-doctor';
              break;
            case 'Admin':
              window.location.href = '/admin';
              break;
            case 'Staff':
              window.location.href = '/dashboard-staff';
              break;
            case 'Member':
            default:
              window.location.href = '/homepage-member';
              break;
          }
        }, 1000);
      } else {
        setError('Đăng nhập thất bại: Không nhận được token từ server.');
        toast.error('Đăng nhập thất bại: Không nhận được token từ server.');
      }
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không đúng!");
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #f0f7fa 0%, #d5f1e8 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
        padding: "2rem",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          fontSize: "2.6rem",
          fontWeight: 900,
          color: "#002f6c",
          letterSpacing: "1px",
          marginBottom: "2.5rem",
          fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
          textShadow: "0 2px 8px rgba(0, 47, 108, 0.2)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        Breathing Free
      </button>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2.5rem 2rem",
          borderRadius: "18px",
          boxShadow: "0 10px 30px rgba(53, 167, 156, 0.15)",
          minWidth: "380px",
          maxWidth: "95vw",
          display: "flex",
          flexDirection: "column",
          gap: "2.2rem",
          alignItems: "stretch",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #35a79c, #44b89d, #35a79c)",
            borderRadius: "18px 18px 0 0",
          }}
        ></div>

        <div
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#35a79c",
            marginBottom: "0.5rem",
            lineHeight: 1.1,
            fontFamily: '"Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
          }}
        >
          Chào mừng trở lại!
        </div>

        {/* Display error message if any */}
        {error && (
          <div
            style={{
              color: "#e53935",
              background: "#ffebee",
              padding: "0.8rem 1rem",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: "500",
              border: "1px solid rgba(229, 57, 53, 0.3)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11v4h2v-4h-2zm0-6v2h2V5h-2z"
                fill="#e53935"
              />
            </svg>
            {error}
          </div>
        )}

        <div style={{ position: "relative" }}>
          <label
            style={{
              color: "#5a6a6e",
              fontWeight: 500,
              fontSize: "1.08rem",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Tên đăng nhập
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                padding: "0.9rem 1.2rem",
                paddingLeft: "3rem",
                borderRadius: "8px",
                border: "1.5px solid #e5e8ee",
                fontSize: "1.08rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
                color: "#5a6a6e",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#35a79c")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e8ee")}
            />
            <svg
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#35a79c",
              }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="#35a79c"
              />
            </svg>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <label
            style={{
              color: "#5a6a6e",
              fontWeight: 500,
              fontSize: "1.08rem",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            Mật khẩu
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="password"
              placeholder="Nhập mật khẩu của bạn"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: "0.9rem 1.2rem",
                paddingLeft: "3rem",
                borderRadius: "8px",
                border: "1.5px solid #e5e8ee",
                fontSize: "1.08rem",
                outline: "none",
                width: "100%",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
                color: "#5a6a6e",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#35a79c")}
              onBlur={(e) => (e.target.style.borderColor = "#e5e8ee")}
            />
            <svg
              style={{
                position: "absolute",
                left: "1rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#35a79c",
              }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                fill="#35a79c"
              />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg, #35a79c, #44b89d)",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.1rem",
            border: "none",
            borderRadius: "8px",
            padding: "0.9rem 1.2rem",
            marginTop: "0.5rem",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(53, 167, 156, 0.3)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 15px rgba(53, 167, 156, 0.4)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 10px rgba(53, 167, 156, 0.3)";
          }}
        >
          Đăng Nhập
        </button>

        <div
          style={{
            textAlign: "center",
            color: "#5a6a6e",
            fontWeight: 500,
            marginTop: "0.5rem",
          }}
        >
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            style={{
              color: "#35a79c",
              fontWeight: 700,
              textDecoration: "none",
              borderBottom: "2px solid #35a79c",
              paddingBottom: "2px",
              transition: "border-color 0.2s",
            }}
          >
            Đăng Ký
          </Link>
        </div>

        {/* Demo login info */}
        <div
          style={{
            marginTop: "1rem",
            fontSize: "0.9rem",
            color: "#5a6a6e",
            textAlign: "center",
            padding: "1rem",
            background: "#f5f7fa",
            borderRadius: "8px",
            border: "1px dashed #35a79c",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: "0.4rem",
              color: "#35a79c",
            }}
          >
            Tài khoản Demo:
          </div>
          <div style={{ marginBottom: "0.3rem" }}>
            <strong>Member:</strong> tantantan123@gmail.com / password123
          </div>
          <div style={{ marginBottom: "0.3rem" }}>
            <strong>Doctor:</strong> doctor@gmail.com / Doctor123!
          </div>
          <div style={{ marginBottom: "0.3rem" }}>
            <strong>Admin:</strong> admin@gmail.com / Admin123!
          </div>
          <div>
            <strong>Staff:</strong> staff@gmail.com / Staff123!
          </div>
        </div>
      </form>
      
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

export default Login;
