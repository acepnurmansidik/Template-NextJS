// Tipe & konfigurasi untuk Account Payable (utang usaha / tagihan dari vendor).
// Mirror endpoint backend /account-payable.

export enum AccountPayableStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
  WRITE_OFF = "WRITE_OFF",
}

export const AP_STATUS_LABEL: Record<AccountPayableStatus, string> = {
  [AccountPayableStatus.DRAFT]: "Draft",
  [AccountPayableStatus.OPEN]: "Open",
  [AccountPayableStatus.PARTIAL]: "Partial",
  [AccountPayableStatus.PAID]: "Paid",
  [AccountPayableStatus.WRITE_OFF]: "Write Off",
};

// Satu baris dokumen (kode/nama akun ter-snapshot dari COA).
export interface AccountPayableLineApiDaum {
  account_id: string;
  account_code: string;
  account_name: string;
  description?: string;
  amount: number;
}

export interface AccountPayableApiDaum {
  _id: string;
  entry_no: string;
  date: string;
  due_date?: string;
  party_name?: string;
  reference?: string;
  description?: string;
  status: AccountPayableStatus;
  lines: AccountPayableLineApiDaum[];
  total_amount: number;
  paid_amount: number;
  created_at?: string;
  updated_at?: string;
}

// Baris pada form (account_id boleh kosong saat baris baru).
export interface AccountPayableLineForm {
  account_id: string;
  description: string;
  amount: number;
}

// Field header form (di luar lines yang punya handler tersendiri).
export interface FormDataAccountPayableProps {
  date: string;
  due_date: string;
  party_name: string;
  reference: string;
  description: string;
  status: AccountPayableStatus;
  paid_amount: number;
}

// Payload create/update.
export interface AccountPayablePayload {
  date: string;
  due_date?: string;
  party_name?: string;
  reference?: string;
  description?: string;
  status?: AccountPayableStatus;
  paid_amount?: number;
  lines: {
    account_id: string;
    description?: string;
    amount: number;
  }[];
}
