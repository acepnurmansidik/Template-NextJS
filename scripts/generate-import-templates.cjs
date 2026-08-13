/**
 * Generate the import example templates in public/templates/<module>.xlsx.
 *
 * Headers use the SAME look as the Export modal (Title Case labels, bold, white
 * text on a blue fill, widened columns). Numeric example cells use the currency
 * number format but stay numeric so import still reads them correctly.
 *
 * Finance modules whose rows contain an array field (`accounts`) are expanded
 * to one row per account line, with the header (scalar) columns merged
 * vertically — identical to how the Export modal builds them.
 *
 * Run:  node scripts/generate-import-templates.cjs
 */
const path = require("path");
const XLSX = require("xlsx-js-style");

const OUT_DIR = path.join(__dirname, "..", "public", "templates");

// Header label: drop underscores -> spaces, Title Case each word. `created_at`
// is shown as "Created Time" (matches the Export modal).
const prettify = (key) =>
  key === "created_at"
    ? "Created Time"
    : key
        .replace(/_/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());

// Same header style as the Export modal.
const headerStyle = {
  font: { bold: true, sz: 13, color: { rgb: "FFFFFF" } },
  fill: { patternType: "solid", fgColor: { rgb: "2563EB" } },
  alignment: { horizontal: "center", vertical: "center", wrapText: true },
  border: {
    top: { style: "thin", color: { rgb: "1E40AF" } },
    bottom: { style: "thin", color: { rgb: "1E40AF" } },
    left: { style: "thin", color: { rgb: "1E40AF" } },
    right: { style: "thin", color: { rgb: "1E40AF" } },
  },
};

// Apply the shared styling to a worksheet given its ordered machine-key columns.
const styleSheet = (ws, columns) => {
  columns.forEach((key, c) => {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c })];
    if (!cell) return;
    cell.v = prettify(key);
    cell.t = "s";
    cell.s = headerStyle;
  });

  // On merged (finance) sheets, center EVERY data cell (merged header columns
  // and per-line account cells alike).
  const centerData = Array.isArray(ws["!merges"]) && ws["!merges"].length > 0;

  const range = XLSX.utils.decode_range(ws["!ref"]);
  const widths = columns.map((k) => prettify(k).length);
  for (let r = 1; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell = ws[XLSX.utils.encode_cell({ r, c })];
      if (!cell) continue;
      if (cell.t === "n") {
        cell.z = "#,##0";
        cell.s = {
          numFmt: "#,##0",
          alignment: centerData
            ? { horizontal: "center", vertical: "center" }
            : { horizontal: "right" },
        };
      } else if (centerData) {
        cell.s = { alignment: { horizontal: "center", vertical: "center" } };
      }
      const len = cell.v == null ? 0 : String(cell.v).length;
      if (len > widths[c]) widths[c] = len;
    }
  }
  ws["!cols"] = widths.map((w) => ({ wch: Math.min(w + 6, 60) }));
  ws["!rows"] = [{ hpt: 22 }];
  return ws;
};

// Build a worksheet from example rows (keyed by snake_case field names). When a
// field is an array, expand it to one row per element and merge the scalar
// columns vertically (finance account lines).
const buildSheet = (rows) => {
  const firstRow = rows[0] ?? {};
  const arrayKey = Object.keys(firstRow).find((k) =>
    rows.some((r) => Array.isArray(r[k])),
  );

  if (!arrayKey) {
    const ws = XLSX.utils.json_to_sheet(rows);
    return styleSheet(ws, Object.keys(firstRow));
  }

  const scalarKeys = Object.keys(firstRow).filter((k) => k !== arrayKey);
  let elementKeys = [];
  for (const r of rows) {
    if (Array.isArray(r[arrayKey]) && r[arrayKey].length) {
      elementKeys = Object.keys(r[arrayKey][0]);
      break;
    }
  }
  const columns = [...scalarKeys, ...elementKeys];

  const aoa = [columns.slice()];
  const merges = [];
  let rowIdx = 1;
  for (const rec of rows) {
    const arr = Array.isArray(rec[arrayKey]) ? rec[arrayKey] : [];
    const n = Math.max(1, arr.length);
    for (let j = 0; j < n; j++) {
      const el = arr[j] ?? {};
      const line = [];
      scalarKeys.forEach((k) => line.push(j === 0 ? (rec[k] ?? "") : ""));
      elementKeys.forEach((k) => line.push(el[k] ?? ""));
      aoa.push(line);
    }
    if (n > 1) {
      scalarKeys.forEach((_k, c) =>
        merges.push({ s: { r: rowIdx, c }, e: { r: rowIdx + n - 1, c } }),
      );
    }
    rowIdx += n;
  }
  const ws = XLSX.utils.aoa_to_sheet(aoa);
  ws["!merges"] = merges;
  return styleSheet(ws, columns);
};

// One template per importable module. Keys mirror what the backend importer
// reads; date columns use DD/MM/YYYY (date only), created_at DD/MM/YYYY HH:mm.
const TEMPLATES = {
  product: [
    {
      code: "PRD-001",
      name: "KOPI ARABIKA 250G",
      category: "BVG",
      uom: "PCS",
      supplier: "SUP-001",
      purchase_price: 35000,
      selling_price: 52000,
      barcode: "8991234567890",
      description: "Kopi arabika kemasan 250 gram",
      is_active: true,
    },
    {
      code: "PRD-002",
      name: "GULA AREN 500G",
      category: "GRC",
      uom: "PCS",
      supplier: "SUP-002",
      purchase_price: 18000,
      selling_price: 27500,
      barcode: "8991234567891",
      description: "Gula aren organik 500 gram",
      is_active: true,
    },
  ],
  "product-category": [
    { prefix: "BVG", name: "Beverages", is_active: true },
    { prefix: "GRC", name: "Grocery", is_active: true },
  ],
  uom: [
    { code: "PCS", name: "Pieces", description: "Satuan per buah", is_active: true },
    { code: "BOX", name: "Box", description: "Satuan per dus", is_active: true },
  ],
  warehouse: [
    {
      code: "WH-001",
      name: "Gudang Pusat",
      phone: "021-555-1000",
      street: "Jl. Merdeka No. 1",
      city: "Jakarta",
      state_province: "DKI Jakarta",
      postal_code: "10110",
      country: "Indonesia",
      is_active: true,
    },
    {
      code: "WH-002",
      name: "Gudang Cabang",
      phone: "022-555-2000",
      street: "Jl. Asia Afrika No. 2",
      city: "Bandung",
      state_province: "Jawa Barat",
      postal_code: "40111",
      country: "Indonesia",
      is_active: true,
    },
  ],
  supplier: [
    {
      code: "SUP-001",
      name: "PT Sumber Rejeki",
      phone: "021-777-1000",
      email: "sales@sumberrejeki.co.id",
      contact_person: "Budi Santoso",
      street: "Jl. Industri No. 10",
      city: "Jakarta",
      state_province: "DKI Jakarta",
      postal_code: "13920",
      country: "Indonesia",
      is_active: true,
    },
    {
      code: "SUP-002",
      name: "CV Mitra Abadi",
      phone: "031-888-2000",
      email: "order@mitraabadi.co.id",
      contact_person: "Siti Rahma",
      street: "Jl. Rungkut No. 5",
      city: "Surabaya",
      state_province: "Jawa Timur",
      postal_code: "60293",
      country: "Indonesia",
      is_active: true,
    },
  ],
  "stock-position": [
    { product: "PRD-001", warehouse: "WH-001", uom: "PCS", quantity: 120, reserved_quantity: 0 },
    { product: "PRD-002", warehouse: "WH-001", uom: "PCS", quantity: 80, reserved_quantity: 5 },
  ],
  "stock-movement": [
    {
      product: "PRD-001",
      warehouse: "WH-001",
      uom: "PCS",
      type: "IN",
      quantity: 100,
      reference: "MOV-2026-0001",
      date: "12/08/2026",
      note: "Penerimaan awal",
      status: "APPROVED",
    },
    {
      product: "PRD-002",
      warehouse: "WH-001",
      uom: "PCS",
      type: "OUT",
      quantity: 20,
      reference: "MOV-2026-0002",
      date: "12/08/2026",
      note: "Pengeluaran penjualan",
      status: "DRAFT",
    },
  ],

  // ---- FINANCE (account lines expand into rows; header columns merged) ----
  "journal-entry": [
    {
      entry_no: "JE-202608-0001",
      date: "05/08/2026",
      description: "Pembelian perlengkapan kantor",
      reference: "INV-77",
      status: "POSTED",
      total_debit: 500000,
      total_credit: 500000,
      accounts: [
        { account_code: "5100", account_name: "Beban Perlengkapan", account_description: "Perlengkapan kantor", debit: 500000, credit: 0 },
        { account_code: "1100", account_name: "Kas", account_description: "Bayar tunai", debit: 0, credit: 500000 },
      ],
      created_at: "05/08/2026 09:15",
    },
    {
      entry_no: "JE-202608-0002",
      date: "07/08/2026",
      description: "Setoran modal pemilik",
      reference: "",
      status: "DRAFT",
      total_debit: 10000000,
      total_credit: 10000000,
      accounts: [
        { account_code: "1100", account_name: "Kas", account_description: "", debit: 10000000, credit: 0 },
        { account_code: "3100", account_name: "Modal", account_description: "", debit: 0, credit: 10000000 },
      ],
      created_at: "07/08/2026 14:00",
    },
  ],
  "journal-write-off": [
    {
      entry_no: "WO-202608-0001",
      date: "10/08/2026",
      write_off_type: "RECEIVABLE",
      reference: "AR-202607-0003",
      description: "Hapus piutang tak tertagih",
      source_type: "ACCOUNT_RECEIVABLE",
      source_no: "AR-202607-0003",
      status: "POSTED",
      total_debit: 750000,
      total_credit: 750000,
      accounts: [
        { account_code: "5200", account_name: "Beban Kerugian Piutang", account_description: "", debit: 750000, credit: 0 },
        { account_code: "1200", account_name: "Piutang Usaha", account_description: "", debit: 0, credit: 750000 },
      ],
      created_at: "10/08/2026 10:00",
    },
  ],
  "account-receivable": [
    {
      entry_no: "AR-202608-0001",
      date: "03/08/2026",
      due_date: "02/09/2026",
      party_name: "PT Pelanggan Setia",
      reference: "SO-101",
      description: "Penjualan barang & jasa",
      status: "OPEN",
      total_amount: 2500000,
      paid_amount: 0,
      total_remaining: 2500000,
      accounts: [
        { account_code: "4100", account_name: "Pendapatan Penjualan", account_description: "Barang", amount: 2000000 },
        { account_code: "4200", account_name: "Pendapatan Jasa", account_description: "Jasa antar", amount: 500000 },
      ],
      created_at: "03/08/2026 08:30",
    },
  ],
  "account-payable": [
    {
      entry_no: "AP-202608-0001",
      date: "04/08/2026",
      due_date: "03/09/2026",
      party_name: "PT Pemasok Jaya",
      reference: "BILL-88",
      description: "Pembelian stok & ongkir",
      status: "PARTIAL",
      total_amount: 1800000,
      paid_amount: 800000,
      total_remaining: 1000000,
      accounts: [
        { account_code: "5100", account_name: "Beban Pembelian", account_description: "Stok barang", amount: 1500000 },
        { account_code: "5300", account_name: "Beban Ongkir", account_description: "Ongkos kirim", amount: 300000 },
      ],
      created_at: "04/08/2026 11:00",
    },
  ],
  "chart-of-account": [
    { code: "1000", name: "ASET", type: "ASSET", normal_balance: "DEBIT", is_header: true, parent_code: "", level: 1, description: "Kelompok aset", created_at: "01/08/2026 08:00" },
    { code: "1000.1100", name: "Kas", type: "ASSET", normal_balance: "DEBIT", is_header: false, parent_code: "1000", level: 2, description: "Kas di tangan", created_at: "01/08/2026 08:01" },
    { code: "1000.1200", name: "Piutang Usaha", type: "ASSET", normal_balance: "DEBIT", is_header: false, parent_code: "1000", level: 2, description: "Piutang pelanggan", created_at: "01/08/2026 08:02" },
    { code: "4000", name: "PENDAPATAN", type: "REVENUE", normal_balance: "CREDIT", is_header: true, parent_code: "", level: 1, description: "Kelompok pendapatan", created_at: "01/08/2026 08:03" },
    { code: "4000.4100", name: "Pendapatan Penjualan", type: "REVENUE", normal_balance: "CREDIT", is_header: false, parent_code: "4000", level: 2, description: "Penjualan barang", created_at: "01/08/2026 08:04" },
  ],
};

for (const [module, rows] of Object.entries(TEMPLATES)) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, buildSheet(rows), module);
  const file = path.join(OUT_DIR, `${module}.xlsx`);
  XLSX.writeFile(wb, file);
  console.log("wrote", path.relative(path.join(__dirname, ".."), file));
}
