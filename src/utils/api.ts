// Helper API terpusat & dinamis dipakai oleh semua slice.

import axios from "axios";
import Cookies from "js-cookie";

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
    const accessToken = Cookies.get("TT");
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
