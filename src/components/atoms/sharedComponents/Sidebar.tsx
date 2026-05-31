"use client";

import Image from "next/image";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MENUS, MODULES, USER_IAM } from "@/utils/permission";

// KUNCI UTAMA: Menyimpan state di memory global browser
let globalOpenKey: string | null = null;
let globalCollapsed: boolean = false;

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [openKey, setOpenKeyState] = useState<string | null>(globalOpenKey);
  const [collapsed, setCollapsedState] = useState<boolean>(globalCollapsed);

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
    USER_IAM.forEach((module, gIndex) => {
      module.permission.forEach((item: MENUS, iIndex: number) => {
        const key = `${gIndex}-${iIndex}`;
        if (item.children?.some((child) => child.path === pathname)) {
          foundKey = key;
        }
      });
    });
    setOpenKey(foundKey);
  }, [pathname]);

  const toggleParent = (key: string, hasChild: boolean, item: MENUS) => {
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
        {USER_IAM.map((module: MODULES, groupIndex: number) => (
          <div key={groupIndex} className="space-y-1 mb-4">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider px-3 mb-2">
                {module.title}
              </h3>
            )}

            {module.permission.map((item: MENUS, itemIndex: number) => {
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
                          <FaChevronUp size={12} />
                        )}
                      </span>
                    )}
                  </div>

                  {/* CHILDREN */}
                  {!collapsed && isOpen && hasChild && (
                    <div className="relative ml-6 mt-0.5 flex flex-col">
                      {item.children.map((child, childIndex) => {
                        const isActiveChild = pathname === child.path;
                        const isLast = childIndex === item.children.length - 1;

                        return (
                          <div
                            key={childIndex}
                            className="relative flex items-center w-full h-10 pl-6"
                          >
                            <div className="absolute left-0 w-0.5 h-full flex flex-col">
                              <div
                                className={`w-full h-1/2 transition-all duration-200 ${isActiveChild ? "bg-gray-600 dark:bg-zinc-400" : "bg-gray-200 dark:bg-zinc-700"}`}
                              />
                              <div
                                className={`w-full h-1/2 ${isLast ? "bg-transparent" : "bg-gray-200 dark:bg-zinc-700"}`}
                              />
                            </div>
                            <div
                              className={`absolute w-4 h-0.5 top-1/2 -translate-y-1/2 ${isActiveChild ? "bg-gray-600 dark:bg-zinc-400 left-0" : "bg-gray-200 dark:bg-zinc-700 left-0.5"}`}
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
        ))}
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
