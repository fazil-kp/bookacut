import { create } from 'zustand';

export const useTenantStore = create((set) => ({
  tenant: null, // { id, name, databaseName, domain, ... }
  setTenant: (tenant) => set({ tenant }),
}));


