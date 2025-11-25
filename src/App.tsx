import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OptimizeRoutePage } from './pages/OptimizeRoutePage';
import CreateOrderPage from './pages/CreateOrderPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import VehiclesPage from './pages/VehiclesPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isAuthenticated = useStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Layout>{children}</Layout>;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
                <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/optimize" element={<ProtectedRoute><OptimizeRoutePage /></ProtectedRoute>} />
                <Route path="/orders/new" element={<ProtectedRoute><CreateOrderPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;