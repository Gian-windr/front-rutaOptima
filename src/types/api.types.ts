// Tipos de la API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
}

export interface Customer {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  zona: 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Centro';
  telefono?: string;
  email?: string;
  activo: boolean;
}

export interface Order {
  id: number;
  customerId: number;
  customerNombre?: string;
  cantidad: number;
  volumen: number;
  peso: number;
  fechaEntrega: string; // Formato ISO 8601, mínimo 3 días desde hoy
  prioridad: number;
  estado: 'PENDIENTE' | 'ASIGNADO' | 'ENTREGADO' | 'CANCELADO';
  tiempoServicioMinutos: number;
}

export interface Vehicle {
  id: number;
  nombre: string;
  patente: string;
  tipo: 'CAMION' | 'FURGONETA' | 'MOTO';
  capacidadCantidad: number;
  capacidadVolumen: number;
  capacidadPeso: number;
  velocidadKmh: number;
  costoKm: number;
  conductor: string;
  zona: 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Centro';
  color: string; // Formato hexadecimal #RRGGBB
  depotLatitud: number;
  depotLongitud: number;
  jornadaInicio: string; // Formato HH:mm:ss
  jornadaFin: string; // Formato HH:mm:ss
  activo: boolean;
}

export interface RouteStop {
  sequence: number;
  customerName: string;
  latitude: number;
  longitude: number;
  eta: string; // ISO 8601 - Estimated Time of Arrival
  etd: string; // ISO 8601 - Estimated Time of Departure
}

export interface OptimizationMetrics {
  totalKm: number;
  totalTimeMin: number;
  totalCost: number;
  vehiculosUtilizados: number;
  pedidosAsignados: number;
  pedidosNoAsignados: number;
}

export interface VehicleRoute {
  vehicleId: number;
  vehicleName: string;
  conductor: string;
  zona: string;
  color: string; // Hexadecimal
  totalKm: number;
  totalTimeMin: number;
  stops: RouteStop[];
}

export interface OptimizeRouteResponse {
  routePlanId?: number;
  status?: 'OPTIMIZED' | 'FAILED' | 'PARTIAL';
  score?: string;
  tiempoOptimizacionSeg?: number;
  metrics?: OptimizationMetrics;
  vehicleRoutes: VehicleRoute[]; // Backend usa vehicleRoutes, no routes
}

export interface OptimizeRouteRequest {
  fechaBase: string; // ISO 8601 datetime
  vehicleIds: number[];
  orderIds?: number[]; // Opcional, backend lo ignora
}

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalVehicles: number;
  pendingOrders: number;
}
