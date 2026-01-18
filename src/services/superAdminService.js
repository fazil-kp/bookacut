import api from './api';

export const superAdminService = {
  getDashboard: async () => {
    const response = await api.get('/super-admin/dashboard');
    return response.data;
  },

  getTenants: async (params = {}) => {
    const response = await api.get('/super-admin/tenants', { params });
    return response.data;
  },

  getTenant: async (tenantId) => {
    const response = await api.get(`/super-admin/tenants/${tenantId}`);
    return response.data;
  },

  createTenant: async (tenantData) => {
    const response = await api.post('/super-admin/tenants', tenantData);
    return response.data;
  },

  updateTenant: async (tenantId, tenantData) => {
    const response = await api.put(`/super-admin/tenants/${tenantId}`, tenantData);
    return response.data;
  },

  recordPayment: async (tenantId, paymentData) => {
    const response = await api.post(`/super-admin/tenants/${tenantId}/payments`, paymentData);
    return response.data;
  },

  getPaymentHistory: async (tenantId) => {
    const response = await api.get(`/super-admin/tenants/${tenantId}/payments`);
    return response.data;
  },
};

