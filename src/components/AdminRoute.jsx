// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a full-page loader while checking auth and profile
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900 text-white">
        <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
      </div>
    );
  }

  // 1. If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If logged in, but not an admin (or profile is still loading), redirect to dashboard
  if (user && (!profile || !profile.is_admin)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. If logged in AND is an admin, show the page
  return children;
}