// Tipe untuk form & response autentikasi (login / register).

export interface AuthFormValues {
  email: string;
  password: string;
  // Nama lengkap (dikirim sebagai `username` ke endpoint sign-up).
  name?: string;
}

// Data user yang dikembalikan endpoint /auth/sign-in (disederhanakan — hanya
// bagian yang dipakai frontend; token dipakai untuk sesi).
export interface LoginData {
  _id?: string;
  name?: string;
  email?: string;
  token: string;
  role_id?: {
    _id?: string;
    name?: string;
  };
  // actions berupa map { read: true, create: false, ... } sesuai backend.
  path_access?: { path: string; actions?: Record<string, boolean> }[];
}

// Bentuk respons standar backend { status, message, data }.
export interface AuthResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}
