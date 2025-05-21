import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardMember from './pages/DashboardMember'
import DashboardCoach from './pages/DashboardCoach'
import HomepageMember from './pages/HomepageMember'
import TrackStatus from './pages/TrackStatus'
import DoctorPage from './pages/DoctorPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard-member" element={<DashboardMember />} />
        <Route path="/dashboard-coach" element={<DashboardCoach />} />
        <Route path="/homepage-member" element={<HomepageMember />} />
        <Route path="/track-status" element={<TrackStatus />} />
        <Route path="/doctor" element={<DoctorPage />} />
      </Routes>
    </Router>
  )
}

export default App
