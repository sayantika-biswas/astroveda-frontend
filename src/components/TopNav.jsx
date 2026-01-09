import React, { useState, useEffect } from 'react';
import { User, Bell, Wallet, Globe, Menu, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  ];

  useEffect(() => {
    // Get user data from localStorage
    const userProfile = localStorage.getItem('userProfile');
    if (userProfile) {
      try {
        setUserData(JSON.parse(userProfile));
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isProfileComplete');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 z-50 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side - Profile & Greeting */}
          <div className="flex items-center space-x-3">
            {/* Profile Icon with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center hover:opacity-90 transition"
              >
                {userData?.fullName ? (
                  <span className="text-sm font-bold">
                    {userData.fullName.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>

              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileDropdown(false)}
                  ></div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-xl border border-gray-700 shadow-lg z-50">
                    <div className="p-3 border-b border-gray-700">
                      <div className="font-bold text-white text-sm truncate">{userData?.fullName || 'User'}</div>
                      <div className="text-xs text-gray-400 mt-1 truncate">{userData?.email || 'user@example.com'}</div>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => {
                          navigate('/profile');
                          setShowProfileDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-700/50 flex items-center text-gray-300 transition"
                      >
                        <User className="w-4 h-4 mr-3 flex-shrink-0" />
                        My Profile
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-700/50 flex items-center text-red-400 transition"
                      >
                        <LogOut className="w-4 h-4 mr-3 flex-shrink-0" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Greeting with User Name */}
            <div>
              <div className="flex items-center">
                <span className="text-sm text-gray-300">Namaste,</span>
              </div>
              <div className="text-sm text-yellow-400 font-semibold">
                {userData?.fullName?.split(' ')[0] || 'Guest'}
              </div>
            </div>
          </div>

          {/* Right Side - Icons */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-gray-700/50 transition"
              >
                <Globe className="w-5 h-5 text-gray-400" />
              </button>

              {/* Language Dropdown */}
              {showLanguageDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLanguageDropdown(false)}
                  ></div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl border border-gray-700 shadow-lg z-50">
                    <div className="p-3 border-b border-gray-700">
                      <div className="text-sm font-bold text-white">Select Language</div>
                    </div>
                    <div className="py-1 max-h-60 overflow-y-auto">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          className="w-full px-4 py-2.5 text-sm text-left hover:bg-gray-700/50 flex items-center text-gray-300 transition"
                          onClick={() => {
                            // Handle language change
                            console.log('Selected language:', lang.code);
                            setShowLanguageDropdown(false);
                          }}
                        >
                          <span className="text-lg mr-3">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Wallet Icon */}
            <button
              onClick={() => navigate('/wallet')} // Create wallet page later
              className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-gray-700/50 transition relative"
            >
              <Wallet className="w-5 h-5 text-gray-400" />
              <div className="absolute -top-1 -right-1 bg-green-500 text-xs px-1.5 py-0.5 rounded-full">
                ₹0
              </div>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/notifications')} // Create notifications page later
              className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-gray-700/50 transition relative"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              {unreadNotifications > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-xs px-1.5 py-0.5 rounded-full min-w-5 text-center">
                  {unreadNotifications}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;