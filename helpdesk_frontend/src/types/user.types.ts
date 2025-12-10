export interface User {
  id: number;
  name: string;
  username: string;
  email?: string;
  companyId?: number;
  companyName?: string;
  projectId?: number;
  projectName?: string;
  departmentId?: number;
  departmentName?: string;
  roleId: number;
  roleName: string;
  sortOrder: number;
  isActive: boolean;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  roleName: string;
}

export interface UserDetails extends User {
  permissions?: string[];
}
