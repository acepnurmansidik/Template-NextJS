import { ModuleResponseAPI } from "./module";
import { AuthResponseAPI } from "./users";

// API RESPONSE ====================================

export interface PathAccessResponseAPI {
  path: string;
  // actions bisa kosong ({}) atau berisi flag boolean per aksi.
  actions: Record<string, boolean>;
}

export interface RoleResponseAPI {
  _id: string;
  name: string;
  path_access: PathAccessResponseAPI[];
  has_access_module: ModuleResponseAPI[];
}

export interface IAMApiDaum {
  _id: string;
  name: string;
  device_token: string;
  auth_id: AuthResponseAPI;
  role_id: RoleResponseAPI;
}
