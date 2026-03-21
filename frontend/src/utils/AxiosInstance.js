// frontend/src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  withCredentials: true,
});
// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/users/login') &&
      !originalRequest.url.includes('/users/refresh-token')
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/users/refresh-token');
        return axiosInstance(originalRequest); // Retry original
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
        window.location.href = '/login'; // Optional logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
