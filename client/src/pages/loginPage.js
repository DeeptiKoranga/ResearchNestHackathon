import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography } from '@mui/material';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isAuthenticated, role } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on role after successful login
      navigate(role === 'faculty' ? '/faculty-dashboard' : '/student-dashboard');
    }
  }, [isAuthenticated, navigate, role]);

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    login(formData);
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        
        {}
        <Typography component="h1" variant="h4" gutterBottom>
          Welcome to ResearchNest
        </Typography>
        
        <Typography component="h2" variant="h5">
          Sign In
        </Typography>
        
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={formData.email} onChange={onChange} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={formData.password} onChange={onChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign In</Button>
          <Link to="/register" style={{ textDecoration: 'none' }}>
            {"Don't have an account? Sign Up"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
