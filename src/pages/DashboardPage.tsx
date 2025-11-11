import { useEffect, useState } from 'react';
import { customerService, orderService, vehicleService } from '../services/dataService';
import { Users, Package, Truck, Clock } from 'lucide-react';
import type { DashboardStats } from '../types/api.types';

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalOrders: 0,
    totalVehicles: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [customers, orders, vehicles] = await Promise.all([
        customerService.getAll(),
        orderService.getAll(),
        vehicleService.getAll(),
      ]);

      const pendingOrders = orders.data.filter((o) => o.estado === 'PENDIENTE').length;

      setStats({
        totalCustomers: customers.data.length,
        totalOrders: orders.data.length,
        totalVehicles: vehicles.data.length,
        pendingOrders,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Clientes',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Órdenes Totales',
      value: stats.totalOrders,
      icon: Package,
      color: 'bg-green-500',
    },
    {
      title: 'Vehículos',
      value: stats.totalVehicles,
      icon: Truck,
      color: 'bg-purple-500',
    },
    {
      title: 'Órdenes Pendientes',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-orange-500',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/optimize"
            className="block p-4 border-2 border-primary-500 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <h3 className="font-semibold text-primary-700">Optimizar Rutas</h3>
            <p className="text-sm text-gray-600 mt-1">Crear un nuevo plan de rutas optimizado</p>
          </a>
          <div className="block p-4 border-2 border-gray-200 rounded-lg bg-gray-50 opacity-60">
            <h3 className="font-semibold text-gray-500">Ver Órdenes</h3>
            <p className="text-sm text-gray-500 mt-1">Próximamente disponible</p>
          </div>
          <div className="block p-4 border-2 border-gray-200 rounded-lg bg-gray-50 opacity-60">
            <h3 className="font-semibold text-gray-500">Ver Clientes</h3>
            <p className="text-sm text-gray-500 mt-1">Próximamente disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
}
