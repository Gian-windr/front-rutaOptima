import { useEffect, useState } from 'react';
import { customerService } from '../services/dataService';
import { Plus, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import type { Customer } from '../types/api.types';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    latitud: -12.046374,
    longitud: -77.042793,
    zona: 'Norte' as 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Centro',
    telefono: '',
    email: '',
    activo: true,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    
    // Debug: Verificar token
    const token = localStorage.getItem('token');
    console.log('🔍 CustomersPage - Verificando token:', token ? `${token.substring(0, 30)}...` : 'NO TOKEN FOUND');
    
    try {
      const response = await customerService.getAll();
      console.log('✅ Clientes cargados:', response.data.length);
      setCustomers(response.data);
    } catch (error: any) {
      console.error('❌ Error loading customers:', error);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      const errorMsg = error.response?.status === 403 
        ? 'Error de autenticación. Por favor, inicia sesión nuevamente.'
        : 'Error al cargar los clientes';
      
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await customerService.update(editingCustomer.id, formData);
        alert('Cliente actualizado exitosamente');
      } else {
        await customerService.create(formData);
        alert('Cliente creado exitosamente');
      }
      setShowModal(false);
      resetForm();
      loadCustomers();
    } catch (error) {
      console.error('Error saving customer:', error);
      const err = error as { message?: string };
      alert(err.message || 'Error al guardar el cliente');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

    try {
      await customerService.delete(id);
      alert('Cliente eliminado exitosamente');
      loadCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error al eliminar el cliente');
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      nombre: customer.nombre,
      direccion: customer.direccion,
      latitud: customer.latitud,
      longitud: customer.longitud,
      zona: customer.zona,
      telefono: customer.telefono || '',
      email: customer.email || '',
      activo: customer.activo,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      nombre: '',
      direccion: '',
      latitud: -12.046374,
      longitud: -77.042793,
      zona: 'Norte',
      telefono: '',
      email: '',
      activo: true,
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-2">Gestiona los clientes de tu red de distribución</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.nombre}</h3>
                <span className="inline-block mt-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                  Zona {customer.zona}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(customer)}
                  className="text-blue-600 hover:text-blue-700 p-1"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(customer.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="break-words">{customer.direccion}</span>
              </div>
              {customer.telefono && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{customer.telefono}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="break-all">{customer.email}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  customer.activo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {customer.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitud *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitud}
                      onChange={(e) => setFormData({ ...formData, latitud: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitud *
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitud}
                      onChange={(e) => setFormData({ ...formData, longitud: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zona *
                  </label>
                  <select
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value as 'Norte' | 'Sur' | 'Este' | 'Oeste' | 'Centro' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    required
                  >
                    <option value="Norte">Norte</option>
                    <option value="Sur">Sur</option>
                    <option value="Este">Este</option>
                    <option value="Oeste">Oeste</option>
                    <option value="Centro">Centro</option>
                  </select>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Activo</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    {editingCustomer ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

