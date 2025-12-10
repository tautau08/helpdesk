// Common types used across multiple entities

export interface BaseEntity {
  id: number;
  name: string;
  createdUserId?: number;
  createdTime?: string;
  updatedByUserId?: number;
  updatedTime?: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Company extends BaseEntity {}

export interface Project extends BaseEntity {
  companyId?: number;
  company?: Company;
}

export interface Department extends BaseEntity {}

export interface Category extends BaseEntity {
  projectId: number;
}

export interface Subcategory extends BaseEntity {
  categoryId: number;
  responseTime?: number;
  resolutionTime?: number;
  isCustomerResponseRequired?: boolean;
}

export interface Status extends BaseEntity {}

export interface Priority extends BaseEntity {}

export interface ServiceType extends BaseEntity {}

export interface Role extends BaseEntity {
  description?: string;
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

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
