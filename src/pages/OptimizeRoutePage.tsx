import { useState, useEffect } from 'react';
import { orderService, vehicleService, routeService } from '../services/dataService';
import { RouteMap } from '../components/routes/RouteMap';
import { Play, Loader2, Check } from 'lucide-react';
import type { Order, Vehicle, RoutePlan } from '../types/api.types';

export function OptimizeRoutePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [objetivo, setObjetivo] = useState<'MINIMIZE_DISTANCE' | 'MINIMIZE_TIME' | 'MINIMIZE_COST'>('MINIMIZE_DISTANCE');
  
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [routePlan, setRoutePlan] = useState<RoutePlan | null>(null);

  // Reload orders when fecha changes
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersRes, vehiclesRes] = await Promise.all([
        // fetch orders for the selected date (no time range)
        orderService.getByDateAndEstado(fecha),
        vehicleService.getActive(),
      ]);
      
      const pendingOrders = ordersRes.data.filter((o) => o.estado === 'PENDIENTE');
      setOrders(pendingOrders);
      setVehicles(vehiclesRes.data);
      
      // Pre-seleccionar los primeros 10 pedidos y todos los vehículos
      setSelectedOrders(pendingOrders.slice(0, 10).map((o) => o.id));
      setSelectedVehicles(vehiclesRes.data.map((v) => v.id));
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (selectedOrders.length === 0 || selectedVehicles.length === 0) {
      alert('Selecciona al menos una orden y un vehículo');
      return;
    }

    setOptimizing(true);
    try {
      // Backend expects a LocalDate (YYYY-MM-DD). Send the date string directly
      // instead of an ISO Instant (which includes time) to avoid Jackson parsing errors.
      const fechaLocal = fecha; // e.g. '2025-11-12'

      const payload = {
        fecha: fechaLocal,
        vehicleIds: selectedVehicles,
        objective: objetivo, // backend expects 'objective'
        allowSoftTimeWindowViolations: false,
        maxOptimizationTimeSeconds: 20,
      } as const;

      const response = await routeService.optimize(payload as any);

      setRoutePlan(response.data);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Error al optimizar rutas');
    } finally {
      setOptimizing(false);
    }
  };

  const toggleOrder = (orderId: number) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  const toggleVehicle = (vehicleId: number) => {
    setSelectedVehicles((prev) =>
      prev.includes(vehicleId) ? prev.filter((id) => id !== vehicleId) : [...prev, vehicleId]
    );
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Panel de configuración */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de entrega
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Objetivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo de optimización
              </label>
              <select
                value={objetivo}
                onChange={(e) => setObjetivo(e.target.value as 'MINIMIZE_DISTANCE' | 'MINIMIZE_TIME' | 'MINIMIZE_COST')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="MINIMIZE_DISTANCE">Minimizar Distancia</option>
                <option value="MINIMIZE_TIME">Minimizar Tiempo</option>
                <option value="MINIMIZE_COST">Minimizar Costo</option>
              </select>
            </div>

            {/* Órdenes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Órdenes ({selectedOrders.length} seleccionadas)
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                {orders.map((order) => (
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
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Vehículos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehículos ({selectedVehicles.length} seleccionados)
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
                    <span className="ml-2 text-sm">
                      {vehicle.nombre} ({vehicle.patente})
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Botón optimizar */}
            <button
              onClick={handleOptimize}
              disabled={optimizing || selectedOrders.length === 0 || selectedVehicles.length === 0}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
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
            {routePlan ? (
              <RouteMap stops={routePlan.stops} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Optimiza una ruta para ver el mapa
              </div>
            )}
          </div>

          {/* Resultados */}
          {routePlan && (
            <div className="bg-white rounded-lg shadow-md p-6 h-[38%] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-500" />
                Ruta Optimizada
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Distancia Total</p>
                  <p className="text-xl font-bold text-gray-900">{routePlan.metrics.totalKm.toFixed(2)} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tiempo Total</p>
                  <p className="text-xl font-bold text-gray-900">{(routePlan.metrics.totalTimeMin / 60).toFixed(1)} hrs</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Costo Total</p>
                  <p className="text-xl font-bold text-gray-900">S/ {routePlan.metrics.totalCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Órdenes Asignadas</p>
                  <p className="text-xl font-bold text-gray-900">{routePlan.metrics.pedidosAsignados}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Paradas:</h4>
                {routePlan.stops.map((stop) => (
                  <div key={`${stop.vehicleId}-${stop.orderId}`} className="text-sm p-2 bg-gray-50 rounded">
                    <span className="font-medium">#{stop.sequence}</span> - {stop.customerName}
                    <span className="text-gray-600 ml-2">({stop.direccion})</span>
                    <span className="text-gray-600 ml-2">
                      ({new Date(stop.eta).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
