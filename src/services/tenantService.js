import api from './api';

export const tenantService = {
  // Public (or semi-public) tenant resolution
  // This is used to hydrate tenant store when loading app on a specific domain or context.
  
  // Actually, we might need an endpoint to "get tenant by domain" or "get tenant by id" publicly.
  // The backend analysis didn't show a specific public "get tenant" endpoint other than what's implied.
  // We'll assume we can pass `tenantId` to some public endpoints or use the auth logic.
  
  // For the frontend, "tenantService" is mostly about getting info needed for context.
  // If the user is logged in, they have tenant info in their token/user object.
  // If the user is NOT logged in (e.g. customer visiting a shop link), they need to resolve tenant.
  
  // Looking at backend `customerRoutes.js`:
  // router.get('/shops/:shopId', customerController.getShopDetails.bind(customerController));
  // This endpoint is public (`optionalAuth`). It likely returns tenant info too or assumes tenant is resolved via header?
  // `extractTenantId` middleware looks for params, body, query.
  
  // So we can fetch shop details which acts as our entry point for customers.
  
  getShopDetailsPublic: async (shopId) => {
    // This is a customer-facing public route but gives us shop context
    const response = await api.get(`/customer/shops/${shopId}`);
    return response.data;
  },
  
  // If we are a super admin or client admin looking up tenants, we use superAdminService or clientAdminService.
  // This service file might be thin if we don't have a dedicated public tenant lookup.
  
  // However, `clientAdminService` has `getShops` for the logged in admin.
};

export default tenantService;
