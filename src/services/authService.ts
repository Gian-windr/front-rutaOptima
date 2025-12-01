import api from './api';
import type { LoginRequest, LoginResponse } from '../types/api.types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    console.log('🔐 Attempting login with:', { email: credentials.email });
    console.log('📤 Request body:', JSON.stringify(credentials));
    
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    
    console.log('✅ Login successful, token received:', response.data.token?.substring(0, 20) + '...');
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.email) {
        localStorage.setItem('email', response.data.email);
      }
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};
