// FORM DATA
export interface ModuleFormData {
  name: string;
  title: string;
  permission: PermissionDataItem[];
}

export interface MenuDetail {
  name: string;
  path: string;
  actions: ActionOption[];
}

export interface PermissionDataItem {
  icon: string;
  menu_name: string;
  path: string;
  actions: ActionOption[];
  children: MenuDetail[];
}

interface ActionOption {
  label: string;
  value: string;
}

// API RESPONSE ====================================
export interface ModuleResponseAPI {
  name: string;
  title: string;
  permission: PermissionResponseAPI[];
}

export interface PermissionResponseAPI {
  icon: string;
  menu_name: string;
  path: string;
  actions: string[];
  children: MenuDetailResponseAPI[];
}

interface MenuDetailResponseAPI {
  name: string;
  path: string;
  actions: string[];
}
