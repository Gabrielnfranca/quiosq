import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TenantState {
  quiosqueId: string | null;
  mesaId: string | null;
  garcomNome: string | null;
  setTenant: (quiosqueId: string, mesaId: string, garcomNome?: string | null) => void;
  clearTenant: () => void;
}

export const useTenant = create<TenantState>()(
  persist(
    (set) => ({
      quiosqueId: null,
      mesaId: null,
      garcomNome: null,
      setTenant: (quiosqueId, mesaId, garcomNome = null) => set({ quiosqueId, mesaId, garcomNome }),
      clearTenant: () => set({ quiosqueId: null, mesaId: null, garcomNome: null }),
    }),
    {
      name: 'quiosq-tenant-storage',
    }
  )
);