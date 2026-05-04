import { create } from 'zustand';

interface OrdersDrawerStore {
  isOpen: boolean;
  toggleOrders: () => void;
  openOrders: () => void;
  closeOrders: () => void;
}

export const useOrdersDrawer = create<OrdersDrawerStore>((set) => ({
  isOpen: false,
  toggleOrders: () => set((state) => ({ isOpen: !state.isOpen })),
  openOrders: () => set({ isOpen: true }),
  closeOrders: () => set({ isOpen: false }),
}));
