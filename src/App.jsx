import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Login from './pages/Login'
import CreateProfile from './pages/CreateProfile'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Kundli from './pages/Kundli'
import Rashifal from './pages/Rashifal'
import TopNav from './components/TopNav'
import BottomNav from './components/BottomNav'
import KundliMatching from './pages/KundliMatching'
import Chats from './pages/chats'
import Settings from './pages/Settings'
import ProfilePage from './pages/ProfilePage'

import { AuthProvider, useAuth } from './context/AuthContext'

// Protected Route wrapper using AuthContext
const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return element;
};

// Main App Routes
const AppRoutes = () => {
  return (
    <>
      <TopNav/>
      <div className="min-h-screen bg-gray-950 pt-12">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-profile" element={<CreateProfile />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/kundli" element={<ProtectedRoute element={<Kundli />} />} />
          <Route path="/kundli-matching" element={<ProtectedRoute element={<KundliMatching />} />} />
          <Route path="/chats" element={<ProtectedRoute element={<Chats />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />
          <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
          <Route path="/rashifal" element={<ProtectedRoute element={<Rashifal />} />} />
        </Routes>
        <BottomNav />
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
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
          theme="dark"
        />
      </Router>
    </AuthProvider>
  )
}

export default App