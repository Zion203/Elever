import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Authentication Context
 * Manages user authentication state and Google OAuth
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated
   */
  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/status');
      if (response.data.isAuthenticated) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initiate Google OAuth login
   */
  const login = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://elever.onrender.com';
    window.location.href = `${apiUrl}/auth/google`;
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await api.get('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local state even if server request fails
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  /**
   * Check if user is admin
   */
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    isAdmin,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
