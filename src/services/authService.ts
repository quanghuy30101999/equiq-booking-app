import { apiService } from './api';
import { User, LoginCredentials, RegisterData, ApiResponse } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiService.post('/auth/login', credentials);
  },

  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    return apiService.post('/auth/register', data);
  },

  resetPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiService.post('/auth/reset-password', { email });
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<ApiResponse<void>> => {
    return apiService.post('/auth/change-password', { oldPassword, newPassword });
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};