export interface UtilityFormulaApiDaum {
  _id: string;
  name: string;
  code: string;
  // Selama tidak kosong, komponen tidak bisa dihapus di backend.
  component_id?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface UtilityFormulaForm {
  name: string;
  code: string;
}
