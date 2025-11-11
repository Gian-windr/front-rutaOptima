import api from './api';
import type { Customer, Order, Vehicle, RoutePlan, OptimizeRouteRequest } from '../types/api.types';

export const customerService = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  create: (customer: Omit<Customer, 'id'>) => api.post<Customer>('/customers', customer),
  update: (id: number, customer: Partial<Customer>) => api.put<Customer>(`/customers/${id}`, customer),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

export const orderService = {
  getAll: () => api.get<Order[]>('/orders'),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (order: Omit<Order, 'id'>) => api.post<Order>('/orders', order),
  update: (id: number, order: Partial<Order>) => api.put<Order>(`/orders/${id}`, order),
  delete: (id: number) => api.delete(`/orders/${id}`),
  getByDate: (fecha: string) => api.get<Order[]>(`/orders/fecha/${fecha}`),
};

export const vehicleService = {
  getAll: () => api.get<Vehicle[]>('/vehicles'),
  getById: (id: number) => api.get<Vehicle>(`/vehicles/${id}`),
  create: (vehicle: Omit<Vehicle, 'id'>) => api.post<Vehicle>('/vehicles', vehicle),
  update: (id: number, vehicle: Partial<Vehicle>) => api.put<Vehicle>(`/vehicles/${id}`, vehicle),
  delete: (id: number) => api.delete(`/vehicles/${id}`),
  getActive: () => api.get<Vehicle[]>('/vehicles/activos'),
};

export const routeService = {
  optimize: (request: OptimizeRouteRequest) => api.post<RoutePlan>('/route-plans/optimize', request),
  getById: (id: number) => api.get<RoutePlan>(`/route-plans/${id}`),
  getAll: () => api.get<RoutePlan[]>('/route-plans'),
  delete: (id: number) => api.delete(`/route-plans/${id}`),
};
