/* ---------------------------- RESPONSE WRAPPERS -------------------------- */

export interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  page_size?: number;
  current_page?: number;
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Response upload gambar: { data: [{ _id, path }] }.
export interface UploadImageResponse {
  success: boolean;
  message: string;
  data: ImageRef[];
}

/* ----------------------------- IMAGE HELPER ----------------------------- */

// Referensi gambar (populate dari koleksi Image).
export interface ImageRef {
  _id: string;
  path: string;
}

export interface Column {
  title: string;
  value: string;
  classname: string;
}
