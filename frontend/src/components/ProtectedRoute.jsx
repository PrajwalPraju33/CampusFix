import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#1e40af',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px auto',
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#475569', fontWeight: 500 }}>Authenticating CampusFix...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = requiredRole === 'ADMIN' ? '/admin/login' : '/student/login';
    return <Navigate to={redirectUrl} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // If student tries to access admin portal or vice-versa
    const targetUrl = user?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={targetUrl} replace />;
  }

  return children;
};
