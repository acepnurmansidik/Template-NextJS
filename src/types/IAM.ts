import { ModuleApiDaum, ModuleResponseAPI } from "./module";

// FORM DATA
export interface IAMFormDataDaum {
  user_id: string;
  role_id: string;
}

// API RESPONSE ====================================
export interface AuthResponseAPI {
  _id: string;
  email: string;
  username: string;
}

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

export interface BodyIAMResponseApiDaum {
  success: boolean;
  message: string;
  // /users/iam mengembalikan satu objek user (bukan array).
  data: IAMApiDaum;
}
