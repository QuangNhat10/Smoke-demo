import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import Header from "../components/Header";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user types
        setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
        setIsLoading(true);

    try {
            const response = await authApi.login(formData.email, formData.password);
            const { token, userId, roleId } = response.data;

            // Save token and user info
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("roleId", roleId);
            localStorage.setItem("userLoggedIn", "true");
            localStorage.setItem("userRole", roleId === 1 ? "Admin" : roleId === 2 ? "Member" : roleId === 3 ? "Doctor" : "User");
            localStorage.setItem("userEmail", formData.email);
        
            // Redirect based on role
            if (roleId === 1) {
                navigate("/admin");
            } else if (roleId === 2) {
                navigate("/homepage-member");
            } else if (roleId === 3) {
                navigate("/homepage-doctor");
        } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            if (error.response) {
                // Handle specific error cases
                switch (error.response.status) {
                    case 400:
                        setError(error.response.data.message || "Email hoặc mật khẩu không đúng");
                        break;
                    case 401:
                        setError("Email hoặc mật khẩu không đúng");
                        break;
                    case 500:
                        setError("Lỗi server. Vui lòng thử lại sau");
                        break;
                    default:
                        setError("Đăng nhập thất bại. Vui lòng thử lại.");
                }
            } else if (error.request) {
                setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
      } else {
                setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
        } finally {
            setIsLoading(false);
    }
  };

  return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Đăng nhập
                        </h2>
        </div>
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
          </label>
                                <div className="mt-1">
            <input
                                        id="email"
                                        name="email"
              type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
          </div>
        </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
                                <div className="mt-1">
            <input
                                        id="password"
                                        name="password"
              type="password"
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={isLoading}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
          </div>
        </div>

                            {error && (
                                <div className="text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
        <button
          type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                        isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                                >
                                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Chưa có tài khoản?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
          <Link
            to="/register"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50"
          >
                                    Đăng ký ngay
          </Link>
        </div>
          </div>
          </div>
          </div>
        </div>
        </>
  );
};

export default Login;
