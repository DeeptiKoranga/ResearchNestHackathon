import React, { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { ProgressContext } from '../context/progressContext';
import { buildTree } from '../utils/buildTree';
import ProgressTreeView from '../components/progressTreeView';
import { Container, Box, Typography, CircularProgress, Alert, AppBar, Toolbar, Button } from '@mui/material';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logout, role } = useContext(AuthContext);
  const { progressItems, loading, error, getMyProgress, updateItemStatus, clearProgress } = useContext(ProgressContext);

  useEffect(() => {
    getMyProgress();
    return () => {
        clearProgress();
    }
  }, [getMyProgress, clearProgress]); 

  const progressTree = useMemo(() => buildTree(progressItems), [progressItems]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }
    if (progressTree.length === 0) {
      return <Typography sx={{ mt: 4 }}>No progress track assigned yet.</Typography>
    }
    
    // 
    return (
        <ProgressTreeView
            nodes={progressTree}
            userRole={role}
            onUpdateStatus={updateItemStatus}
        />
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Progress
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Welcome back! Here is an overview of your academic journey. You can mark tasks and subtasks as complete to update your progress.
        </Typography>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default StudentDashboard;
