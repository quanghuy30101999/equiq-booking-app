import { apiService } from './api';
import { EquipmentUsageHistory, ApiResponse, PaginatedResponse } from '../types';

export const equipmentService = {
  getUsageHistory: async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<EquipmentUsageHistory>>> => {
    return apiService.get(`/equipment/history?page=${page}&pageSize=${pageSize}`);
  },

  getUsageHistoryById: async (id: string): Promise<ApiResponse<EquipmentUsageHistory>> => {
    return apiService.get(`/equipment/history/${id}`);
  },

  createBooking: async (data: {
    equipmentId: string;
    startDate: string;
    endDate: string;
    purpose: string;
  }): Promise<ApiResponse<EquipmentUsageHistory>> => {
    return apiService.post('/equipment/bookings', data);
  },

  updateBooking: async (id: string, data: Partial<EquipmentUsageHistory>): Promise<ApiResponse<EquipmentUsageHistory>> => {
    return apiService.put(`/equipment/bookings/${id}`, data);
  },

  approveBooking: async (id: string): Promise<ApiResponse<EquipmentUsageHistory>> => {
    return apiService.post(`/equipment/bookings/${id}/approve`);
  },

  rejectBooking: async (id: string, reason: string): Promise<ApiResponse<EquipmentUsageHistory>> => {
    return apiService.post(`/equipment/bookings/${id}/reject`, { reason });
  },

  completeBooking: async (id: string): Promise<ApiResponse<EquipmentUsageHistory>> => {
    return apiService.post(`/equipment/bookings/${id}/complete`);
  },

  deleteBooking: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete(`/equipment/bookings/${id}`);
  },

  getMyBookings: async (): Promise<ApiResponse<EquipmentUsageHistory[]>> => {
    return apiService.get('/equipment/my-bookings');
  },

  getAllBookings: async (): Promise<ApiResponse<EquipmentUsageHistory[]>> => {
    return apiService.get('/equipment/bookings');
  },
};