import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Calendar, Heart, TrendingUp, Shield, Book, Car, Users, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import axios from '../utils/axios';

const RashifalDetail = ({ signId, period, onBack }) => {
  const [rashifalData, setRashifalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('career');

  const signDetails = {
    aries: { name: 'Aries', emoji: '♈', element: 'Fire', ruler: 'Mars' },
    taurus: { name: 'Taurus', emoji: '♉', element: 'Earth', ruler: 'Venus' },
    gemini: { name: 'Gemini', emoji: '♊', element: 'Air', ruler: 'Mercury' },
    cancer: { name: 'Cancer', emoji: '♋', element: 'Water', ruler: 'Moon' },
    leo: { name: 'Leo', emoji: '♌', element: 'Fire', ruler: 'Sun' },
    virgo: { name: 'Virgo', emoji: '♍', element: 'Earth', ruler: 'Mercury' },
    libra: { name: 'Libra', emoji: '♎', element: 'Air', ruler: 'Venus' },
    scorpio: { name: 'Scorpio', emoji: '♏', element: 'Water', ruler: 'Pluto/Mars' },
    sagittarius: { name: 'Sagittarius', emoji: '♐', element: 'Fire', ruler: 'Jupiter' },
    capricorn: { name: 'Capricorn', emoji: '♑', element: 'Earth', ruler: 'Saturn' },
    aquarius: { name: 'Aquarius', emoji: '♒', element: 'Air', ruler: 'Uranus' },
    pisces: { name: 'Pisces', emoji: '♓', element: 'Water', ruler: 'Neptune' },
  };

  const categories = [
    { id: 'career', label: 'Career', icon: TrendingUp, color: 'text-blue-400' },
    { id: 'finance', label: 'Finance', icon: TrendingUp, color: 'text-green-400' },
    { id: 'love', label: 'Love', icon: Heart, color: 'text-pink-400' },
    { id: 'health', label: 'Health', icon: Shield, color: 'text-red-400' },
    { id: 'education', label: 'Education', icon: Book, color: 'text-yellow-400' },
    { id: 'travel', label: 'Travel', icon: Car, color: 'text-purple-400' },
    { id: 'family', label: 'Family', icon: Users, color: 'text-orange-400' },
  ];

  useEffect(() => {
    fetchRashifal();
  }, [signId, period]);

  const fetchRashifal = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/astro/${signId}?period=${period}`);
      if (response.data.success) {
        setRashifalData(response.data);
      }
    } catch (error) {
      console.error('Error fetching rashifal:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPeriodLabel = (period) => {
    switch(period) {
      case 'daily': return 'Today';
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return period;
    }
  };

  const sign = signDetails[signId];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white pb-20">
        <div className="px-4 max-w-md mx-auto pt-4">
          <div className="h-8 bg-gray-700/50 rounded w-1/3 animate-pulse mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-700/50 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white pb-20">
      {/* Header */}
      <div className="px-4 max-w-md mx-auto pt-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">{sign.name} Rashifal</h1>
          <div className="w-10 h-10"></div>
        </div>

        {/* Sign Header Card */}
        <div className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center mr-4">
                <span className="text-3xl">{sign.emoji}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold">{sign.name}</h2>
                <div className="text-sm text-gray-400">
                  {sign.element} • Ruled by {sign.ruler}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-300 font-medium">
                {getPeriodLabel(period)}
              </div>
              <div className="text-xs text-gray-400">
                Predictions
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
            <button
              key={p}
              onClick={() => window.location.href = `?period=${p}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                period === p 
                  ? 'bg-gradient-to-r from-purple-700 to-violet-700' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Predictions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Predictions</h2>
            <div className="text-sm text-gray-400 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {rashifalData?.generatedAt ? 
                new Date(rashifalData.generatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                'Now'}
            </div>
          </div>

          {/* Category Navigation */}
          <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const hasPrediction = rashifalData?.predictions?.["0"]?.predictions?.[category.id];
              
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id 
                      ? 'bg-gradient-to-r from-purple-700 to-violet-700' 
                      : 'bg-gray-800/50 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${category.color}`} />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Active Category Prediction */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 mb-4">
            <div className="flex items-center mb-3">
              {(() => {
                const CategoryIcon = categories.find(c => c.id === activeCategory)?.icon;
                const color = categories.find(c => c.id === activeCategory)?.color;
                return CategoryIcon ? <CategoryIcon className={`w-5 h-5 mr-2 ${color}`} /> : null;
              })()}
              <h3 className="text-lg font-bold capitalize">{activeCategory}</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              {rashifalData?.predictions?.["0"]?.predictions?.[activeCategory] || 
               'No prediction available for this category.'}
            </p>
          </div>

          {/* Quick Overview Grid */}
          <div className="grid grid-cols-2 gap-3">
            {['career', 'finance', 'love', 'health'].map((cat) => (
              <div 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`bg-gray-800/30 rounded-lg p-3 cursor-pointer transition hover:bg-gray-700/50 ${
                  activeCategory === cat ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                <div className="text-sm font-medium capitalize mb-2">{cat}</div>
                <p className="text-xs text-gray-400 line-clamp-2">
                  {rashifalData?.predictions?.["0"]?.predictions?.[cat]?.split('.')[0]}.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Lucky Days & Precautions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Lucky Days */}
          {rashifalData?.predictions?.["0"]?.luckyDays && (
            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <h3 className="text-sm font-medium">Lucky Days</h3>
              </div>
              <div className="space-y-2">
                {rashifalData.predictions["0"].luckyDays.map((day, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                    <span className="text-sm text-gray-300">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Precautions */}
          {rashifalData?.predictions?.["0"]?.precautions && (
            <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <AlertCircle className="w-4 h-4 text-red-400 mr-2" />
                <h3 className="text-sm font-medium">Precautions</h3>
              </div>
              <div className="space-y-2">
                {rashifalData.predictions["0"].precautions.slice(0, 3).map((precaution, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-1.5"></div>
                    <span className="text-sm text-gray-300 flex-1">{precaution}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* General Advice */}
        {rashifalData?.predictions?.["0"]?.advice && (
          <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-3">
              <Star className="w-4 h-4 text-blue-400 mr-2" />
              <h3 className="text-sm font-medium">Advice</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              {rashifalData.predictions["0"].advice}
            </p>
          </div>
        )}

        {/* Generated Info */}
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="text-xs text-gray-400">
            <div className="mb-1">
              Generated: {rashifalData?.generatedAt ? 
                new Date(rashifalData.generatedAt).toLocaleString() : 
                'Recently'}
            </div>
            <div>Source: {rashifalData?.source || 'gemini'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RashifalDetail;