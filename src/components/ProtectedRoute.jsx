import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute - Ensures user is logged in before accessing protected pages
 * If user is not logged in (no accessToken), redirects to /login
 */
const ProtectedRoute = ({ element }) => {
  const accessToken = localStorage.getItem('accessToken');
  
  // If no access token, redirect to login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  
  // If token exists, render the protected component
  return element;
};

export default ProtectedRoute;
