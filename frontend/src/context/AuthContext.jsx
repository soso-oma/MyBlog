import React, { createContext, useState, useEffect } from 'react';

// Creates the authentication context
export const AuthContext = createContext();

// AuthProvider component that wraps around the app and provides auth state
export const AuthProvider = ({ children }) => {
  // Initializes auth state from localStorage 
  const [auth, setAuth] = useState(() => {
    try {
      const stored = localStorage.getItem('auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // When user logs in; sets auth state and stores it in localStorage
  const login = ({ user, token }) => {
    const authData = { user, token };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  // When user logs out; clears auth state and removes it from localStorage
  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  // ProvideS auth values and methods to child components
  return (
    <AuthContext.Provider value={{ user: auth?.user, token: auth?.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
