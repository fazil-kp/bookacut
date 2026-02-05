import api from './api';

export const clientAdminService = {
  // --- Shop Management ---
  createShop: async (shopData) => {
    const response = await api.post('/admin/shops', shopData);
    return response.data;
  },

  getShops: async () => {
    const response = await api.get('/admin/shops');
    return response.data;
  },

  getShopDetails: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}`);
    return response.data;
  },

  updateShop: async (shopId, shopData) => {
    const response = await api.put(`/admin/shops/${shopId}`, shopData);
    return response.data;
  },

  getShopSettings: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/settings`);
    return response.data;
  },

  updateShopSettings: async (shopId, settings) => {
    const response = await api.put(`/admin/shops/${shopId}/settings`, settings);
    return response.data;
  },

  getAllInvoices: async (params = {}) => {
    const response = await api.get('/admin/invoices', { params });
    return response.data;
  },

  getDashboardStats: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/dashboard`);
    return response.data;
  },

  // --- Staff Management ---
  getShopStaff: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/staff`);
    return response.data;
  },

  addStaff: async (shopId, staffData) => {
    const response = await api.post(`/admin/shops/${shopId}/staff`, staffData);
    return response.data;
  },

  removeStaff: async (shopId, staffId) => {
    const response = await api.del(`/admin/shops/${shopId}/staff/${staffId}`);
    return response.data;
  },

  updateStaffPassword: async (shopId, staffId, password) => {
    const response = await api.put(`/admin/shops/${shopId}/staff/${staffId}/password`, { password });
    return response.data;
  },
  
  updateStaffCredentials: async (shopId, staffId, data) => {
    const response = await api.put(`/admin/shops/${shopId}/staff/${staffId}/credentials`, data);
    return response.data;
  },

  updateStaffCommissionRate: async (shopId, staffId, rate) => {
    const response = await api.put(`/admin/shops/${shopId}/staff/${staffId}/commission-rate`, { commissionRate: rate });
    return response.data;
  },

  // --- Service Category Management ---
  createServiceCategory: async (shopId, categoryData) => {
    const response = await api.post(`/admin/shops/${shopId}/service-categories`, categoryData);
    return response.data;
  },

  getServiceCategories: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/service-categories`);
    return response.data;
  },

  updateServiceCategory: async (shopId, categoryId, categoryData) => {
    const response = await api.put(`/admin/shops/${shopId}/service-categories/${categoryId}`, categoryData);
    return response.data;
  },
  
  deleteServiceCategory: async (shopId, categoryId) => {
      const response = await api.del(`/admin/shops/${shopId}/service-categories/${categoryId}`);
      return response.data;
  },

  // --- Service Management ---
  createService: async (shopId, serviceData) => {
    const response = await api.post(`/admin/shops/${shopId}/services`, serviceData);
    return response.data;
  },

  getShopServices: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/services`);
    return response.data;
  },

  updateService: async (shopId, serviceId, serviceData) => {
    const response = await api.put(`/admin/shops/${shopId}/services/${serviceId}`, serviceData);
    return response.data;
  },

  // --- Slot Management ---
  getShopSlots: async (shopId) => {
    const response = await api.get(`/admin/shops/${shopId}/slots`);
    return response.data;
  },

  generateSlots: async (shopId, { startDate, endDate }) => {
    const response = await api.post(`/admin/shops/${shopId}/slots/generate`, { startDate, endDate });
    return response.data;
  },

  blockSlot: async (shopId, { date, slotTime, reason }) => {
    // block by date/time
    const response = await api.post(`/admin/shops/${shopId}/slots/block`, { date, slotTime, reason });
    return response.data;
  },
  
  blockSlotById: async (shopId, slotId, reason) => {
      const response = await api.post(`/admin/shops/${shopId}/slots/${slotId}/block`, { reason });
      return response.data;
  },

  unblockSlot: async (shopId, { date, slotTime }) => {
    const response = await api.post(`/admin/shops/${shopId}/slots/unblock`, { date, slotTime });
    return response.data;
  },
  
  unblockSlotById: async (shopId, slotId) => {
      const response = await api.post(`/admin/shops/${shopId}/slots/${slotId}/unblock`);
      return response.data;
  },

  reduceSlotCapacity: async (shopId, slotId, capacity) => {
    const response = await api.put(`/admin/shops/${shopId}/slots/${slotId}/capacity`, { capacity });
    return response.data;
  },

  // --- Invoice & Finance ---
  getShopInvoices: async (shopId, params = {}) => {
    const response = await api.get(`/admin/shops/${shopId}/invoices`, { params });
    return response.data;
  },

  addPayment: async (shopId, invoiceId, paymentData) => {
    const response = await api.post(`/admin/shops/${shopId}/invoices/${invoiceId}/payments`, paymentData);
    return response.data;
  },
  
  markInvoicePaid: async (shopId, invoiceId, paymentMethod) => {
      const response = await api.post(`/admin/shops/${shopId}/invoices/${invoiceId}/paid`, { paymentMethod });
      return response.data;
  },

  getCommissions: async (shopId, params = {}) => {
    const response = await api.get(`/admin/shops/${shopId}/commissions`, { params });
    return response.data;
  },
  
  getStaffCommissions: async (shopId, staffId, params = {}) => {
      const response = await api.get(`/admin/shops/${shopId}/staff/${staffId}/commissions`, { params });
      return response.data;
  },
  
  getPaymentReports: async (shopId, params = {}) => {
      const response = await api.get(`/admin/shops/${shopId}/payment-reports`, { params });
      return response.data;
  },
  
  getDailyPaymentReport: async (shopId, params = {}) => {
      const response = await api.get(`/admin/shops/${shopId}/payment-reports/daily`, { params });
      return response.data;
  }
};

export default clientAdminService;
