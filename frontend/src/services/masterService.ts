import { apiService } from './api';
import { Employee, Tool, Equipment, ApiResponse, PaginatedResponse } from '../types';

export const masterService = {
  // Employee Management
  getEmployees: async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<Employee>>> => {
    return apiService.get(`/master/employees?page=${page}&pageSize=${pageSize}`);
  },

  getEmployee: async (id: string): Promise<ApiResponse<Employee>> => {
    return apiService.get(`/master/employees/${id}`);
  },

  createEmployee: async (data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    return apiService.post('/master/employees', data);
  },

  updateEmployee: async (id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    return apiService.put(`/master/employees/${id}`, data);
  },

  deleteEmployee: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete(`/master/employees/${id}`);
  },

  // Tool Management
  getTools: async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<Tool>>> => {
    return apiService.get(`/master/tools?page=${page}&pageSize=${pageSize}`);
  },

  getTool: async (id: string): Promise<ApiResponse<Tool>> => {
    return apiService.get(`/master/tools/${id}`);
  },

  createTool: async (data: Partial<Tool>): Promise<ApiResponse<Tool>> => {
    return apiService.post('/master/tools', data);
  },

  updateTool: async (id: string, data: Partial<Tool>): Promise<ApiResponse<Tool>> => {
    return apiService.put(`/master/tools/${id}`, data);
  },

  deleteTool: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete(`/master/tools/${id}`);
  },

  // Equipment Management
  getEquipments: async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<Equipment>>> => {
    return apiService.get(`/master/equipments?page=${page}&pageSize=${pageSize}`);
  },

  getEquipment: async (id: string): Promise<ApiResponse<Equipment>> => {
    return apiService.get(`/master/equipments/${id}`);
  },

  createEquipment: async (data: Partial<Equipment>): Promise<ApiResponse<Equipment>> => {
    return apiService.post('/master/equipments', data);
  },

  updateEquipment: async (id: string, data: Partial<Equipment>): Promise<ApiResponse<Equipment>> => {
    return apiService.put(`/master/equipments/${id}`, data);
  },

  deleteEquipment: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete(`/master/equipments/${id}`);
  },
};