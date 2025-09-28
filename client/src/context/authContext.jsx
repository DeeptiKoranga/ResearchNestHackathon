import React, { createContext, useReducer, useEffect } from 'react';
import api from '../services/api';

// --- Initial State ---
// The state when the app first loads. We check localStorage for an existing token.
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
  role: null,
};

// --- Reducer Function ---
const authReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'USER_LOADED':
      // When user data is loaded successfully from a token
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
        role: payload.role,
      };
    case 'LOGIN_SUCCESS':
      // When login is successful, store the token and set user as authenticated.
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
        // Assuming the user object with role is nested in a 'data' property
        role: payload.data ? payload.data.role : null, 
      };
    case 'REGISTER_SUCCESS':
        // After successful registration, we don't log them in automatically.
        // We just reset the loading state.
        return {
            ...state,
            loading: false,
        };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      // On failure or logout, clear the token and reset the state.
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        role: null,
      };
    default:
      return state;
  }
};

// --- Create Context ---
export const AuthContext = createContext();

// --- Provider Component ---
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Register User
  const register = async (formData) => {
    try {
      // The register endpoint returns a success message, not a token
      await api.post('/auth/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS' });
      alert('Registration successful! Please log in.');
      return true; 
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      alert(errorMessage);
      console.error(errorMessage);
      return false; // Indicate failure
    }
  };

  // Login User
  const login = async (formData) => {
    try {
      const res = await api.post('/auth/login', formData);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL' });
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      alert(errorMessage);
      console.error(errorMessage);
    }
  };

  // Logout User
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        role: state.role,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};