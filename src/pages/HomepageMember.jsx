import React, { useState } from 'react';
import { FaCalendarAlt, FaMoneyBillWave, FaBan, FaUser } from 'react-icons/fa';
import Header from '../components/Header';
import SecondaryNavigation from '../components/SecondaryNavigation';
import DashboardCard from '../components/DashboardCard';
import MembershipPlans from '../components/MembershipPlans';
import '../styles/global.css';

const HomepageMember = () => {
    const [showMembershipModal, setShowMembershipModal] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(1); // Assume user has Basic plan

    // Mock user data
    const userData = {
        name: 'John Doe',
        smokeFreedays: 30,
        moneySaved: 1500000,
        cigarettesAvoided: 450,
        joinDate: '2023-05-15',
        membershipExpiry: '2023-06-15',
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    // Calculate days remaining in membership
    const today = new Date();
    const expiryDate = new Date(userData.membershipExpiry);
    const daysRemaining = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

    return (
        <div className="homepage-member">
            <Header isLoggedIn={true} />
            <SecondaryNavigation />

            <main className="container py-6">
                <div className="dashboard-header flex justify-between items-center mb-6">
                    <div>
                        <h1 className="mb-2">Welcome back, {userData.name}</h1>
                        <p className="text-gray-600">
                            Your membership plan: <strong>Basic</strong> ({daysRemaining} days remaining)
                        </p>
                    </div>
                    <div className="membership-actions flex gap-2">
                        <button
                            className="btn btn-outline"
                            onClick={() => setShowMembershipModal(true)}
                        >
                            Manage Membership
                        </button>
                    </div>
                </div>

                {/* Progress Statistics */}
                <h2 className="mb-4 mt-6">Your Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <DashboardCard
                        title="Smoke-Free Days"
                        value={userData.smokeFreedays}
                        description="Keep going strong!"
                        icon={<FaCalendarAlt />}
                        color="#3b82f6"
                    />
                    <DashboardCard
                        title="Money Saved"
                        value={formatCurrency(userData.moneySaved)}
                        description="From not buying cigarettes"
                        icon={<FaMoneyBillWave />}
                        color="#10b981"
                    />
                    <DashboardCard
                        title="Cigarettes Avoided"
                        value={userData.cigarettesAvoided}
                        description="Your lungs thank you!"
                        icon={<FaBan />}
                        color="#ef4444"
                    />
                </div>

                {/* Quick Actions */}
                <h2 className="mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="quick-action-card shadow rounded-lg p-6 bg-white">
                        <div className="card-icon mb-4" style={{ backgroundColor: '#bfdbfe', color: '#1d4ed8' }}>
                            <FaCalendarAlt />
                        </div>
                        <h3 className="mb-2">Track Your Progress</h3>
                        <p className="mb-4">View detailed statistics about your quitting journey</p>
                        <a href="/track-status" className="btn btn-primary w-full">Track Now</a>
                    </div>

                    <div className="quick-action-card shadow rounded-lg p-6 bg-white">
                        <div className="card-icon mb-4" style={{ backgroundColor: '#d1fae5', color: '#047857' }}>
                            <FaUser />
                        </div>
                        <h3 className="mb-2">Talk to a Doctor</h3>
                        <p className="mb-4">Get professional help from our experienced doctors</p>
                        <a href="/doctor" className="btn btn-primary w-full">Consult Now</a>
                    </div>

                    <div className="quick-action-card shadow rounded-lg p-6 bg-white">
                        <div className="card-icon mb-4" style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                            <FaBan />
                        </div>
                        <h3 className="mb-2">Join Community</h3>
                        <p className="mb-4">Connect with others on the same quitting journey</p>
                        <a href="/community" className="btn btn-primary w-full">Join Now</a>
                    </div>
                </div>
            </main>

            {/* Membership Modal */}
            {showMembershipModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            className="modal-close"
                            onClick={() => setShowMembershipModal(false)}
                        >
                            &times;
                        </button>
                        <MembershipPlans
                            onClose={() => setShowMembershipModal(false)}
                            currentPlan={currentPlan}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomepageMember; 