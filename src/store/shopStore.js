import { create } from 'zustand';

import { persist } from 'zustand/middleware';

export const useShopStore = create(
  persist(
    (set) => ({
      shops: [],
      selectedShop: null,

      setShops: (shops) => set({ shops }),
      setSelectedShop: (shop) => set({ selectedShop: shop }),
    }),
    {
      name: 'shop-storage',
    }
  )
);

