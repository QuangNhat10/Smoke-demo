import React, { useState } from 'react';
import '../styles/global.css';

const MembershipPlans = ({ onClose, currentPlan }) => {
    const [selectedPlan, setSelectedPlan] = useState(currentPlan || null);

    const plans = [
        {
            id: 1,
            name: 'Basic',
            duration: '1 month',
            price: 600000,
            features: [
                'Consult with general doctors',
                'Basic progress tracking',
                'Community access',
                'Weekly reports'
            ]
        },
        {
            id: 2,
            name: 'Standard',
            duration: '6 months',
            price: 3000000,
            features: [
                'All Basic features',
                'Consult with specialist doctors',
                'Detailed health analytics',
                'Priority support',
                '10% discount on next renewal'
            ]
        },
        {
            id: 3,
            name: 'Premium',
            duration: '1 year',
            price: 5400000,
            features: [
                'All Standard features',
                'Personalized quitting plan',
                'Direct message with doctors',
                'Monthly health assessment',
                '24/7 support access',
                '20% discount on next renewal'
            ]
        }
    ];

    const handleSubscribe = (planId) => {
        // Here you would handle the subscription logic
        console.log(`Subscribing to plan ${planId}`);
        // Mock success for demo purposes
        setSelectedPlan(planId);
        // Close modal after a delay to show success state
        setTimeout(() => onClose(), 1500);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="membership-plans-container">
            <div className="membership-header">
                <h2>Choose Your Membership Plan</h2>
                <p>Select the plan that works best for your quitting journey</p>
            </div>

            <div className="plans-grid">
                {plans.map(plan => (
                    <div key={plan.id} className={`plan-card ${selectedPlan === plan.id ? 'selected' : ''}`}>
                        <h3>{plan.name}</h3>
                        <div className="plan-duration">{plan.duration}</div>
                        <div className="plan-price">{formatPrice(plan.price)}</div>

                        <ul className="plan-features">
                            {plan.features.map((feature, index) => (
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>

                        <button
                            className={`btn ${currentPlan === plan.id ? 'btn-outline' : 'btn-primary'}`}
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={selectedPlan && selectedPlan !== plan.id}
                        >
                            {currentPlan === plan.id ? 'Current Plan' : 'Subscribe'}
                        </button>
                    </div>
                ))}
            </div>

            <div className="membership-footer">
                <button className="btn btn-outline" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default MembershipPlans; 