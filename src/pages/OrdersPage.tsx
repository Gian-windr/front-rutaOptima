import { useEffect, useState } from 'react';
import { orderService } from '../services/dataService';
import type { Order } from '../types/api.types';

export default function OrdersPage() {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const [fecha, setFecha] = useState<string>(today);
  const [estado, setEstado] = useState<string>('');
  const [horaInicio, setHoraInicio] = useState<string>('');
  const [horaFin, setHoraFin] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!fecha) {
      alert('Selecciona una fecha (obligatoria)');
      return;
    }

    setLoading(true);
    try {
      const res = await orderService.getByDateAndEstado(fecha, estado || undefined);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      alert('Error al obtener las órdenes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-6">Órdenes</h1>

      <div className="bg-gray-800/70 backdrop-blur-md p-4 rounded-xl shadow-2xl mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end border border-gray-700">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Fecha (obligatoria)</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Estado (opcional)</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="mt-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-lg w-full focus:ring-2 focus:ring-blue-500">
            <option value="">Todos</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="ASIGNADO">ASIGNADO</option>
            <option value="ENTREGADO">ENTREGADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Hora inicio (opcional)</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="mt-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Hora fin (opcional)</label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="mt-1 p-2 bg-gray-700 border border-gray-600 text-white rounded-lg w-full focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={fetchOrders} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg">Buscar</button>
          <button onClick={() => { setEstado(''); setFecha(today); }} className="px-4 py-2 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600">Limpiar</button>
        </div>
      </div>

      <div className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-4 border border-gray-700">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Cargando órdenes...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No hay órdenes para la fecha seleccionada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-700">
                  <th className="p-2">#</th>
                  <th className="p-2">Cliente</th>
                  <th className="p-2">Fecha</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Estado</th>
                  <th className="p-2">Notas</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                    <td className="p-2 text-sm text-gray-300">{o.id}</td>
                    <td className="p-2 text-sm text-gray-300">{o.customerNombre ?? `#${o.customerId}`}</td>
                    <td className="p-2 text-sm text-gray-300">{o.fechaEntrega ? new Date(o.fechaEntrega).toLocaleString() : 'N/A'}</td>
                    <td className="p-2 text-sm text-gray-300">{o.cantidad}</td>
                    <td className="p-2 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        o.estado === 'PENDIENTE' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-700' :
                        o.estado === 'ASIGNADO' ? 'bg-blue-900/50 text-blue-300 border border-blue-700' :
                        o.estado === 'ENTREGADO' ? 'bg-green-900/50 text-green-300 border border-green-700' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {o.estado}
                      </span>
                    </td>
                    <td className="p-2 text-sm text-gray-400">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
