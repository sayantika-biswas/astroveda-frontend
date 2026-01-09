import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, User, Calendar, Star, Heart, Moon, Sun, Edit3, LogOut, 
  TrendingUp, Shield, Wallet, BookOpen, Users, Globe, RefreshCw,
  ChevronRight, Sparkles, AlertCircle, Info
} from 'lucide-react';
import axios from '../utils/axios';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State for user data
  const [userData, setUserData] = useState(null);
  const [horoscope, setHoroscope] = useState(null);
  const [panchang, setPanchang] = useState(null);
  const [kundli, setKundli] = useState(null);
  const [dailyTips, setDailyTips] = useState([]);
  const [loading, setLoading] = useState({
    user: true,
    horoscope: true,
    panchang: true,
    kundli: true,
    tips: true
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [showKundliMatching, setShowKundliMatching] = useState(false);
  const [kundliMatchingForm, setKundliMatchingForm] = useState({
    partnerName: '',
    partnerDob: '',
    partnerTob: '',
    partnerPob: ''
  });
  const [kundliMatchingResult, setKundliMatchingResult] = useState(null);
  const [selectedRashifal, setSelectedRashifal] = useState('leo');
  const [rashifalData, setRashifalData] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchUserProfile();
    fetchHoroscope();
    fetchPanchang();
    fetchKundli();
    fetchDailyTips();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/auth/userprofile');
      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(prev => ({ ...prev, user: false }));
    }
  };

  const fetchHoroscope = async () => {
    try {
      const response = await axios.get('/astro/horoscope/daily');
      if (response.data.success) {
        setHoroscope(response.data);
      }
    } catch (error) {
      console.error('Error fetching horoscope:', error);
    } finally {
      setLoading(prev => ({ ...prev, horoscope: false }));
    }
  };

  const fetchPanchang = async () => {
    try {
      const response = await axios.get('/astro/panchang');
      if (response.data.success) {
        setPanchang(response.data);
      }
    } catch (error) {
      console.error('Error fetching panchang:', error);
    } finally {
      setLoading(prev => ({ ...prev, panchang: false }));
    }
  };

  const fetchKundli = async () => {
    try {
      const response = await axios.get('/astro/kundli');
      if (response.data.success) {
        setKundli(response.data);
      }
    } catch (error) {
      console.error('Error fetching kundli:', error);
    } finally {
      setLoading(prev => ({ ...prev, kundli: false }));
    }
  };

  const fetchDailyTips = async () => {
    try {
      const response = await axios.get('/astro/daily-tips');
      if (response.data.success) {
        setDailyTips(response.data.tips);
      }
    } catch (error) {
      console.error('Error fetching daily tips:', error);
    } finally {
      setLoading(prev => ({ ...prev, tips: false }));
    }
  };

  const fetchRashifal = async (zodiacSign) => {
    try {
      const response = await axios.get(`/astro/${zodiacSign}`);
      if (response.data.success) {
        setRashifalData(response.data);
      }
    } catch (error) {
      console.error('Error fetching rashifal:', error);
    }
  };

  const handleKundliMatching = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/astro/kundli-matching', kundliMatchingForm);
      if (response.data.success) {
        setKundliMatchingResult(response.data);
      }
    } catch (error) {
      console.error('Error matching kundli:', error);
      alert('Error matching kundli. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('isProfileComplete');
    navigate('/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString;
  };

  const refreshData = () => {
    setLoading({
      user: true,
      horoscope: true,
      panchang: true,
      kundli: true,
      tips: true
    });
    fetchHoroscope();
    fetchPanchang();
    fetchDailyTips();
  };

  const zodiacSigns = [
    { id: 'aries', name: 'Aries', emoji: '♈' },
    { id: 'taurus', name: 'Taurus', emoji: '♉' },
    { id: 'gemini', name: 'Gemini', emoji: '♊' },
    { id: 'cancer', name: 'Cancer', emoji: '♋' },
    { id: 'leo', name: 'Leo', emoji: '♌' },
    { id: 'virgo', name: 'Virgo', emoji: '♍' },
    { id: 'libra', name: 'Libra', emoji: '♎' },
    { id: 'scorpio', name: 'Scorpio', emoji: '♏' },
    { id: 'sagittarius', name: 'Sagittarius', emoji: '♐' },
    { id: 'capricorn', name: 'Capricorn', emoji: '♑' },
    { id: 'aquarius', name: 'Aquarius', emoji: '♒' },
    { id: 'pisces', name: 'Pisces', emoji: '♓' }
  ];

  // Loading skeleton
  if (loading.user && !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-white text-xl">Loading your cosmic dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-800/80 to-purple-900/80 backdrop-blur-lg border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-8 h-8 text-purple-400" />
                <div>
                  <h1 className="text-2xl font-bold">
                    Astro<span className="text-purple-400">Veda</span>
                  </h1>
                  <p className="text-gray-300 text-sm">Cosmic Dashboard</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-purple-900/30 px-3 py-1 rounded-full">
                <Sun className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">
                  {panchang ? panchang.date : 'Loading...'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 bg-purple-700/50 hover:bg-purple-700/70 px-4 py-2 rounded-xl transition"
                disabled={Object.values(loading).some(l => l)}
              >
                <RefreshCw className={`w-4 h-4 ${Object.values(loading).some(l => l) ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-700/50 hover:bg-red-700/70 px-4 py-2 rounded-xl transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - User Profile & Navigation */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
              {userData && (
                <>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {userData.fullName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{userData.fullName}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-purple-300">{userData.zodiacSign}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-300">{userData.age} years</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Gender</span>
                      <span className="capitalize">{userData.gender}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Birth Date</span>
                      <span>{formatDate(userData.dateOfBirth)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Birth Time</span>
                      <span>{formatTime(userData.timeOfBirth)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Birth Place</span>
                      <span>{userData.placeOfBirth?.city}, {userData.placeOfBirth?.state}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/create-profile')}
                    className="w-full mt-6 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 px-4 py-3 rounded-xl transition"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-4">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-purple-400" />
                Navigation
              </h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                    activeTab === 'overview' 
                      ? 'bg-purple-700/30 border border-purple-500/50' 
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-3" />
                    <span>Overview</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('horoscope')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                    activeTab === 'horoscope' 
                      ? 'bg-purple-700/30 border border-purple-500/50' 
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-3" />
                    <span>Horoscope</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('panchang')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                    activeTab === 'panchang' 
                      ? 'bg-purple-700/30 border border-purple-500/50' 
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span>Panchang</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('kundli')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                    activeTab === 'kundli' 
                      ? 'bg-purple-700/30 border border-purple-500/50' 
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <Moon className="w-4 h-4 mr-3" />
                    <span>Kundli</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('rashifal')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
                    activeTab === 'rashifal' 
                      ? 'bg-purple-700/30 border border-purple-500/50' 
                      : 'hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-3" />
                    <span>Rashifal</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            </div>

            {/* Daily Quote */}
            <div className="bg-gradient-to-br from-purple-800/50 to-violet-800/50 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
              <Sparkles className="w-8 h-8 text-yellow-400 mb-3" />
              <p className="text-lg italic mb-2">
                "The stars incline, they do not compel."
              </p>
              <p className="text-sm text-gray-300">- Astrological Proverb</p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-purple-700/30 to-violet-700/30 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Welcome back, {userData?.fullName?.split(' ')[0]}! ✨
                      </h2>
                      <p className="text-gray-300">
                        Your cosmic insights for {panchang ? panchang.date : 'today'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-300">
                        {userData?.zodiacSign}
                      </div>
                      <div className="text-sm text-gray-300">Your Zodiac Sign</div>
                    </div>
                  </div>
                </div>

                {/* Daily Horoscope Summary */}
                {horoscope && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                      <div className="flex items-center mb-4">
                        <TrendingUp className="w-6 h-6 text-green-400 mr-3" />
                        <h3 className="text-lg font-bold">Finance</h3>
                      </div>
                      <p className="text-gray-300">
                        {horoscope.horoscope?.categories?.finance || 'Review your financial plans today'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                      <div className="flex items-center mb-4">
                        <Shield className="w-6 h-6 text-blue-400 mr-3" />
                        <h3 className="text-lg font-bold">Health</h3>
                      </div>
                      <p className="text-gray-300">
                        {horoscope.horoscope?.categories?.health || 'Focus on balanced diet and exercise'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                      <div className="flex items-center mb-4">
                        <Heart className="w-6 h-6 text-pink-400 mr-3" />
                        <h3 className="text-lg font-bold">Relationships</h3>
                      </div>
                      <p className="text-gray-300">
                        {dailyTips.find(tip => tip.category === 'Relationships')?.tip || 'Connect with loved ones today'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Today's Panchang */}
                {panchang && (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-purple-400" />
                        Today's Panchang
                      </h3>
                      <div className="text-sm text-gray-400">
                        {panchang.date}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">{panchang.panchang?.tithi}</div>
                        <div className="text-sm text-gray-400 mt-1">Tithi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">{panchang.panchang?.nakshatra}</div>
                        <div className="text-sm text-gray-400 mt-1">Nakshatra</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">{panchang.panchang?.sunrise}</div>
                        <div className="text-sm text-gray-400 mt-1">Sunrise</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-300">{panchang.panchang?.sunset}</div>
                        <div className="text-sm text-gray-400 mt-1">Sunset</div>
                      </div>
                    </div>
                    <div className="mt-6 p-4 bg-purple-900/30 rounded-xl">
                      <p className="text-gray-300">{panchang.panchang?.guidance}</p>
                    </div>
                  </div>
                )}

                {/* Daily Tips */}
                {dailyTips.length > 0 && (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
                      Today's Cosmic Tips
                    </h3>
                    <div className="space-y-4">
                      {dailyTips.map((tip, index) => (
                        <div key={index} className="p-4 bg-gray-800/50 rounded-xl">
                          <div className="flex items-start">
                            <Sparkles className="w-5 h-5 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
                            <div>
                              <h4 className="font-bold text-purple-300 mb-1">{tip.category}</h4>
                              <p className="text-gray-300 mb-2">{tip.tip}</p>
                              <p className="text-sm text-green-300">
                                <span className="font-medium">Benefit: </span>
                                {tip.benefit}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                  <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab('kundli')}
                      className="bg-gradient-to-r from-purple-700/50 to-violet-700/50 hover:from-purple-600 hover:to-violet-600 p-4 rounded-xl text-center transition"
                    >
                      <Moon className="w-8 h-8 mx-auto mb-2" />
                      <div>View Kundli</div>
                    </button>
                    
                    <button
                      onClick={() => setShowKundliMatching(true)}
                      className="bg-gradient-to-r from-purple-700/50 to-violet-700/50 hover:from-purple-600 hover:to-violet-600 p-4 rounded-xl text-center transition"
                    >
                      <Heart className="w-8 h-8 mx-auto mb-2" />
                      <div>Kundli Matching</div>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('rashifal')}
                      className="bg-gradient-to-r from-purple-700/50 to-violet-700/50 hover:from-purple-600 hover:to-violet-600 p-4 rounded-xl text-center transition"
                    >
                      <Users className="w-8 h-8 mx-auto mb-2" />
                      <div>All Rashifal</div>
                    </button>
                    
                    <button
                      onClick={() => navigate('/create-profile')}
                      className="bg-gradient-to-r from-purple-700/50 to-violet-700/50 hover:from-purple-600 hover:to-violet-600 p-4 rounded-xl text-center transition"
                    >
                      <User className="w-8 h-8 mx-auto mb-2" />
                      <div>Edit Profile</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Horoscope Tab */}
            {activeTab === 'horoscope' && (
              <div className="space-y-6">
                {loading.horoscope ? (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-300">Loading your daily horoscope...</p>
                  </div>
                ) : horoscope ? (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Daily Horoscope</h2>
                        <p className="text-gray-300">{horoscope.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-300">{horoscope.user?.zodiacSign}</div>
                        <div className="text-sm text-gray-300">for {horoscope.user?.name}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(horoscope.horoscope?.categories || {}).map(([category, prediction]) => (
                        <div key={category} className="bg-gray-800/50 rounded-xl p-5">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                              {category === 'finance' && <Wallet className="w-5 h-5 text-green-400" />}
                              {category === 'health' && <Shield className="w-5 h-5 text-blue-400" />}
                              {category === 'love' && <Heart className="w-5 h-5 text-pink-400" />}
                              {category === 'career' && <TrendingUp className="w-5 h-5 text-yellow-400" />}
                            </div>
                            <h3 className="text-lg font-bold capitalize">{category}</h3>
                          </div>
                          <p className="text-gray-300">{prediction}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-purple-900/30 rounded-xl">
                      <div className="flex items-center mb-2">
                        <Info className="w-5 h-5 text-blue-400 mr-2" />
                        <h4 className="font-bold">Cosmic Guidance</h4>
                      </div>
                      <p className="text-gray-300">{horoscope.panchang?.guidance || 'Follow your intuition today.'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Horoscope Unavailable</h3>
                    <p className="text-gray-300">Unable to fetch your daily horoscope at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Panchang Tab */}
            {activeTab === 'panchang' && (
              <div className="space-y-6">
                {loading.panchang ? (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-300">Loading panchang...</p>
                  </div>
                ) : panchang ? (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Today's Panchang</h2>
                        <p className="text-gray-300">{panchang.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-300">Hindu Calendar</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Tithi</div>
                        <div className="text-2xl font-bold text-white">{panchang.panchang?.tithi}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Nakshatra</div>
                        <div className="text-2xl font-bold text-white">{panchang.panchang?.nakshatra}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Sunrise</div>
                        <div className="text-2xl font-bold text-white">{panchang.panchang?.sunrise}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Sunset</div>
                        <div className="text-2xl font-bold text-white">{panchang.panchang?.sunset}</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-xl p-4 text-center">
                        <div className="text-sm text-gray-400 mb-1">Rahu Kaal</div>
                        <div className="text-lg font-bold text-white">
                          {panchang.panchang?.rahuKaal?.start} - {panchang.panchang?.rahuKaal?.end}
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-900/30 rounded-xl p-5">
                      <div className="flex items-center mb-3">
                        <Info className="w-5 h-5 text-blue-400 mr-2" />
                        <h3 className="text-lg font-bold">Guidance</h3>
                      </div>
                      <p className="text-gray-300">{panchang.panchang?.guidance}</p>
                    </div>

                    {panchang.panchang?.festivals && panchang.panchang.festivals.length > 0 && (
                      <div className="bg-yellow-900/20 rounded-xl p-5 mt-6">
                        <div className="flex items-center mb-3">
                          <Calendar className="w-5 h-5 text-yellow-400 mr-2" />
                          <h3 className="text-lg font-bold">Today's Festivals</h3>
                        </div>
                        <div className="space-y-2">
                          {panchang.panchang.festivals.map((festival, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                              <span className="text-gray-300">{festival}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Panchang Unavailable</h3>
                    <p className="text-gray-300">Unable to fetch panchang at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* Kundli Tab */}
            {activeTab === 'kundli' && (
              <div className="space-y-6">
                {loading.kundli ? (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-gray-300">Loading your Kundli...</p>
                  </div>
                ) : kundli ? (
                  <>
                    {/* Personal Info */}
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                      <h2 className="text-2xl font-bold mb-6">Your Kundli</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-bold mb-4">Personal Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Name</span>
                              <span>{kundli.personalInfo?.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Date of Birth</span>
                              <span>{formatDate(kundli.personalInfo?.dateOfBirth)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Time of Birth</span>
                              <span>{formatTime(kundli.personalInfo?.timeOfBirth)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Place of Birth</span>
                              <span>{kundli.personalInfo?.placeOfBirth}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold mb-4">Astrological Details</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Ascendant (Lagna)</span>
                              <span className="text-purple-300">{kundli.kundli?.["0"]?.ascendant?.sign}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Moon Sign</span>
                              <span className="text-purple-300">{kundli.kundli?.["0"]?.moonSign?.sign}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Current Dasha</span>
                              <span className="text-purple-300">{kundli.kundli?.["0"]?.currentDasha?.planet}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Planetary Positions */}
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                      <h3 className="text-lg font-bold mb-4">Planetary Positions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {kundli.kundli?.["0"]?.planetaryPositions?.map((planet, index) => (
                          <div key={index} className="bg-gray-800/50 rounded-xl p-4">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-2">
                                <span className="text-sm font-bold">{planet.planet.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-bold">{planet.planet}</div>
                                <div className="text-sm text-gray-400">{planet.sign}</div>
                              </div>
                            </div>
                            <div className="text-sm mt-2">
                              <div className="flex justify-between">
                                <span className="text-gray-400">House</span>
                                <span>{planet.house}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">Degree</span>
                                <span>{planet.degree}°</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Predictions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                        <h3 className="text-lg font-bold mb-4">Predictions</h3>
                        <div className="space-y-4">
                          {Object.entries(kundli.kundli?.["0"]?.predictions || {}).map(([area, prediction]) => (
                            <div key={area} className="bg-gray-800/30 rounded-lg p-4">
                              <h4 className="font-bold text-purple-300 mb-2 capitalize">{area}</h4>
                              <p className="text-gray-300 text-sm">{prediction}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Remedies */}
                      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                        <h3 className="text-lg font-bold mb-4">Suggested Remedies</h3>
                        <div className="space-y-3">
                          {kundli.kundli?.["0"]?.remedies?.map((remedy, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-6 h-6 rounded-full bg-yellow-900/30 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                                <span className="text-xs">📿</span>
                              </div>
                              <p className="text-gray-300">{remedy}</p>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6">
                          <h4 className="font-bold mb-3">Planet Strengths</h4>
                          <div className="space-y-2">
                            {kundli.kundli?.["0"]?.planetStrengths?.map((planet, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-gray-300">{planet.planet}</span>
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                  planet.strength === 'Strong' ? 'bg-green-900/30 text-green-400' :
                                  planet.strength === 'Weak' ? 'bg-red-900/30 text-red-400' :
                                  'bg-yellow-900/30 text-yellow-400'
                                }`}>
                                  {planet.strength}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Kundli Unavailable</h3>
                    <p className="text-gray-300">Unable to generate your Kundli at the moment.</p>
                  </div>
                )}

                {/* Kundli Matching Section */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Kundli Matching</h3>
                    <button
                      onClick={() => setShowKundliMatching(!showKundliMatching)}
                      className="bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 px-4 py-2 rounded-xl transition"
                    >
                      {showKundliMatching ? 'Hide Form' : 'Match Kundli'}
                    </button>
                  </div>

                  {showKundliMatching && (
                    <div className="space-y-6">
                      <form onSubmit={handleKundliMatching} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-300 mb-2">Partner's Name</label>
                            <input
                              type="text"
                              value={kundliMatchingForm.partnerName}
                              onChange={(e) => setKundliMatchingForm(prev => ({ ...prev, partnerName: e.target.value }))}
                              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                              placeholder="Enter partner's name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Date of Birth</label>
                            <input
                              type="date"
                              value={kundliMatchingForm.partnerDob}
                              onChange={(e) => setKundliMatchingForm(prev => ({ ...prev, partnerDob: e.target.value }))}
                              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Time of Birth</label>
                            <input
                              type="time"
                              value={kundliMatchingForm.partnerTob}
                              onChange={(e) => setKundliMatchingForm(prev => ({ ...prev, partnerTob: e.target.value }))}
                              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-gray-300 mb-2">Place of Birth</label>
                            <input
                              type="text"
                              value={kundliMatchingForm.partnerPob}
                              onChange={(e) => setKundliMatchingForm(prev => ({ ...prev, partnerPob: e.target.value }))}
                              className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                              placeholder="City, State, Country"
                              required
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-700 to-violet-700 hover:from-purple-600 hover:to-violet-600 px-6 py-3 rounded-xl font-bold transition"
                        >
                          Match Kundli
                        </button>
                      </form>

                      {kundliMatchingResult && (
                        <div className="mt-6 p-6 bg-purple-900/30 rounded-xl">
                          <h4 className="text-lg font-bold mb-4">Matching Results</h4>
                          {/* Display matching results here */}
                          <p className="text-gray-300">Kundli matching results will be displayed here.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rashifal Tab */}
            {activeTab === 'rashifal' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6">
                  <h2 className="text-2xl font-bold mb-6">Monthly Rashifal</h2>
                  
                  {/* Zodiac Sign Selector */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold mb-4">Select Zodiac Sign</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {zodiacSigns.map((sign) => (
                        <button
                          key={sign.id}
                          onClick={() => {
                            setSelectedRashifal(sign.id);
                            fetchRashifal(sign.id);
                          }}
                          className={`p-4 rounded-xl text-center transition ${
                            selectedRashifal === sign.id
                              ? 'bg-gradient-to-r from-purple-700 to-violet-700'
                              : 'bg-gray-800/50 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="text-2xl mb-1">{sign.emoji}</div>
                          <div className="text-sm font-medium">{sign.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rashifal Display */}
                  {selectedRashifal && (
                    <div className="space-y-6">
                      {rashifalData ? (
                        <div>
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="text-4xl mr-4">
                                {zodiacSigns.find(s => s.id === selectedRashifal)?.emoji}
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold capitalize">
                                  {zodiacSigns.find(s => s.id === selectedRashifal)?.name}
                                </h3>
                                <p className="text-gray-300">Monthly Predictions</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">Period</div>
                              <div className="font-bold">{rashifalData.period || 'This Month'}</div>
                            </div>
                          </div>

                          {/* Predictions by Category */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {rashifalData.predictions?.["0"]?.predictions && Object.entries(rashifalData.predictions["0"].predictions).map(([category, prediction]) => (
                              <div key={category} className="bg-gray-800/50 rounded-xl p-5">
                                <h4 className="font-bold text-lg mb-3 capitalize">{category}</h4>
                                <p className="text-gray-300">{prediction}</p>
                              </div>
                            ))}
                          </div>

                          {/* Additional Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {rashifalData.predictions?.["0"]?.luckyDays && (
                              <div className="bg-purple-900/30 rounded-xl p-5">
                                <h4 className="font-bold text-lg mb-3">Lucky Days</h4>
                                <div className="flex flex-wrap gap-2">
                                  {rashifalData.predictions["0"].luckyDays.map((day, index) => (
                                    <span key={index} className="bg-purple-800/50 px-3 py-1 rounded-full">
                                      {day}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {rashifalData.predictions?.["0"]?.precautions && (
                              <div className="bg-yellow-900/20 rounded-xl p-5">
                                <h4 className="font-bold text-lg mb-3">Precautions</h4>
                                <ul className="space-y-2">
                                  {rashifalData.predictions["0"].precautions.map((precaution, index) => (
                                    <li key={index} className="flex items-start">
                                      <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 mt-2"></div>
                                      <span className="text-gray-300">{precaution}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* General Advice */}
                          {rashifalData.predictions?.["0"]?.advice && (
                            <div className="mt-6 p-5 bg-blue-900/20 rounded-xl">
                              <h4 className="font-bold text-lg mb-3">Advice</h4>
                              <p className="text-gray-300">{rashifalData.predictions["0"].advice}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-4xl mb-4">
                            {zodiacSigns.find(s => s.id === selectedRashifal)?.emoji}
                          </div>
                          <p className="text-gray-300">
                            Click on a zodiac sign to view predictions
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;