import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Calendar, Clock, MapPin, Mail, Edit3, ArrowLeft, 
  Sparkles, Shield, Globe, Bell, Save, X, Loader2 
} from 'lucide-react';
import axios from '../utils/axios';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initial user data with fallback
  const [userData, setUserData] = useState({
    fullName: 'Priya Sharma',
    gender: 'Female',
    dateOfBirth: '1995-05-15',
    timeOfBirth: '14:30',
    placeOfBirth: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India'
    },
    email: 'priya@example.com',
    phoneNumber: '+91 9876543210',
    astrologyData: {
      sunSign: 'Taurus',
      moonSign: 'Cancer',
      risingSign: 'Leo',
      nakshatra: 'Rohini'
    },
    preferences: {
      notifications: true,
      newsletter: false,
      language: 'English'
    }
  });

  // Edit form data
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    timeOfBirth: '',
    city: '',
    state: '',
    email: '',
    phone: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/auth/userprofile');
      
      if (response.data.success) {
        const user = response.data.user;
        setUserData(user);
        // Initialize form data
        setFormData({
          fullName: user.fullName || '',
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
          timeOfBirth: user.timeOfBirth || '',
          city: user.placeOfBirth?.city || '',
          state: user.placeOfBirth?.state || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          age: user.age || '',
          zodiacSign: user.zodiacSign || ''

        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use local data if API fails
      const storedProfile = localStorage.getItem('astroveda_profile');
      if (storedProfile) {
        const user = JSON.parse(storedProfile);
        setUserData(user);
        setFormData({
          fullName: user.fullName || '',
          gender: user.gender || '',
          dateOfBirth: user.dateOfBirth || '',
          timeOfBirth: user.timeOfBirth || '',
          city: user.placeOfBirth?.city || '',
          state: user.placeOfBirth?.state || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          age: user.age || '',
          zodiacSign: user.zodiacSign || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setError('');
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
    if (formErrors.gender) {
      setFormErrors(prev => ({
        ...prev,
        gender: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    if (!formData.gender) {
      errors.gender = 'Please select your gender';
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      if (dob >= today) {
        errors.dateOfBirth = 'Date of birth must be in the past';
      }
    }
    
    if (formData.timeOfBirth) {
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(formData.timeOfBirth)) {
        errors.timeOfBirth = 'Please enter a valid time (HH:MM)';
      }
    }
    
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phoneNumber && !/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const apiData = {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth || undefined,
        placeOfBirth: {
          city: formData.city,
          state: formData.state,
          country: 'India'
        },
        email: formData.email || undefined,
        phone: formData.phoneNumber || undefined
      };
      
      const response = await axios.put('/auth/updateprofile', apiData);
      
      if (response.data.success) {
        // Update local state
        setUserData({
          ...userData,
          ...response.data.user
        });
        
        // Save to localStorage
        localStorage.setItem('astroveda_profile', JSON.stringify({
          ...userData,
          ...response.data.user
        }));
        
        setSuccess('Profile updated successfully!');
        setTimeout(() => {
          setIsEditMode(false);
          setSuccess('');
        }, 2000);
      }
    } catch (error) {
      console.error('Update error:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    setFormData({
      fullName: userData.fullName || '',
      gender: userData.gender || '',
      dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
      timeOfBirth: userData.timeOfBirth || '',
      city: userData.placeOfBirth?.city || '',
      state: userData.placeOfBirth?.state || '',
      email: userData.email || '',
      phone: userData.phoneNumber || ''
    });
    setFormErrors({});
    setError('');
    setIsEditMode(false);
  };

  // Format helpers
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 13);
    return maxDate.toISOString().split('T')[0];
  };

  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);
    return minDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-purple-300 text-lg font-light">Loading cosmic profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full mix-blend-multiply blur-2xl opacity-10"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-600 rounded-full mix-blend-multiply blur-2xl opacity-10"></div>
        
        {/* Small stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-4 px-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-purple-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          
          {/* Small logo */}
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h1 className="text-xl font-bold text-white tracking-wider">
              Astro<span className="text-purple-400">Veda</span>
            </h1>
          </div>
          
          <div className="w-10"></div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          {isEditMode ? 'Edit Profile' : 'My Profile'}
        </h1>
        <p className="text-purple-200 font-light">
          {isEditMode ? 'Update your astrological information' : 'View your cosmic profile'}
        </p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 max-w-md mx-auto pb-8">
        {/* Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-900/30 border border-green-500/50 rounded-xl text-green-300 text-sm">
            <p className="font-medium">✓ {success}</p>
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-xl shadow-purple-900/20 mb-6 overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 border-b border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="text-xl font-bold text-white bg-transparent border-b border-purple-500/50 focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-white">{userData.fullName}</h2>
                  )}
                  <p className="text-purple-300 text-sm">Astrological Profile</p>
                </div>
              </div>
              
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-700/30 hover:bg-purple-700/50 rounded-xl border border-purple-500/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-300 text-sm">Edit</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl border border-gray-700/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-300 text-sm">Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Personal Information */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-400" />
              <span>Personal Information</span>
            </h3>
            
            <div className="space-y-4">
              {/* Gender */}
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Gender</p>
                  {isEditMode ? (
                    <div className="flex space-x-3 mt-1">
                      {['male', 'female', 'other'].map((gender) => (
                        <button
                          key={gender}
                          type="button"
                          onClick={() => handleGenderSelect(gender)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                            formData.gender === gender
                              ? 'bg-purple-700 text-white'
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                          }`}
                        >
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white capitalize">{userData.gender}</p>
                  )}
                  {formErrors.gender && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.gender}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Email Address</p>
                  {isEditMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white mt-1 focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white">{userData.email || 'Not specified'}</p>
                  )}
                  {formErrors.email && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 mt-0.5"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Phone Number</p>
                  {isEditMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white mt-1 focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white">{userData.phoneNumber || 'Not specified'}</p>
                  )}
                  {formErrors.phone && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Date of Birth</p>
                  {isEditMode ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white mt-1 focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white">{formatDate(userData.dateOfBirth)}</p>
                  )}
                  {formErrors.dateOfBirth && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.dateOfBirth}</p>
                  )}
                </div>
              </div>

              {/* Time of Birth */}
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Time of Birth</p>
                  {isEditMode ? (
                    <input
                      type="time"
                      name="timeOfBirth"
                      value={formData.timeOfBirth}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white mt-1 focus:border-purple-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-white">{formatTime(userData.timeOfBirth)}</p>
                  )}
                  {formErrors.timeOfBirth && (
                    <p className="text-red-400 text-sm mt-1">{formErrors.timeOfBirth}</p>
                  )}
                </div>
              </div>

              {/* Place of Birth */}
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400">Place of Birth</p>
                  {isEditMode ? (
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full bg-gray-800/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-white">
                      {userData.placeOfBirth?.city && userData.placeOfBirth?.state
                        ? `${userData.placeOfBirth.city}, ${userData.placeOfBirth.state}`
                        : 'Not specified'}
                    </p>
                  )}
                  {(formErrors.city || formErrors.state) && (
                    <div className="space-y-1 mt-1">
                      {formErrors.city && <p className="text-red-400 text-sm">{formErrors.city}</p>}
                      {formErrors.state && <p className="text-red-400 text-sm">{formErrors.state}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          {userData.preferences && (
            <div className="p-6 border-t border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Bell className="w-5 h-5 text-purple-400" />
                <span>Preferences</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Notifications</span>
                  <div className={`px-3 py-1 rounded-full text-sm ${userData.preferences.notifications ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {userData.preferences.notifications ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Newsletter</span>
                  <div className={`px-3 py-1 rounded-full text-sm ${userData.preferences.newsletter ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                    {userData.preferences.newsletter ? 'Subscribed' : 'Not Subscribed'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Language</span>
                  <span className="text-white">{userData.preferences.language || 'English'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button (only in edit mode) */}
        {isEditMode && (
          <div className="space-y-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="group w-full relative overflow-hidden rounded-2xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
              <div className="relative bg-gradient-to-r from-purple-700 to-violet-700 text-white rounded-2xl px-8 py-4 flex items-center justify-center space-x-3 border border-purple-400/50 shadow-lg">
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 text-purple-200 animate-spin" />
                    <span className="text-lg font-bold">Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 text-purple-200" />
                    <span className="text-lg font-bold">Save Changes</span>
                  </>
                )}
              </div>
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-white rounded-xl py-3 border border-gray-700/50 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* View Mode Actions */}
        

        {/* Security Note */}
        <div className="mt-4 mb-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-800/30 rounded-full px-4 py-2 border border-purple-500/20">
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-light">Your cosmic data is securely encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;