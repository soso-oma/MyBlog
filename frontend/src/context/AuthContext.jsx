import React, { createContext, useState, useEffect } from 'react';

// Create the authentication context
export const AuthContext = createContext();

// AuthProvider component that wraps the app and provides auth state
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

  // Rehydrate auth from localStorage on first render
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuth(parsed);
        console.log("✅ Auth rehydrated from localStorage:", parsed);
      } catch (error) {
        console.error("❌ Failed to parse auth from localStorage", error);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // Login function
  const login = ({ user, token }) => {
    const authData = { user, token };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  // Logout function
  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ user: auth?.user, token: auth?.token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
