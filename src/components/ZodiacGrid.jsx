import React from 'react';

const ZodiacGrid = ({ onSignSelect }) => {
  const zodiacSigns = [
    { 
      id: 'aries', 
      name: 'Aries', 
      emoji: '♈', 
      date: 'Mar 21 - Apr 19',
      element: '🔥',
      color: 'from-red-500 to-orange-500'
    },
    { 
      id: 'taurus', 
      name: 'Taurus', 
      emoji: '♉', 
      date: 'Apr 20 - May 20',
      element: '🌍',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'gemini', 
      name: 'Gemini', 
      emoji: '♊', 
      date: 'May 21 - Jun 20',
      element: '💨',
      color: 'from-yellow-500 to-amber-500'
    },
    { 
      id: 'cancer', 
      name: 'Cancer', 
      emoji: '♋', 
      date: 'Jun 21 - Jul 22',
      element: '💧',
      color: 'from-silver-500 to-gray-400'
    },
    { 
      id: 'leo', 
      name: 'Leo', 
      emoji: '♌', 
      date: 'Jul 23 - Aug 22',
      element: '🔥',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'virgo', 
      name: 'Virgo', 
      emoji: '♍', 
      date: 'Aug 23 - Sep 22',
      element: '🌍',
      color: 'from-green-500 to-lime-500'
    },
    { 
      id: 'libra', 
      name: 'Libra', 
      emoji: '♎', 
      date: 'Sep 23 - Oct 22',
      element: '💨',
      color: 'from-pink-500 to-rose-500'
    },
    { 
      id: 'scorpio', 
      name: 'Scorpio', 
      emoji: '♏', 
      date: 'Oct 23 - Nov 21',
      element: '💧',
      color: 'from-red-900 to-purple-900'
    },
    { 
      id: 'sagittarius', 
      name: 'Sagittarius', 
      emoji: '♐', 
      date: 'Nov 22 - Dec 21',
      element: '🔥',
      color: 'from-purple-500 to-violet-500'
    },
    { 
      id: 'capricorn', 
      name: 'Capricorn', 
      emoji: '♑', 
      date: 'Dec 22 - Jan 19',
      element: '🌍',
      color: 'from-gray-700 to-gray-900'
    },
    { 
      id: 'aquarius', 
      name: 'Aquarius', 
      emoji: '♒', 
      date: 'Jan 20 - Feb 18',
      element: '💨',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'pisces', 
      name: 'Pisces', 
      emoji: '♓', 
      date: 'Feb 19 - Mar 20',
      element: '💧',
      color: 'from-blue-300 to-indigo-500'
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {zodiacSigns.map((sign) => (
        <button
          key={sign.id}
          onClick={() => onSignSelect(sign.id)}
          className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 text-center transition transform hover:scale-[1.02] hover:border-purple-500/50"
        >
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${sign.color} flex items-center justify-center mx-auto mb-3`}>
            <span className="text-2xl">{sign.emoji}</span>
          </div>
          <div className="font-bold text-sm mb-1">{sign.name}</div>
          <div className="text-xs text-gray-400 mb-2">{sign.date}</div>
          <div className="text-lg">{sign.element}</div>
        </button>
      ))}
    </div>
  );
};

export default ZodiacGrid;