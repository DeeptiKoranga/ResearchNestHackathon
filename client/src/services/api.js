import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/*Axios Request Interceptor */
api.interceptors.request.use(
  (config) => {
    // 1. Get the authentication token from localStorage.
    const token = localStorage.getItem('token');

    // 2. If the token exists, add it to the Authorization header.
    if (token) {
      // The 'Bearer ' prefix is a standard convention for JWTs.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // This part handles errors that occur before the request is sent.
    return Promise.reject(error);
  }
);

export default api;