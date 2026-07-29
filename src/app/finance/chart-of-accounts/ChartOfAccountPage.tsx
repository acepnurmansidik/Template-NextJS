"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { FaPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { apiGet } from "@/utils/api";
import { ChartOfAccountApiDaum } from "@/types/chartOfAccount";
import CreateChartOfAccountModal from "@/components/atoms/modals/create/CreateChartOfAccountModal";
import { TableChartOfAccount } from "@/components/atoms/table/tableChartOfAccount";
import { ListResponse } from "@/types/api";

interface DataProps {
  title: string;
  subtitle: string;
}

export const ChartOfAccountPage = ({ title, subtitle }: DataProps) => {
  const currentUser = useAppSelector((state) => state.iam.data);
  const pathname = usePathname();
  const [hasAccess, setHasAccess] = useState<Record<string, boolean>>({});

  const [accounts, setAccounts] = useState<ChartOfAccountApiDaum[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | null>(null);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 500),
    [],
  );
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const fetchingData = useCallback(async () => {
    try {
      const result = await await apiGet<ListResponse<ChartOfAccountApiDaum>>(
        "/chart-of-account",
        { search },
        false,
      );
      setAccounts(result.data ?? []);
    } catch {
      setAccounts([]);
    }
  }, [search]);

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  useEffect(() => {
    if (currentUser) {
      const matched = currentUser.role_id.path_access.find(
        (item) => item.path === pathname,
      );
      setHasAccess(matched?.actions ?? {});
    }
  }, [currentUser, pathname]);

  const openCreate = (parentId: string | null) => {
    setCreateParentId(parentId);
    setIsModalCreateOpen(true);
  };

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
            {hasAccess.create && (
              <button
                onClick={() => openCreate(null)}
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
                  placeholder="Search code or name..."
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
                in code &amp; name
              </span>
            </div>
          </div>

          <TableChartOfAccount
            hasAccess={hasAccess}
            data={accounts}
            searchActive={!!search.trim()}
            onRefresh={fetchingData}
            onAddChild={(parentId) => openCreate(parentId)}
          />
        </div>
      </div>

      {isModalCreateOpen && (
        <CreateChartOfAccountModal
          isOpen={isModalCreateOpen}
          defaultParentId={createParentId}
          onClose={() => setIsModalCreateOpen(false)}
          onSuccess={() => {
            setIsModalCreateOpen(false);
            fetchingData();
          }}
        />
      )}
    </CMSLayout>
  );
};
