// Product Category — mirror model backend (single file, embedded line_accounts).
// line_accounts = daftar COA: { title, account_id → ChartOfAccount }.

// account_id bisa string id atau objek populate { _id, code, name }.
export type AccountRef =
  | string
  | { _id: string; code?: string; name?: string };

export interface LineAccount {
  _id?: string;
  product_category_id?: string | null;
  title: string;
  account_id: AccountRef;
}

export interface ProductCategoryApiDaum {
  _id: string;
  name: string;
  prefix: string;
  slug: string;
  line_accounts: LineAccount[];
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategoryPayload {
  name: string;
  prefix: string;
  is_active?: boolean;
  line_accounts: { title: string; account_id: string }[];
}

// Ambil id akun dari LineAccount (string atau objek populate).
export const accountId = (ref?: AccountRef): string =>
  ref && typeof ref === "object" ? ref._id : (ref ?? "");

// Bentuk field plain yang dikumpulkan modal Create/Update. `line_accounts`
// (tabel dinamis add/remove) tetap dikelola state terpisah, bukan di sini.
export interface FormDataProductCategoryProps {
  name: string;
  prefix: string;
  is_active: boolean;
}
