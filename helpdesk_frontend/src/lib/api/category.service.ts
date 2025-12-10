import apiClient from "./client";
import { Category, PaginatedResponse } from "@/types/common.types";

interface CategoryFilters {
  projectId?: number;
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const categoryService = {
  getAll: async (filters?: CategoryFilters): Promise<PaginatedResponse<Category>> => {
    const response = await apiClient.get<PaginatedResponse<Category>>("/categories", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: Omit<Category, "id">): Promise<Category> => {
    const response = await apiClient.post<Category>("/categories", data);
    return response.data;
  },

  update: async (id: number, data: Omit<Category, "id">): Promise<Category> => {
    const response = await apiClient.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  activate: async (id: number): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number): Promise<Category> => {
    const response = await apiClient.patch<Category>(`/categories/${id}/deactivate`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/categories/${id}`);
  },

  getSubcategoryCount: async (id: number): Promise<number> => {
    const response = await apiClient.get<number>(`/categories/${id}/subcategories/count`);
    return response.data;
  },
};
