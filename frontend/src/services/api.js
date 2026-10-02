import axios from 'axios';

// Normalize base URL to prevent common deployment issues:
// 1. Missing trailing slashes vs extra slashes
// 2. Missing '/api' prefix when pasting backend root URL (e.g., https://my-api.onrender.com)
// 3. Fallback in production if VITE_API_URL is missing
const resolveApiUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || typeof envUrl !== 'string' || !envUrl.trim()) {
    if (import.meta.env.DEV) {
      return 'http://localhost:5000/api';
    }
    // In production without VITE_API_URL set, default to relative '/api'
    console.warn(
      '[EventForce] VITE_API_URL is not defined in environment variables! Using relative "/api". ' +
      'If your backend is hosted separately (e.g. Render), please set VITE_API_URL in your hosting environment settings.'
    );
    return '/api';
  }

  let cleanUrl = envUrl.trim().replace(/\/+$/, '');
  
  // If the user provided a full domain without '/api' (e.g. https://xyz.onrender.com),
  // automatically append '/api' so all requests hit backend route handlers.
  if (cleanUrl.startsWith('http') && !cleanUrl.endsWith('/api')) {
    cleanUrl += '/api';
  }

  return cleanUrl;
};

const API_URL = resolveApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle global authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid token if unauthenticated
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.response && error.response.status === 404) {
      console.error(
        `[EventForce 404] Resource not found: ${error.config?.baseURL || ''}${error.config?.url || ''}`,
        error.response?.data
      );
    }
    return Promise.reject(error);
  }
);

export default api;
