import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate('/login'); 
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Sign Up</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
          <TextField required fullWidth id="email" label="Email Address" name="email" autoComplete="email" value={formData.email} onChange={onChange} />
          <TextField required fullWidth name="password" label="Password" type="password" id="password" sx={{ mt: 2 }} autoComplete="new-password" value={formData.password} onChange={onChange} />
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">I am a...</FormLabel>
            <RadioGroup row name="role" value={formData.role} onChange={onChange}>
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="faculty" control={<Radio />} label="Faculty" />
            </RadioGroup>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            {"Already have an account? Sign In"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;