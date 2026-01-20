import api from './api';

/**
 * Tenant/domain related APIs.
 *
 * Assumes a backend endpoint that can resolve the current host to a tenant/client.
 * Example: GET /public/tenants/resolve-domain?host=abcsalon.com
 */
export const tenantService = {
  resolveByDomain: async (host) => {
    const response = await api.get('/public/tenants/resolve-domain', {
      params: { host },
    });
    return response.data;
  },
};


