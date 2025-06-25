import React from 'react';
import Header from '../components/Header';
import ChangePasswordForm from '../components/ChangePasswordForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ChangePasswordPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Đổi Mật Khẩu</h1>
          <ChangePasswordForm />
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default ChangePasswordPage; 