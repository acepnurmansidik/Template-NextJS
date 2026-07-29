"use client";

import CMSLayout from "@/components/atoms/layouts/CMSLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import debounce from "lodash/debounce";
import { FaPlus } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { apiGet } from "@/utils/api";
import { RefParamApiDaum, RefParamTypesResponse } from "@/types/refParam";
import CreateReferenceParameterModal from "@/components/atoms/modals/create/CreateReferenceParameterModal";
import { TableReferenceParameter } from "@/components/atoms/table/tableReferenceParameter";
import { ListResponse } from "@/types/api";

interface DataProps {
  title: string;
  subtitle: string;
}

const columns = [
  { title: "Icon", value: "icon", classname: "w-[10%]" },
  { title: "Value", value: "value", classname: "w-[24%]" },
  { title: "Type", value: "type", classname: "w-[18%]" },
  { title: "Description", value: "description", classname: "w-[36%]" },
  { title: "Action", value: "action", classname: "w-[12%]" },
];

export const ReferenceParameterPage = ({ title, subtitle }: DataProps) => {
  const currentUser = useAppSelector((state) => state.iam.data);
  const pathname = usePathname();
  const [hasAccess, setHasAccess] = useState<Record<string, boolean>>({});

  const [data, setData] = useState<RefParamApiDaum[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [totalData, setTotalData] = useState(0);
  const totalPage = totalData === 0 ? 1 : Math.ceil(totalData / limit);

  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setPage(1);
      }, 500),
    [],
  );
  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const fetchTypes = useCallback(async () => {
    try {
      const res = await apiGet<RefParamTypesResponse>(
        "/ref-parameter/types",
        {},
        false,
      );
      setTypes(res.data ?? []);
    } catch {
      setTypes([]);
    }
  }, []);

  const fetchingData = useCallback(async () => {
    try {
      const result = await apiGet<ListResponse<RefParamApiDaum>>(
        "/ref-parameter",
        { page, limit, search, type },
        false,
      );
      setData(result.data ?? []);
      setTotalData(result.page_size ?? 0);
    } catch {
      setData([]);
      setTotalData(0);
    }
  }, [page, limit, search, type]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

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
                in value &amp; description
              </span>
            </div>

            {/* TYPE (GROUP) FILTER */}
            <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto bg-gray-100 dark:bg-zinc-700/50 p-1 rounded-lg">
              <button
                onClick={() => {
                  setType("");
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  type === ""
                    ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
                }`}
              >
                All
              </button>
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setType(t);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                    type === t
                      ? "bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-gray-500 dark:text-zinc-400 hover:text-gray-700 dark:hover:text-zinc-200"
                  }`}
                >
                  {t.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          <TableReferenceParameter
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
        <CreateReferenceParameterModal
          isOpen={isModalCreateOpen}
          defaultType={type}
          onClose={() => setIsModalCreateOpen(false)}
          onSuccess={() => {
            setIsModalCreateOpen(false);
            fetchTypes();
            fetchingData();
          }}
        />
      )}
    </CMSLayout>
  );
};
