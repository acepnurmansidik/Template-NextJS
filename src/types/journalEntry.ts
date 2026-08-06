// Tipe mirror endpoint /journal-entry (backend Codebase-NoSQL).
//
// Jurnal umum (double-entry): satu header + banyak baris. Total debit HARUS
// sama dengan total credit (balanced). Tiap baris menunjuk akun COA postable.

export enum JournalStatus {
  DRAFT = "DRAFT",
  POSTED = "POSTED",
}

export const JOURNAL_STATUS_LABEL: Record<JournalStatus, string> = {
  [JournalStatus.DRAFT]: "Draft",
  [JournalStatus.POSTED]: "Posted",
};

// Satu baris jurnal sebagaimana dikembalikan API (kode/nama akun ter-snapshot).
export interface JournalLineApiDaum {
  account_id: string;
  account_code: string;
  account_name: string;
  description?: string;
  debit: number;
  credit: number;
}

export interface JournalEntryApiDaum {
  _id: string;
  entry_no: string;
  date: string;
  description?: string;
  reference?: string;
  status: JournalStatus;
  lines: JournalLineApiDaum[];
  total_debit: number;
  total_credit: number;
  created_at?: string;
  updated_at?: string;
}

// Baris pada form (account_id boleh kosong saat baris baru).
export interface JournalLineForm {
  account_id: string;
  description: string;
  debit: number;
  credit: number;
}

// Field header/scalar form (baris debit/credit dikelola state `lines` terpisah).
export interface FormDataJournalEntryProps {
  date: string;
  description: string;
  reference: string;
  status: JournalStatus;
}

// Payload create/update.
export interface JournalEntryPayload {
  date: string;
  description?: string;
  reference?: string;
  status?: JournalStatus;
  lines: {
    account_id: string;
    description?: string;
    debit: number;
    credit: number;
  }[];
}

// Format angka ke tampilan mata uang (tanpa simbol) — mis. 1500000 → "1.500.000".
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
