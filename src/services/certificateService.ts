import { apiService } from './api';
import { WorkCertificate, ApiResponse, PaginatedResponse } from '../types';

export const certificateService = {
  getCertificates: async (page: number = 1, pageSize: number = 10): Promise<ApiResponse<PaginatedResponse<WorkCertificate>>> => {
    return apiService.get(`/certificates?page=${page}&pageSize=${pageSize}`);
  },

  getCertificate: async (id: string): Promise<ApiResponse<WorkCertificate>> => {
    return apiService.get(`/certificates/${id}`);
  },

  uploadCertificate: async (file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<WorkCertificate>> => {
    return apiService.uploadFile('/certificates/upload', file, onProgress);
  },

  deleteCertificate: async (id: string): Promise<ApiResponse<void>> => {
    return apiService.delete(`/certificates/${id}`);
  },

  approveCertificate: async (id: string): Promise<ApiResponse<WorkCertificate>> => {
    return apiService.post(`/certificates/${id}/approve`);
  },

  rejectCertificate: async (id: string, reason: string): Promise<ApiResponse<WorkCertificate>> => {
    return apiService.post(`/certificates/${id}/reject`, { reason });
  },

  getMyCertificates: async (): Promise<ApiResponse<WorkCertificate[]>> => {
    return apiService.get('/certificates/my-certificates');
  },
};