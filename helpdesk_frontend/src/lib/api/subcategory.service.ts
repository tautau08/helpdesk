import apiClient from "./client";
import { Subcategory, PaginatedResponse } from "@/types/common.types";

interface SubcategoryFilters {
  categoryId?: number;
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const subcategoryService = {
  getAll: async (filters?: SubcategoryFilters): Promise<PaginatedResponse<Subcategory>> => {
    const response = await apiClient.get<PaginatedResponse<Subcategory>>("/subcategories", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Subcategory> => {
    const response = await apiClient.get<Subcategory>(`/subcategories/${id}`);
    return response.data;
  },

  create: async (data: Omit<Subcategory, "id">): Promise<Subcategory> => {
    const response = await apiClient.post<Subcategory>("/subcategories", data);
    return response.data;
  },

  update: async (id: number, data: Omit<Subcategory, "id">): Promise<Subcategory> => {
    const response = await apiClient.put<Subcategory>(`/subcategories/${id}`, data);
    return response.data;
  },

  activate: async (id: number): Promise<Subcategory> => {
    const response = await apiClient.patch<Subcategory>(`/subcategories/${id}/activate`);
    return response.data;
  },

  deactivate: async (id: number): Promise<Subcategory> => {
    const response = await apiClient.patch<Subcategory>(`/subcategories/${id}/deactivate`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/subcategories/${id}`);
  },
};
