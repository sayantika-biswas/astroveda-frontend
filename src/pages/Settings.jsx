import React from 'react';
import { Settings as SettingsIcon, ChevronLeft, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white pb-20">
      <div className="px-4 max-w-md mx-auto pt-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
          <div className="w-10 h-10"></div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <User className="w-5 h-5 text-purple-400 mr-3" />
              <div>
                <div className="font-medium">Account</div>
                <div className="text-sm text-gray-400">Manage your profile</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-purple-400 mr-3" />
              <div>
                <div className="font-medium">Notifications</div>
                <div className="text-sm text-gray-400">Configure alerts</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <Shield className="w-5 h-5 text-purple-400 mr-3" />
              <div>
                <div className="font-medium">Privacy & Security</div>
                <div className="text-sm text-gray-400">Data protection</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4">
            <div className="flex items-center mb-4">
              <HelpCircle className="w-5 h-5 text-purple-400 mr-3" />
              <div>
                <div className="font-medium">Help & Support</div>
                <div className="text-sm text-gray-400">Get assistance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;