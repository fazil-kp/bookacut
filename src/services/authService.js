import api from './api';

export const authService = {
  login: async (credentials) => {
    // Backend expects { email, password }
    const response = await api.post('/auth/login', credentials);
    // Backend returns { success: true, token, user }
    return response.data;
  },

  registerCustomer: async (customerData) => {
    // Backend expects { email, password, phone, firstName, lastName, tenantId }
    const response = await api.post('/auth/register', customerData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    // Local cleanup only, as JWT is stateless usually, unless we implement blacklist
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Default export for backward compatibility if needed, but named export is preferred
export default authService;

