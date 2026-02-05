import api from './api';

export const customerService = {
  // Public / Semi-public (Tenant/Shop context required via URL or header for some)
  
  getAllShops: async () => {
    const response = await api.get('/customer/shops');
    return response.data;
  },

  getShopDetails: async (shopId) => {
    const response = await api.get(`/customer/shops/${shopId}`);
    return response.data;
  },

  getShopServices: async (shopId) => {
    const response = await api.get(`/customer/shops/${shopId}/services`);
    return response.data;
  },

  getAvailableSlots: async (shopId, params = {}) => {
    // params: { date, serviceId, staffId }
    const response = await api.get(`/customer/shops/${shopId}/slots`, { params });
    return response.data;
  },

  // Authenticated
  bookSlot: async (shopId, bookingData) => {
    // bookingData: { slotId, serviceId }
    const response = await api.post(`/customer/shops/${shopId}/bookings`, bookingData);
    return response.data;
  },

  getBookingHistory: async (params = {}) => {
    const response = await api.get('/customer/bookings', { params });
    return response.data;
  },

  cancelBooking: async (shopId, bookingId) => {
    const response = await api.post(`/customer/shops/${shopId}/bookings/${bookingId}/cancel`);
    return response.data;
  },
};

export default customerService;
