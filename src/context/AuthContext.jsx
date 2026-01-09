import React, { createContext, useContext, useState } from 'react';
import axios from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);

  const sendOTP = async (phoneNumber) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/auth/send-otp', {
        phoneNumber: phoneNumber,
      });
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
      throw err;
    }
  };

  const verifyOTP = async (phoneNumber, otp) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/auth/verify-otp', {
        phoneNumber: phoneNumber,
        otp: otp,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Update context state
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
      setLoading(false);

      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  };

  const isAuthenticated = !!accessToken && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        accessToken,
        refreshToken,
        sendOTP,
        verifyOTP,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
