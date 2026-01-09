import React, { useState, useEffect } from 'react';
import { Moon, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const KundliCard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/auth/userprofile');
      if (response.data.success) {
        setUserName(response.data.user.fullName);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <button
      onClick={() => navigate('/kundli')}
      className="w-full bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700/50 p-4 flex items-center justify-between hover:bg-gray-700/50 transition"
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center mr-3">
          <Moon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="font-bold">My Kundli</div>
          <div className="text-xs text-gray-300">
            {userName ? `View ${userName.split(' ')[0]}'s Kundli` : 'Birth chart'}
          </div>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
};

export default KundliCard;