import React, { useState } from 'react';
import { Phone, ArrowRight, Shield, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { sendOTP, verifyOTP, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (phoneNumber.length === 10) {
      try {
        await sendOTP(phoneNumber);
        setOtpSent(true);
        toast.success('OTP sent successfully!');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to send OTP');
      }
    } else {
      toast.error('Please enter a valid 10-digit phone number');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length === 6) {
      try {
        const response = await verifyOTP(phoneNumber, otp);
        toast.success('Login successful!');
        // Navigate to home or dashboard after successful login
        setTimeout(() => {
          navigate('/create-profile');
        }, 1500);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to verify OTP');
      }
    } else {
      toast.error('Please enter a valid 6-digit OTP');
    }
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers;
    }
    return numbers.slice(0, 10);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleOtpChange = (e) => {
    const numbers = e.target.value.replace(/\D/g, '');
    if (numbers.length <= 6) {
      setOtp(numbers);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-950 text-white pb-20 pt-6">
      {/* Main Content */}
      <div className="px-4 max-w-md mx-auto w-full">
        {/* Logo and Tagline */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">
              Astro<span className="text-purple-400">Veda</span>
            </h1>
          </div>
          <p className="text-gray-300 text-sm">Unlock your cosmic potential</p>
        </div>

        {/* Login Card */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6 space-y-6">
          
          {/* Module Numbers Section */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-300 text-xs text-center">{error}</p>
              </div>
            )}
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">MOBILE NUMBER</h2>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 rounded-xl border border-purple-500/40 p-5 space-y-4">
              <div className="flex items-center space-x-3 bg-gray-900/40 rounded-lg p-4 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-600/40 to-purple-900/40 rounded-lg border border-purple-500/40 flex-shrink-0">
                  <span className="text-sm font-bold text-purple-300">+91</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="9876 543210"
                  className="flex-1 bg-transparent text-xl font-semibold text-white placeholder-gray-500 outline-none tracking-wider"
                  maxLength="10"
                />
              </div>
              
              {/* Phone number indicator dots */}
              <div className="flex justify-center items-center space-x-2 pt-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i < phoneNumber.length 
                        ? 'bg-gradient-to-r from-purple-500 to-violet-500 scale-125 shadow-lg shadow-purple-500/50' 
                        : 'bg-gray-600/50'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* OTP Section (Conditional) */}
          {otpSent && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-center space-x-2">
                <Lock className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Enter Your OTP</h3>
              </div>
              
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-purple-500/30 p-4">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  {[1, 2, 3, 4, 5, 6].map((digit) => (
                    <div
                      key={digit}
                      className="w-11 h-11 bg-gray-800 rounded-lg border border-purple-500/30 flex items-center justify-center"
                    >
                      <input
                        type="text"
                        maxLength="1"
                        value={otp[digit - 1] || ''}
                        onChange={(e) => {
                          const newOtp = otp.split('');
                          newOtp[digit - 1] = e.target.value.replace(/\D/g, '');
                          setOtp(newOtp.join(''));
                        }}
                        className="w-full h-full bg-transparent text-center text-xl font-bold text-white outline-none"
                      />
                    </div>
                  ))}
                </div>
                
                <p className="text-center text-gray-400 text-xs">
                  Enter the 6-digit OTP sent to +91 {phoneNumber}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div>
            <button
              onClick={otpSent ? handleVerifyOTP : handleSendOTP}
              disabled={loading}
              className={`w-full relative overflow-hidden rounded-lg transition-all duration-300 ${
                loading ? 'cursor-not-allowed opacity-50' : 'hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg blur opacity-50 group-hover:opacity-70 transition duration-300"></div>
              
              {/* Button content */}
              <div className="relative bg-gradient-to-r from-purple-700 to-violet-700 text-white rounded-lg px-6 py-3 flex items-center justify-center space-x-2 border border-purple-400/50">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-purple-200 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                <span className="text-sm font-bold">
                  {loading ? (otpSent ? 'Verifying...' : 'Sending...') : (otpSent ? 'Verify OTP' : 'Get OTP')}
                </span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </div>
            </button>
            
            <p className="text-center text-gray-400 text-xs mt-2">
              {otpSent 
                ? 'Enter the code sent to your number' 
                : 'Click to generate your OTP'}
            </p>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3 border-t border-gray-700 pt-4">
            <p className="text-gray-400 text-xs">
              By continuing, you agree to our{' '}
              <a 
                href="#" 
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Terms & Privacy Policy
              </a>
            </p>
            
            {/* Reset option */}
            {otpSent && (
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                }}
                className="text-purple-400 hover:text-purple-300 text-xs transition-colors"
              >
                ← Use different number
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;