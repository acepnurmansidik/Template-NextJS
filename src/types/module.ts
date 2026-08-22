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
  // Urutan tampil menu (kecil -> atas). Diinput sebagai text di form, dikirim
  // sebagai number ke backend.
  sequence?: number | string;
  actions: ActionOption[];
  children: MenuDetail[];
}

// API RESPONSE ====================================
export interface ModuleApiDaum {
  _id: string;
  name: string;
  title: string;
  permission: PermissionResponseAPI[];
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
  sequence?: number;
  actions: string[];
  children: MenuDetailResponseAPI[];
}

export interface MenuDetailResponseAPI {
  name: string;
  path: string;
  actions: string[];
}
