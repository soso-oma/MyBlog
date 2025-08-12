import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);

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

  // Login 
  const login = ({ user, token }) => {
    const authData = { user, token };
    setAuth(authData);
    localStorage.setItem('auth', JSON.stringify(authData));
  };

  // Logout 
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
