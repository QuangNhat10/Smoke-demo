import React from "react";
import Header from "../components/Header";
import ChangePasswordForm from "../components/ChangePasswordForm";
import SecondaryNavigation from "../components/SecondaryNavigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SecondaryNavigation />
      <div className="container-change-password">
        <div className="change-password-card">
          <h1 className="change-password-title">Đổi Mật Khẩu</h1>
          <ChangePasswordForm />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
      <style jsx>{`
        .container-change-password {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f6fcfc;
          padding: 40px 0;
        }
        .change-password-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(44, 144, 133, 0.13);
          padding: 2.5rem 2.5rem 2rem 2.5rem;
          max-width: 420px;
          width: 100%;
          margin: 0 auto;
        }
        .change-password-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2c9085;
          text-align: center;
          margin-bottom: 2rem;
          letter-spacing: 0.01em;
        }
        @media (max-width: 600px) {
          .change-password-card {
            padding: 1.2rem 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChangePasswordPage;
