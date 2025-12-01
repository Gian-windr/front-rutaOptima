import { useEffect, useState } from 'react';
import { vehicleService } from '../services/dataService';
import { Plus, Edit, Trash2, Truck, X } from 'lucide-react';
import type { Vehicle } from '../types/api.types';

interface VehicleFormData {
  nombre: string;
  patente: string;
  tipo: 'CAMION' | 'FURGONETA' | 'MOTO';
  conductor: string;
  capacidadCantidad: number;
  capacidadVolumen: number;
  capacidadPeso: number;
  velocidadKmh: number;
  costoKm: number;
  zona: 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Centro';
  color: string;
  depotLatitud: number;
  depotLongitud: number;
  jornadaInicio: string;
  jornadaFin: string;
  activo: boolean;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<VehicleFormData>({
    nombre: '',
    patente: '',
    tipo: 'CAMION',
    conductor: '',
    capacidadCantidad: 100,
    capacidadVolumen: 50,
    capacidadPeso: 5000,
    velocidadKmh: 40,
    costoKm: 1.5,
    zona: 'Norte',
    color: '#1976d2',
    depotLatitud: -12.0464,
    depotLongitud: -77.0428,
    jornadaInicio: '08:00',
    jornadaFin: '18:00',
    activo: true
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleService.getAll();
      setVehicles(response.data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      alert('Error al cargar los vehículos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este vehículo?')) return;

    try {
      await vehicleService.delete(id);
      alert('Vehículo eliminado exitosamente');
      loadVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Error al eliminar el vehículo');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await vehicleService.create(formData);
      alert('Vehículo creado exitosamente');
      setShowModal(false);
      loadVehicles();
      // Reset form
      setFormData({
        nombre: '',
        patente: '',
        tipo: 'CAMION',
        conductor: '',
        capacidadCantidad: 100,
        capacidadVolumen: 50,
        capacidadPeso: 5000,
        velocidadKmh: 40,
        costoKm: 1.5,
        zona: 'Norte',
        color: '#1976d2',
        depotLatitud: -12.0464,
        depotLongitud: -77.0428,
        jornadaInicio: '08:00',
        jornadaFin: '18:00',
        activo: true
      });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      alert('Error al crear el vehículo');
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Vehículos</h1>
          <p className="text-gray-400 mt-2">Gestiona tu flota de vehículos de distribución</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Vehículo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-2xl p-6 hover:shadow-3xl transition-all border border-gray-700">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div 
                  className="p-3 rounded-lg mr-3"
                  style={{ backgroundColor: vehicle.color + '20', color: vehicle.color }}
                >
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{vehicle.nombre}</h3>
                  <p className="text-sm text-gray-400">{vehicle.patente}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => alert('Editar: ' + vehicle.nombre)}
                  className="text-blue-400 hover:text-blue-300 p-1"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700">
                {vehicle.tipo.replace(/_/g, ' ')}
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 border border-purple-700">
                Zona {vehicle.zona}
              </span>
            </div>

            <div className="mb-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <p className="text-xs text-gray-400 mb-1">Conductor</p>
              <p className="font-medium text-white">{vehicle.conductor}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-400">Capacidad</p>
                  <p className="font-medium text-white">{vehicle.capacidadCantidad} unidades</p>
                </div>
                <div>
                  <p className="text-gray-400">Volumen</p>
                  <p className="font-medium text-white">{vehicle.capacidadVolumen} m³</p>
                </div>
                <div>
                  <p className="text-gray-400">Peso</p>
                  <p className="font-medium text-white">{vehicle.capacidadPeso} kg</p>
                </div>
                <div>
                  <p className="text-gray-400">Velocidad</p>
                  <p className="font-medium text-white">{vehicle.velocidadKmh} km/h</p>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <p className="text-gray-400">Costo por km</p>
                <p className="font-medium text-green-400">S/ {vehicle.costoKm.toFixed(2)}</p>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <p className="text-gray-400">Jornada</p>
                <p className="font-medium text-white">{vehicle.jornadaInicio} - {vehicle.jornadaFin}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  vehicle.activo ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {vehicle.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear vehículo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Nuevo Vehículo</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Básica */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-white mb-4">Información Básica</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre del Vehículo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Camión Norte 1"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Patente *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patente}
                    onChange={(e) => setFormData({ ...formData, patente: e.target.value })}
                    placeholder="Ej: ABC-123"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tipo de Vehículo *
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'CAMION' | 'FURGONETA' | 'MOTO' })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="CAMION">Camión</option>
                    <option value="FURGONETA">Furgoneta</option>
                    <option value="MOTO">Moto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Conductor *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.conductor}
                    onChange={(e) => setFormData({ ...formData, conductor: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Zona de Operación *
                  </label>
                  <select
                    required
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value as 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Centro' })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Norte">Norte</option>
                    <option value="Sur">Sur</option>
                    <option value="Este">Este</option>
                    <option value="Oeste">Oeste</option>
                    <option value="Centro">Centro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Color (Hexadecimal) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 w-20 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#1976d2"
                      pattern="^#[0-9A-Fa-f]{6}$"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Capacidades */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Capacidades</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Capacidad en Unidades *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacidadCantidad}
                    onChange={(e) => setFormData({ ...formData, capacidadCantidad: Number(e.target.value) })}
                    placeholder="Ej: 100"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Número máximo de unidades</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Capacidad en Volumen (m³) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    step="0.1"
                    value={formData.capacidadVolumen}
                    onChange={(e) => setFormData({ ...formData, capacidadVolumen: Number(e.target.value) })}
                    placeholder="Ej: 50"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Volumen máximo en metros cúbicos</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Capacidad en Peso (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacidadPeso}
                    onChange={(e) => setFormData({ ...formData, capacidadPeso: Number(e.target.value) })}
                    placeholder="Ej: 5000"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Peso máximo en kilogramos</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Velocidad Promedio (km/h) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.velocidadKmh}
                    onChange={(e) => setFormData({ ...formData, velocidadKmh: Number(e.target.value) })}
                    placeholder="Ej: 40"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Velocidad promedio del vehículo</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Costo por Kilómetro (S/) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.costoKm}
                    onChange={(e) => setFormData({ ...formData, costoKm: Number(e.target.value) })}
                    placeholder="Ej: 1.5"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Costo operativo por kilómetro</p>
                </div>

                {/* Ubicación del Depósito */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Ubicación del Depósito</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Latitud del Depósito *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.000001"
                    min="-90"
                    max="90"
                    value={formData.depotLatitud}
                    onChange={(e) => setFormData({ ...formData, depotLatitud: Number(e.target.value) })}
                    placeholder="Ej: -12.0464"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Coordenada de inicio y fin de ruta</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Longitud del Depósito *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.000001"
                    min="-180"
                    max="180"
                    value={formData.depotLongitud}
                    onChange={(e) => setFormData({ ...formData, depotLongitud: Number(e.target.value) })}
                    placeholder="Ej: -77.0428"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Coordenada de inicio y fin de ruta</p>
                </div>

                {/* Horario de Jornada */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Horario de Jornada</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Hora de Inicio *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.jornadaInicio}
                    onChange={(e) => setFormData({ ...formData, jornadaInicio: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Hora de Fin *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.jornadaFin}
                    onChange={(e) => setFormData({ ...formData, jornadaFin: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Estado */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                    />
                    <span className="text-sm text-gray-300">Vehículo activo</span>
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg"
                >
                  Crear Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

