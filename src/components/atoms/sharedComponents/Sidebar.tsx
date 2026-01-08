"use client";

import menuGroups from "@/utils/menuGroups";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface MenuGroup {
  title: string;
  menu_items: MenuItem[];
}

interface MenuItem {
  icon: React.ReactNode;
  name: string;
  path: string;
  children: SubmenuItem[];
}

interface SubmenuItem {
  icon: React.ReactNode;
  name: string;
  path: string;
}

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<boolean>(false);

  // ⭐ Auto-open parent jika child aktif
  useEffect(() => {
    menuGroups.forEach((group, gIndex) => {
      group.menu_items.forEach((item: MenuItem, iIndex: number) => {
        const key = `${gIndex}-${iIndex}`;

        if (item.path === pathname && item.children.length === 0) {
          setOpenKey(null);
        }

        if (item.children?.some((child) => child.path === pathname)) {
          setOpenKey(key);
        }
      });
    });
  }, [pathname]);

  const toggleParent = (key: string, hasChild: boolean, item: MenuItem) => {
    // Jika collapsed → expand dahulu
    if (collapsed) {
      setCollapsed(false);
      if (hasChild) setOpenKey(key);
      else router.push(item.path);
      return;
    }

    // Jika tidak punya child → langsung push
    if (!hasChild) {
      router.push(item.path);
      return;
    }

    // Jika punya child → toggle
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
      className={`max-w-xs h-screen  bg-white flex flex-col gap-4 transition-all duration-300 
      ${collapsed ? "w-20" : "w-88"}`}
    >
      {/* === LOGO === */}
      <div
        className="flex items-center px-2 py-4 hover:cursor-pointer gap-2"
        onClick={toggleSidebarFromLogo}
      >
        <Image
          src="/assets/logo/default-logo.png"
          alt="Logo"
          width={collapsed ? 40 : 50}
          height={collapsed ? 40 : 100}
        />
        {!collapsed && <h2 className="text-2xl font-bold mb-4">History</h2>}
      </div>

      {/* === MENU === */}
      <div className="overflow-x-scroll">
        {menuGroups.map((group: MenuGroup, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2">
                {group.title}
              </h3>
            )}

            {group.menu_items.map((item: MenuItem, itemIndex: number) => {
              const key = `${groupIndex}-${itemIndex}`;
              const isOpen = openKey === key;
              const hasChild = item.children.length > 0;

              const isParentActive =
                item.path === pathname && item.children.length === 0;

              const isChildActive = item.children?.some(
                (child) => child.path === pathname,
              );

              return (
                <div key={key} className="flex flex-col px-2">
                  {/* === PARENT === */}
                  <div
                    onClick={() => toggleParent(key, hasChild, item)}
                    className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer
                      ${collapsed ? "justify-center" : ""}
                      ${isParentActive ? "bg-gray-100 font-semibold" : ""}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      {!collapsed && <span>{item.name}</span>}
                    </div>

                    {!collapsed && hasChild && (
                      <span>
                        {isOpen ? (
                          <FaChevronDown fontSize={14} />
                        ) : (
                          <FaChevronUp fontSize={14} />
                        )}
                      </span>
                    )}
                  </div>

                  {/* === CHILDREN === */}
                  {!collapsed && isOpen && hasChild && (
                    <div className="ml-5 pl-4 border-l border-gray-300 flex flex-col gap-1 animate-fadeIn">
                      {item.children.map((child, childIndex) => {
                        const isActiveChild = pathname === child.path;

                        return (
                          <div
                            key={childIndex}
                            onClick={() => {
                              expandIfCollapsed();
                              router.push(child.path);
                            }}
                            className={`flex items-center gap-2 p-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer
                              ${
                                isActiveChild ? "bg-gray-100 font-semibold" : ""
                              }
                            `}
                          >
                            {child.icon}
                            <span>{child.name}</span>
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

      {/* === FOOTER === */}
      {!collapsed && (
        <div className="mt-auto">
          <div className="w-full p-4 bg-gray-800 text-white shadow-lg flex flex-col items-center justify-center transition-all duration-300">
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
