import { create } from 'zustand';
import type { Customer, Order, Vehicle, RoutePlan } from '../types/api.types';

interface AppState {
  // Auth
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;

  // Data
  customers: Customer[];
  orders: Order[];
  vehicles: Vehicle[];
  routePlans: RoutePlan[];

  setCustomers: (customers: Customer[]) => void;
  setOrders: (orders: Order[]) => void;
  setVehicles: (vehicles: Vehicle[]) => void;
  setRoutePlans: (routePlans: RoutePlan[]) => void;

  // Selected items
  selectedRoutePlan: RoutePlan | null;
  setSelectedRoutePlan: (plan: RoutePlan | null) => void;

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
  routePlans: [],

  setCustomers: (customers) => set({ customers }),
  setOrders: (orders) => set({ orders }),
  setVehicles: (vehicles) => set({ vehicles }),
  setRoutePlans: (routePlans) => set({ routePlans }),

  selectedRoutePlan: null,
  setSelectedRoutePlan: (plan) => set({ selectedRoutePlan: plan }),

  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),
}));
