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
      // Convertir fecha correctamente a ISO 8601
      const fechaISO = new Date(fechaEntrega).toISOString();

      const payload = {
        customerId: Number(customerId),
        fechaEntrega: fechaISO,
        cantidad: Number(cantidad),
        volumen: volumen === '' ? 0 : Number(volumen),
        peso: peso === '' ? 0 : Number(peso),
        tiempoServicioMinutos: Number(tiempoServicioEstimadoMin),
        prioridad: Number(prioridad),
        estado: 'PENDIENTE' as const
      };

      console.log('📤 Creando orden con payload:', payload);
      const response = await orderService.create(payload);
      console.log('✅ Orden creada exitosamente:', response.data);
      alert('¡Orden creada exitosamente!');
      navigate(-1);
    } catch (err) {
      console.error('❌ Error completo:', err);
      const error = err as {
        response?: {
          data?: { message?: string; error?: string } | string;
          status?: number;
        };
        message?: string;
      };

      let errorMsg = 'Error al crear la orden';

      // Manejo de errores específicos del backend
      if (error.response) {
        console.log('📥 Respuesta del backend:', error.response);

        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data?.message) {
          const msg = error.response.data.message;

          // Mensajes específicos del backend
          if (msg.includes('clientes nuevos')) {
            errorMsg = 'Los clientes nuevos requieren mínimo 5 días de anticipación';
          } else if (msg.includes('ventana horaria')) {
            errorMsg = 'La fecha de entrega no coincide con la ventana horaria del cliente';
          } else if (msg.includes('no existe')) {
            errorMsg = 'El cliente seleccionado no existe';
          } else {
            errorMsg = msg;
          }
        } else if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        } else {
          errorMsg = `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Crear Nueva Orden
        </h1>
        <p className="text-gray-400 mt-2">Completa la información para crear una orden de entrega</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-gray-700 space-y-6">
          
          {/* Sección: Información del Cliente */}
          <div className="border-b border-gray-700 pb-4">
            <h2 className="text-xl font-semibold text-white mb-4">Información del Cliente</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cliente *
              </label>
              <p className="text-xs text-gray-500 mb-2">Selecciona el cliente que recibirá la entrega</p>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Selecciona un cliente</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} - {c.direccion} (Zona {c.zona})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sección: Fecha y Hora */}
          <div className="border-b border-gray-700 pb-4">
            <h2 className="text-xl font-semibold text-white mb-4">Fecha y Hora de Entrega</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fecha y hora de entrega *
              </label>
              <p className="text-xs text-gray-500 mb-2">Debe ser al menos 3 días después de hoy para clientes existentes</p>
              <input
                type="datetime-local"
                value={fechaEntrega}
                onChange={(e) => setFechaEntrega(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Sección: Detalles del Pedido */}
          <div className="border-b border-gray-700 pb-4">
            <h2 className="text-xl font-semibold text-white mb-4">Detalles del Pedido</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cantidad de productos *
                </label>
                <p className="text-xs text-gray-500 mb-2">Número de unidades a entregar</p>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: 50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Volumen (m³)
                </label>
                <p className="text-xs text-gray-500 mb-2">Espacio que ocupa en el vehículo</p>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={volumen}
                  onChange={(e) => setVolumen(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: 1.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Peso (kg)
                </label>
                <p className="text-xs text-gray-500 mb-2">Peso total de la carga</p>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: 120"
                />
              </div>
            </div>
          </div>

          {/* Sección: Configuración Adicional */}
          <div className="border-b border-gray-700 pb-4">
            <h2 className="text-xl font-semibold text-white mb-4">Configuración Adicional</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tiempo de servicio (minutos)
                </label>
                <p className="text-xs text-gray-500 mb-2">Tiempo estimado para descarga en el cliente</p>
                <input
                  type="number"
                  min="1"
                  value={tiempoServicioEstimadoMin}
                  onChange={(e) => setTiempoServicioEstimadoMin(Number(e.target.value))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ej: 15"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prioridad
                </label>
                <p className="text-xs text-gray-500 mb-2">Nivel de urgencia de la entrega</p>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(Number(e.target.value))}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={1}>1 - Normal</option>
                  <option value={2}>2 - Alta</option>
                  <option value={3}>3 - Urgente</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección: Notas */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Información Adicional</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notas o instrucciones especiales
              </label>
              <p className="text-xs text-gray-500 mb-2">Cualquier información adicional para el conductor</p>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                rows={4}
                placeholder="Ej: Llamar antes de llegar, entregar en recepción..."
              />
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              className="px-6 py-3 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 text-white rounded-lg font-bold shadow-lg disabled:cursor-not-allowed"
            >
              {submitting ? 'Creando orden...' : 'Crear Orden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
