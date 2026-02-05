import { create } from 'zustand';

import { persist } from 'zustand/middleware';

export const useTenantStore = create(
  persist(
    (set) => ({
      tenant: null,
      
      setTenant: (tenant) => set({ tenant }),
      
      loadTenant: async (tenantId) => {
          // Placeholder for async fetch if needed
          // const { getTenant } = await import('../services/tenantService');
          // For now just setting it
      }
    }),
    {
      name: 'tenant-storage',
    }
  )
);


