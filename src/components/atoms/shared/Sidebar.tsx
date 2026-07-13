"use client";

import Image from "next/image";
import Cookies from "js-cookie";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers } from "@/store/slices/iamSlice";

// Bentuk data minimal yang dibutuhkan sidebar untuk render. Baik data statis
// (USER_IAM) maupun data dari API bisa dinormalisasi ke tipe ini.
interface SidebarMenu {
  icon: string;
  menu_name: string;
  path: string;
  children: { name: string; path: string }[];
}
interface SidebarModule {
  name: string;
  title: string;
  permission: SidebarMenu[];
}

// Skeleton loading untuk menu sidebar saat data user sedang di-fetch.
const SidebarSkeleton = ({ collapsed }: { collapsed: boolean }) => (
  <div className="animate-pulse" aria-hidden="true">
    {[0, 1].map((group) => (
      <div key={group} className="space-y-1 mb-6">
        {!collapsed && (
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-zinc-700 mx-3 mb-3" />
        )}
        {[0, 1, 2].map((row) => (
          <div
            key={row}
            className={`flex items-center gap-3 p-2.5 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="h-6 w-6 shrink-0 rounded-md bg-gray-200 dark:bg-zinc-700" />
            {!collapsed && (
              <div className="h-3 flex-1 max-w-[150px] rounded bg-gray-200 dark:bg-zinc-700" />
            )}
          </div>
        ))}
      </div>
    ))}
  </div>
);

// KUNCI UTAMA: Menyimpan state di memory global browser
let globalOpenKey: string | null = null;
let globalCollapsed: boolean = false;

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.iam.data);
  const loading = useAppSelector((state) => state.iam.loading);
  const error = useAppSelector((state) => state.iam.error);

  // Tampilkan skeleton saat fetch berjalan atau data belum ada (sebelum
  // request pertama selesai), tapi berhenti bila sudah error.
  const showSkeleton = loading || (!currentUser && !error);

  const [openKey, setOpenKeyState] = useState<string | null>(globalOpenKey);
  const [collapsed, setCollapsedState] = useState<boolean>(globalCollapsed);

  // Ambil data user (IAM) sekali saja. Store Redux tetap hidup saat pindah
  // halaman (client-side nav), jadi cukup fetch bila data belum ada & tidak
  // sedang loading — mencegah refetch berulang tiap ganti halaman.
  useEffect(() => {
    if (!currentUser && !loading) {
      dispatch(fetchUsers());
    }
  }, [dispatch, currentUser, loading]);

  // Path yang boleh diakses current user (dari /users/iam).
  const allowedPaths = useMemo(() => {
    const paths =
      currentUser?.role_id?.path_access?.map((access) => access.path) ?? [];
    return new Set(paths);
  }, [currentUser]);

  const menuGroups: SidebarModule[] = useMemo(() => {
    // 1) Struktur menu (icon, title, children) memakai data statis USER_IAM.
    const base =
      currentUser?.role_id.has_access_module || ([] as SidebarModule[]);

    // 2) Selama path_access user belum tersedia (masih loading), tampilkan
    //    struktur penuh agar sidebar tidak kosong.
    if (allowedPaths.size === 0) return base;

    // 3) Filter menu sesuai path_access current user:
    //    - item punya children -> sisakan hanya child yang path-nya diizinkan,
    //      buang item bila tak ada child tersisa.
    //    - item tanpa children -> tampil hanya jika path-nya diizinkan.
    //    - module tanpa item tersisa -> dibuang.
    return base
      .map((module) => {
        const permission: SidebarMenu[] = [];
        for (const item of module.permission) {
          if (item.children.length > 0) {
            const children = item.children.filter((child) =>
              allowedPaths.has(child.path),
            );
            if (children.length > 0) permission.push({ ...item, children });
          } else if (allowedPaths.has(item.path)) {
            permission.push(item);
          }
        }
        return { ...module, permission };
      })
      .filter((module) => module.permission.length > 0);
  }, [allowedPaths]);

  const setOpenKey = (key: string | null) => {
    globalOpenKey = key;
    setOpenKeyState(key);
  };

  const setCollapsed = (val: boolean) => {
    globalCollapsed = val;
    setCollapsedState(val);
  };

  useEffect(() => {
    // // AM: Access Module
    // const hasAccess = Cookies.get("AM");
    // if (!hasAccess) return router.push("/auth/login");

    let foundKey: string | null = null;
    menuGroups.forEach((module, gIndex) => {
      module.permission.forEach((item: SidebarMenu, iIndex: number) => {
        const key = `${gIndex}-${iIndex}`;
        if (item.children?.some((child) => child.path === pathname)) {
          foundKey = key;
        }
      });
    });
    setOpenKey(foundKey);
  }, [pathname, menuGroups]);

  const toggleParent = (key: string, hasChild: boolean, item: SidebarMenu) => {
    if (collapsed) {
      setCollapsed(false);
      if (hasChild) setOpenKey(key);
      else router.push(item.path, { scroll: false });
      return;
    }

    if (!hasChild) {
      router.push(item.path, { scroll: false });
      return;
    }
    setOpenKey(openKey === key ? null : key);
  };

  const toggleSidebarFromLogo = () => {
    if (collapsed) {
      setCollapsed(false);
      return;
    }
    setOpenKey(null);
    setCollapsed(true);
  };

  const expandIfCollapsed = () => {
    if (collapsed) setCollapsed(false);
  };

  return (
    <div
      className={`max-w-xs h-screen bg-white dark:bg-zinc-800 flex flex-col gap-4 transition-all duration-300 border-r border-gray-100 dark:border-zinc-700
      ${collapsed ? "w-20" : "w-88"}`}
    >
      {/* LOGO */}
      <div
        className="flex items-center px-4 py-5 hover:cursor-pointer gap-2"
        onClick={toggleSidebarFromLogo}
      >
        <Image
          src="/assets/logo/default-logo.png"
          alt="Logo"
          width={collapsed ? 40 : 50}
          height={40}
        />
        {!collapsed && (
          <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-zinc-100">
            Journey
          </h2>
        )}
      </div>

      {/* MENU */}
      <div className="overflow-y-auto flex-1 px-2">
        {showSkeleton ? (
          <SidebarSkeleton collapsed={collapsed} />
        ) : (
          menuGroups.map((module: SidebarModule, groupIndex: number) => (
            <div key={groupIndex} className="space-y-1 mb-4">
              {!collapsed && (
                <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-2">
                  {module.title}
                </h3>
              )}

              {module.permission.map((item: SidebarMenu, itemIndex: number) => {
                const key = `${groupIndex}-${itemIndex}`;
                const isOpen = openKey === key;
                const hasChild = item.children && item.children.length > 0;

                const isParentActive =
                  item.path === pathname && item.children.length === 0;
                const anyChildActive = item.children?.some(
                  (child) => child.path === pathname,
                );

                return (
                  <div key={key} className="flex flex-col">
                    <div
                      onClick={() => toggleParent(key, hasChild, item)}
                      className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all duration-200
                      ${collapsed ? "justify-center" : ""}
                      ${isParentActive || anyChildActive ? "bg-gray-100 text-gray-900 font-semibold dark:bg-zinc-700 dark:text-white" : "text-gray-700 hover:bg-gray-50 dark:text-zinc-300 dark:hover:bg-zinc-700/50"}
                    `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={
                            isParentActive || anyChildActive
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-zinc-400"
                          }
                          dangerouslySetInnerHTML={{ __html: item.icon }}
                        />
                        {!collapsed && (
                          <span className="text-sm">{item.menu_name}</span>
                        )}
                      </div>

                      {!collapsed && hasChild && (
                        <span className="text-gray-400 dark:text-zinc-500">
                          {isOpen ? (
                            <FaChevronDown size={12} />
                          ) : (
                            <FaChevronRight size={12} />
                          )}
                        </span>
                      )}
                    </div>

                    {/* CHILDREN */}
                    {!collapsed && isOpen && hasChild && (
                      <div className="relative ml-6 mt-0.5 flex flex-col">
                        {item.children.map((child, childIndex) => {
                          const isActiveChild = pathname === child.path;
                          const isLast =
                            childIndex === item.children.length - 1;

                          // Mencari apakah ada child aktif di bawah item ini
                          const activeChildIndex = item.children.findIndex(
                            (c) => c.path === pathname,
                          );

                          // Logika Warna:
                          // 1. Jika index saat ini < activeChildIndex, maka ini bagian "jalur aktif" -> Gelap
                          // 2. Jika index saat ini === activeChildIndex, maka bagian atasnya "jalur aktif" -> Gelap
                          // 3. Sisanya -> Abu-abu default

                          const isAboveActive = childIndex < activeChildIndex;
                          const isCurrentActive = isActiveChild;

                          return (
                            <div
                              key={childIndex}
                              className="relative flex items-center w-full h-10 pl-6"
                            >
                              <div className="absolute left-0 w-0.5 h-full flex flex-col">
                                {/* Bagian Atas: Gunakan kondisi khusus untuk item pertama agar menyambung ke parent */}
                                <div
                                  className={`w-full h-1/2 ${
                                    childIndex === 0 && isCurrentActive
                                      ? "bg-gray-800 dark:bg-zinc-700" // Garis sambung ke parent
                                      : isAboveActive || isCurrentActive
                                        ? "bg-gray-800 dark:bg-zinc-200"
                                        : "bg-gray-200 dark:bg-zinc-700"
                                  }`}
                                />
                                {/* Bagian Bawah */}
                                <div
                                  className={`w-full h-1/2 ${
                                    isLast
                                      ? "bg-transparent"
                                      : isAboveActive
                                        ? "bg-gray-800 dark:bg-zinc-200"
                                        : "bg-gray-200 dark:bg-zinc-700"
                                  }`}
                                />
                              </div>

                              {/* Garis Horizontal */}
                              <div
                                className={`absolute left-0 w-4 h-0.5 top-1/2 -translate-y-1/2 ${
                                  isActiveChild
                                    ? "bg-gray-800 dark:bg-zinc-200"
                                    : "bg-gray-200 dark:bg-zinc-700"
                                }`}
                              />

                              <div
                                onClick={() => {
                                  expandIfCollapsed();
                                  router.push(child.path, { scroll: false });
                                }}
                                className={`flex items-center w-full px-3 py-2.5 text-xs rounded-md cursor-pointer transition-all duration-200 ${
                                  isActiveChild
                                    ? "bg-gray-200/70 text-gray-900 font-bold dark:bg-zinc-700 dark:text-white"
                                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-700/30"
                                }`}
                              >
                                <span>{child.name}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      {!collapsed && (
        <div className="mt-auto">
          {/* PERUBAHAN 8: Menambahkan border atas dark mode (dark:border-zinc-700) jika diperlukan, background footer tetap konstan gelap */}
          <div className="w-full p-4 bg-gray-800 text-white shadow-lg flex flex-col items-center justify-center transition-all duration-300 border-t dark:border-zinc-700/50">
            <div className="text-sm font-semibold tracking-wide">
              © {new Date().getFullYear()}{" "}
              <a
                href="https://www.instagram.com/acepnurmansidik_"
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                @acepnurmansidik_
              </a>
            </div>
            <div className="text-[11px] opacity-80 mt-1">
              Crafted with ❤️ for excellence
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
