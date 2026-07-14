// FORM DATA
export interface RoleFormData {
  name: string;
  has_access_module: RoleAccessModuleDaum[];
}

export interface RoleAccessModuleDaum {
  name: string;
  title: string;
  permission: RolePermissionItem[];
}

export interface RolePermissionItem {
  icon: string;
  menu_name: string;
  path: string;
  actions: Record<string, boolean>;
  children: RoleMenuDetail[];
}

export interface RoleMenuDetail {
  name: string;
  path: string;
  actions: Record<string, boolean>;
}

// API RESPONSE ====================================
export interface BodyRoleResponseAPI {
  success: boolean;
  message: string;
  data: RoleApiDaum[];
}

// Dokumen Role (collection "roles"). Field has_access_module & path_access
// dinormalisasi ke collection tersendiri, dan diasumsikan sudah di-populate
// oleh backend saat response dikirim.
export interface RoleApiDaum {
  _id: string;
  name: string;
  slug: string;
  has_access_module: RoleModuleApiDaum[];
  path_access: PathAccessDaum[];
  is_delete?: boolean;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Dokumen PathAccess (collection "path_accesses").
export interface PathAccessDaum {
  _id: string;
  role_id: string;
  path: string;
  actions: Record<string, boolean>;
  is_delete?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Dokumen RoleModule (collection "role_modules").
export interface RoleModuleApiDaum {
  _id: string;
  role_id: string;
  name: string;
  title: string;
  permission: RolePermissionApiDaum[];
  is_delete?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Sub-dokumen permission (schema pakai _id: false → tanpa _id).
export interface RolePermissionApiDaum {
  icon: string;
  menu_name: string;
  path: string;
  actions: Record<string, boolean>;
  children: RoleMenuApiDetail[];
}

// Sub-dokumen children/sub-menu (schema pakai _id: false → tanpa _id).
export interface RoleMenuApiDetail {
  name: string;
  path: string;
  actions: Record<string, boolean>;
}
