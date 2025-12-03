import { apiService } from './api';
import { ChangeHistory, ApiResponse, PaginatedResponse } from '../types';

export const historyService = {
  getHistory: async (
    entityType?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<ApiResponse<PaginatedResponse<ChangeHistory>>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (entityType) {
      params.append('entityType', entityType);
    }

    return apiService.get(`/history?${params.toString()}`);
  },

  getEntityHistory: async (entityType: string, entityId: string): Promise<ApiResponse<ChangeHistory[]>> => {
    return apiService.get(`/history/${entityType}/${entityId}`);
  },
};