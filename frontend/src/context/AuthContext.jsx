import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('cf_token');
    const savedUser = localStorage.getItem('cf_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('cf_token');
        localStorage.removeItem('cf_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const authData = await api.login(credentials);
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('cf_token', authData.token);
    localStorage.setItem('cf_user', JSON.stringify(authData));
    return authData;
  };

  const register = async (studentData) => {
    const authData = await api.register(studentData);
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('cf_token', authData.token);
    localStorage.setItem('cf_user', JSON.stringify(authData));
    return authData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('cf_token');
    localStorage.removeItem('cf_user');
  };

  const isStudent = user && user.role === 'STUDENT';
  const isAdmin = user && user.role === 'ADMIN';
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isStudent,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
