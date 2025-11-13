// Tipos de la API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface Customer {
  id: number;
  nombre: string;
  direccion: string;
  latitud: number;
  longitud: number;
  esNuevo: boolean;
  ventanaHorariaInicio?: string;
  ventanaHorariaFin?: string;
  demandaPromedioSemanal: number;
  telefono?: string;
  email?: string;
  activo: boolean;
}

export interface Order {
  id: number;
  customerId: number;
  customerNombre?: string;
  fecha: string;
  cantidad: number;
  volumen: number;
  peso: number;
  tiempoServicioEstimadoMin: number;
  prioridad: "NORMAL" | "URGENTE" | "BAJA";
  estado: "PENDIENTE" | "ASIGNADO" | "ENTREGADO" | "CANCELADO";
  notas?: string;
}

export interface Vehicle {
  id: number;
  nombre: string;
  patente: string;
  tipo: "FURGONETA_GRANDE" | "FURGONETA_MEDIANA" | "MOTO";
  capacidadCantidad: number;
  capacidadVolumen: number;
  capacidadPeso: number;
  velocidadKmh: number;
  costoKm: number;
  activo: boolean;
  depotLatitud: number;
  depotLongitud: number;
  jornadaInicio: string;
  jornadaFin: string;
}

export interface RouteStop {
  orderId: number;
  customerId: number;
  customerName: string;
  direccion: string;
  sequence: number;
  eta: string;
  etd: string;
  latitude: number;
  longitude: number;
  distanceKmFromPrev: number;
  travelTimeMinFromPrev: number;
  waitTimeMin?: number;
  cargaAcumuladaCantidad: number;
  cargaAcumuladaVolumen: number;
  cargaAcumuladaPeso: number;
  cantidad: number;
  volumen: number;
  peso: number;
  vehicleId: number;
  vehiclePatente: string;
}

export interface RoutePlanMetrics {
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
  stops: RouteStop[];
  totalKm: number;
  totalTimeMin: number;
}

export interface RoutePlan {
  id: number;
  status: "PENDING" | "OPTIMIZING" | "OPTIMIZED" | "FAILED";
  metrics: RoutePlanMetrics;
  vehicleRoutes: VehicleRoute[];
  stops: RouteStop[];
  score?: string;
  tiempoOptimizacionSeg?: number;
}

export interface OptimizeRouteRequest {
  fecha: string;
  vehicleIds: number[];
  objective: "MINIMIZE_DISTANCE" | "MINIMIZE_TIME" | "MINIMIZE_COST";
  allowSoftTimeWindowViolations?: boolean;
  maxOptimizationTimeSeconds?: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalVehicles: number;
  pendingOrders: number;
}
