import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useContext(AuthContext);

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/unauthorized" />;  // Redirect to unauthorized page
  }

  return children;
};

export default PrivateRoute;