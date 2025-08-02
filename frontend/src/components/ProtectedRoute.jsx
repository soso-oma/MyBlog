import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext); // Access user from context
  const [checkingAuth, setCheckingAuth] = useState(true); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authData = JSON.parse(localStorage.getItem('auth'));
    const token = authData?.token;

    if (user && token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setCheckingAuth(false);
  }, [user]);

  if (checkingAuth) {
    return <div className="text-center p-8">Checking authentication...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
