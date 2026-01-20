// API endpoints
// For multi-tenant setup we default to relative /api, so each domain hits its own tenant-aware backend.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const USER_ROLES = {
  // Support both legacy and new naming for platform super admin
  SUPER_ADMIN: 'super_admin',
  PLATFORM_SUPER_ADMIN: 'platform_super_admin',
  CLIENT_ADMIN: 'client_admin',
  STAFF: 'staff',
  CUSTOMER: 'customer',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ARRIVED: 'arrived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  DEMO: 'demo',
};

export const PAYMENT_METHODS = ['cash', 'bank_transfer', 'check', 'other'];

export const SERVICE_CATEGORIES = [
  'haircut',
  'hair_color',
  'facial',
  'massage',
  'manicure',
  'pedicure',
  'waxing',
  'makeup',
  'other',
];

export const SLOT_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  BLOCKED: 'blocked',
  FULL: 'full',
};

