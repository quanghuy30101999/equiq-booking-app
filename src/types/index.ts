export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Individual';
  name: string;
  createdAt: string;
}

export interface LoginCredentials {
  loginId: string;
  password: string;
  method: '2FA' | 'SSO' | 'SMS';
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'Admin' | 'Individual';
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  quantity: number;
  status: 'available' | 'in_use' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  status: 'available' | 'booked' | 'in_use' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentUsageHistory {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface WorkCertificate {
  id: string;
  userId: string;
  userName: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ChangeHistory {
  id: string;
  entityType: 'equipment' | 'booking' | 'user' | 'certificate';
  entityId: string;
  action: 'create' | 'update' | 'delete';
  changedBy: string;
  changedAt: string;
  oldValue?: string;
  newValue?: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}