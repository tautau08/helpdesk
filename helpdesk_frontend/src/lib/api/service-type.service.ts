import apiClient from "./client";
import { ServiceType, PaginatedResponse } from "@/types/common.types";

interface ServiceTypeFilters {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const serviceTypeService = {
  getAll: async (filters?: ServiceTypeFilters): Promise<PaginatedResponse<ServiceType>> => {
    const response = await apiClient.get<PaginatedResponse<ServiceType>>("/service-types", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<ServiceType> => {
    const response = await apiClient.get<ServiceType>(`/service-types/${id}`);
    return response.data;
  },

  create: async (data: Omit<ServiceType, "id">): Promise<ServiceType> => {
    const response = await apiClient.post<ServiceType>("/service-types", data);
    return response.data;
  },

  update: async (id: number, data: Omit<ServiceType, "id">): Promise<ServiceType> => {
    const response = await apiClient.put<ServiceType>(`/service-types/${id}`, data);
    return response.data;
  },

  activate: async (id: number): Promise<ServiceType> => {
    const response = await apiClient.patch<ServiceType>(`/service-types/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number): Promise<ServiceType> => {
    const response = await apiClient.patch<ServiceType>(`/service-types/${id}/deactivate`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/service-types/${id}`);
  },
};
