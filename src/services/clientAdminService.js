import api from './api';

export const clientAdminService = {
  // Dashboard
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Shops
  getShops: async () => {
    const response = await api.get('/admin/shops');
    return response.data;
  },

  getShop: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}`);
    return response.data;
  },

  createShop: async (shopData) => {
    const response = await api.post('/admin/shops', shopData);
    return response.data;
  },

  updateShop: async (shopId, shopData) => {
    const response = await api.put(`/admin/shops/${shopId}`, shopData);
    return response.data;
  },

  // Staff
  getStaff: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/staff`);
    return response.data;
  },

  addStaff: async (shopId, staffData) => {
    const response = await api.post(`/admin/shops/${shopId}/staff`, staffData);
    return response.data;
  },

  updateStaff: async (shopId, staffId, staffData) => {
    const response = await api.put(`/admin/shops/${shopId}/staff/${staffId}`, staffData);
    return response.data;
  },

  removeStaff: async (shopId, staffId) => {
    const response = await api.delete(`/admin/shops/${shopId}/staff/${staffId}`);
    return response.data;
  },

  // Services
  getServices: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/services`);
    return response.data;
  },

  createService: async (shopId, serviceData) => {
    const response = await api.post(`/admin/shops/${shopId}/services`, serviceData);
    return response.data;
  },

  updateService: async (shopId, serviceId, serviceData) => {
    const response = await api.put(`/admin/shops/${shopId}/services/${serviceId}`, serviceData);
    return response.data;
  },

  deleteService: async (shopId, serviceId) => {
    const response = await api.delete(`/admin/shops/${shopId}/services/${serviceId}`);
    return response.data;
  },

  // Slots
  getSlots: async (shopId, params = {}) => {
    const response = await api.get(`/admin/shops/${shopId}/slots`, { params });
    return response.data;
  },

  generateSlots: async (shopId, slotData) => {
    const response = await api.post(`/admin/shops/${shopId}/slots/generate`, slotData);
    return response.data;
  },

  blockSlot: async (shopId, slotId, reason) => {
    const response = await api.post(`/admin/shops/${shopId}/slots/${slotId}/block`, { reason });
    return response.data;
  },

  unblockSlot: async (shopId, slotId) => {
    const response = await api.post(`/admin/shops/${shopId}/slots/${slotId}/unblock`);
    return response.data;
  },

  // Settings
  getShopSettings: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/settings`);
    return response.data;
  },

  updateShopSettings: async (shopId, settings) => {
    const response = await api.put(`/admin/shops/${shopId}/settings`, settings);
    return response.data;
  },

  // Invoices
  getInvoices: async (params = {}) => {
    const response = await api.get('/admin/invoices', { params });
    return response.data;
  },

  getInvoice: async (invoiceId) => {
    const response = await api.get(`/admin/invoices/${invoiceId}`);
    return response.data;
  },
};

