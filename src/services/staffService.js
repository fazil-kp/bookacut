import api from './api';

export const staffService = {
  getDashboard: async (shopId) => {
    const response = await api.get(`/staff/shops/${shopId}/dashboard`);
    return response.data;
  },

  getBookings: async (shopId, params = {}) => {
    const response = await api.get(`/staff/shops/${shopId}/bookings`, { params });
    return response.data;
  },

  getBooking: async (shopId, bookingId) => {
    const response = await api.get(`/staff/shops/${shopId}/bookings/${bookingId}`);
    return response.data;
  },

  createWalkIn: async (shopId, bookingData) => {
    const response = await api.post(`/staff/shops/${shopId}/bookings/walkin`, bookingData);
    return response.data;
  },

  markArrived: async (shopId, bookingId) => {
    const response = await api.post(`/staff/shops/${shopId}/bookings/${bookingId}/arrived`);
    return response.data;
  },

  startService: async (shopId, bookingId) => {
    const response = await api.post(`/staff/shops/${shopId}/bookings/${bookingId}/start`);
    return response.data;
  },

  completeService: async (shopId, bookingId) => {
    const response = await api.post(`/staff/shops/${shopId}/bookings/${bookingId}/complete`);
    return response.data;
  },

  markNoShow: async (shopId, bookingId) => {
    const response = await api.post(`/staff/shops/${shopId}/bookings/${bookingId}/no-show`);
    return response.data;
  },

  updateBookingPrice: async (shopId, bookingId, price, reason) => {
    const response = await api.put(`/staff/shops/${shopId}/bookings/${bookingId}/price`, {
      price,
      reason,
    });
    return response.data;
  },

  getInvoices: async (shopId, params = {}) => {
    const response = await api.get(`/staff/shops/${shopId}/invoices`, { params });
    return response.data;
  },

  markInvoicePaid: async (shopId, invoiceId, paymentMethod) => {
    const response = await api.post(`/staff/shops/${shopId}/invoices/${invoiceId}/pay`, {
      paymentMethod,
    });
    return response.data;
  },
};

