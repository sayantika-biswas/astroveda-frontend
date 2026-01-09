import React from 'react';
import { MessageCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chats = () => {
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
          <h1 className="text-xl font-bold">Chats</h1>
          <div className="w-10 h-10"></div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-8 text-center">
          <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
          <h2 className="text-lg font-bold mb-2">Coming Soon</h2>
          <p className="text-gray-400">
            Chat with astrologers feature will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chats;