import { create } from 'zustand';

export const useShopStore = create((set) => ({
  selectedShop: null,
  setSelectedShop: (shop) => set({ selectedShop: shop }),
}));

