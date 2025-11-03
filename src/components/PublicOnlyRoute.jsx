// src/components/PublicOnlyRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // 👈 Make sure this path is correct

/**
 * A wrapper for routes that should ONLY be visible to non-authenticated users.
 * If the user is authenticated, they are redirected to the /dashboard page.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if not authenticated.
 */
const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth(); // Get user from our auth context

  if (user) {
    // If user is logged in, redirect them away from this public-only page
    return <Navigate to="/dashboard" replace />;
  }

  // If not logged in, render the component they requested (e.g., Login, Signup)
  return children;
};

export default PublicOnlyRoute;
