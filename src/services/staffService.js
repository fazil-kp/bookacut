import api from './api';

export const staffService = {
  // Dashboard
  getDashboard: async (shopId) => {
    const response = await api.get(`/staff/shops/${shopId}/dashboard`);
    return response.data;
  },

  // Booking Management
  getShopBookings: async (shopId, params = {}) => {
    const response = await api.get(`/staff/shops/${shopId}/bookings`, { params });
    return response.data;
  },

  createWalkIn: async (shopId, bookingData) => {
    // bookingData: { slotId, serviceId, customerData: { firstName, lastName, phone, email } }
    const response = await api.post(`/staff/shops/${shopId}/bookings/walkin`, bookingData);
    return response.data;
  },

  // Booking Actions
  markArrived: async (shopId, bookingId) => {
    const response = await api.post(`/staff/shops/${shopId}/bookings/${bookingId}/arrived`);
    return response.data;
  },

  markNoShow: async (shopId, bookingId) => {
    const response = await api.post(`/staff/shops/${shopId}/bookings/${bookingId}/no-show`);
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

  editPrice: async (shopId, bookingId, price) => {
    const response = await api.put(`/staff/shops/${shopId}/bookings/${bookingId}/price`, { price });
    return response.data;
  },

  // Invoice Management
  getShopInvoices: async (shopId, params = {}) => {
    const response = await api.get(`/staff/shops/${shopId}/invoices`, { params });
    return response.data;
  },

  generateInvoice: async (shopId, bookingId) => {
    const response = await api.post(`/staff/shops/${shopId}/bookings/${bookingId}/invoice`);
    return response.data;
  },

  addPayment: async (shopId, invoiceId, paymentData) => {
    const response = await api.post(`/staff/shops/${shopId}/invoices/${invoiceId}/payments`, paymentData);
    return response.data;
  },
  
  markInvoicePaid: async (shopId, invoiceId, paymentMethod) => {
    const response = await api.post(`/staff/shops/${shopId}/invoices/${invoiceId}/paid`, { paymentMethod });
    return response.data;
  },

  getInvoicePayments: async (shopId, invoiceId) => {
    const response = await api.get(`/staff/shops/${shopId}/invoices/${invoiceId}/payments`);
    return response.data;
  },

  // Printing & Email
  sendInvoiceEmail: async (shopId, invoiceId, email) => {
    const response = await api.post(`/staff/shops/${shopId}/invoices/${invoiceId}/send-email`, { email });
    return response.data;
  },
  
  downloadInvoicePDF: async (shopId, invoiceId) => {
      // For download, we might need blob response type, but this returns URL usually or stream
      // Assuming it triggers download or returns JSON. Middleware says downloadInvoicePDF
      // Ideally we should open in new window or handle blob.
      // Let's assume it returns a file URL or handled via browser. 
      // Actually backend probably pipes file. 
      // If so, we need 'blob' logic here.
      // Let's use window.open for now if it is GET. 
      // Or use API to get blob.
      // Since `downloadInvoicePDF` controller likely `res.download` or `res.attachment`.
      // It's safer to return the response object or use download helper.
      
      const response = await api.get(`/staff/shops/${shopId}/invoices/${invoiceId}/download`, {
          responseType: 'blob'
      });
      return response; // Return full response to handle blob
  },

  printInvoice: async (shopId, invoiceId, printerData) => {
    const response = await api.post(`/staff/shops/${shopId}/invoices/${invoiceId}/print`, printerData);
    return response.data;
  },

  getAvailablePrinters: async () => {
    const response = await api.get('/staff/printers');
    return response.data;
  },
};

export default staffService;
