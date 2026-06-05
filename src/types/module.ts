import { ActionOption } from "./global_types";

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

// API RESPONSE ====================================
export interface BodyRoleResponseAPI {
  success: string;
  message: string;
  data: ModuleResponseAPI[];
}
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

export interface MenuDetailResponseAPI {
  name: string;
  path: string;
  actions: string[];
}
