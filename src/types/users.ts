import { RoleApiDaum } from "./role";

// AUTH ====================================
export interface AuthResponseAPI {
  _id: string;
  email: string;
  username: string;
}

// USERS ====================================
// FORM DATA
export interface UserFormDataDaum {
  username: string;
  email: string;
  password: string;
  role_id: string;
}

export interface UserApiDaum {
  _id: string;
  auth_id: AuthResponseAPI;
  role_id: RoleApiDaum;
  name: string;
  device_token: string;
}

export interface BodyUsersResponseApiDaum {
  success: boolean;
  message: string;
  data: UserApiDaum[];
  // Total seluruh record (bukan panjang halaman saat ini) & halaman aktif.
  page_size?: number;
  current_page?: number;
}
