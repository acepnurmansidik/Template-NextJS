// Tipe mirror endpoint /api/v1/component-formula (backend Codebase-NoSQL).

export enum RateType {
  FIXED = "FIXED",
  CALCULATED = "CALCULATED",
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
}

export interface ComponentFormulaApiDaum {
  _id: string;
  name: string;
  slug?: string;
  rate_type: RateType;
  fixed_rate: number;
  calculated_rate: number;
  decimal_place: number;
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
