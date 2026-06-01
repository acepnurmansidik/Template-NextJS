export interface ModuleFormData {
  name: string;
  title: string;
  permission: PermissionDataItem[];
}

export interface PermissionDataItem {
  _id?: number;
  icon: string;
  menu_name: string;
  path: string;
  actions: ActionOption[];
}

interface ActionOption {
  label: string;
  value: string;
}
