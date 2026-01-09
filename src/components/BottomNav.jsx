import React from 'react';
import { Home, Star, MessageCircle, Settings,Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'rashifal', label: 'Rashifal', icon: Star, path: '/rashifal' },
    { id: 'chats', label: 'Chats', icon: MessageCircle, path: '/chats' },
    { id: 'Match', label: 'Match', icon: Heart, path: '/kundli-matching' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center  px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center w-20 py-1"
              >
                <div className={`relative mb-1 p-2 rounded-full transition-all ${
                  isActive ? 'bg-gradient-to-r from-purple-700 to-violet-700' : ''
                }`}>
                  <Icon className={`w-4 h-4 ${
                    isActive ? 'text-white' : 'text-gray-400'
                  }`} />
                  
                  {/* Active indicator dot */}
                  {/* {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                  )} */}
                </div>
                
                <span className={`text-xs ${
                  isActive ? 'text-white font-semibold' : 'text-gray-400'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Safe area for iPhone notch */}
      <div className="h-safe-bottom"></div>
    </nav>
  );
};

export default BottomNav;