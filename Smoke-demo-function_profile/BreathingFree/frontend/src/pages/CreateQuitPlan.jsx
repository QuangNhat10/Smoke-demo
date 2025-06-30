import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosConfig';

const CreateQuitPlan = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState({
    quitDate: '',
    cigarettesPerDay: 0,
    costPerPack: 0,
    quitReasons: [],
    socialTriggers: [],
    routineTriggers: [],
    emotionalTriggers: [],
    withdrawalTriggers: [],
    copingStrategies: [],
    supportMethods: [],
    expertHelpMethods: []
  });

  const quitReasonOptions = [
    'It is affecting my health',
    'For my family or friends',
    'My doctor recommended quitting',
    'To save money',
    'To set a good example',
    'To have a better future',
    'To take back control',
    'For the environment',
    'To look and smell better',
    'For my pets',
    'It\'s hard to find places to smoke',
    'Baby on the way'
  ];

  const triggerOptions = {
    social: [
      'Being offered a cigarette',
      'Drinking alcohol or going to a bar',
      'Going to a party or other social event',
      'Being around others who smoke',
      'Seeing someone else smoke',
      'Smelling cigarette smoke'
    ],
    withdrawal: [
      'Feeling irritable',
      'Feeling restless or jumpy',
      'Having strong cravings',
      'Having trouble concentrating',
      'Waking up in the morning'
    ],
    routine: [
      'Being on my phone',
      'Down time or between activities',
      'Drinking coffee',
      'Finishing a meal',
      'Seeing cigarettes on TV or in movies',
      'Waiting for transportation',
      'Walking or driving',
      'Watching TV or playing games',
      'Working or studying'
    ],
    emotional: [
      'Angry',
      'Anxious or worried',
      'Bored',
      'Frustrated or upset',
      'Happy or excited',
      'Lonely',
      'Sad or depressed',
      'Stressed or overwhelmed'
    ]
  };

  const copingStrategyOptions = [
    'Drink water',
    'Eat something crunchy (carrots, apples, seeds)',
    'Take 10 deep breaths',
    'Exercise',
    'Play games or listen to audio',
    'Text or talk with supporters',
    'Go to smoke-free places'
  ];

  const supportMethodOptions = [
    'Share quit plans with important people',
    'Find a quit buddy',
    'Ask advice from successful quitters',
    'Join social media quit communities',
    'Reach out to close ones'
  ];

  const expertHelpOptions = [
    'Talk to healthcare professionals',
    'Find in-person counseling',
    'Call quitline for counseling',
    'Join text message program',
    'Download quit smoking app',
    'Chat with online counselors'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setPlan(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const calculateSavings = () => {
    const cigarettesPerPack = 20;
    const packsPerDay = plan.cigarettesPerDay / cigarettesPerPack;
    const dailyCost = packsPerDay * plan.costPerPack;
    
    return {
      weekly: (dailyCost * 7).toFixed(2),
      monthly: (dailyCost * 30).toFixed(2),
      yearly: (dailyCost * 365).toFixed(2)
    };
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/QuitPlan', {
        ...plan,
        quitReasons: plan.quitReasons.join(','),
        socialTriggers: JSON.stringify(plan.socialTriggers),
        routineTriggers: JSON.stringify(plan.routineTriggers),
        emotionalTriggers: JSON.stringify(plan.emotionalTriggers),
        withdrawalTriggers: JSON.stringify(plan.withdrawalTriggers),
        copingStrategies: plan.copingStrategies.join(','),
        supportMethods: plan.supportMethods.join(','),
        expertHelpMethods: plan.expertHelpMethods.join(',')
      });

      if (response.data) {
        navigate('/dashboard-member', { 
          state: { message: 'Quit plan created successfully! A doctor will review it soon.' }
        });
      }
    } catch (error) {
      console.error('Error creating quit plan:', error);
      alert('Failed to create quit plan. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Choose Your Quit Date</h2>
            <p className="text-gray-600 text-center mb-6">Pick a date in the next two weeks to give yourself time to prepare.</p>
            <div className="flex justify-center">
              <input
                type="date"
                name="quitDate"
                value={plan.quitDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-64 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Your Smoking Habits</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-gray-600 text-lg mb-2">How many cigarettes do you smoke per day?</label>
                <input
                  type="number"
                  name="cigarettesPerDay"
                  value={plan.cigarettesPerDay}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-lg mb-2">How much does a pack of cigarettes cost?</label>
                <input
                  type="number"
                  name="costPerPack"
                  value={plan.costPerPack}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              {plan.cigarettesPerDay > 0 && plan.costPerPack > 0 && (
                <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-xl text-green-800 mb-4">Your Potential Savings:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                      <div className="text-green-700 font-bold text-lg">Weekly</div>
                      <div className="text-2xl font-bold text-green-600">${calculateSavings().weekly}</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                      <div className="text-green-700 font-bold text-lg">Monthly</div>
                      <div className="text-2xl font-bold text-green-600">${calculateSavings().monthly}</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow">
                      <div className="text-green-700 font-bold text-lg">Yearly</div>
                      <div className="text-2xl font-bold text-green-600">${calculateSavings().yearly}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Why Are You Quitting?</h2>
            <p className="text-gray-600 text-center mb-6">Select all that apply:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quitReasonOptions.map((reason) => (
                <label key={reason} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={plan.quitReasons.includes(reason)}
                    onChange={() => handleCheckboxChange('quitReasons', reason)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3">{reason}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Know Your Triggers</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-center mb-4">Social Situations</h3>
                {triggerOptions.social.map((trigger) => (
                  <label key={trigger} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={plan.socialTriggers.includes(trigger)}
                      onChange={() => handleCheckboxChange('socialTriggers', trigger)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3">{trigger}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-center mb-4">Withdrawal Triggers</h3>
                {triggerOptions.withdrawal.map((trigger) => (
                  <label key={trigger} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={plan.withdrawalTriggers.includes(trigger)}
                      onChange={() => handleCheckboxChange('withdrawalTriggers', trigger)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3">{trigger}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-center mb-4">Daily Routines</h3>
                {triggerOptions.routine.map((trigger) => (
                  <label key={trigger} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={plan.routineTriggers.includes(trigger)}
                      onChange={() => handleCheckboxChange('routineTriggers', trigger)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3">{trigger}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-center mb-4">Emotional Triggers</h3>
                {triggerOptions.emotional.map((trigger) => (
                  <label key={trigger} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={plan.emotionalTriggers.includes(trigger)}
                      onChange={() => handleCheckboxChange('emotionalTriggers', trigger)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span className="ml-3">{trigger}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Your Coping Strategies</h2>
            <p className="text-gray-600 text-center mb-6">Select strategies you'll use when cravings hit:</p>
            <div className="space-y-4">
              {copingStrategyOptions.map((strategy) => (
                <label key={strategy} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={plan.copingStrategies.includes(strategy)}
                    onChange={() => handleCheckboxChange('copingStrategies', strategy)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3">{strategy}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Build Your Support Team</h2>
            <div className="space-y-4">
              {supportMethodOptions.map((method) => (
                <label key={method} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={plan.supportMethods.includes(method)}
                    onChange={() => handleCheckboxChange('supportMethods', method)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3">{method}</span>
                </label>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-center mt-8 text-blue-600">Get Expert Help</h2>
            <div className="space-y-4">
              {expertHelpOptions.map((method) => (
                <label key={method} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={plan.expertHelpMethods.includes(method)}
                    onChange={() => handleCheckboxChange('expertHelpMethods', method)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                  <span className="ml-3">{method}</span>
                </label>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Create Your Quit Plan</h1>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full ${
                  step === stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {renderStep()}

        <div className="mt-8 flex justify-center space-x-4">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>
          )}
          {step < 5 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuitPlan; 