import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Configure axios
  axios.defaults.baseURL = import.meta.env.VITE_API_URL;
  axios.defaults.withCredentials = true;

  // Add interceptor for adding token to requests
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add interceptor for token refresh
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is 403 and not already retrying
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        try {
          // Call refresh endpoint
          const res = await axios.get('/auth/refresh');
          localStorage.setItem('accessToken', res.data.accessToken);
          
          // Retry the original request
          return axios(originalRequest);
        } catch (err) {
          // If refresh fails, logout
          logout();
          return Promise.reject(err);
        }
      }
      
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Verify token by making a request
          const res = await axios.get('/auth/refresh');
          localStorage.setItem('accessToken', res.data.accessToken);
          
          // Get user data
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          setCurrentUser(userInfo);
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (username, email, password) => {
    try {
      await axios.post('/auth/register', { username, email, password });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('userInfo', JSON.stringify(res.data.user));
      setCurrentUser(res.data.user);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userInfo');
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
