// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx'; // 👈 Make sure this path is correct

/**
 * A wrapper for routes that require authentication.
 * If the user is not authenticated, they are redirected to the /login page.
 * @param {object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated.
 */
const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Get user from our auth context
  const location = useLocation();

  if (!user) {
    // If not logged in, redirect to login,
    // saving the location they tried to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render the component they requested
  return children;
};

export default PrivateRoute;