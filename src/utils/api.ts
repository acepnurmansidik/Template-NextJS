// Helper API terpusat & dinamis dipakai oleh semua slice.

import axios from "axios";
import { getToken } from "@/utils/secureCookie";

// Base URL bisa dioverride lewat env NEXT_PUBLIC_API_URL.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Tipe params query yang fleksibel.
export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

// Bangun query string dari object secara dinamis.
// Nilai undefined / null / "" otomatis diabaikan.
export const buildQuery = (params?: QueryParams): string => {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join("&");
  return query ? `?${query}` : "";
};

// GET generik memakai axios. `endpoint` relatif terhadap API_BASE_URL
// Bearer yang diambil dari cookie "TT".
export const apiGet = async <T>(
  endpoint: string,
  params?: QueryParams,
  token?: boolean,
): Promise<T> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    const accessToken = getToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  const res = await axios.get<T>(
    `${API_BASE_URL}${endpoint}${buildQuery(params)}`,
    { headers },
  );

  return res.data;
};

// Bangun headers dinamis dipakai bersama POST/PUT/DELETE.
// - `token`   : bila true, ambil Bearer dari cookie "TT" (sama seperti apiGet).
// - `isFormData`: bila true, payload berupa file/FormData (multipart) sehingga
//   Content-Type dibiarkan diatur otomatis oleh browser (lengkap dgn boundary);
//   bila false/undefined dipakai application/json.
const buildHeaders = (
  token?: boolean,
  isFormData?: boolean,
): Record<string, string> => {
  const headers: Record<string, string> = {};

  // Cek dulu apakah ini upload file (multipart) atau JSON biasa.
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // Cek token — logika sama seperti apiGet (didekripsi dari cookie "TT").
  if (token) {
    const accessToken = getToken();
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return headers;
};

// POST generik. `isFormData` true bila `data` berupa FormData (upload file).
export const apiPost = async <T>(
  endpoint: string,
  data?: unknown,
  token?: boolean,
  isFormData?: boolean,
): Promise<T> => {
  const headers = buildHeaders(token, isFormData ?? false);
  const res = await axios.post<T>(`${API_BASE_URL}${endpoint}`, data, {
    headers,
  });
  return res.data;
};

// PUT generik. `isFormData` true bila `data` berupa FormData (upload file).
export const apiPut = async <T>(
  endpoint: string,
  data?: unknown,
  token?: boolean,
  isFormData?: boolean,
): Promise<T> => {
  const headers = buildHeaders(token, isFormData ?? false);
  const res = await axios.put<T>(`${API_BASE_URL}${endpoint}`, data, {
    headers,
  });
  return res.data;
};

// DELETE generik. Mendukung query params opsional & token.
export const apiDelete = async <T>(
  endpoint: string,
  params?: QueryParams,
  token?: boolean,
): Promise<T> => {
  const headers = buildHeaders(token);
  const res = await axios.delete<T>(
    `${API_BASE_URL}${endpoint}${buildQuery(params)}`,
    { headers },
  );
  return res.data;
};
