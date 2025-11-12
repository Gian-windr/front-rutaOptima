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
      const res = await orderService.getByDateRange(fecha, horaInicio || undefined, horaFin || undefined, estado || undefined);
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
      <h1 className="text-2xl font-bold mb-4">Órdenes</h1>

      <div className="bg-white p-4 rounded shadow mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600">Fecha (obligatoria)</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Estado (opcional)</label>
          <select value={estado} onChange={(e) => setEstado(e.target.value)} className="mt-1 p-2 border rounded w-full">
            <option value="">Todos</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="ASIGNADO">ASIGNADO</option>
            <option value="ENTREGADO">ENTREGADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600">Hora inicio (opcional)</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600">Hora fin (opcional)</label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={fetchOrders} className="bg-primary-600 text-white px-4 py-2 rounded">Buscar</button>
          <button onClick={() => { setEstado(''); setFecha(today); }} className="px-4 py-2 border rounded">Limpiar</button>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div className="text-center py-8">Cargando órdenes...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No hay órdenes para la fecha seleccionada.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-600">
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
                  <tr key={o.id} className="border-t">
                    <td className="p-2 text-sm">{o.id}</td>
                    <td className="p-2 text-sm">{o.customerNombre ?? `#${o.customerId}`}</td>
                    <td className="p-2 text-sm">{new Date(o.fecha).toLocaleString()}</td>
                    <td className="p-2 text-sm">{o.cantidad}</td>
                    <td className="p-2 text-sm">{o.estado}</td>
                    <td className="p-2 text-sm">{o.notas ?? '-'}</td>
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
