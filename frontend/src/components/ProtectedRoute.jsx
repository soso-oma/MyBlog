import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext); // Access user from AuthContext
  const [checkingAuth, setCheckingAuth] = useState(true); //Tracks if auth check is in progress
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth status

  useEffect(() => {
    const token = localStorage.getItem('token'); // Check token from localStorage

    // Determine auth status based on presence of user and token
    if (user && token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setCheckingAuth(false); //Done checking auth
  }, [user]); //Re-run check when user changes

  //While checking authentication, show loading message
  if (checkingAuth) {
    return <div className="text-center p-8">Checking authentication...</div>;
  }

  // If authenticated, show the protected children, If not authenticated, redirect to login page
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
