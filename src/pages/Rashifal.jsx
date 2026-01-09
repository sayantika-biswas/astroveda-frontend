import React, { useState, useEffect } from 'react';
import { ChevronLeft, Star, Calendar, Clock, ChevronRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ZodiacGrid from '../components/ZodiacGrid';
import RashifalDetail from '../components/RashifalDetail';

const Rashifal = () => {
  const navigate = useNavigate();
  const [selectedSign, setSelectedSign] = useState(null);
  const [period, setPeriod] = useState('daily');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'detail'

  const periods = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' }
  ];

  const handleSignSelect = (signId) => {
    setSelectedSign(signId);
    setViewMode('detail');
  };

  const handleBackToGrid = () => {
    setViewMode('grid');
    setSelectedSign(null);
  };

  // If detail view, show selected sign
  if (viewMode === 'detail' && selectedSign) {
    return (
      <RashifalDetail 
        signId={selectedSign}
        period={period}
        onBack={handleBackToGrid}
      />
    );
  }

  // Grid view
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white pb-20">
      {/* Header */}
      <div className="px-4 max-w-md mx-auto pt-4 pb-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Rashifal</h1>
          <div className="w-10 h-10"></div> {/* Spacer for symmetry */}
        </div>

        {/* Period Selector */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-purple-400 mr-2" />
              <div className="text-sm font-medium">Select Period</div>
            </div>
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriod(p.id)}
                className={`py-2 rounded-lg text-sm font-medium transition ${
                  period === p.id 
                    ? 'bg-gradient-to-r from-purple-700 to-violet-700' 
                    : 'bg-gray-700/50 hover:bg-gray-600/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Current Period Info */}
        <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-yellow-400 mr-2" />
              <div>
                <div className="text-sm font-medium">{period.charAt(0).toUpperCase() + period.slice(1)} Predictions</div>
                <div className="text-xs text-gray-400">
                  {new Date().toLocaleDateString('en-IN', { 
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                  })}
                </div>
              </div>
            </div>
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Zodiac Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">All Zodiac Signs</h2>
            <div className="text-sm text-gray-400">12 Signs</div>
          </div>
          <ZodiacGrid onSignSelect={handleSignSelect} />
        </div>

        {/* Info Note */}
        <div className="mt-8 text-center">
          <div className="text-xs text-gray-400">
            Select a zodiac sign to view {period} predictions
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Predictions are based on astrological calculations
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rashifal;