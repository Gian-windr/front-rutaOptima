import { create } from 'zustand';
import type { Customer, Order, Vehicle, OptimizeRouteResponse } from '../types/api.types';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;

  // Data
  customers: Customer[];
  orders: Order[];
  vehicles: Vehicle[];
  lastOptimization: OptimizeRouteResponse | null;

  setCustomers: (customers: Customer[]) => void;
  setOrders: (orders: Order[]) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setLastOptimization: (optimization: OptimizeRouteResponse | null) => void;

  // Loading
  isLoading: boolean;
  setLoading: (value: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: !!localStorage.getItem('token'),
  setAuthenticated: (value) => set({ isAuthenticated: value }),

  customers: [],
  orders: [],
  vehicles: [],
  lastOptimization: null,

  setCustomers: (customers) => set({ customers }),
  setOrders: (orders) => set({ orders }),
  setVehicles: (vehicles) => set({ vehicles }),
  setLastOptimization: (optimization) => set({ lastOptimization: optimization }),

  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),
}));
