// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import { ProgressProvider } from './context/progressContext';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// Page Imports
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import StudentDashboard from './pages/studentDashboard';
import FacultyDashboard from './pages/facultyDashboard';
import PrivateRoute from './components/privateRoute';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Student Route */}
              <Route path="/student-dashboard" element={
                <PrivateRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </PrivateRoute>
              } />

              {/* Protected Faculty Route */}
              <Route path="/faculty-dashboard" element={
                <PrivateRoute allowedRoles={['faculty']}>
                  <FacultyDashboard />
                </PrivateRoute>
              } />

              {/* Default redirect or home page */}
              <Route path="/" element={<LoginPage />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}

export default App;