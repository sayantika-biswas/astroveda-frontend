import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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

import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        
        <TopNav/>
        <div className="min-h-screen bg-gray-950 pt-12">
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/" element={<Home />} />
            <Route path="/kundli" element={<Kundli />} />
            <Route path="/kundli-matching" element={<KundliMatching />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/rashifal" element={<Rashifal />} />

             
            
          </Routes>
          <BottomNav />
        </div>
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