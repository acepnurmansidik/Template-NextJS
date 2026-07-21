// Tipe mirror endpoint /api/v1/component-formula (backend Codebase-NoSQL).

// Akun (Chart of Account) — bisa berupa id string (payload) atau objek
// ter-populate (GET list). Pakai refId() untuk mengambil id-nya.
export interface AccountLite {
  _id: string;
  code?: string;
  name?: string;
  type?: string;
}
export type AccountRef = string | AccountLite;

// Ambil id dari sebuah ref (string atau objek ter-populate).
export const refId = (v: AccountRef | undefined | null): string =>
  v == null ? "" : typeof v === "string" ? v : (v._id ?? "");

export enum RateType {
  FIXED = "FIXED",
  CALCULATED = "CALCULATED",
  // EXTERNAL: komponen tetap punya rate (calculated_rate). Saat dipakai di
  // CalculatedFormula, rate digabung dgn nilai LUAR "x" (target dari koleksi
  // lain) memakai operator yang dipilih PADA TOKEN formula (bukan di komponen).
  // Tampilan: "x {operator} rate", mis. "x + 3.2".
  EXTERNAL = "EXTERNAL",
}

// Field yang boleh dikirim client saat create/update.
// Catatan: `slug` di-generate backend dari `name`, dan `component_id`
// (reverse-ref formula yang memakai komponen ini) TIDAK boleh dikirim client.
export interface ComponentFormulaForm {
  name: string;
  rate_type: RateType;
  fixed_rate: number;
  calculated_rate: number;
  decimal_place: number;
  // Akun (Chart of Account) terkait komponen — id string saat dikirim.
  accounts: string[];
}

export interface ComponentFormulaApiDaum {
  _id: string;
  name: string;
  slug?: string;
  rate_type: RateType;
  fixed_rate: number;
  calculated_rate: number;
  decimal_place: number;
  accounts?: AccountRef[];
  // Daftar CalculatedFormula yang memakai komponen ini (read-only).
  // Selama tidak kosong, komponen tidak bisa dihapus di backend.
  component_id?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface BodyComponentFormulaResponseApiDaum {
  success: boolean;
  message: string;
  // Envelope component-formula tidak selalu menyertakan `code`.
  code?: number;
  data: ComponentFormulaApiDaum[];
  // Total seluruh record (server-side), bukan panjang halaman ini.
  page_size?: number;
  current_page?: number;
}

// Envelope untuk single-object (create/update/delete) — `data` bukan array.
export interface SingleComponentFormulaResponseApiDaum {
  success: boolean;
  message: string;
  code?: number;
  data?: ComponentFormulaApiDaum;
}
