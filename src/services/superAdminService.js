import api from './api';

export const superAdminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/super-admin/dashboard');
    return response.data;
  },

  // Tenants
  getAllTenants: async (params = {}) => {
    const response = await api.get('/super-admin/tenants', { params });
    return response.data;
  },

  getTenantDetails: async (tenantId) => {
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

  // Client Admin Management
  createClientAdmin: async (tenantId, adminData) => {
    const response = await api.post(`/super-admin/tenants/${tenantId}/admin`, adminData);
    return response.data;
  },

  updateClientAdminPassword: async (tenantId, userId, password) => {
    const response = await api.put(`/super-admin/tenants/${tenantId}/admin/${userId}/password`, { password });
    return response.data;
  },

  // Subscription / Payments
  recordPayment: async (tenantId, paymentData) => {
    const response = await api.post(`/super-admin/tenants/${tenantId}/payments`, paymentData);
    return response.data;
  },

  getPaymentHistory: async (tenantId) => {
    const response = await api.get(`/super-admin/tenants/${tenantId}/payments`);
    return response.data;
  },

  updateSubscriptionExpiry: async (tenantId, expiryDate) => {
    const response = await api.put(`/super-admin/tenants/${tenantId}/subscription`, { subscriptionExpiresAt: expiryDate });
    return response.data;
  },
};

export default superAdminService;
