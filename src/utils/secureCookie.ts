// Penyimpanan token terenkripsi di cookie.
//
// JWT hasil login tidak disimpan apa adanya; ia dienkripsi dulu dengan AES
// (crypto-js) memakai secret dari env, lalu ciphertext-nya yang ditaruh di
// cookie "TT". Saat dibaca kembali (api.ts / socket.ts), token didekripsi lewat
// getToken(). Ini mengurangi risiko token terbaca langsung dari cookie.
//
// Catatan: enkripsi sisi-klien BUKAN pengganti httpOnly cookie untuk keamanan
// penuh — secret ikut ter-bundle di client. Ini lapisan obfuscation sesuai
// kebutuhan (JWT di cookie, terenkripsi crypto-js), bukan proteksi mutlak.

import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

export const TOKEN_COOKIE = "TT";

// Secret AES. Override lewat NEXT_PUBLIC_COOKIE_SECRET; fallback konstan agar
// dev tetap jalan tanpa konfigurasi tambahan.
const SECRET = process.env.NEXT_PUBLIC_COOKIE_SECRET || "secure-cookie-key";

// Umur cookie (hari) — samakan dengan masa berlaku JWT backend bila perlu.
const COOKIE_EXPIRES_DAYS = 3;

export const encryptValue = (value: string): string =>
  CryptoJS.AES.encrypt(value, SECRET).toString();

export const decryptValue = (cipher: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};

// Simpan JWT terenkripsi ke cookie "TT".
export const setToken = (token: string): void => {
  Cookies.set(TOKEN_COOKIE, encryptValue(token), {
    expires: COOKIE_EXPIRES_DAYS,
    sameSite: "lax",
    secure:
      typeof window !== "undefined" && window.location.protocol === "https:",
  });
};

// Penyimpanan:
//  - TT (JWT)          -> cookie (terenkripsi)
//  - UI (info user)    -> cookie (terenkripsi) — kecil, muat.
//  - AM (path_access)  -> localStorage (terenkripsi) — cookie dibatasi ~4KB
//    sehingga path_access besar gagal tersimpan (kebaca []); localStorage
//    ~5MB/origin jadi lapang.
export const ACCESS_KEY = "AM"; // Access Module (path_access) — localStorage
export const USER_COOKIE = "UI"; // User Info (email + name) — cookie

// Opsi cookie standar.
const cookieOpts = () => ({
  expires: COOKIE_EXPIRES_DAYS,
  sameSite: "lax" as const,
  secure:
    typeof window !== "undefined" && window.location.protocol === "https:",
});

// --- JSON terenkripsi di COOKIE ---
export const setSecureJSON = (name: string, value: unknown): void => {
  Cookies.set(name, encryptValue(JSON.stringify(value)), cookieOpts());
};

export const getSecureJSON = <T>(name: string): T | null => {
  const cipher = Cookies.get(name);
  if (!cipher) return null;
  const plain = decryptValue(cipher);
  if (!plain) return null;
  try {
    return JSON.parse(plain) as T;
  } catch {
    return null;
  }
};

// --- JSON terenkripsi di LOCALSTORAGE ---
export const setSecureStorage = (key: string, value: unknown): void => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, encryptValue(JSON.stringify(value)));
  } catch {
    // storage penuh / diblokir — abaikan.
  }
};

export const getSecureStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const cipher = window.localStorage.getItem(key);
  if (!cipher) return null;
  const plain = decryptValue(cipher);
  if (!plain) return null;
  try {
    return JSON.parse(plain) as T;
  } catch {
    return null;
  }
};

export interface UserInfo {
  email: string;
  name: string;
}

// path_access dari backend: { path, actions: Record<string, boolean> }.
export type Actions = Record<string, boolean>;
export type PathAccess = { path: string; actions?: Actions };
// Bentuk map hak akses: path -> actions.
export type AccessMap = Map<string, Actions>;

// path_access (hak akses) — terenkripsi, DI LOCALSTORAGE (bisa besar).
//
// PENTING: `Map` TIDAK bisa di-JSON.stringify (hasilnya selalu "{}", datanya
// hilang). Jadi disimpan sebagai OBJECT map { [path]: actions } yang JSON-
// friendly, lalu dibaca kembali menjadi `Map` oleh getAccess().
export const setAccess = (pathAccess: PathAccess[]): void => {
  const record: Record<string, Actions> = {};
  for (const item of pathAccess ?? []) {
    record[String(item.path)] = item.actions ?? {};
  }
  setSecureStorage(ACCESS_KEY, record);
};

// Kembalikan sebagai Map<path, actions>; gunakan access.get(path) untuk cek
// hak akses sebuah halaman.
export const getAccess = (): AccessMap => {
  const record = getSecureStorage<Record<string, Actions>>(ACCESS_KEY) ?? {};
  return new Map(Object.entries(record));
};

// Proxy baca-saja untuk localStorage terenkripsi: akses key sebagai properti
// biasa akan OTOMATIS mendekripsi + parse JSON-nya. Contoh:
//   secureStore.AM  -> object map path_access (sudah didekripsi), null bila kosong
export const secureStore = new Proxy(
  {},
  {
    get: (_target, key) => getSecureStorage(String(key)),
  },
) as Record<string, unknown>;

// Info user login (email + nama) — terenkripsi, DI COOKIE (kecil).
export const setUserInfo = (info: UserInfo): void => {
  setSecureJSON(USER_COOKIE, info);
};

export const getUserInfo = (): UserInfo | null =>
  getSecureJSON<UserInfo>(USER_COOKIE);

// Ambil JWT (sudah didekripsi) dari cookie "TT"; "" bila tidak ada / gagal.
export const getToken = (): string => {
  const cipher = Cookies.get(TOKEN_COOKIE);
  if (!cipher) return "";
  return decryptValue(cipher);
};

// Hapus seluruh sesi: token & info user (cookie) + path_access (localStorage).
export const clearToken = (): void => {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(USER_COOKIE);
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ACCESS_KEY);
  }
};

// True bila sesi lengkap (ada token + ada hak akses). Bila tidak lengkap,
// bersihkan sisa sesi agar konsisten. Catatan: `Map` selalu truthy, jadi cek
// `.size` — bukan `!AM`.
export const checkAuthAvailable = (): boolean => {
  const token = getToken();
  const access = getAccess();
  if (!token || access.size === 0) {
    clearToken();
    return false;
  }
  return true;
};
