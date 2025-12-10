import apiClient from "./client";
import {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketFilters,
  PaginatedResponse,
} from "@/types/ticket.types";

export const ticketService = {
  // Get all tickets with optional filters
  getAll: async (filters?: TicketFilters): Promise<PaginatedResponse<Ticket>> => {
    // Filter out undefined values to avoid sending empty params
    const cleanFilters = filters ? Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ) : undefined;
    
    const response = await apiClient.get<PaginatedResponse<Ticket>>("/tickets",
      cleanFilters && Object.keys(cleanFilters).length > 0 ? { params: cleanFilters } : undefined
    );
    return response.data;
  },

  // Get ticket by ID
  getById: async (id: number): Promise<Ticket> => {
    const response = await apiClient.get<Ticket>(`/tickets/${id}`);
    return response.data;
  },

  // Get tickets created by specific user
  getByUser: async (userId: number, filters?: TicketFilters): Promise<PaginatedResponse<Ticket>> => {
    // Filter out undefined values to avoid sending empty params
    const cleanFilters = filters ? Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    ) : undefined;
    
    const response = await apiClient.get<PaginatedResponse<Ticket>>(`/tickets/user/${userId}`,
      cleanFilters && Object.keys(cleanFilters).length > 0 ? { params: cleanFilters } : undefined
    );
    return response.data;
  },

  // Create new ticket
  create: async (data: CreateTicketRequest): Promise<Ticket> => {
    const formData = new FormData();
    
    // Append regular fields
    formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    formData.append('companyId', data.companyId.toString());
    formData.append('categoryId', data.categoryId.toString());
    formData.append('subcategoryId', data.subcategoryId.toString());
    formData.append('statusId', data.statusId.toString());
    formData.append('priorityId', data.priorityId.toString());
    formData.append('serviceTypeId', data.serviceTypeId.toString());
    formData.append('sortOrder', (data.sortOrder || 0).toString());
    formData.append('isActive', (data.isActive !== false).toString());
    
    // Append images if they exist
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    
    const response = await apiClient.post<Ticket>("/tickets", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update existing ticket
  update: async (id: number, data: UpdateTicketRequest): Promise<Ticket> => {
    const response = await apiClient.put<Ticket>(`/tickets/${id}`, data);
    return response.data;
  },

  // Activate ticket
  activate: async (id: number): Promise<Ticket> => {
    const response = await apiClient.patch<Ticket>(`/tickets/${id}/activate`);
    return response.data;
  },

  // Deactivate ticket
  deactivate: async (id: number): Promise<Ticket> => {
    const response = await apiClient.patch<Ticket>(`/tickets/${id}/deactivate`);
    return response.data;
  },

  // Delete ticket
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tickets/${id}`);
  },
};
