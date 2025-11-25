import { useState, useEffect } from 'react';
import { orderService, vehicleService, routeService } from '../services/dataService';
import { RouteMap } from '../components/routes/RouteMap';
import { Play, Loader2, Check, AlertCircle } from 'lucide-react';
import type { Vehicle, Order, OptimizeRouteResponse } from '../types/api.types';

export function OptimizeRoutePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [fechaBase, setFechaBase] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [routeResponse, setRouteResponse] = useState<OptimizeRouteResponse | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Establecer fecha mínima (hoy + 3 días)
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3);
    minDate.setHours(8, 0, 0, 0);
    setFechaBase(minDate.toISOString().slice(0, 16));
    
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    // Debug: Verificar token
    const token = localStorage.getItem('token');
    console.log('🔍 OptimizeRoutePage - Verificando token:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN FOUND');
    
    try {
      const [vehiclesRes, ordersRes] = await Promise.all([
        vehicleService.getActive(),
        orderService.getAll(),
      ]);
      
      setVehicles(vehiclesRes.data);
      
      // Filtrar solo órdenes pendientes
      const pendingOrders = ordersRes.data.filter((o) => o.estado === 'PENDIENTE');
      setOrders(pendingOrders);
      
      // Pre-seleccionar todos los vehículos
      setSelectedVehicles(vehiclesRes.data.map((v) => v.id));
      
      // Pre-seleccionar las primeras 10 órdenes
      setSelectedOrders(pendingOrders.slice(0, 10).map((o) => o.id));
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error al cargar datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (selectedVehicles.length === 0) {
      setError('Selecciona al menos un vehículo');
      return;
    }

    setError('');
    setOptimizing(true);
    
    try {
      const request = {
        fechaBase: fechaBase,
        vehicleIds: selectedVehicles,
        orderIds: selectedOrders // Opcional, el backend lo ignora
      };

      console.log('📤 Request de optimización:', request);

      const response = await routeService.optimize(request);

      console.log('📥 Response de optimización:', response.data);

      if (response.data.vehicleRoutes && response.data.vehicleRoutes.length > 0) {
        setRouteResponse(response.data);
      } else if (response.data.status === 'OPTIMIZED') {
        setRouteResponse(response.data);
      } else if (response.data.status === 'PARTIAL') {
        setRouteResponse(response.data);
        setError('Optimización parcial: algunos pedidos no pudieron ser asignados');
      } else {
        setError('La optimización no pudo completarse exitosamente');
      }
    } catch (error) {
      console.error('❌ Error en optimización:', error);
      const err = error as {
        response?: {
          data?: { message?: string; error?: string };
          status?: number;
        };
        message?: string;
      };

      let errorMsg = 'Error al optimizar rutas';

      // Verificar si es error de autenticación
      if (err.response?.status === 401 || err.response?.status === 403) {
        errorMsg = 'No autenticado. Por favor, inicia sesión nuevamente.';
        console.error('🔒 Error de autenticación. Token inválido o expirado.');
      } else if (err.response?.status === 500) {
        errorMsg = 'Error interno del servidor. El backend no pudo procesar la solicitud. Por favor contacte al administrador.';
        console.error('🔥 Error 500: El backend tiene un problema interno');
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
      } else if (err.message) {
        errorMsg = err.message;
      }

      if (err.response?.status) {
        errorMsg = `${errorMsg} (HTTP ${err.response.status})`;
      }

      setError(errorMsg);
    } finally {
      setOptimizing(false);
    }
  };

  const toggleVehicle = (vehicleId: number) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
  };

  const toggleOrder = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Optimizar Rutas</h1>
        <p className="text-gray-600 mt-2">Crea un plan de rutas optimizado para tus entregas</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Panel de configuración */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Fecha base */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha y hora base
              </label>
              <input
                type="datetime-local"
                value={fechaBase}
                onChange={(e) => setFechaBase(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Las órdenes deben tener fecha de entrega de al menos 3 días desde hoy
              </p>
            </div>

            {/* Órdenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Órdenes Pendientes ({selectedOrders.length} de {orders.length} seleccionadas)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No hay órdenes pendientes
                  </p>
                ) : (
                  orders.map((order) => (
                    <label
                      key={order.id}
                      className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrder(order.id)}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm">
                        #{order.id} - {order.customerNombre || `Cliente ${order.customerId}`}
                        <span className="text-xs text-gray-500 ml-1">
                          ({order.cantidad} u, {order.peso}kg)
                        </span>
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Vehículos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehículos ({selectedVehicles.length} de {vehicles.length} seleccionados)
              </label>
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <label
                    key={vehicle.id}
                    className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={() => toggleVehicle(vehicle.id)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div 
                      className="w-3 h-3 rounded-full ml-2 mr-2"
                      style={{ backgroundColor: vehicle.color }}
                    />
                    <span className="text-sm">
                      {vehicle.nombre} ({vehicle.patente})
                      <span className="text-xs text-gray-500 ml-1">
                        - {vehicle.conductor} - Zona {vehicle.zona}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botón optimizar */}
            <button
              onClick={handleOptimize}
              disabled={optimizing || selectedOrders.length === 0 || selectedVehicles.length === 0}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {optimizing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Optimizando...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Optimizar Rutas
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mapa y resultados */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mapa */}
          <div className="bg-white rounded-lg shadow-md h-[60%]">
            {routeResponse && routeResponse.vehicleRoutes && routeResponse.vehicleRoutes.length > 0 ? (
              <RouteMap routes={routeResponse.vehicleRoutes} />
            ) : routeResponse ? (
              <div className="h-full flex items-center justify-center text-yellow-600">
                <div className="text-center p-6">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-lg font-medium mb-2">No se generaron rutas</p>
                  <p className="text-sm">El backend no pudo crear un plan de rutas. Contacte al administrador.</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">Optimiza una ruta para ver el mapa</p>
                  <p className="text-sm">Selecciona órdenes y vehículos, luego haz clic en "Optimizar Rutas"</p>
                </div>
              </div>
            )}
          </div>

          {/* Resultados */}
          {routeResponse && (
            <div className="bg-white rounded-lg shadow-md p-6 h-[38%] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                Ruta Optimizada {routeResponse.status ? `- ${routeResponse.status}` : ''}
              </h3>
              
              {routeResponse.metrics && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Distancia Total</p>
                      <p className="text-xl font-bold text-gray-900">
                        {routeResponse.metrics.totalKm.toFixed(2)} km
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tiempo Total</p>
                      <p className="text-xl font-bold text-gray-900">
                        {(routeResponse.metrics.totalTimeMin / 60).toFixed(1)} hrs
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Costo Total</p>
                      <p className="text-xl font-bold text-green-600">
                        S/ {routeResponse.metrics.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Vehículos</p>
                      <p className="text-xl font-bold text-blue-600">
                        {routeResponse.metrics.vehiculosUtilizados}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">Pedidos Asignados</p>
                      <p className="text-lg font-semibold text-green-700">
                        {routeResponse.metrics.pedidosAsignados}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">No Asignados</p>
                      <p className="text-lg font-semibold text-red-600">
                        {routeResponse.metrics.pedidosNoAsignados}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {routeResponse.score && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600">Score de Optimización</p>
                  <p className="text-sm font-mono text-blue-800">{routeResponse.score}</p>
                  {routeResponse.tiempoOptimizacionSeg && (
                    <p className="text-xs text-gray-500 mt-1">
                      Tiempo: {routeResponse.tiempoOptimizacionSeg}s
                    </p>
                  )}
                </div>
              )}

              {/* Rutas por vehículo */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Rutas por Vehículo:</h4>
                {routeResponse.vehicleRoutes && routeResponse.vehicleRoutes.length > 0 ? (
                  routeResponse.vehicleRoutes.map((route) => (
                    <div key={route.vehicleId} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div 
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: route.color }}
                        />
                        <span className="font-semibold">{route.vehicleName}</span>
                        <span className="text-sm text-gray-600 ml-2">
                          ({route.conductor} - {route.zona})
                        </span>
                      </div>
                    <div className="space-y-1">
                      {route.stops.map((stop) => (
                        <div key={stop.sequence} className="text-sm p-2 bg-gray-50 rounded flex justify-between">
                          <span>
                            <span className="font-medium">#{stop.sequence}</span> {stop.customerName}
                          </span>
                          <span className="text-gray-600">
                            ETA: {formatTime(stop.eta)}
                          </span>
                        </div>
                      ))}
                      {route.stops.length === 0 && (
                        <p className="text-sm text-gray-500 italic">Sin paradas asignadas</p>
                      )}
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 font-medium">⚠️ No se generaron rutas</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      El backend devolvió un resultado vacío. Por favor, contacte al administrador.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

