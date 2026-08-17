"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { CiImport, CiExport } from "react-icons/ci";
import ImportModal from "@/components/atoms/modals/shared/ImportModal";
import ExportModal from "@/components/atoms/modals/shared/ExportModal";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { FaPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { apiGet } from "@/utils/api";
import { SupplierApiDaum } from "@/types/supplier";
import CreateSupplierModal from "@/components/atoms/modals/create/CreateSupplierModal";
import { TableSupplier } from "@/components/atoms/table/tableSupplier";
import { Column, ListResponse } from "@/types/api";
import { getAccess } from "@/utils/secureCookie";

interface DataProps {
  title: string;
  subtitle: string;
}

const columns: Column[] = [
  { title: "Code", value: "code", classname: "w-[14%]" },
  { title: "Name", value: "name", classname: "w-[28%]" },
  { title: "Contact Person", value: "contact_person", classname: "w-[20%]" },
  { title: "Phone", value: "phone", classname: "w-[18%]" },
  { title: "Status", value: "status", classname: "w-[10%]" },
  { title: "Action", value: "action", classname: "w-[10%]" },
];

export const SupplierPage = ({ title, subtitle }: DataProps) => {
  const pathname = usePathname();
  const [hasAccess, setHasAccess] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const perm = getAccess().get(pathname) ?? {};
    setHasAccess(perm);
  }, [pathname]);

  const [data, setData] = useState<SupplierApiDaum[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [totalData, setTotalData] = useState(0);
  const totalPage = totalData === 0 ? 1 : Math.ceil(totalData / limit);

  const [isModalCreateOpen, setIsModalCreateOpen] = useState<boolean>(false);
  const [isModalImport, setIsModalImport] = useState<boolean>(false);
  const [isModalExport, setIsModalExport] = useState<boolean>(false);

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
      const result = await apiGet<ListResponse<SupplierApiDaum>>(
        "/supplier",
        { page, limit, search },
        false,
      );
      setData(result.data ?? []);
      setTotalData(result.page_size ?? 0);
    } catch {
      setData([]);
      setTotalData(0);
    }
  }, [page, limit, search]);

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
          <div className="flex-4">
            <h1 className="text-3xl font-black text-gray-900 dark:text-zinc-50 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-3 justify-end">
            {hasAccess.import && (
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
            )}
            {hasAccess.export && (
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
            )}
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
                in name &amp; code
              </span>
            </div>
          </div>

          <TableSupplier
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
        <CreateSupplierModal
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
          module={"supplier"}
          label={"Supplier"}
        />
      )}
      {isModalExport && (
        <ExportModal
          isOpen={isModalExport}
          onClose={() => setIsModalExport(false)}
          module={"supplier"}
          label={"Supplier"}
        />
      )}
    </CMSLayout>
  );
};
