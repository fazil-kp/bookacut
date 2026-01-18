import api from './api';

export const customerService = {
  getServices: async (shopId) => {
    const response = await api.get(`/customer/shops/${shopId}/services`);
    return response.data;
  },

  getSlots: async (shopId, params = {}) => {
    const response = await api.get(`/customer/shops/${shopId}/slots`, { params });
    return response.data;
  },

  createBooking: async (shopId, bookingData) => {
    const response = await api.post(`/customer/shops/${shopId}/bookings`, bookingData);
    return response.data;
  },

  getBookings: async (params = {}) => {
    const response = await api.get('/customer/bookings', { params });
    return response.data;
  },

  getBooking: async (bookingId) => {
    const response = await api.get(`/customer/bookings/${bookingId}`);
    return response.data;
  },

  cancelBooking: async (bookingId, reason) => {
    const response = await api.post(`/customer/bookings/${bookingId}/cancel`, { reason });
    return response.data;
  },
};

