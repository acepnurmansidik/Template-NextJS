// Tipe mirror endpoint /journal-write-off (backend Codebase-NoSQL).
//
// Jurnal penghapusan (write-off) — double-entry seimbang (total debit == total
// credit), sama seperti Journal Entry, dengan kategori write_off_type.

export enum WriteOffStatus {
  DRAFT = "DRAFT",
  POSTED = "POSTED",
}

// Tipe dokumen sumber yang ditautkan (dihapus) oleh write-off.
export enum WriteOffSourceType {
  NONE = "NONE",
  JOURNAL_ENTRY = "JOURNAL_ENTRY",
  ACCOUNT_RECEIVABLE = "ACCOUNT_RECEIVABLE",
  ACCOUNT_PAYABLE = "ACCOUNT_PAYABLE",
}

export const WRITE_OFF_SOURCE_LABEL: Record<WriteOffSourceType, string> = {
  [WriteOffSourceType.NONE]: "None",
  [WriteOffSourceType.JOURNAL_ENTRY]: "Journal Entry",
  [WriteOffSourceType.ACCOUNT_RECEIVABLE]: "Account Receivable",
  [WriteOffSourceType.ACCOUNT_PAYABLE]: "Account Payable",
};

// Endpoint list per tipe sumber (untuk dropdown pemilih dokumen).
export const WRITE_OFF_SOURCE_PATH: Record<WriteOffSourceType, string> = {
  [WriteOffSourceType.NONE]: "",
  [WriteOffSourceType.JOURNAL_ENTRY]: "/journal-entry",
  [WriteOffSourceType.ACCOUNT_RECEIVABLE]: "/account-receivable",
  [WriteOffSourceType.ACCOUNT_PAYABLE]: "/account-payable",
};

export enum WriteOffType {
  RECEIVABLE = "RECEIVABLE",
  PAYABLE = "PAYABLE",
  INVENTORY = "INVENTORY",
  OTHER = "OTHER",
}

export const WRITE_OFF_TYPE_LABEL: Record<WriteOffType, string> = {
  [WriteOffType.RECEIVABLE]: "Receivable (Bad Debt)",
  [WriteOffType.PAYABLE]: "Payable",
  [WriteOffType.INVENTORY]: "Inventory",
  [WriteOffType.OTHER]: "Other",
};

export interface WriteOffLineApiDaum {
  account_id: string;
  account_code: string;
  account_name: string;
  description?: string;
  debit: number;
  credit: number;
}

export interface JournalWriteOffApiDaum {
  _id: string;
  entry_no: string;
  date: string;
  write_off_type: WriteOffType;
  description?: string;
  reference?: string;
  status: WriteOffStatus;
  lines: WriteOffLineApiDaum[];
  total_debit: number;
  total_credit: number;
  source_type?: WriteOffSourceType | string;
  source_id?: string;
  source_no?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WriteOffLineForm {
  account_id: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalWriteOffPayload {
  date: string;
  write_off_type?: WriteOffType;
  description?: string;
  reference?: string;
  status?: WriteOffStatus;
  source_type?: WriteOffSourceType | string;
  source_id?: string;
  lines: {
    account_id: string;
    description?: string;
    debit: number;
    credit: number;
  }[];
}

// Format angka ke tampilan mata uang (tanpa simbol) — 1500000 → "1.500.000".
export const formatAmount = (n: number): string =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0,
  );

// Jumlahkan total debit/credit dari baris form (untuk cek balance live).
export const sumLines = (lines: { debit: number; credit: number }[]) => {
  const round2 = (v: number) => Math.round((Number(v) || 0) * 100) / 100;
  let debit = 0;
  let credit = 0;
  for (const l of lines) {
    debit += Number(l.debit) || 0;
    credit += Number(l.credit) || 0;
  }
  return { totalDebit: round2(debit), totalCredit: round2(credit) };
};
