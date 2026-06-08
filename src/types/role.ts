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
export interface BodyRoleResponseAPIDaum {
  success: string;
  message: string;
  data: RoleApiDaum[];
}

export interface PathAccessDaum {
  path: string;
  actions: Record<string, boolean>;
}

export interface RoleApiDaum {
  name: string;
  slug: string;
  has_access_module: RoleModuleApiDaum[];
  path_access: PathAccessDaum[];
}

export interface RoleModuleApiDaum {
  name: string;
  title: string;
  permission: RolePermissionApiDaum[];
}

export interface RolePermissionApiDaum {
  icon: string;
  menu_name: string;
  path: string;
  actions: Record<string, boolean>;
  children: RoleMenuApiDetail[];
}

export interface RoleMenuApiDetail {
  name: string;
  path: string;
  actions: Record<string, boolean>;
}
