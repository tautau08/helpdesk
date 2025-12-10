import apiClient from "./client";
import { Company, PaginatedResponse } from "@/types/common.types";

interface CompanyFilters {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const companyService = {
  getAll: async (filters?: CompanyFilters): Promise<PaginatedResponse<Company>> => {
    const response = await apiClient.get<PaginatedResponse<Company>>("/companies", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Company> => {
    const response = await apiClient.get<Company>(`/companies/${id}`);
    return response.data;
  },

  create: async (data: Omit<Company, "id">): Promise<Company> => {
    const response = await apiClient.post<Company>("/companies", data);
    return response.data;
  },

  update: async (id: number, data: Omit<Company, "id">): Promise<Company> => {
    const response = await apiClient.put<Company>(`/companies/${id}`, data);
    return response.data;
  },

  activate: async (id: number): Promise<Company> => {
    const response = await apiClient.patch<Company>(`/companies/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number): Promise<Company> => {
    const response = await apiClient.patch<Company>(`/companies/${id}/deactivate`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/companies/${id}`);
  },

  getProjectCount: async (id: number): Promise<number> => {
    const response = await apiClient.get<number>(`/companies/${id}/projects/count`);
    return response.data;
  },
};
