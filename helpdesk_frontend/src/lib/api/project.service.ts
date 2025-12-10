import apiClient from './client';
import type { Project, PaginatedResponse } from '@/types/common.types';

interface ProjectFilters {
  page?: number;
  size?: number;
  sort?: string;
}

export const projectService = {
  // Get all projects with pagination
  getAll: async (filters?: ProjectFilters): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams();
    
    if (filters?.page !== undefined) params.append('page', filters.page.toString());
    if (filters?.size !== undefined) params.append('size', filters.size.toString());
    if (filters?.sort) params.append('sort', filters.sort);

    const response = await apiClient.get(`/projects?${params.toString()}`);
    return response.data;
  },

  // Get project by ID
  getById: async (id: number): Promise<Project> => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  create: async (data: {
    name: string;
    companyId?: number;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<Project> => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  // Update project
  update: async (id: number, data: {
    name: string;
    companyId?: number;
    sortOrder?: number;
    isActive?: boolean;
  }): Promise<Project> => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  // Activate project
  activate: async (id: number): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}/activate`);
    return response.data;
  },

  // Deactivate project
  deactivate: async (id: number): Promise<Project> => {
    const response = await apiClient.patch(`/projects/${id}/deactivate`);
    return response.data;
  },

  // Delete project
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  // Get category count by project ID
  getCategoryCount: async (id: number): Promise<number> => {
    const response = await apiClient.get<number>(`/projects/${id}/categories/count`);
    return response.data;
  }
};
