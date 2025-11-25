import { useEffect, useState } from 'react';
import { vehicleService } from '../services/dataService';
import { Plus, Edit, Trash2, Truck } from 'lucide-react';
import type { Vehicle } from '../types/api.types';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vehículos</h1>
          <p className="text-gray-600 mt-2">Gestiona tu flota de vehículos de distribución</p>
        </div>
        <button
          onClick={() => alert('Funcionalidad de crear vehículo - Implementar modal')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Vehículo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div 
                  className="p-3 rounded-lg mr-3"
                  style={{ backgroundColor: vehicle.color + '20', color: vehicle.color }}
                >
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{vehicle.nombre}</h3>
                  <p className="text-sm text-gray-600">{vehicle.patente}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => alert('Editar: ' + vehicle.nombre)}
                  className="text-blue-600 hover:text-blue-700 p-1"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {vehicle.tipo.replace(/_/g, ' ')}
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Zona {vehicle.zona}
              </span>
            </div>

            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-1">Conductor</p>
              <p className="font-medium text-gray-900">{vehicle.conductor}</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-gray-600">Capacidad</p>
                  <p className="font-medium">{vehicle.capacidadCantidad} unidades</p>
                </div>
                <div>
                  <p className="text-gray-600">Volumen</p>
                  <p className="font-medium">{vehicle.capacidadVolumen} m³</p>
                </div>
                <div>
                  <p className="text-gray-600">Peso</p>
                  <p className="font-medium">{vehicle.capacidadPeso} kg</p>
                </div>
                <div>
                  <p className="text-gray-600">Velocidad</p>
                  <p className="font-medium">{vehicle.velocidadKmh} km/h</p>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-gray-600">Costo por km</p>
                <p className="font-medium text-green-600">S/ {vehicle.costoKm.toFixed(2)}</p>
              </div>

              <div className="pt-2 border-t">
                <p className="text-gray-600">Jornada</p>
                <p className="font-medium">{vehicle.jornadaInicio} - {vehicle.jornadaFin}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  vehicle.activo ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}
              >
                {vehicle.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

