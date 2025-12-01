import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, LayoutDashboard, Route, LogOut, Plus, FileText, Users, Truck } from 'lucide-react';
import { authService } from '../../services/authService';
import { useStore } from '../../store/useStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuthenticated = useStore((state) => state.setAuthenticated);

  const handleLogout = () => {
    authService.logout();
    setAuthenticated(false);
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/optimize', icon: Route, label: 'Optimizar Rutas' },
    { path: '/orders', icon: FileText, label: 'Órdenes' },
    { path: '/customers', icon: Users, label: 'Clientes' },
    { path: '/vehicles', icon: Truck, label: 'Vehículos' },
    { path: '/orders/new', icon: Plus, label: 'Crear Orden', primary: true },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800/80 backdrop-blur-md shadow-2xl relative border-r border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">RutaÓptima</h1>
              <p className="text-xs text-gray-400">Sistema de Rutas</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon as React.ComponentType<{ className?: string }>;
            const isActive = location.pathname === item.path;

            if (item.primary) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gray-700 text-white font-medium shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/30 hover:text-red-200 transition-all duration-200 w-full font-medium"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {children}
      </main>
    </div>
  );
}
