import type { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, LayoutDashboard, Route, LogOut, Plus, FileText, Map } from 'lucide-react';
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
    { path: '/route-plans', icon: Map, label: 'Planes de Rutas' },
    { path: '/orders', icon: FileText, label: 'Órdenes' },
    { path: '/orders/new', icon: Plus, label: 'Crear Orden', primary: true },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg relative">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">RutaÓptima</h1>
              <p className="text-xs text-gray-500">Sistema de Rutas</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon as any;
            const isActive = location.pathname === item.path;

            if (item.primary) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-primary-700 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
