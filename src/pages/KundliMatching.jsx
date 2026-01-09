import React, { useState } from 'react';
import { 
  ChevronLeft, Heart, Calendar, Clock, MapPin, 
  User, Star, Check, X, AlertCircle, Loader2,
  Sparkles, Target, Shield, Trophy, Percent, 
  TrendingUp, Users, Activity, Zap, Moon, Sun
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import GunaMilanTable from '../components/GunaMilanTable';

const KundliMatching = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    partnerName: '',
    partnerDob: '',
    partnerTob: '',
    partnerPob: ''
  });

  const getMaxDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);
    return minDate.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.partnerName.trim()) {
      newErrors.partnerName = 'Partner name is required';
    }
    
    if (!formData.partnerDob) {
      newErrors.partnerDob = 'Date of birth is required';
    } else {
      const dob = new Date(formData.partnerDob);
      const today = new Date();
      
      if (dob >= today) {
        newErrors.partnerDob = 'Date of birth must be in the past';
      }
    }
    
    if (!formData.partnerTob) {
      newErrors.partnerTob = 'Time of birth is required';
    }
    
    if (!formData.partnerPob.trim()) {
      newErrors.partnerPob = 'Place of birth is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const response = await axios.post('/astro/kundli-matching', formData);
      
      if (response.data.success) {
        setResult(response.data);
      } else {
        setErrors({ general: response.data.message || 'Failed to perform matching' });
      }
    } catch (error) {
      console.error('Kundli matching error:', error);
      setErrors({ 
        general: error.response?.data?.message || 
                'Failed to perform kundli matching. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      partnerName: '',
      partnerDob: '',
      partnerTob: '',
      partnerPob: ''
    });
    setResult(null);
    setErrors({});
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 75) return 'bg-green-900/20 border-green-500/30';
    if (score >= 50) return 'bg-yellow-900/20 border-yellow-500/30';
    return 'bg-red-900/20 border-red-500/30';
  };

  const getCompatibilityLevel = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    if (percentage >= 20) return 'Below Average';
    return 'Poor';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white pb-20">
      {/* Header */}
      <div className="px-4 max-w-md mx-auto pt-4">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Kundli Matching</h1>
          <div className="w-10 h-10"></div>
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-3">
            <Heart className="w-5 h-5 text-pink-400 mr-2" />
            <h2 className="text-lg font-bold">Vedic Astrology Matchmaking</h2>
          </div>
          <p className="text-sm text-gray-300">
            Enter your partner's birth details to check astrological compatibility using the ancient Ashtakoota (8 Gunas) system.
          </p>
        </div>

        {/* Form Section */}
        {!result && (
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 mb-6">
            <div className="flex items-center mb-6">
              <User className="w-5 h-5 text-purple-400 mr-2" />
              <h3 className="text-lg font-bold">Partner's Birth Details</h3>
            </div>

            {errors.general && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm">{errors.general}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Partner Name */}
              <div>
                <label className=" text-sm font-medium mb-2 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  Partner's Full Name
                </label>
                <input
                  type="text"
                  name="partnerName"
                  value={formData.partnerName}
                  onChange={handleChange}
                  placeholder="Enter partner's full name"
                  className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition ${
                    errors.partnerName 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-700 focus:border-purple-500'
                  }`}
                />
                {errors.partnerName && (
                  <p className="mt-1 text-sm text-red-400">{errors.partnerName}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div>
                <label className=" text-sm font-medium mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="partnerDob"
                  value={formData.partnerDob}
                  onChange={handleChange}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white outline-none transition ${
                    errors.partnerDob 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-700 focus:border-purple-500'
                  }`}
                />
                {errors.partnerDob && (
                  <p className="mt-1 text-sm text-red-400">{errors.partnerDob}</p>
                )}
              </div>

              {/* Time of Birth */}
              <div>
                <label className="text-sm font-medium mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  Time of Birth (24-hour format)
                </label>
                <input
                  type="time"
                  name="partnerTob"
                  value={formData.partnerTob}
                  onChange={handleChange}
                  className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white outline-none transition ${
                    errors.partnerTob 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-700 focus:border-purple-500'
                  }`}
                />
                {errors.partnerTob && (
                  <p className="mt-1 text-sm text-red-400">{errors.partnerTob}</p>
                )}
              </div>

              {/* Place of Birth */}
              <div>
                <label className=" text-sm font-medium mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  Place of Birth
                </label>
                <input
                  type="text"
                  name="partnerPob"
                  value={formData.partnerPob}
                  onChange={handleChange}
                  placeholder="City, State, Country"
                  className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition ${
                    errors.partnerPob 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-700 focus:border-purple-500'
                  }`}
                />
                {errors.partnerPob && (
                  <p className="mt-1 text-sm text-red-400">{errors.partnerPob}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Example: Mumbai, Maharashtra, India
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 py-3 rounded-xl font-bold flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Matching Kundlis...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    Match Kundlis
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Overall Compatibility Score */}
            <div className={`rounded-xl p-6 ${getScoreBgColor(result.matching?.["0"]?.compatibility?.percentage || 0)} border`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Trophy className="w-6 h-6 text-yellow-400 mr-3" />
                  <div>
                    <h3 className="text-lg font-bold">Overall Compatibility</h3>
                    <p className="text-sm text-gray-300">Ashtakoota Guna Milan</p>
                  </div>
                </div>
                <div className={`text-4xl font-bold ${getScoreColor(result.matching?.["0"]?.compatibility?.percentage || 0)}`}>
                  {result.matching?.["0"]?.compatibility?.percentage || 0}%
                </div>
              </div>
              
              <div className="text-center mb-3">
                <div className={`text-xl font-bold mb-1 ${getScoreColor(result.matching?.["0"]?.compatibility?.percentage || 0)}`}>
                  {result.matching?.["0"]?.compatibility?.level || getCompatibilityLevel(result.matching?.["0"]?.compatibility?.percentage || 0)}
                </div>
                <p className="text-sm text-gray-300">
                  {result.matching?.["0"]?.compatibility?.description || 'No description available'}
                </p>
              </div>
              
              {/* Total Guna Score */}
              <div className="bg-gray-900/50 rounded-lg p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-2" />
                    <span>Total Guna Score</span>
                  </div>
                  <div className="text-xl font-bold">
                    {result.matching?.["0"]?.totalGuna || 0}/36
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Minimum 18/36 required for marriage approval
                </div>
              </div>
            </div>

            {/* Guna Milan Table Component */}
            {result.matching?.["0"]?.gunaDetails && (
              <div className="bg-gray-800/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Target className="w-5 h-5 text-purple-400 mr-2" />
                  <h3 className="text-lg font-bold">Guna Milan (8 Kootas)</h3>
                </div>
                <GunaMilanTable gunaDetails={result.matching["0"].gunaDetails} />
              </div>
            )}

            {/* Couple Info */}
            <div className="grid grid-cols-2 gap-4">
              {/* Boy's Info */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Sun className="w-4 h-4 text-yellow-400 mr-2" />
                  <h4 className="font-bold">partner1</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="truncate" title={result.boyInfo?.name}>
                    <span className="text-gray-400">Name:</span> {result.boyInfo?.name}
                  </div>
                  <div>
                    <span className="text-gray-400">DOB:</span> {new Date(result.boyInfo?.dateOfBirth).toLocaleDateString('en-IN')}
                  </div>
                  <div>
                    <span className="text-gray-400">TOB:</span> {result.boyInfo?.timeOfBirth}
                  </div>
                  <div className="truncate" title={result.boyInfo?.placeOfBirth}>
                    <span className="text-gray-400">POB:</span> {result.boyInfo?.placeOfBirth}
                  </div>
                </div>
              </div>

              {/* Girl's Info */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <Moon className="w-4 h-4 text-blue-400 mr-2" />
                  <h4 className="font-bold">Partner2</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="truncate" title={result.girlInfo?.name}>
                    <span className="text-gray-400">Name:</span> {result.girlInfo?.name}
                  </div>
                  <div>
                    <span className="text-gray-400">DOB:</span> {new Date(result.girlInfo?.dateOfBirth).toLocaleDateString('en-IN')}
                  </div>
                  <div>
                    <span className="text-gray-400">TOB:</span> {result.girlInfo?.timeOfBirth}
                  </div>
                  <div className="truncate" title={result.girlInfo?.placeOfBirth}>
                    <span className="text-gray-400">POB:</span> {result.girlInfo?.placeOfBirth}
                  </div>
                </div>
              </div>
            </div>

            {/* Manglik Status */}
            {result.matching?.["0"]?.manglik && (
              <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-orange-400 mr-2" />
                  Manglik Status
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Boy</div>
                    <div className={`font-bold ${result.matching["0"].manglik.boy === 'Manglik' ? 'text-red-400' : 'text-green-400'}`}>
                      {result.matching["0"].manglik.boy}
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-400 mb-1">Girl</div>
                    <div className={`font-bold ${result.matching["0"].manglik.girl === 'Manglik' ? 'text-red-400' : 'text-green-400'}`}>
                      {result.matching["0"].manglik.girl}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-300">
                  {result.matching["0"].manglik.analysis}
                </p>
              </div>
            )}

            {/* Nadi Dosha */}
            {result.matching?.["0"]?.nadiDosha && (
              <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-blue-400 mr-2" />
                  Nadi Dosha Analysis
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Nadi Dosha Present:</span>
                    <span className={`font-bold ${result.matching["0"].nadiDosha.present ? 'text-red-400' : 'text-green-400'}`}>
                      {result.matching["0"].nadiDosha.present ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Dosha Type:</span>
                    <span className="font-medium">{result.matching["0"].nadiDosha.type}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-gray-300">Remedy:</span>
                    <span className="font-medium text-right flex-1 ml-4">{result.matching["0"].nadiDosha.remedy}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths */}
            {result.matching?.["0"]?.strengths && result.matching["0"].strengths.length > 0 && (
              <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
                  Strengths
                </h3>
                <div className="space-y-3">
                  {result.matching["0"].strengths.map((strength, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-green-900/30 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      <p className="text-gray-300">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {result.matching?.["0"]?.challenges && result.matching["0"].challenges.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                  Areas of Concern
                </h3>
                <div className="space-y-3">
                  {result.matching["0"].challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-yellow-900/30 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <AlertCircle className="w-3 h-3 text-yellow-400" />
                      </div>
                      <p className="text-gray-300">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Remedies */}
            {result.matching?.["0"]?.remedies && result.matching["0"].remedies.length > 0 && (
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
                  Suggested Remedies
                </h3>
                <div className="space-y-3">
                  {result.matching["0"].remedies.map((remedy, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-purple-900/30 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                        <span className="text-xs">📿</span>
                      </div>
                      <p className="text-gray-300">{remedy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Final Verdict */}
            {result.matching?.["0"]?.verdict && (
              <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-indigo-400 mr-2" />
                  Final Verdict
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {result.matching["0"].verdict}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={resetForm}
                className="py-3 bg-gray-800/50 rounded-xl font-medium hover:bg-gray-700/50 transition flex items-center justify-center"
              >
                <Users className="w-4 h-4 mr-2" />
                New Match
              </button>
              <button
                onClick={() => {
                  // Implement save/share functionality
                  const matchData = {
                    ...result,
                    generatedAt: new Date().toISOString()
                  };
                  localStorage.setItem('lastKundliMatch', JSON.stringify(matchData));
                  alert('Match result saved to your profile!');
                }}
                className="py-3 bg-gradient-to-r from-purple-700 to-violet-700 rounded-xl font-medium hover:from-purple-600 hover:to-violet-600 transition flex items-center justify-center"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Save Result
              </button>
            </div>

            {/* Generated Info */}
            <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-800">
              <p>Results are based on Vedic astrology calculations and should be considered as guidance only.</p>
              <p className="mt-1">Generated: {new Date(result.generatedAt).toLocaleString()}</p>
              <p>Source: {result.matching?.source || 'gemini'}</p>
            </div>
          </div>
        )}

        {/* Info when no result */}
        {!result && !loading && (
          <div className="bg-gray-800/30 rounded-xl p-6 mt-6">
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 text-purple-400 mr-3" />
              <div>
                <h3 className="text-lg font-bold">Ashtakoota Guna Milan</h3>
                <p className="text-sm text-gray-400">8 aspects of compatibility</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-green-400">≥ 30 Gunas</div>
                <div className="text-gray-400">Excellent Match</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-yellow-400">24-29 Gunas</div>
                <div className="text-gray-400">Good Match</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-orange-400">18-23 Gunas</div>
                <div className="text-gray-400">Acceptable</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="font-medium text-red-400">&lt; 18 Gunas</div>
                <div className="text-gray-400">Not Recommended</div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>• Minimum 18/36 Gunas required for marriage approval</p>
              <p>• Manglik dosha can affect marriage timing and harmony</p>
              <p>• Nadi dosha is considered most important among all</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KundliMatching;