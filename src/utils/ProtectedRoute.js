import { includes } from 'lodash';
import React from 'react'
import { Navigate } from 'react-router-dom'
import { getUserIsLoggedIn, getUserRole } from './LocalData';

export const ProtectedRoute = ({ user, roles = [], children }) => {
  const isLoggedIn = getUserIsLoggedIn();
  const roleId = getUserRole();
  if (isLoggedIn) {
    if (includes(roles, roleId)) {
      return children;
    }
    return <Navigate to="/noauth" replace />
  }
  return <Navigate to="/" replace />
};
