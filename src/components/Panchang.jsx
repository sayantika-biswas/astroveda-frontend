import React, { useState, useEffect } from 'react';
import { Moon, Star, Calendar } from 'lucide-react';
import axios from '../utils/axios';

const Panchang = () => {
  const [panchang, setPanchang] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPanchang();
  }, []);

  const fetchPanchang = async () => {
    try {
      const response = await axios.get('/astro/panchang');
      if (response.data.success) {
        setPanchang(response.data);
      }
    } catch (error) {
      console.error('Error fetching panchang:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-8 bg-gray-700/50 rounded"></div>
            <div className="h-8 bg-gray-700/50 rounded"></div>
            <div className="h-8 bg-gray-700/50 rounded"></div>
          </div>
          <div className="mt-4 h-4 bg-gray-700/50 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg border border-gray-700/50 p-4">
      {/* Header with Date in Right Corner */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Panchang</h3>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <Calendar className="w-3 h-3 text-yellow-400" />
          <span>{panchang?.date || 'Today'}</span>
        </div>
      </div>

      {/* Tithi and Nakshatra */}
      <div className="grid grid-cols-2 gap-4">
        {/* Tithi */}
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center space-x-2 mb-1">
            <Moon className="w-4 h-4 text-blue-400" />
            <div className="text-xs text-gray-400">Tithi</div>
          </div>
          <div className="font-bold text-sm text-white">{panchang?.panchang?.tithi || 'Dwitiya'}</div>
        </div>

        {/* Nakshatra */}
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
          <div className="flex items-center space-x-2 mb-1">
            <Star className="w-4 h-4 text-purple-400" />
            <div className="text-xs text-gray-400">Nakshatra</div>
          </div>
          <div className="font-bold text-sm text-white">{panchang?.panchang?.nakshatra || 'Pushya'}</div>
        </div>
      </div>
    </div>
  );
};

export default Panchang;