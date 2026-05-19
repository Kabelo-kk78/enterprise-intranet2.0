import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('access_token');
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      const { access_token, user: userData } = response;
      
      localStorage.setItem('access_token', access_token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = !err.response
        ? 'Cannot connect to server. Make sure the backend is running on port 5000.'
        : err.response?.data?.error || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};