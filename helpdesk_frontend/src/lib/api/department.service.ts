import apiClient from "./client";
import { Department, PaginatedResponse } from "@/types/common.types";

interface DepartmentFilters {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

interface DepartmentCreateUpdate {
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export const departmentService = {
  getAll: async (filters?: DepartmentFilters): Promise<PaginatedResponse<Department>> => {
    const response = await apiClient.get<PaginatedResponse<Department>>("/departments", 
      filters ? { params: filters } : undefined
    );
    return response.data;
  },

  getById: async (id: number): Promise<Department> => {
    const response = await apiClient.get<Department>(`/departments/${id}`);
    return response.data;
  },

  create: async (data: DepartmentCreateUpdate): Promise<Department> => {
    const response = await apiClient.post<Department>("/departments", data);
    return response.data;
  },

  update: async (id: number, data: DepartmentCreateUpdate): Promise<Department> => {
    const response = await apiClient.put<Department>(`/departments/${id}`, data);
    return response.data;
  },

  activate: async (id: number): Promise<Department> => {
    const response = await apiClient.patch<Department>(`/departments/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number): Promise<Department> => {
    const response = await apiClient.patch<Department>(`/departments/${id}/deactivate`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/departments/${id}`);
  },
};
