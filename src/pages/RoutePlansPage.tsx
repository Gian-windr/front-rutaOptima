import { useState, useEffect } from 'react';
import { routeService } from '../services/dataService';
import { RouteMap } from '../components/routes/RouteMap';
import { Calendar, MapPin, Clock, DollarSign, Package, Truck, ChevronDown, ChevronUp, Eye, Trash2 } from 'lucide-react';
import type { RoutePlan } from '../types/api.types';

export function RoutePlansPage() {
  const [routePlans, setRoutePlans] = useState<RoutePlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<RoutePlan | null>(null);
  const [expandedPlanId, setExpandedPlanId] = useState<number | null>(null);

  useEffect(() => {
    loadRoutePlans();
  }, []);

  const loadRoutePlans = async () => {
    setLoading(true);
    try {
      const response = await routeService.getAll();
      // Ordenar por fecha descendente (más reciente primero)
      const sorted = response.data.sort((a, b) => b.id - a.id);
      setRoutePlans(sorted);
    } catch (error) {
      console.error('Error loading route plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este plan de rutas?')) return;

    try {
      await routeService.delete(id);
      setRoutePlans((prev) => prev.filter((plan) => plan.id !== id));
      if (selectedPlan?.id === id) {
        setSelectedPlan(null);
      }
    } catch (error) {
      console.error('Error deleting route plan:', error);
      alert('Error al eliminar el plan de rutas');
    }
  };

  const handleViewDetails = (plan: RoutePlan) => {
    setSelectedPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleExpand = (planId: number) => {
    setExpandedPlanId(expandedPlanId === planId ? null : planId);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      OPTIMIZED: 'bg-green-100 text-green-800',
      OPTIMIZING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
      PENDING: 'bg-gray-100 text-gray-800',
    };
    return badges[status as keyof typeof badges] || badges.PENDING;
  };

  const getStatusText = (status: string) => {
    const texts = {
      OPTIMIZED: 'Optimizado',
      OPTIMIZING: 'Optimizando',
      FAILED: 'Fallido',
      PENDING: 'Pendiente',
    };
    return texts[status as keyof typeof texts] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Planes de Rutas</h1>
        <p className="text-gray-600 mt-2">Visualiza y gestiona tus rutas optimizadas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de planes de rutas */}
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {routePlans.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No hay planes de rutas disponibles</p>
              <p className="text-sm mt-2">Optimiza una ruta para verla aquí</p>
            </div>
          ) : (
            routePlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
                  selectedPlan?.id === plan.id
                    ? 'ring-2 ring-primary-500'
                    : ''
                }`}
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        Plan #{plan.id}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                          plan.status
                        )}`}
                      >
                        {getStatusText(plan.status)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(plan)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Ver detalles"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="p-1 hover:bg-red-50 rounded"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Métricas principales */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-600">
                        {(plan.metrics?.totalKm || 0).toFixed(1)} km
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span className="text-gray-600">
                        {((plan.metrics?.totalTimeMin || 0) / 60).toFixed(1)} hrs
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">
                        S/ {(plan.metrics?.totalCost || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-600">
                        {plan.metrics?.pedidosAsignados || 0} pedidos
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Truck className="w-4 h-4 text-gray-500" />
                    <span>{plan.metrics?.vehiculosUtilizados || 0} vehículos</span>
                  </div>

                  {/* Botón expandir/contraer */}
                  {plan.status === 'OPTIMIZED' && plan.stops && plan.stops.length > 0 && (
                    <button
                      onClick={() => toggleExpand(plan.id)}
                      className="w-full flex items-center justify-center gap-2 text-sm text-primary-600 hover:text-primary-700 py-2 border-t border-gray-200"
                    >
                      {expandedPlanId === plan.id ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Ocultar paradas
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Ver paradas ({plan.stops.length})
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Paradas expandibles */}
                {expandedPlanId === plan.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 max-h-64 overflow-y-auto">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm">
                      Paradas:
                    </h4>
                    <div className="space-y-2">
                      {plan.stops.map((stop) => (
                        <div
                          key={`${stop.vehicleId}-${stop.orderId}`}
                          className="text-xs bg-white p-2 rounded border border-gray-200"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="font-semibold text-gray-700">
                                #{stop.sequence}
                              </span>{' '}
                              - {stop.customerName}
                              <div className="text-gray-500 mt-1">
                                {stop.direccion}
                              </div>
                            </div>
                            <span className="text-gray-600 text-xs">
                              {new Date(stop.eta).toLocaleTimeString('es-PE', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-gray-500">
                            <span>Vehículo: {stop.vehiclePatente}</span>
                            {stop.distanceKmFromPrev > 0 && (
                              <span>
                                {stop.distanceKmFromPrev.toFixed(1)} km
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Panel de detalles y mapa */}
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <div className="space-y-4">
              {/* Mapa */}
              <div className="bg-white rounded-lg shadow-md h-[500px]">
                {selectedPlan.stops && selectedPlan.stops.length > 0 ? (
                  <RouteMap stops={selectedPlan.stops} />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No hay paradas para mostrar</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Detalles completos */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Detalles del Plan #{selectedPlan.id}
                </h3>

                {/* Métricas detalladas */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Distancia Total
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                      {(selectedPlan.metrics?.totalKm || 0).toFixed(2)} km
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Tiempo Total
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {((selectedPlan.metrics?.totalTimeMin || 0) / 60).toFixed(1)} hrs
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Costo Total
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      S/ {(selectedPlan.metrics?.totalCost || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Pedidos Asignados
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedPlan.metrics?.pedidosAsignados || 0}
                    </p>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Truck className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Vehículos Utilizados
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-indigo-600">
                      {selectedPlan.metrics?.vehiculosUtilizados || 0}
                    </p>
                  </div>

                  {selectedPlan.score && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Score OptaPlanner
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-600">
                        {selectedPlan.score}
                      </p>
                    </div>
                  )}
                </div>

                {/* Rutas por vehículo */}
                {selectedPlan.vehicleRoutes && selectedPlan.vehicleRoutes.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Rutas por Vehículo:
                    </h4>
                    <div className="space-y-3">
                      {selectedPlan.vehicleRoutes.map((route) => (
                        <div
                          key={route.vehicleId}
                          className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Truck className="w-5 h-5 text-primary-600" />
                            <span className="font-medium text-gray-900">
                              Vehículo ID: {route.vehicleId}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({route.stops.length} paradas)
                            </span>
                          </div>
                          <div className="space-y-2">
                            {route.stops.map((stop) => (
                              <div
                                key={`${stop.vehicleId}-${stop.orderId}`}
                                className="flex items-center justify-between text-sm bg-white p-2 rounded border border-gray-200"
                              >
                                <div>
                                  <span className="font-medium">
                                    #{stop.sequence}
                                  </span>{' '}
                                  - {stop.customerName}
                                </div>
                                <div className="text-gray-600">
                                  {new Date(stop.eta).toLocaleTimeString(
                                    'es-PE',
                                    { hour: '2-digit', minute: '2-digit' }
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md h-[600px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">
                  Selecciona un plan de rutas
                </p>
                <p className="text-sm mt-2">
                  Haz clic en un plan para ver sus detalles y mapa
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
