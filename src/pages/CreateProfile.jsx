import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Clock, MapPin, Sparkles, Loader2, Mail } from 'lucide-react';
import axios from '../utils/axios';

const CreateProfile = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    email: '',
    cityState: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (serverError) setServerError('');
  };

  const handleGenderSelect = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
    if (errors.gender) {
      setErrors(prev => ({
        ...prev,
        gender: ''
      }));
    }
  };

  const parseCityState = (cityStateString) => {
    // Split by comma and clean up whitespace
    const parts = cityStateString.split(',').map(part => part.trim());
    if (parts.length >= 2) {
      return {
        city: parts[0],
        state: parts[1],
        country: 'India'
      };
    } else if (parts.length === 1) {
      return {
        city: parts[0],
        state: '',
        country: 'India'
      };
    }
    return {
      city: '',
      state: '',
      country: 'India'
    };
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      
      if (dob >= today) {
        newErrors.dateOfBirth = 'Date of birth must be in the past';
      } else {
        // Calculate age
        const age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
        
        const adjustedAge = (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) ? age - 1 : age;
        
        if (adjustedAge < 13) {
          newErrors.dateOfBirth = 'You must be at least 13 years old';
        }
      }
    }
    
    if (formData.timeOfBirth) {
      // Native time input already validates format
      const time = new Date(`2000-01-01T${formData.timeOfBirth}`);
      if (isNaN(time.getTime())) {
        newErrors.timeOfBirth = 'Please enter a valid time';
      }
    }
    
    if (!formData.cityState.trim()) {
      newErrors.cityState = 'City and state are required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForAPI = (dateString) => {
    // Date input returns yyyy-mm-dd, which is perfect for backend
    return dateString;
  };

  const formatDateForDisplay = (dateString) => {
    // Convert yyyy-mm-dd to dd/mm/yyyy for display if needed
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for backend
      const placeOfBirthData = parseCityState(formData.cityState);
      const apiData = {
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formatDateForAPI(formData.dateOfBirth),
        timeOfBirth: formData.timeOfBirth || undefined,
        placeOfBirth: placeOfBirthData,
        email: formData.email || undefined
      };
      
      // Remove undefined fields
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === undefined) {
          delete apiData[key];
        }
      });
      
      console.log('Sending profile data:', apiData);
      
      // Make PUT request to update profile
      const response = await axios.put('/auth/updateprofile', apiData);
      
      if (response.data.success) {
        console.log('Profile created successfully:', response.data);
        
        // Store user data in localStorage if needed
        localStorage.setItem('userProfile', JSON.stringify(response.data.user));
        localStorage.setItem('isProfileComplete', 'true');
        
        // Show success message
        alert('Profile created successfully!');
        
        // Navigate to dashboard
        navigate('/');
      } else {
        throw new Error(response.data.message || 'Failed to create profile');
      }
      
    } catch (error) {
      console.error('Profile creation error:', error);
      
      if (error.response) {
        const errorData = error.response.data;
        
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const backendErrors = {};
          errorData.errors.forEach(err => {
            if (err.includes('fullName')) backendErrors.fullName = err;
            else if (err.includes('gender')) backendErrors.gender = err;
            else if (err.includes('dateOfBirth')) backendErrors.dateOfBirth = err;
            else if (err.includes('timeOfBirth')) backendErrors.timeOfBirth = err;
            else if (err.includes('email')) backendErrors.email = err;
            else if (err.includes('place of birth')) backendErrors.cityState = err;
          });
          setErrors(backendErrors);
        } else if (errorData.message) {
          setServerError(errorData.message);
        } else {
          setServerError('Failed to create profile. Please try again.');
        }
      } else if (error.request) {
        setServerError('Network error. Please check your connection and try again.');
      } else {
        setServerError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate max date for date picker (must be at least 13 years old)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setFullYear(today.getFullYear() - 13);
    return maxDate.toISOString().split('T')[0]; // Format: yyyy-mm-dd
  };

  // Calculate min date (reasonable limit - 120 years ago)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120);
    return minDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse" 
             style={{ animationDelay: '2s' }}></div>
        
        {/* Stars */}
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          ></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-float">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-5xl font-bold text-white tracking-wider">
              Astro<span className="text-purple-400">Veda</span>
            </h1>
          </div>
          <p className="text-xl text-purple-200 font-light tracking-wider">
            Begin your cosmic journey
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/40 p-8">
          {serverError && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-300 text-sm">
              <p className="font-medium">Error: {serverError}</p>
              <p className="mt-1 text-xs">Please check your information and try again.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-white font-medium">
                <User className="w-5 h-5 text-purple-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all ${
                  errors.fullName 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-purple-500/30 focus:border-purple-500'
                }`}
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <label className="flex items-center space-x-2 text-white font-medium">
                <span>Gender</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' }
                ].map((genderOption) => (
                  <button
                    key={genderOption.value}
                    type="button"
                    onClick={() => handleGenderSelect(genderOption.value)}
                    disabled={isLoading}
                    className={`py-3 rounded-xl border transition-all ${
                      formData.gender === genderOption.value
                        ? 'bg-purple-700/30 border-purple-500 text-white'
                        : 'bg-gray-800/50 border-purple-500/30 text-gray-300 hover:border-purple-500 hover:text-white'
                    } ${errors.gender ? 'border-red-500' : ''} ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {genderOption.label}
                  </button>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-400 text-sm">{errors.gender}</p>
              )}
            </div>

            {/* Date and Time of Birth */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <span>Date of Birth</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    disabled={isLoading}
                    className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all appearance-none ${
                      errors.dateOfBirth 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-purple-500/30 focus:border-purple-500'
                    } ${isLoading ? 'opacity-50' : ''}`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                {errors.dateOfBirth && (
                  <p className="text-red-400 text-sm">{errors.dateOfBirth}</p>
                )}
                {formData.dateOfBirth && (
                  <p className="text-gray-400 text-xs">
                    Selected: {formatDateForDisplay(formData.dateOfBirth)}
                  </p>
                )}
              </div>

              {/* Time of Birth */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-white font-medium">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <span>Time of Birth</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    name="timeOfBirth"
                    value={formData.timeOfBirth}
                    onChange={handleChange}
                    disabled={isLoading}
                    className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all appearance-none ${
                      errors.timeOfBirth 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-purple-500/30 focus:border-purple-500'
                    } ${isLoading ? 'opacity-50' : ''}`}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                {errors.timeOfBirth && (
                  <p className="text-red-400 text-sm">{errors.timeOfBirth}</p>
                )}
                <p className="text-gray-400 text-xs">Optional - 24-hour format</p>
              </div>
            </div>

            {/* Optional Email Field */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-white font-medium">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>Email Address (Optional)</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                disabled={isLoading}
                className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-purple-500/30 focus:border-purple-500'
                } ${isLoading ? 'opacity-50' : ''}`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email}</p>
              )}
            </div>

            {/* City, State */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-white font-medium">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span>City, State</span>
              </label>
              <input
                type="text"
                name="cityState"
                value={formData.cityState}
                onChange={handleChange}
                placeholder="Mumbai, Maharashtra"
                disabled={isLoading}
                className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none transition-all ${
                  errors.cityState 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-purple-500/30 focus:border-purple-500'
                } ${isLoading ? 'opacity-50' : ''}`}
              />
              {errors.cityState && (
                <p className="text-red-400 text-sm">{errors.cityState}</p>
              )}
              <p className="text-gray-400 text-xs">Example: Delhi, Delhi or Bangalore, Karnataka</p>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full relative overflow-hidden rounded-2xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 rounded-2xl blur opacity-60 group-hover:opacity-80 transition duration-300"></div>
                
                {/* Button content */}
                <div className="relative bg-gradient-to-r from-purple-700 to-violet-700 text-white rounded-2xl px-8 py-4 flex items-center justify-center space-x-3 border border-purple-400/50 shadow-lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 text-purple-200 animate-spin" />
                      <span className="text-xl font-bold tracking-widest">
                        Creating Profile...
                      </span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-purple-200" />
                      <span className="text-xl font-bold tracking-widest">
                        Create Profile
                      </span>
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Optional: Skip for now */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                disabled={isLoading}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip for now →
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-4">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <div className="text-purple-300 text-sm font-light tracking-wider">
              Your cosmic identity • Protected • Encrypted
            </div>
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" 
                 style={{ animationDelay: '1s' }}></div>
          </div>
          
          <p className="text-gray-500 text-xs mt-4">
            This information helps us create accurate astrological readings
          </p>
        </div>
      </div>

      {/* Custom styles for date/time inputs */}
      <style jsx global>{`
        /* Custom styles for date and time inputs */
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        
        /* Hide default dropdown arrows in Firefox */
        input[type="date"]::-moz-calendar-picker-indicator,
        input[type="time"]::-moz-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        
        /* Custom placeholder text for date input */
        input[type="date"]:not(:valid):before {
          content: attr(placeholder);
          color: #6B7280; /* Tailwind gray-500 */
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        
        /* Custom placeholder text for time input */
        input[type="time"]:not(:valid):before {
          content: attr(placeholder);
          color: #6B7280; /* Tailwind gray-500 */
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        
        /* For Firefox */
        input[type="date"]:invalid:before,
        input[type="time"]:invalid:before {
          content: attr(placeholder);
          color: #6B7280;
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default CreateProfile;