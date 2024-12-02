import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUserData } from '../services/authService';

function PrivateRoute({ element, role, ...rest }) {
  const user = getCurrentUserData();

  if (!user) {
    // Redirect to login page if the user is not logged in
    return <Navigate to={role === 'admin' ? '/admin/login' : '/login'} />;
  }

  if (role && user.role !== role) {
    // Redirect to quiz list if the user doesn't have the required role
    return <Navigate to="/quizlist" />;
  }

  return element;
}

export default PrivateRoute;
