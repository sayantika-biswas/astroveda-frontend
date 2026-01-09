import React, { useState, useEffect } from 'react';
import { ExternalLink, Sun, Moon, Heart, Coins, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const DailyHoroscope = () => {
  const navigate = useNavigate();
  const [horoscope, setHoroscope] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHoroscope();
  }, []);

  const fetchHoroscope = async () => {
    try {
      const response = await axios.get('/astro/horoscope/daily');
      if (response.data.success) {
        setHoroscope(response.data);
      }
    } catch (error) {
      console.error('Error fetching horoscope:', error);
      setError('Failed to load horoscope');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 backdrop-blur-lg rounded-xl border border-purple-500/30 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-purple-700/50 rounded w-1/3 mb-3"></div>
          <div className="h-20 bg-purple-700/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !horoscope) {
    return (
      <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 backdrop-blur-lg rounded-xl border border-purple-500/30 p-6">
        <p className="text-red-400 text-sm">{error || 'Unable to load horoscope'}</p>
      </div>
    );
  }

  const { user, horoscope: horoscopeData, panchang, date } = horoscope;
  const { finance, health } = horoscopeData.categories || {};

  return (
    <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 backdrop-blur-lg rounded-xl border border-purple-500/30 p-6 space-y-4">
      {/* Header with Date and User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
            <span className="text-lg font-bold">{user?.zodiacSign?.charAt(0) || '♌'}</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg capitalize">{user?.zodiacSign}</h3>
            <p className="text-gray-400 text-xs">{date}</p>
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>{user?.name}</p>
          <p>Age: {user?.age}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Categories - Finance and Health */}
      <div className="grid grid-cols-2 gap-3">
        {/* Finance */}
        {finance && (
          <div className="bg-gray-800/40 rounded-lg p-3 border border-green-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-4 h-4 text-green-400" />
              <h4 className="text-green-400 font-semibold text-sm">Finance</h4>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">{finance}</p>
          </div>
        )}

        {/* Health */}
        {health && (
          <div className="bg-gray-800/40 rounded-lg p-3 border border-red-500/30">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-4 h-4 text-red-400" />
              <h4 className="text-red-400 font-semibold text-sm">Health</h4>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed">{health}</p>
          </div>
        )}
      </div>

      {/* Panchang Section */}
      {/* {panchang && (
        <div className="space-y-3">
          <div className="border-t border-gray-700 pt-3">
            <h4 className="text-purple-300 font-semibold text-sm mb-3">📅 Panchang</h4>
            
            {/* Tithi and Nakshatra */}
            {/* <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-800/40 rounded-lg p-2 border border-purple-500/30">
                <p className="text-gray-400 text-xs">Tithi</p>
                <p className="text-white font-semibold text-sm">{panchang.tithi}</p>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-2 border border-purple-500/30">
                <p className="text-gray-400 text-xs">Nakshatra</p>
                <p className="text-white font-semibold text-sm">{panchang.nakshatra}</p>
              </div>
            </div> */}

            {/* Sunrise and Sunset */}
            {/* <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-800/40 rounded-lg p-2 border border-yellow-500/30">
                <div className="flex items-center space-x-1 mb-1">
                  <Sun className="w-3 h-3 text-yellow-400" />
                  <p className="text-gray-400 text-xs">Sunrise</p>
                </div>
                <p className="text-white font-semibold text-sm">{panchang.sunrise}</p>
              </div>
              <div className="bg-gray-800/40 rounded-lg p-2 border border-blue-500/30">
                <div className="flex items-center space-x-1 mb-1">
                  <Moon className="w-3 h-3 text-blue-400" />
                  <p className="text-gray-400 text-xs">Sunset</p>
                </div>
                <p className="text-white font-semibold text-sm">{panchang.sunset}</p>
              </div>
            </div> */}

            {/* Rahu Kaal */}
            {/* {panchang.rahuKaal && (
              <div className="bg-red-900/30 rounded-lg p-3 border border-red-500/30 mb-3">
                <p className="text-red-400 text-xs font-semibold mb-1">⚠️ Rahu Kaal (Avoid important tasks)</p>
                <p className="text-gray-300 text-sm">{panchang.rahuKaal.start} - {panchang.rahuKaal.end}</p>
              </div>
            )} */}

            {/* Guidance */}
            {/* {panchang.guidance && (
              <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                <div className="flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-purple-300 font-semibold text-xs mb-1">Daily Guidance</p>
                    <p className="text-gray-300 text-xs leading-relaxed">{panchang.guidance}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )} */} 

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Read Full Forecast Button */}
      <button 
        onClick={() => navigate('/rashifal')}
        className="w-full bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 py-3 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 transition"
      >
        <span>READ FULL FORECAST</span>
        <ExternalLink className="w-3 h-3" />
      </button>
    </div>
  );
};

export default DailyHoroscope;