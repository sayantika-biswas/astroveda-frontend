import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, User, Calendar, Clock, MapPin, Star, 
  Sun, Moon, Zap, Target, Shield, TrendingUp, AlertCircle,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const Kundli = () => {
  const navigate = useNavigate();
  const [kundliData, setKundliData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    fetchKundli();
  }, []);

  const fetchKundli = async () => {
    try {
      const response = await axios.get('/astro/kundli');
      if (response.data.success) {
        setKundliData(response.data);
      }
    } catch (error) {
      console.error('Error fetching kundli:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getPlanetIcon = (planet) => {
    switch(planet.toLowerCase()) {
      case 'sun': return '☉';
      case 'moon': return '☽';
      case 'mars': return '♂';
      case 'mercury': return '☿';
      case 'jupiter': return '♃';
      case 'venus': return '♀';
      case 'saturn': return '♄';
      case 'rahu': return '☊';
      case 'ketu': return '☋';
      default: return '★';
    }
  };

  const getStrengthColor = (strength) => {
    switch(strength.toLowerCase()) {
      case 'strong': return 'text-green-400';
      case 'weak': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white pb-20">
        <div className="px-4 max-w-md mx-auto">
          <div className="pt-4">
            <div className="h-8 bg-gray-700/50 rounded w-1/3 animate-pulse mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-700/50 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-bold">Birth Chart Analysis</h1>
          <button 
            onClick={fetchKundli}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-800/50 hover:bg-purple-700/50 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Personal Info Card */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center mr-3">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{kundliData?.personalInfo?.name}</h2>
              <p className="text-sm text-gray-300">Birth Chart Analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <div className="text-xs text-gray-400">DOB</div>
                <div className="text-sm font-medium">{formatDate(kundliData?.personalInfo?.dateOfBirth)}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <div className="text-xs text-gray-400">Time</div>
                <div className="text-sm font-medium">{kundliData?.personalInfo?.timeOfBirth}</div>
              </div>
            </div>
            <div className="col-span-2 flex items-center mt-2">
              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
              <div>
                <div className="text-xs text-gray-400">Place of Birth</div>
                <div className="text-sm font-medium">{kundliData?.personalInfo?.placeOfBirth}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'overview' ? 'bg-purple-700' : 'bg-gray-800/50'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSection('planets')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'planets' ? 'bg-purple-700' : 'bg-gray-800/50'}`}
          >
            Planets
          </button>
          <button
            onClick={() => setActiveSection('predictions')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${activeSection === 'predictions' ? 'bg-purple-700' : 'bg-gray-800/50'}`}
          >
            Predictions
          </button>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-4">
            {/* Ascendant & Moon Sign */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Sun className="w-4 h-4 text-yellow-400 mr-2" />
                  <div className="text-sm font-medium">Ascendant</div>
                </div>
                <div className="text-2xl font-bold text-purple-300 mb-2">
                  {kundliData?.kundli?.["0"]?.ascendant?.sign}
                </div>
                <p className="text-xs text-gray-400 line-clamp-3">
                  {kundliData?.kundli?.["0"]?.ascendant?.description?.split('.')[0]}.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Moon className="w-4 h-4 text-blue-400 mr-2" />
                  <div className="text-sm font-medium">Moon Sign</div>
                </div>
                <div className="text-2xl font-bold text-purple-300 mb-2">
                  {kundliData?.kundli?.["0"]?.moonSign?.sign}
                </div>
                <p className="text-xs text-gray-400 line-clamp-3">
                  {kundliData?.kundli?.["0"]?.moonSign?.characteristics?.split('.')[0]}.
                </p>
              </div>
            </div>

            {/* Current Dasha */}
            <div className="bg-gradient-to-r from-purple-900/30 to-violet-900/30 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Zap className="w-4 h-4 text-yellow-400 mr-2" />
                <div className="text-sm font-medium">Current Dasha</div>
              </div>
              <div className="text-lg font-bold mb-2">{kundliData?.kundli?.["0"]?.currentDasha?.planet}</div>
              <div className="text-xs text-gray-400 mb-2">
                {kundliData?.kundli?.["0"]?.currentDasha?.period}
              </div>
              <p className="text-sm text-gray-300">
                {kundliData?.kundli?.["0"]?.currentDasha?.effects?.split('.')[0]}.
              </p>
            </div>

            {/* Yogas */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <div className="text-sm font-medium">Important Yogas</div>
              </div>
              <div className="space-y-2">
                {kundliData?.kundli?.["0"]?.yogas?.slice(0, 2).map((yoga, index) => (
                  <div key={index} className="text-sm text-gray-300 bg-gray-700/50 rounded-lg p-3">
                    {yoga}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Planets Section */}
        {activeSection === 'planets' && (
          <div className="space-y-4">
            {/* Planetary Positions Grid */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-purple-400 mr-2" />
                  <div className="text-sm font-medium">Planetary Positions</div>
                </div>
                <div className="text-xs text-gray-400">{kundliData?.kundli?.planetaryPositions?.length || 9} Planets</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {kundliData?.kundli?.["0"]?.planetaryPositions?.map((planet, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="text-lg mr-2">{getPlanetIcon(planet.planet)}</span>
                        <div className="text-sm font-medium">{planet.planet}</div>
                      </div>
                      <div className="text-xs bg-purple-900/30 px-2 py-1 rounded">
                        H{planet.house}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{planet.sign}</div>
                    <div className="text-xs text-gray-300">{planet.degree}°</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Planet Strengths */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <div className="text-sm font-medium">Planet Strengths</div>
              </div>
              <div className="space-y-3">
                {kundliData?.kundli?.["0"]?.planetStrengths?.map((planet, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{getPlanetIcon(planet.planet)}</span>
                      <div>
                        <div className="text-sm font-medium">{planet.planet}</div>
                        <div className="text-xs text-gray-400">{planet.reason?.split('.')[0]}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${getStrengthColor(planet.strength)}`}>
                      {planet.strength}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Houses Chart Visualization */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center mb-4">
                <Shield className="w-4 h-4 text-blue-400 mr-2" />
                <div className="text-sm font-medium">Houses Chart</div>
              </div>
              <div className="relative h-64">
                {/* Simplified Houses Chart */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 relative">
                    {/* Outer Circle */}
                    <div className="absolute inset-0 border-2 border-purple-500/30 rounded-full"></div>
                    
                    {/* Houses */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house, index) => {
                      const angle = (index * 30) * Math.PI / 180;
                      const radius = 100;
                      const x = radius * Math.cos(angle);
                      const y = radius * Math.sin(angle);
                      
                      return (
                        <div
                          key={house}
                          className="absolute w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`
                          }}
                        >
                          {house}
                        </div>
                      );
                    })}

                    {/* Planets in Houses */}
                    {kundliData?.kundli?.["0"]?.planetaryPositions?.map((planet) => {
                      const houseNumber = planet.house;
                      const angle = ((houseNumber - 1) * 30) * Math.PI / 180;
                      const radius = 70;
                      const x = radius * Math.cos(angle);
                      const y = radius * Math.sin(angle);
                      
                      return (
                        <div
                          key={planet.planet}
                          className="absolute w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-violet-600 flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2"
                          style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`
                          }}
                          title={`${planet.planet} in ${planet.sign} (H${houseNumber})`}
                        >
                          {getPlanetIcon(planet.planet)}
                        </div>
                      );
                    })}

                    {/* Center Point */}
                    <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center mt-4">
                Chart shows planets in their respective houses
              </div>
            </div>
          </div>
        )}

        {/* Predictions Section */}
        {activeSection === 'predictions' && (
          <div className="space-y-4">
            {/* Predictions Grid */}
            <div className="grid grid-cols-2 gap-4">
              {kundliData?.kundli?.["0"]?.predictions && Object.entries(kundliData.kundli["0"].predictions).map(([category, prediction]) => (
                <div key={category} className="bg-gray-800/50 rounded-xl p-4">
                  <div className="text-sm font-medium capitalize mb-2">{category}</div>
                  <p className="text-xs text-gray-300 line-clamp-4">
                    {prediction.split('.')[0]}.
                  </p>
                </div>
              ))}
            </div>

            {/* Remedies */}
            <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-4">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                <div className="text-sm font-medium">Suggested Remedies</div>
              </div>
              <div className="space-y-3">
                {kundliData?.kundli?.["0"]?.remedies?.map((remedy, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-yellow-900/30 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                      <span className="text-xs">📿</span>
                    </div>
                    <p className="text-sm text-gray-300 flex-1">{remedy}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Info */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="text-xs text-gray-400">
                <div className="mb-1">Generated: {new Date(kundliData?.generatedAt).toLocaleString()}</div>
                <div>Source: {kundliData?.kundli?.source || 'gemini'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button className="py-3 bg-gray-800/50 rounded-lg text-sm font-medium hover:bg-gray-700/50 transition">
            Save PDF
          </button>
          <button className="py-3 bg-gradient-to-r from-purple-700 to-violet-700 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-violet-600 transition">
            Share Kundli
          </button>
        </div>
      </div>
    </div>
  );
};

export default Kundli;