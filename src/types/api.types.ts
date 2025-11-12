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
  customerId: number;
  orderId: number;
  customerName?: string;
  sequence: number;
  eta: string;
  etd: string;
  distanceKmFromPrev: number;
  travelTimeMinFromPrev: number;
  cargaAcumuladaCantidad: number;
  // tiempoEsperaMin: number;
  latitude?: number;
  longitude?: number;
}

export interface RoutePlan {
  id: number;
  fecha: string;
  estado: "BORRADOR" | "CALCULADO" | "APROBADO" | "EN_EJECUCION" | "COMPLETADO";
  totalKilometros: number;
  totalMinutos: number;
  totalCosto: number;
  vehiculosUtilizados: number;
  ordenesAsignadas: number;
  ordenesNoAsignadas: number;
  objetivo: "MINIMIZE_DISTANCE" | "MINIMIZE_TIME" | "MINIMIZE_COST";
  stops: RouteStop[];
}

export interface OptimizeRouteRequest {
  fecha: string;
  orderIds: number[];
  vehicleIds: number[];
  objetivo: "MINIMIZE_DISTANCE" | "MINIMIZE_TIME" | "MINIMIZE_COST";
  maxOptimizationTimeSeconds?: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalVehicles: number;
  pendingOrders: number;
}
