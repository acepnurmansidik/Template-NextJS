// Unit of Measure (master data satuan). Mirror endpoint /uom.

export interface UomApiDaum {
  _id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
}

export interface UomPayload {
  name: string;
  code: string;
  description?: string;
  is_active?: boolean;
}
