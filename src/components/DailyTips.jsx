import React, { useState, useEffect } from 'react';
import { Briefcase, Heart, Zap, Sparkles } from 'lucide-react';
import axios from '../utils/axios';

const DailyTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDailyTips();
  }, []);

  const fetchDailyTips = async () => {
    try {
      const response = await axios.get('/astro/daily-tips');
      if (response.data.success) {
        setTips(response.data.tips);
      }
    } catch (error) {
      console.error('Error fetching daily tips:', error);
      setError('Failed to load daily tips');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('career') || categoryLower.includes('work')) {
      return <Briefcase className="w-5 h-5 text-blue-400" />;
    } else if (categoryLower.includes('health')) {
      return <Zap className="w-5 h-5 text-red-400" />;
    } else if (categoryLower.includes('relationship')) {
      return <Heart className="w-5 h-5 text-pink-400" />;
    }
    return <Sparkles className="w-5 h-5 text-purple-400" />;
  };

  const getCategoryColor = (category) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('career') || categoryLower.includes('work')) {
      return 'border-blue-500/30 bg-blue-900/10';
    } else if (categoryLower.includes('health')) {
      return 'border-red-500/30 bg-red-900/10';
    } else if (categoryLower.includes('relationship')) {
      return 'border-pink-500/30 bg-pink-900/10';
    }
    return 'border-purple-500/30 bg-purple-900/10';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse border border-gray-700/50">
            <div className="h-4 bg-gray-700/50 rounded w-1/4 mb-3"></div>
            <div className="h-3 bg-gray-700/50 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-700/50 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tips.map((tip, index) => (
        <div 
          key={index} 
          className={`backdrop-blur-lg rounded-lg border p-4 transition-all hover:shadow-lg ${getCategoryColor(tip.category)}`}
        >
          {/* Header with Category and Icon */}
          <div className="flex items-center space-x-2 mb-3">
            {getCategoryIcon(tip.category)}
            <h4 className="font-bold text-white capitalize">{tip.category}</h4>
          </div>
          
          {/* Tip Content */}
          <div className="space-y-2">
            <p className="text-gray-300 text-sm leading-relaxed">
              {tip.tip}
            </p>
            
            {/* Benefit Section */}
            {/* {tip.benefit && (
              <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                <p className="text-xs text-gray-400 font-semibold mb-1">✨ Benefit</p>
                <p className="text-xs text-gray-200">{tip.benefit}</p>
              </div>
            )} */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyTips;