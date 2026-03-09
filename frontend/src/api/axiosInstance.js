// Configured Axios instance for backend API calls

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,   // REQUIRED — sends cookies on cross-origin requests
});

// Response interceptor — handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Import store to dispatch localLogout
      // Use dynamic import to avoid circular dependency
      import('../redux/store.js').then(({ default: store }) => {
        import('../redux/authSlice.js').then(({ localLogout }) => {
          store.dispatch(localLogout())
        })
      })
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
