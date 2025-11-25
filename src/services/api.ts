import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000 // 30 segundos
});

// ⭐ CRUCIAL: Interceptor para añadir JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const isLoginRequest = config.url?.includes('/auth/login');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token found and added to request:', token.substring(0, 20) + '...');
    } else if (!isLoginRequest) {
      console.warn('⚠️ No token found in localStorage for request to:', config.url);
    }
    
    console.log('🌐 API Request:', config.method?.toUpperCase(), `${config.baseURL || ''}${config.url || ''}`, {
      data: config.data,
      params: config.params,
      hasAuth: !!config.headers.Authorization,
      isLogin: isLoginRequest
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ⭐ CRUCIAL: Interceptor para manejar errores
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.config.url, '→', response.status, '→', Array.isArray(response.data) ? `${response.data.length} items` : 'data');
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.config?.url, '→', error.response?.status, error.response?.data);

    // Si es 401, token expiró o inválido
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      window.location.href = '/login';
    }

    // Extraer mensaje de error del backend
    const message = error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Ha ocurrido un error inesperado';

    return Promise.reject({ ...error, message });
  }
);

export default api;
