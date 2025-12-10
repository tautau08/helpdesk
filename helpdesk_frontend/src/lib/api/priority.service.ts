import apiClient from "./client";
import { Priority, PaginatedResponse } from "@/types/common.types";

interface PriorityFilters {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const priorityService = {
  getAll: async (filters?: PriorityFilters): Promise<PaginatedResponse<Priority>> => {
    const response = await apiClient.get<PaginatedResponse<Priority>>("/priorities", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Priority> => {
    const response = await apiClient.get<Priority>(`/priorities/${id}`);
    return response.data;
  },

  create: async (data: Omit<Priority, "id">): Promise<Priority> => {
    const response = await apiClient.post<Priority>("/priorities", data);
    return response.data;
  },

  update: async (id: number, data: Omit<Priority, "id">): Promise<Priority> => {
    const response = await apiClient.put<Priority>(`/priorities/${id}`, data);
    return response.data;
  },

  activate: async (id: number): Promise<Priority> => {
    const response = await apiClient.patch<Priority>(`/priorities/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number): Promise<Priority> => {
    const response = await apiClient.patch<Priority>(`/priorities/${id}/deactivate`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/priorities/${id}`);
  },
};
