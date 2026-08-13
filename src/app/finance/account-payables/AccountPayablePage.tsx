"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { Column, ListResponse } from "@/types/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { FaPlus } from "react-icons/fa";
import { CiImport, CiExport } from "react-icons/ci";
import ImportModal from "@/components/atoms/modals/shared/ImportModal";
import ExportModal from "@/components/atoms/modals/shared/ExportModal";
import { usePathname } from "next/navigation";
import { apiGet } from "@/utils/api";
import { AccountPayableApiDaum } from "@/types/accountPayable";
import CreateAccountPayableModal from "@/components/atoms/modals/create/CreateAccountPayableModal";
import { TableAccountPayable } from "@/components/atoms/table/tableAccountPayable";
import {
  AccountReceivableStatus,
  AR_STATUS_LABEL,
} from "@/types/accountReceivable";
import { getAccess } from "@/utils/secureCookie";

interface DataProps {
  title: string;
  subtitle: string;
}

const columns: Column[] = [
  { title: "Bill No", value: "entry_no", classname: "w-[12%]" },
  { title: "Date", value: "date", classname: "w-[12%]" },
  { title: "Due", value: "due_date", classname: "w-[12%]" },
  { title: "Vendor", value: "party_name", classname: "w-[18%]" },
  { title: "Total", value: "total_amount", classname: "w-[12%] text-right" },
  { title: "Paid", value: "paid_amount", classname: "w-[12%] text-right" },
  { title: "Status", value: "status", classname: "w-[12%]" },
  { title: "Action", value: "action", classname: "w-[10%]" },
];

const STATUS_FILTERS: AccountReceivableStatus[] = [
  AccountReceivableStatus.DRAFT,
  AccountReceivableStatus.OPEN,
  AccountReceivableStatus.PARTIAL,
  AccountReceivableStatus.PAID,
  AccountReceivableStatus.WRITE_OFF,
];

export const AccountPayablePage = ({ title, subtitle }: DataProps) => {
  const pathname = usePathname();
  const [hasAccess, setHasAccess] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const perm = getAccess().get(pathname) ?? {};
    setHasAccess(perm);
  }, [pathname]);

  const [data, setData] = useState<AccountPayableApiDaum[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const [totalData, setTotalData] = useState(0);
  const totalPage = totalData === 0 ? 1 : Math.ceil(totalData / limit);

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalImport, setIsModalImport] = useState(false);
  const [isModalExport, setIsModalExport] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 500),
    [],
  );
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const fetchingData = useCallback(async () => {
    try {
      const result = await apiGet<ListResponse<AccountPayableApiDaum>>(
        "/account-payable",
        { page, limit, search, status: statusFilter },
        false,
      );
      setData(result.data ?? []);
      setTotalData(result.page_size ?? 0);
      setStatusCounts(result.status_counts ?? {});
    } catch {
      setData([]);
      setTotalData(0);
      setStatusCounts({});
    }
  }, [page, limit, search, statusFilter]);

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  useEffect(() => {
    if (page > totalPage) setPage(1);
  }, [totalPage, page]);

  const windowPages = (() => {
    if (totalData === 0) return [1];
    if (page === 1) return [1, 2, 3].filter((p) => p <= totalPage);
    if (page === totalPage)
      return [totalPage - 2, totalPage - 1, totalPage].filter((p) => p > 0);
    return [page - 1, page, page + 1].filter((p) => p <= totalPage);
  })();

  return (
    <CMSLayout>
      <div className="w-full px-6 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsModalImport(true)}
              className="h-8.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 active:bg-gray-100 dark:active:bg-zinc-600 cursor-pointer px-4 flex items-center gap-2 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-sm"
            >
              <CiImport
                size={14}
                strokeWidth={1.5}
                className="text-gray-500 dark:text-zinc-400"
              />
              <span>Import</span>
            </button>
            <button
              onClick={() => setIsModalExport(true)}
              className="h-8.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 active:bg-gray-100 dark:active:bg-zinc-600 cursor-pointer px-4 flex items-center gap-2 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-sm"
            >
              <CiExport
                size={14}
                strokeWidth={1.5}
                className="text-gray-500 dark:text-zinc-400"
              />
              <span>Export</span>
            </button>
            {hasAccess.create && (
              <button
                onClick={() => setIsModalCreateOpen(true)}
                className="h-8.5 rounded-lg text-xs font-medium bg-white dark:bg-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-600/80 active:bg-gray-100 dark:active:bg-zinc-600 cursor-pointer px-4 flex items-center gap-2 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-sm"
              >
                <FaPlus
                  size={10}
                  className="text-gray-500 dark:text-zinc-400"
                />
                <span>Create New</span>
              </button>
            )}
          </div>
        </div>

        {/* STATUS FILTER — segmented control, rata kanan di bawah tombol Create */}
        <div className="flex justify-end mb-3">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/60 p-1">
            {[
              { value: "", label: "All", count: statusCounts.ALL ?? 0 },
              ...STATUS_FILTERS.map((s) => ({
                value: s as string,
                label: AR_STATUS_LABEL[s],
                count: statusCounts[s] ?? 0,
              })),
            ].map((chip) => {
              const active = statusFilter === chip.value;
              return (
                <button
                  key={chip.value || "ALL"}
                  onClick={() => {
                    setStatusFilter(chip.value);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-zinc-400 hover:text-gray-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <span>{chip.label}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-bold tabular-nums ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600 dark:bg-zinc-600 dark:text-zinc-200"
                    }`}
                  >
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 py-4 rounded-lg shadow-xs bg-white dark:bg-zinc-800 transition-colors duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-zinc-700">
            <div className="flex flex-col space-y-1.5">
              <div className="relative w-72">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    debouncedSearch(e.target.value);
                  }}
                  className="w-full py-1.5 px-1 text-sm border-b-2 border-gray-200 dark:border-zinc-700 outline-none transition-colors duration-200 focus:border-blue-600 dark:focus:border-blue-500 bg-transparent text-gray-800 dark:text-zinc-200 placeholder-gray-400 dark:placeholder-zinc-500"
                />
              </div>
              <span className="text-xs text-gray-400 dark:text-zinc-500 select-none">
                <span className="font-semibold text-gray-500 dark:text-zinc-400">
                  Search
                </span>{" "}
                in no, vendor, reference
              </span>
            </div>
          </div>

          <TableAccountPayable
            columns={columns}
            hasAccess={hasAccess}
            data={data}
            page={page}
            limit={limit}
            totalData={totalData}
            totalPage={totalPage}
            setPage={setPage}
            setLimit={setLimit}
            windowPages={windowPages}
            onRefresh={fetchingData}
          />
        </div>
      </div>

      {isModalCreateOpen && (
        <CreateAccountPayableModal
          isOpen={isModalCreateOpen}
          onClose={() => setIsModalCreateOpen(false)}
          onSuccess={() => {
            setIsModalCreateOpen(false);
            fetchingData();
          }}
        />
      )}
      {isModalImport && (
        <ImportModal
          isOpen={isModalImport}
          onClose={() => setIsModalImport(false)}
          module={"account-payable"}
          label={"Account Payable"}
        />
      )}
      {isModalExport && (
        <ExportModal
          isOpen={isModalExport}
          onClose={() => setIsModalExport(false)}
          module={"account-payable"}
          label={"Account Payable"}
        />
      )}
    </CMSLayout>
  );
};
