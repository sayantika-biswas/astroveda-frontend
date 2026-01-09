import React from 'react';
import { User, ChevronRight } from 'lucide-react';
import DailyHoroscope from '../components/DailyHoroscope';
import DailyTips from '../components/DailyTips';
import Panchang from '../components/Panchang';
import KundliCard from '../components/KundliCard';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-950 text-white pb-20">
      {/* Top Header - Centered and Narrow */}
      <div className="pt-6 pb-4 px-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Personal Pandit: Ji</h1>
            <p className="text-gray-300 text-sm mt-1">
              Ask about Today's Studio Podcast, Binder & Green.
            </p>
          </div>
          {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div> */}
        </div>
      </div>

      {/* Main Content - Narrow Container */}
      <div className="px-4 max-w-md mx-auto space-y-6">
        {/* Daily Horoscope Card */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-gray-200">Daily Horoscope</h2>
          <DailyHoroscope />
        </div>

        {/* Quick Links Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold mb-3 text-gray-200">Quick Access</h2>
            <button className="text-sm text-purple-300">Check Others</button>
          </div>
          <div className="space-y-3">
            <KundliCard />
            {/* You can add more quick links here */}
          </div>
        </div>

        {/* Daily Tips Card */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-200">Your Daily Tips</h2>
          </div>
          <DailyTips />
        </div>

       {/* Panchang Card - Compact */}
        <div>
          <h2 className="text-lg font-bold mb-3 text-gray-200">Panchang</h2>
          <Panchang />
        </div>
      </div>
    </div>
  );
};

export default Home;