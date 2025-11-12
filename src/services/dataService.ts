import api from "./api";
import type {
  Customer,
  Order,
  Vehicle,
  RoutePlan,
  OptimizeRouteRequest,
} from "../types/api.types";

export const customerService = {
  getAll: () => api.get<Customer[]>("/customers"),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  create: (customer: Omit<Customer, "id">) =>
    api.post<Customer>("/customers", customer),
  update: (id: number, customer: Partial<Customer>) =>
    api.put<Customer>(`/customers/${id}`, customer),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

export const orderService = {
  getAll: () => api.get<Order[]>("/orders"),
  getById: (id: number) => api.get<Order>(`/orders/${id}`),
  create: (order: Omit<Order, "id">) => api.post<Order>("/orders", order),
  update: (id: number, order: Partial<Order>) =>
    api.put<Order>(`/orders/${id}`, order),
  delete: (id: number) => api.delete(`/orders/${id}`),
  getByDate: (fecha: string) => api.get<Order[]>(`/orders/fecha/${fecha}`),
  getByDateAndEstado: (fecha: string, estado?: string) =>
    api.get<Order[]>("/orders", { params: { fecha, estado } }),
  // New: fetch orders for a date and optional time range within that date.
  // If horaInicio/horaFin are provided they should be in 'HH:mm' format and
  // will be converted to full ISO instants combining the provided `fecha`.
  getByDateRange: (
    fecha: string,
    horaInicio?: string,
    horaFin?: string,
    estado?: string
  ) => {
    const params: Record<string, any> = { fecha };
    if (estado) params.estado = estado;
    if (horaInicio) {
      try {
        params.fechaInicio = new Date(
          `${fecha}T${horaInicio}:00`
        ).toISOString();
      } catch (e) {
        console.error(e);
      }
    }
    if (horaFin) {
      try {
        params.fechaFin = new Date(`${fecha}T${horaFin}:00`).toISOString();
      } catch (e) {
        console.error(e);
      }
    }

    return api.get<Order[]>("/orders", { params });
  },
};

export const vehicleService = {
  getAll: () => api.get<Vehicle[]>("/vehicles"),
  getById: (id: number) => api.get<Vehicle>(`/vehicles/${id}`),
  create: (vehicle: Omit<Vehicle, "id">) =>
    api.post<Vehicle>("/vehicles", vehicle),
  update: (id: number, vehicle: Partial<Vehicle>) =>
    api.put<Vehicle>(`/vehicles/${id}`, vehicle),
  delete: (id: number) => api.delete(`/vehicles/${id}`),
  getActive: (activo = true) =>
    api.get<Vehicle[]>("/vehicles", { params: { activo } }),
};

export const routeService = {
  optimize: (request: OptimizeRouteRequest) =>
    api.post<RoutePlan>("/route-plans/optimize", request),
  getById: (id: number) => api.get<RoutePlan>(`/route-plans/${id}`),
  getAll: () => api.get<RoutePlan[]>("/route-plans"),
  delete: (id: number) => api.delete(`/route-plans/${id}`),
};
