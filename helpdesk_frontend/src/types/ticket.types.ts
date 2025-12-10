export interface Ticket {
  id: number;
  name: string;
  description?: string;
  companyId: number;
  companyName: string;
  categoryId: number;
  categoryName: string;
  subcategoryId: number;
  subcategoryName: string;
  submittedStatusId: number;
  submittedStatusName: string;
  currentStatusId: number;
  currentStatusName: string;
  priorityId: number;
  priorityName: string;
  serviceTypeId: number;
  serviceTypeName: string;
  createdUserId: number;
  createdTime: string;
  updatedByUserId?: number;
  updatedTime?: string;
  sortOrder: number;
  isActive: boolean;
  imageUrls?: string[];
}

export interface CreateTicketRequest {
  name: string;
  description?: string;
  companyId: number;
  categoryId: number;
  subcategoryId: number;
  statusId: number;
  priorityId: number;
  serviceTypeId: number;
  sortOrder?: number;
  isActive?: boolean;
  images?: File[];
}

export interface UpdateTicketRequest extends CreateTicketRequest {
  id: number;
}

export interface TicketFilters {
  name?: string;
  companyId?: number;
  categoryId?: number;
  subcategoryId?: number;
  currentStatusId?: number;
  priorityId?: number;
  serviceTypeId?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
}
