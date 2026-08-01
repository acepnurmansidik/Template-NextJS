// Warehouse (master data gudang). Mirror endpoint backend /warehouse.

export interface WarehouseAddress {
  street?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
}

export interface WarehouseApiDaum {
  _id: string;
  code: string;
  name: string;
  slug: string;
  phone?: string;
  address?: WarehouseAddress;
  is_active: boolean;
  created_at?: string;
}

export interface WarehousePayload {
  name: string;
  code: string;
  phone?: string;
  address?: WarehouseAddress;
  is_active?: boolean;
}
