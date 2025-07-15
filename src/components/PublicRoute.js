import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicRoute({ children }) {
  const { currentUser } = useAuth();

  if (currentUser) {
    // Redirect to home if already authenticated
    return <Navigate to="/" />;
  }

  return children;
}
