import api from "./api";
import { API_CONFIG } from "../config/api.config";
import type {
  Customer,
  Order,
  Vehicle,
  OptimizeRouteRequest,
  OptimizeRouteResponse,
} from "../types/api.types";

export const customerService = {
  getAll: () => api.get<Customer[]>(API_CONFIG.ENDPOINTS.CUSTOMERS),
  getById: (id: number) => api.get<Customer>(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`),
  create: (customer: Omit<Customer, "id">) =>
    api.post<Customer>(API_CONFIG.ENDPOINTS.CUSTOMERS, customer),
  update: (id: number, customer: Partial<Customer>) =>
    api.put<Customer>(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`, customer),
  delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`),
};

export const orderService = {
  getAll: () => api.get<Order[]>(API_CONFIG.ENDPOINTS.ORDERS),
  getById: (id: number) => api.get<Order>(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`),
  create: (order: Omit<Order, "id">) => api.post<Order>(API_CONFIG.ENDPOINTS.ORDERS, order),
  update: (id: number, order: Partial<Order>) =>
    api.put<Order>(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`, order),
  delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.ORDERS}/${id}`),
  getByDate: (fecha: string) => api.get<Order[]>(`${API_CONFIG.ENDPOINTS.ORDERS}/fecha/${fecha}`),
  getByDateAndEstado: (fecha: string, estado?: string) =>
    api.get<Order[]>(API_CONFIG.ENDPOINTS.ORDERS, { params: { fecha, estado } }),
};

export const vehicleService = {
  getAll: () => api.get<Vehicle[]>(API_CONFIG.ENDPOINTS.VEHICLES),
  getById: (id: number) => api.get<Vehicle>(`${API_CONFIG.ENDPOINTS.VEHICLES}/${id}`),
  create: (vehicle: Omit<Vehicle, "id">) =>
    api.post<Vehicle>(API_CONFIG.ENDPOINTS.VEHICLES, vehicle),
  update: (id: number, vehicle: Partial<Vehicle>) =>
    api.put<Vehicle>(`${API_CONFIG.ENDPOINTS.VEHICLES}/${id}`, vehicle),
  delete: (id: number) => api.delete(`${API_CONFIG.ENDPOINTS.VEHICLES}/${id}`),
  getActive: (activo = true) =>
    api.get<Vehicle[]>(API_CONFIG.ENDPOINTS.VEHICLES, { params: { activo } }),
};

export const routeService = {
  optimize: (request: OptimizeRouteRequest) =>
    api.post<OptimizeRouteResponse>(`${API_CONFIG.ENDPOINTS.ROUTE_PLANS}/mock/optimize`, request),
};
