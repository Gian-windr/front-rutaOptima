import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService, orderService } from '../services/dataService';
import type { Customer } from '../types/api.types';

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [customerId, setCustomerId] = useState<number | ''>('');
  const [fechaEntrega, setFechaEntrega] = useState(''); 
  const [cantidad, setCantidad] = useState<number | ''>('');
  const [volumen, setVolumen] = useState<number | ''>('');
  const [peso, setPeso] = useState<number | ''>('');
  const [tiempoServicioEstimadoMin, setTiempoServicioEstimadoMin] = useState<number>(10);
  const [prioridad, setPrioridad] = useState<number>(1);
  const [notas, setNotas] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await customerService.getAll();
        setCustomers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId || !fechaEntrega || !cantidad) {
      alert('Completa los campos obligatorios: Cliente, Fecha y Cantidad');
      return;
    }

    setSubmitting(true);
    try {
      const fechaIso = new Date(fechaEntrega).toISOString();

      const payload = {
        customerId: Number(customerId),
        fechaEntrega: fechaIso,
        cantidad: Number(cantidad),
        volumen: volumen === '' ? 0 : Number(volumen),
        peso: peso === '' ? 0 : Number(peso),
        tiempoServicioEstimadoMin: Number(tiempoServicioEstimadoMin),
        prioridad: Number(prioridad),
        notas: notas || undefined,
      };

      console.log({payload})

      await orderService.create(payload as any);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error al crear la orden');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Cargando clientes...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Orden</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cliente *</label>
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded"
          >
            <option value="">Selecciona un cliente</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre} - {c.direccion}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de entrega *</label>
          <input
            type="datetime-local"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cantidad *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Volumen</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={volumen}
              onChange={(e) => setVolumen(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Peso</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={peso}
              onChange={(e) => setPeso(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tiempo servicio (min)</label>
            <input
              type="number"
              min="0"
              value={tiempoServicioEstimadoMin}
              onChange={(e) => setTiempoServicioEstimadoMin(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prioridad</label>
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(Number(e.target.value))}
              className="w-full mt-1 p-2 border rounded"
            >
              <option value={1}>1 (Normal)</option>
              <option value={2}>2 (Alta)</option>
              <option value={3}>3 (Urgente)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notas</label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
            rows={4}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {submitting ? 'Creando...' : 'Crear Orden'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
