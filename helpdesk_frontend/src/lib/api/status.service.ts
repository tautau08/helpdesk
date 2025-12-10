import apiClient from "./client";
import { Status, PaginatedResponse } from "@/types/common.types";

interface StatusFilters {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const statusService = {
  getAll: async (filters?: StatusFilters): Promise<PaginatedResponse<Status>> => {
    const response = await apiClient.get<PaginatedResponse<Status>>("/statuses", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Status> => {
    const response = await apiClient.get<Status>(`/statuses/${id}`);
    return response.data;
  },

  create: async (data: Omit<Status, "id">): Promise<Status> => {
    const response = await apiClient.post<Status>("/statuses", data);
    return response.data;
  },

  update: async (id: number, data: Omit<Status, "id">): Promise<Status> => {
    const response = await apiClient.put<Status>(`/statuses/${id}`, data);
    return response.data;
  },

  activate: async (id: number): Promise<Status> => {
    const response = await apiClient.patch<Status>(`/statuses/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number): Promise<Status> => {
    const response = await apiClient.patch<Status>(`/statuses/${id}/deactivate`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/statuses/${id}`);
  },
};
