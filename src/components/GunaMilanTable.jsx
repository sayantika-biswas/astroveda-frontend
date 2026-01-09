import React from 'react';
import { Check, X, AlertCircle, Star } from 'lucide-react';

const GunaMilanTable = ({ gunaDetails }) => {
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Perfect Match':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'Excellent Match':
        return <Star className="w-4 h-4 text-blue-500" />;
      case 'Good Match':
        return <Check className="w-4 h-4 text-green-400" />;
      case 'Average Match':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'Below Average':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <X className="w-4 h-4 text-red-500" />;
    }
  };

  const getProgressColor = (points, maxPoints) => {
    const percentage = (points / maxPoints) * 100;
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-yellow-500';
    if (percentage >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Koota</th>
            <th className="text-center py-3 px-2 text-sm font-medium text-gray-400">Points</th>
            <th className="text-center py-3 px-2 text-sm font-medium text-gray-400">Max</th>
            <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Status</th>
          </tr>
        </thead>
        <tbody>
          {gunaDetails.map((guna, index) => (
            <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30">
              <td className="py-3 px-2">
                <div className="font-medium">{guna.koota}</div>
                <div className="text-xs text-gray-400">{getKootaDescription(guna.koota)}</div>
              </td>
              <td className="py-3 px-2 text-center">
                <div className="font-bold text-lg">{guna.points}</div>
              </td>
              <td className="py-3 px-2 text-center">
                <div className="text-gray-400">{guna.maxPoints}</div>
              </td>
              <td className="py-3 px-2">
                <div className="flex items-center">
                  <div className="mr-2">
                    {getStatusIcon(guna.status)}
                  </div>
                  <div>
                    <div className="font-medium">{guna.status}</div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-700 h-1 rounded-full mt-1">
                      <div 
                        className={`h-full rounded-full ${getProgressColor(guna.points, guna.maxPoints)}`}
                        style={{ width: `${(guna.points / guna.maxPoints) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="text-sm text-gray-400 mb-2">Koota Descriptions:</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="font-medium">Varna:</span> Spiritual compatibility</div>
          <div><span className="font-medium">Vasya:</span> Mutual attraction & control</div>
          <div><span className="font-medium">Tara:</span> Health & destiny</div>
          <div><span className="font-medium">Yoni:</span> Sexual & physical compatibility</div>
          <div><span className="font-medium">Graha Maitri:</span> Mental & friendship</div>
          <div><span className="font-medium">Gana:</span> Temperament & nature</div>
          <div><span className="font-medium">Bhakoot:</span> Emotional & family happiness</div>
          <div><span className="font-medium">Nadi:</span> Health & progeny</div>
        </div>
      </div>
    </div>
  );
};

const getKootaDescription = (koota) => {
  const descriptions = {
    'Varna': 'Spiritual compatibility',
    'Vasya': 'Mutual attraction & control',
    'Tara': 'Health & destiny',
    'Yoni': 'Sexual & physical compatibility',
    'Graha Maitri': 'Mental & friendship',
    'Gana': 'Temperament & nature',
    'Bhakoot': 'Emotional & family happiness',
    'Nadi': 'Health & progeny'
  };
  return descriptions[koota] || koota;
};

export default GunaMilanTable;