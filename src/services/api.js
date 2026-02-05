import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
// Request interceptor to add auth token and tenant id
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Tenant ID if available in store
    // We use dynamic import or getState to avoid circular dependencies if possible, 
    // but here we'll assume stores are initialized.
    // Better to use window or direct store access if imports cause issues.
    // For now, let's try to get it from localStorage or window if store access is complex here,
    // but importing store is usually fine in interceptors.
    
    // We need to lazily access the store to avoid circular dependency issues during initialization
    // But since api.js is imported by services, and services by components, and stores by components...
    // Let's rely on localStorage for tenantId as a fallback or direct store access.
    
    // Attempting to read from tenantStore state in localStorage (persistence)
    try {
      const tenantStorage = localStorage.getItem('tenant-storage');
      if (tenantStorage) {
        const { state } = JSON.parse(tenantStorage);
        if (state?.tenant?.id) {
          config.headers['x-tenant-id'] = state.tenant.id;
        }
      }
    } catch (e) {
      // Ignore json parse error
    }

    // Also check for shopId in headers if passed explicitly in config
    if (config.headers.shopId) {
        config.headers['x-shop-id'] = config.headers.shopId;
        delete config.headers.shopId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - logout user
      if (status === 401) {
        const { logout } = useAuthStore.getState();
        logout();
        // Only redirect if not already there to avoid loops
        if (window.location.pathname !== '/login') {
             toast.error('Session expired. Please login again.');
             window.location.href = '/login';
        }
      }

      // Handle other errors
      const errorMessage = data?.message || data?.error || 'An error occurred';
      
      // Don't show toast for 401 as we redirect, unless it's a login failure which might be 401 too.
      // Actually login failure is usually 401, so we should be careful. 
      // If we are on login page, don't redirect, just show error.
      if (status === 401 && window.location.pathname === '/login') {
          toast.error(errorMessage);
      } else if (status !== 401) {
          toast.error(errorMessage);
      }
    } else if (error.request) {
      toast.error('Network error. Please check your connection.');
    } else {
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// Helper methods
api.get = (url, config) => api.request({ ...config, method: 'GET', url });
api.post = (url, data, config) => api.request({ ...config, method: 'POST', url, data });
api.put = (url, data, config) => api.request({ ...config, method: 'PUT', url, data });
api.patch = (url, data, config) => api.request({ ...config, method: 'PATCH', url, data });
api.del = (url, config) => api.request({ ...config, method: 'DELETE', url });

export default api;

