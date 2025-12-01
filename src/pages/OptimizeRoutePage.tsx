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
    // Establecer fecha por defecto: 9 de diciembre 2025 (fecha con órdenes de prueba)
    const defaultDate = new Date('2025-12-09T08:00:00');
    setFechaBase(defaultDate.toISOString().slice(0, 16));
    
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
      
      // Pre-seleccionar los primeros 4 vehículos disponibles
      const firstFourVehicles = vehiclesRes.data.slice(0, 4).map(v => v.id);
      setSelectedVehicles(firstFourVehicles);
      
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
      // Convertir fechaBase a formato YYYY-MM-DD
      const fecha = fechaBase.split('T')[0];
      
      const request = {
        fecha: fecha,
        vehicleIds: selectedVehicles,
        orderIds: selectedOrders,
        objective: 'MINIMIZE_DISTANCE' as const
      };

      console.log('📤 Request de optimización OptaPlanner:', request);

      const response = await routeService.optimize(request);

      console.log('📥 Response de optimización COMPLETA:', JSON.stringify(response.data, null, 2));
      console.log('🎯 Score OptaPlanner:', response.data.score);
      console.log('🚗 VehicleRoutes:', response.data.vehicleRoutes);
      
      // Log detallado de cada ruta y routeGeometry
      if (response.data.vehicleRoutes) {
        console.log('\n=== VERIFICACIÓN ROUTE GEOMETRY ===');
        let totalStops = 0;
        response.data.vehicleRoutes.forEach((route, idx) => {
          const stopsCount = route.stops?.length || 0;
          totalStops += stopsCount;
          
          console.log(`\n🚙 Ruta ${idx + 1}: ${route.vehicleName}`);
          console.log(`  vehicleId: ${route.vehicleId}`);
          console.log(`  stops: ${stopsCount}`);
          console.log(`  routeGeometry existe: ${!!route.routeGeometry}`);
          if (route.routeGeometry?.coordinates) {
            console.log(`  Waypoints: ${route.routeGeometry.coordinates.length}`);
            console.log(`  Primer punto:`, route.routeGeometry.coordinates[0]);
            console.log(`  Último punto:`, route.routeGeometry.coordinates[route.routeGeometry.coordinates.length - 1]);
          }
          console.log(`  Tiempos - Total: ${route.totalTimeMin}, Viaje: ${route.totalTravelTimeMin}, Servicio: ${route.totalServiceTimeMin}`);
          console.log(`  Retorno al depot: ${route.returnToDepotKm?.toFixed(2)} km, ${route.returnToDepotTimeMin} min`);
        });
        console.log(`\n📊 TOTAL DE PARADAS EN TODAS LAS RUTAS: ${totalStops}`);
        console.log(`✅ Deberías ver ${totalStops} marcadores numerados con tooltips en el mapa`);
        
        // Verificar inconsistencia entre pedidosAsignados y stops reales
        const pedidosAsignados = response.data.metrics?.pedidosAsignados || 0;
        if (pedidosAsignados > totalStops) {
          console.warn(`\n⚠️ ADVERTENCIA: El backend reporta ${pedidosAsignados} pedidos asignados pero solo devuelve ${totalStops} stops`);
          console.warn('🔴 Esto es un bug del backend. Debería devolver un stop por cada pedido asignado.');
          console.warn('📝 Por favor reportar al equipo de backend.\n');
          
          setError(`⚠️ Advertencia: El backend asignó ${pedidosAsignados} pedidos pero solo devolvió ${totalStops} ubicaciones. Puede haber pedidos faltantes en el mapa.`);
        }
      }

      // Validar score y pedidos no asignados
      if (response.data.score) {
        const hardMatch = response.data.score.match(/(-?\d+)hard/);
        const hardScore = hardMatch ? parseInt(hardMatch[1]) : 0;
        
        if (hardScore < 0) {
          setError(`❌ Solución con restricciones violadas (${response.data.score}). No se pueden asignar todos los pedidos.`);
        } else if (response.data.metrics && response.data.metrics.pedidosNoAsignados > 0) {
          setError(`⚠️ ${response.data.metrics.pedidosNoAsignados} pedidos no asignados. Verifica capacidad de vehículos o zonas.`);
        }
      }

      // Siempre establecer la respuesta si existe
      setRouteResponse(response.data);
      
      // Verificar si hay rutas generadas
      if (response.data.vehicleRoutes && response.data.vehicleRoutes.length > 0) {
        // Hay rutas, limpiar errores solo si no hay advertencias
        if (!error || !error.includes('⚠️')) {
          setError('');
        }
      } else {
        // No hay rutas generadas
        setRouteResponse(null);
        
        // Verificar si es porque no hay pedidos para esa fecha
        const metrics = response.data.metrics;
        if (metrics && metrics.pedidosAsignados === 0 && metrics.pedidosNoAsignados === 0) {
          setError(`📅 No hay pedidos pendientes para la fecha ${fecha}. Selecciona otra fecha con pedidos disponibles.`);
        } else if (metrics && metrics.pedidosNoAsignados > 0) {
          setError(`⚠️ ${metrics.pedidosNoAsignados} pedidos no pudieron ser asignados. Verifica capacidad de vehículos o zonas.`);
        } else {
          setError('No se pudieron generar rutas. Verifica que haya pedidos pendientes para esta fecha.');
        }
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
      } else if (err.response?.status === 400) {
        // Error de validación (probablemente sin pedidos para esa fecha)
        errorMsg = err.response?.data?.message || err.response?.data?.error || 'No hay pedidos pendientes para la fecha seleccionada';
        console.error('📅 Error 400: Sin pedidos para la fecha');
      } else if (err.response?.status === 422) {
        // Error de OptaPlanner (restricciones no cumplidas)
        errorMsg = 'No se pudo generar una solución válida. Verifica capacidad de vehículos y zonas.';
        console.error('⚠️ Error 422: OptaPlanner no pudo resolver el problema');
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

      if (err.response?.status && err.response.status !== 400 && err.response.status !== 422) {
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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Optimizar Rutas con IA
        </h1>
        <p className="text-gray-400 mt-2">Crea un plan de rutas optimizado usando OptaPlanner + OSRM</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg flex items-center gap-2 backdrop-blur-sm">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Panel de configuración */}
          <div className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 overflow-y-auto border border-gray-700">
          <div className="space-y-6">
            {/* Fecha base */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha y hora base
              </label>
              <input
                type="datetime-local"
                value={fechaBase}
                onChange={(e) => setFechaBase(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Las órdenes deben tener fecha de entrega de al menos 3 días desde hoy
              </p>
            </div>

            {/* Órdenes Pendientes - Seleccionables */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Órdenes Pendientes ({selectedOrders.length} de {orders.length} seleccionadas)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-700 rounded-lg p-2 bg-gray-900/50">
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-2">
                    No hay órdenes pendientes para esta fecha
                  </p>
                ) : (
                  orders.map((order) => (
                    <label
                      key={order.id}
                      className="flex items-center p-2 hover:bg-gray-700 rounded cursor-pointer transition-colors duration-150"
                    >
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => toggleOrder(order.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                      />
                      <span className="ml-2 text-sm text-gray-200">
                        #{order.id} - {order.customerNombre || `Cliente ${order.customerId}`}
                        <span className="text-xs text-gray-400 ml-1">
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vehículos ({selectedVehicles.length} de {vehicles.length} seleccionados)
              </label>
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <label
                    key={vehicle.id}
                    className="flex items-center p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors duration-150 border border-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={() => toggleVehicle(vehicle.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                    />
                    <div 
                      className="w-4 h-4 rounded-full ml-2 mr-2 shadow-lg"
                      style={{ backgroundColor: vehicle.color }}
                    />
                    <span className="text-sm text-gray-200">
                      {vehicle.nombre} ({vehicle.patente})
                      <span className="text-xs text-gray-400 ml-1">
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-[1.02]"
            >
              {optimizing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  OptaPlanner optimizando... (puede tardar hasta 2 min)
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Optimizar Rutas con IA
                </>
              )}
            </button>
            
            {optimizing && (
              <div className="mt-2 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                <p className="text-sm text-blue-300">
                  ⏳ OptaPlanner procesando con OSRM... Esto puede tomar hasta 2 minutos con muchas órdenes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mapa y resultados */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mapa */}
          <div className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl h-[60%] border border-gray-700 overflow-hidden">
            {routeResponse && routeResponse.vehicleRoutes && routeResponse.vehicleRoutes.length > 0 ? (
              <RouteMap routes={routeResponse.vehicleRoutes} />
            ) : routeResponse ? (
              <div className="h-full flex items-center justify-center text-yellow-400">
                <div className="text-center p-6">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-lg font-medium mb-2 text-white">No se generaron rutas</p>
                  <p className="text-sm text-gray-400">El backend no pudo crear un plan de rutas. Contacte al administrador.</p>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-lg mb-2 text-white">Optimiza una ruta para ver el mapa</p>
                  <p className="text-sm text-gray-400">Selecciona órdenes y vehículos, luego haz clic en "Optimizar Rutas"</p>
                </div>
              </div>
            )}
          </div>

          {/* Resultados */}
          {routeResponse && (
            <div className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl p-6 h-[38%] overflow-y-auto border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-400" />
                Ruta Optimizada {routeResponse.status ? `- ${routeResponse.status}` : ''}
              </h3>
              
              {routeResponse.metrics && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-4 rounded-lg border border-blue-700">
                      <p className="text-sm text-blue-300">Distancia Total</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {routeResponse.metrics.totalKm.toFixed(2)} km
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-4 rounded-lg border border-purple-700">
                      <p className="text-sm text-purple-300">Tiempo Total</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {(routeResponse.metrics.totalTimeMin / 60).toFixed(1)} hrs
                      </p>
                      {routeResponse.metrics.totalTravelTimeMin !== undefined && (
                        <p className="text-xs text-purple-300 mt-1">
                          {routeResponse.metrics.totalTravelTimeMin} min viaje + {routeResponse.metrics.totalServiceTimeMin} min servicio
                        </p>
                      )}
                    </div>
                    <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-4 rounded-lg border border-green-700">
                      <p className="text-sm text-green-300">Costo Total</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        S/ {routeResponse.metrics.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/50 p-4 rounded-lg border border-orange-700">
                      <p className="text-sm text-orange-300">Vehículos</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {routeResponse.metrics.vehiculosUtilizados}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div>
                      <p className="text-sm text-gray-400">Pedidos Asignados</p>
                      <p className="text-lg font-semibold text-green-400">
                        {routeResponse.metrics.pedidosAsignados}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">No Asignados</p>
                      <p className="text-lg font-semibold text-red-400">
                        {routeResponse.metrics.pedidosNoAsignados}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Score OptaPlanner */}
              <div className="mb-4 p-4 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-blue-300">Score OptaPlanner</p>
                  {routeResponse.score && (() => {
                    const hardMatch = routeResponse.score.match(/(-?\d+)hard/);
                    const hardScore = hardMatch ? parseInt(hardMatch[1]) : 0;
                    return (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        hardScore === 0 
                          ? 'bg-green-900/50 text-green-300 border border-green-700' 
                          : 'bg-red-900/50 text-red-300 border border-red-700'
                      }`}>
                        {hardScore === 0 ? '✅ Solución Válida' : '❌ Restricciones Violadas'}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-lg font-mono text-blue-200 mb-1">{routeResponse.score || 'N/A'}</p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Optimizado con IA + OSRM</span>
                  {routeResponse.tiempoOptimizacionSeg && (
                    <span>{routeResponse.tiempoOptimizacionSeg}s</span>
                  )}
                </div>
              </div>

              {/* Rutas por vehículo */}
              <div className="space-y-4">
                <h4 className="font-medium text-white">Rutas por Vehículo:</h4>
                {routeResponse.vehicleRoutes && routeResponse.vehicleRoutes.length > 0 ? (
                  routeResponse.vehicleRoutes.map((route) => (
                    <div key={route.vehicleId} className="border border-gray-700 rounded-lg p-3 bg-gray-900/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div 
                            className="w-4 h-4 rounded-full mr-2 shadow-lg"
                            style={{ backgroundColor: route.color }}
                          />
                          <span className="font-semibold text-white">{route.vehicleName}</span>
                          <span className="text-sm text-gray-400 ml-2">
                            ({route.conductor} - {route.zona})
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {route.totalKm?.toFixed(1) || '0.0'} km • {route.totalTimeMin || 0} min
                          {route.returnToDepotKm && (
                            <span className="ml-2 text-blue-400">
                              (Regreso: {route.returnToDepotKm.toFixed(1)} km)
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Desglose de tiempos */}
                      {(route.totalTravelTimeMin !== undefined || route.totalServiceTimeMin !== undefined) && (
                        <div className="text-xs bg-blue-900/30 p-2 rounded mb-2 border border-blue-700">
                          <span className="font-medium text-blue-300">Tiempos: </span>
                          {route.totalTravelTimeMin !== undefined && (
                            <span className="text-blue-300">Viaje: {route.totalTravelTimeMin} min</span>
                          )}
                          {route.totalServiceTimeMin !== undefined && (
                            <span className="text-blue-300 ml-2">Servicio: {route.totalServiceTimeMin} min</span>
                          )}
                          {route.returnToDepotTimeMin !== undefined && (
                            <span className="text-blue-300 ml-2">Regreso: {route.returnToDepotTimeMin} min</span>
                          )}
                        </div>
                      )}
                      
                    <div className="space-y-1">
                      {route.stops && route.stops.length > 0 ? route.stops.map((stop) => (
                        <div key={stop.sequence} className="text-xs p-2 bg-gray-800/50 rounded border border-gray-700">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-white">
                              #{stop.sequence} {stop.customerName}
                            </span>
                            <span className="text-gray-400">
                              {formatTime(stop.eta)}
                            </span>
                          </div>
                          <div className="text-gray-400 flex gap-3 flex-wrap">
                            <span>{stop.cantidad} unid.</span>
                            <span>{stop.distanceKmFromPrev.toFixed(1)} km</span>
                            <span>{stop.travelTimeMinFromPrev} min viaje</span>
                            <span>{stop.serviceTimeMin} min servicio</span>
                            {stop.waitTimeMin && stop.waitTimeMin > 0 && (
                              <span>{stop.waitTimeMin} min espera</span>
                            )}
                          </div>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-400 italic">Sin paradas asignadas</p>
                      )}
                    </div>
                  </div>
                  ))
                ) : (
                  <div className="p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                    <p className="text-yellow-300 font-medium">No se generaron rutas</p>
                    <p className="text-sm text-yellow-400 mt-1">
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

