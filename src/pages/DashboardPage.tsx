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
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const [fecha] = useState<string>(today);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [customers, orders, vehicles, pendingOrdersReq] = await Promise.all([
        customerService.getAll(),
        orderService.getAll(),
        vehicleService.getAll(),
        orderService.getByDateAndEstado(fecha, 'PENDIENTE'),
      ]);

      const pendingOrders = pendingOrdersReq.data.filter((o: { estado?: string }) => o.estado === 'PENDIENTE').length;

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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-gray-400 mt-2">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-200 border border-gray-700 transform hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">Acceso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/optimize"
            className="block p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-900/30 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <h3 className="font-semibold text-blue-300">Optimizar Rutas</h3>
            <p className="text-sm text-gray-400 mt-1">Crear un nuevo plan de rutas optimizado</p>
          </a>
          <a href='/orders' className="block p-4 border-2 border-purple-500 rounded-lg hover:bg-purple-900/30 transition-all duration-200 transform hover:scale-[1.02]">
            <h3 className="font-semibold text-purple-300">Ver Órdenes</h3>
            <p className="text-sm text-gray-400 mt-1">Visualizar las órdenes registradas</p>
          </a>
          <a href='/customers' className="block p-4 border-2 border-red-600 rounded-lg hover:bg-red-900/30 transition-all duration-200 transform hover:scale-[1.02]">
            <h3 className="font-semibold text-red-400">Ver Clientes</h3>
            <p className="text-sm text-gray-500 mt-1">Visualizar los clientes registrados</p>
          </a>
        </div>
      </div>
    </div>
  );
}
