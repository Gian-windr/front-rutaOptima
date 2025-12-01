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

export interface RouteGeometry {
  type: 'LineString';
  coordinates: [number, number][]; // [longitude, latitude]
}

export interface RouteStop {
  orderId: number;
  customerId: number;
  customerName: string;
  direccion: string;
  sequence: number;
  eta: string; // ISO 8601
  etd: string; // ISO 8601
  latitude: number;
  longitude: number;
  distanceKmFromPrev: number;
  travelTimeMinFromPrev: number;
  serviceTimeMin: number; // NUEVO: Tiempo de descarga/servicio
  waitTimeMin?: number | null;
  cargaAcumuladaCantidad?: number | null;
  cargaAcumuladaVolumen?: number | null;
  cargaAcumuladaPeso?: number | null;
  cantidad: number;
  volumen?: number | null;
  peso?: number | null;
  vehicleId?: number | null;
  vehiclePatente?: string | null;
}

export interface OptimizationMetrics {
  totalKm: number;
  totalTimeMin: number;
  totalTravelTimeMin: number; // NUEVO: Solo tiempo en carretera
  totalServiceTimeMin: number; // NUEVO: Solo tiempo de servicio
  totalWaitTimeMin: number; // NUEVO: Solo tiempo de espera
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
  routeGeometry?: RouteGeometry; // NUEVO: Geometría de la ruta siguiendo calles
  totalKm: number;
  totalTimeMin: number;
  totalTravelTimeMin?: number; // NUEVO: Solo tiempo en carretera
  totalServiceTimeMin?: number; // NUEVO: Solo tiempo de servicio
  totalWaitTimeMin?: number; // NUEVO: Solo tiempo de espera
  returnToDepotKm?: number; // NUEVO: Distancia de regreso al depot
  returnToDepotTimeMin?: number; // NUEVO: Tiempo de regreso al depot
  stops: RouteStop[];
}

export interface OptimizeRouteResponse {
  routePlanId?: number;
  status?: 'OPTIMIZED' | 'FAILED' | 'PARTIAL';
  score: string; // Formato OptaPlanner: "0hard/-45280soft"
  tiempoOptimizacionSeg?: number;
  metrics?: OptimizationMetrics;
  vehicleRoutes: VehicleRoute[]; // Backend usa vehicleRoutes, no routes
}

export interface OptimizeRouteRequest {
  fecha: string; // Formato: "YYYY-MM-DD"
  vehicleIds: number[];
  orderIds?: number[]; // IDs de órdenes específicas a optimizar (opcional)
  objective?: 'MINIMIZE_DISTANCE' | 'MINIMIZE_TIME'; // Opcional, default MINIMIZE_DISTANCE
}

export interface DashboardStats {
  totalCustomers: number;
  totalOrders: number;
  totalVehicles: number;
  pendingOrders: number;
}
