"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { FaPlus, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

type Option = { value: string; label: string; data: any };
const dataOptions: Option[] = [
  {
    value: "MOD_PRIVACY_SECURITY",
    label: "Privacy & Security",
    data: {
      name: "MOD_PRIVACY_SECURITY",
      title: "Privacy & Security",
      permission: [
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-component-icon lucide-component"><path d="M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/><path d="M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"/><path d="M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"/><path d="M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"/></svg>`,
          menu_name: "Module",
          path: "/security/module",
          actions: ["view", "create", "update", "delete"],
          children: [],
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-icon lucide-key"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/></svg>`,
          menu_name: "Role",
          path: "/security/role",
          actions: ["view", "create", "update", "delete"],
          children: [],
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-key-icon lucide-user-key"><path d="M20 11v6"/><path d="M20 13h2"/><path d="M3 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 2.072.578"/><circle cx="10" cy="7" r="4"/><circle cx="20" cy="19" r="2"/></svg>`,
          menu_name: "IAM",
          path: "/security/iam",
          actions: ["view", "create", "update", "delete"],
          children: [],
        },
      ],
    },
  },
  {
    value: "MOD_DOCUMENTATION",
    label: "Documentation",
    data: {
      name: "MOD_DOCUMENTATION",
      title: "Documentation",
      permission: [
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-form-icon lucide-form"><path d="M4 14h6"/><path d="M4 2h10"/><rect x="4" y="18" width="16" height="4" rx="1"/><rect x="4" y="6" width="16" height="4" rx="1"/></svg>`,
          menu_name: "Form",
          path: "/documentation/table",
          actions: [],
          children: [
            {
              name: "Multi Step",
              path: "/documentation/form/multi-step",
              actions: ["view", "create", "update", "delete"],
            },
          ],
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table-icon lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>`,
          menu_name: "Table",
          path: "/documentation/table",
          actions: [],
          children: [
            {
              name: "Basic Table",
              path: "/documentation/table/basic-table",
              actions: [],
            },
            {
              name: "Expanded Table",
              path: "/documentation/table/expanded-table",
              actions: [],
            },
          ],
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-dashboard-icon lucide-layout-dashboard"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
          menu_name: "Widget",
          path: "/documentation/widgets",
          actions: [],
          children: [
            {
              name: "Charts",
              path: "/documentation/widget/charts",
              actions: [],
            },
            { name: "Map", path: "/documentation/widget/map", actions: [] },
            {
              name: "Measurement",
              path: "/documentation/widget/measurement",
              actions: [],
            },
          ],
        },
        {
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-asterisk-icon lucide-asterisk"><path d="M12 6v12"/><path d="M17.196 9 6.804 15"/><path d="m6.804 9 10.392 6"/></svg>`,
          menu_name: "Misc",
          path: "/documentation/widgets",
          actions: [],
          children: [
            {
              name: "Text Input",
              path: "/documentation/misc/text-input",
              actions: [],
            },
            {
              name: "Filter",
              path: "/documentation/misc/filter",
              actions: [],
            },
            { name: "Etc", path: "/documentation/misc/etc", actions: [] },
          ],
        },
      ],
    },
  },
];

import { IoClose } from "react-icons/io5";
import React from "react";
import { RoleFormData } from "@/types/role";
import { MenuDetailResponseAPI, PermissionResponseAPI } from "@/types/module";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultValue: RoleFormData = {
  name: "",
  has_access_module: [],
};

export default function CreateRoleModal({ isOpen, onClose }: DataProps) {
  // ==================== C A C H E * F E T C H * D A T A ====================
  const [cacheDataModule, setCacheDataModule] = useState<Option[]>([]);

  // =============================== S T A T E ===============================
  const [formData, setFormData] = useState<RoleFormData>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ====================== H A N D L E R * S U B M I T ======================
  const handleSubmit = () => {
    setIsLoading(true);
    console.log("Submitting:", formData);
    setIsLoading(false);
  };

  // ====================== H A N D L E R * A C T I O N ======================
  const toggleAction = (
    modIdx: number,
    type: "permission" | "children",
    parentIdx: number,
    childIdx: number | null,
    actionKey: string,
  ) => {
    setFormData((prev) => {
      // Deep clone agar React mendeteksi perubahan
      const newModules = JSON.parse(JSON.stringify(prev.has_access_module));
      const target =
        type === "permission"
          ? newModules[modIdx].permission[parentIdx]
          : newModules[modIdx].permission[parentIdx].children[childIdx!];

      target.actions[actionKey] = !target.actions[actionKey];

      return { ...prev, has_access_module: newModules };
    });
  };

  const toggleSelectAll = (
    modIdx: number,
    type: "permission" | "children",
    parentIdx: number,
    childIdx: number | null,
  ) => {
    setFormData((prev) => {
      const newModules = JSON.parse(JSON.stringify(prev.has_access_module));
      const target =
        type === "permission"
          ? newModules[modIdx].permission[parentIdx]
          : newModules[modIdx].permission[parentIdx].children[childIdx!];

      const actions = target.actions;
      const allChecked = Object.values(actions).every((val) => val === true);

      if (allChecked) {
        // Jika semua sudah tercentang, unselect semua KECUALI 'view'
        Object.keys(actions).forEach((key) => {
          actions[key] = key === "view";
        });
      } else {
        // Jika belum semua, select semua
        Object.keys(actions).forEach((key) => {
          actions[key] = true;
        });
      }

      return { ...prev, has_access_module: newModules };
    });
  };

  const handleAddModule = () => {
    setFormData((prev: RoleFormData) => ({
      ...prev,
      has_access_module: [
        ...prev.has_access_module,
        { name: "", title: "", permission: [] },
      ],
    }));
  };

  const handleSelectedModule = (vals: Option | null, modIdx: number) => {
    if (!vals?.data) return;

    const selectedData = vals.data;

    // 1. Cek duplikasi di level global
    // Kita cek apakah 'name' modul sudah ada di index lain (selain modIdx yang sedang diedit)
    const isDuplicate = formData.has_access_module.some(
      (mod, idx) => mod.name === selectedData.name && idx !== modIdx,
    );

    if (isDuplicate) {
      showWarning(
        "You have already added this module to your role access list.",
      );

      return;
    }

    setFormData((prev) => {
      const newAccessModules = [...prev.has_access_module];

      const transformActions = (actions: string[]) => {
        return actions.reduce(
          (acc, action) => {
            acc[action] = true;
            return acc;
          },
          {} as Record<string, boolean>,
        );
      };

      newAccessModules[modIdx] = {
        name: selectedData.name,
        title: selectedData.title,
        permission: selectedData.permission.map(
          (perm: PermissionResponseAPI) => ({
            icon: perm.icon,
            menu_name: perm.menu_name,
            path: perm.path,
            actions: transformActions(perm.actions),
            children: perm.children.map((child: MenuDetailResponseAPI) => ({
              name: child.name,
              path: child.path,
              actions: transformActions(child.actions),
            })),
          }),
        ),
      };

      return {
        ...prev,
        has_access_module: newAccessModules,
      };
    });
  };

  const handleRemoveModule = (modIdx: number) => {
    setFormData((prev) => ({
      ...prev,
      has_access_module: prev.has_access_module.filter((_, i) => i !== modIdx),
    }));
  };

  // ========================= H A N D L E R * E T C =========================
  const showWarning = (text: string) => {
    const isDarkMode = document.documentElement.classList.contains("dark");

    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: text,
      background: isDarkMode ? "#18181b" : "#ffffff", // zinc-900 : white
      color: isDarkMode ? "#f4f4f5" : "#1f2937", // zinc-100 : zinc-800
      confirmButtonColor: "#2563eb",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Role Access
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-full px-5 mx-auto space-y-8">
          <div className="group">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
              Role Name
            </label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
            />
          </div>

          <div className="flex justify-between items-end mb-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase">
              access <span className="text-red-600">*</span>
            </h3>
            <button
              type="button"
              onClick={handleAddModule}
              className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline hover:cursor-pointer"
            >
              <FaPlus size={10} /> Add Row
            </button>
          </div>

          {formData.has_access_module.map((mod, modIdx) => (
            <div
              key={modIdx}
              className="border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-6 bg-zinc-50/30 dark:bg-zinc-900/20"
            >
              {/* Header Module */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* MODULE */}
                <div className="col-span-3 order-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                    module <span className="text-red-600">*</span>
                  </label>
                  <Select
                    isSearchable
                    instanceId={`module-select-${modIdx}`} // Pastikan unique per row
                    classNamePrefix="rs"
                    placeholder="Ketik untuk mencari..."
                    // 1. Logika untuk mengisi value berdasarkan state formData
                    value={
                      mod.name
                        ? {
                            value: mod.name,
                            label: mod.title,
                            data: {
                              name: mod.name,
                              title: mod.title,
                              permission: mod.permission,
                            },
                          }
                        : null
                    }
                    options={dataOptions}
                    onChange={(vals) => handleSelectedModule(vals, modIdx)}
                    menuPortalTarget={
                      typeof document !== "undefined" ? document.body : null
                    }
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                </div>

                {/* MENU */}
                <div className="col-span-8 order-3 lg:order-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                    menu
                  </label>

                  {mod.permission.length > 0 ? (
                    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
                      <table className="w-full text-left">
                        <thead className="bg-zinc-100 dark:bg-zinc-800/50 hidden lg:table-header-group">
                          <tr>
                            <th className="p-3 text-[10px] font-bold uppercase text-zinc-500">
                              Menu Name
                            </th>
                            <th className="p-3 text-[10px] font-bold uppercase text-zinc-500">
                              Path
                            </th>
                            <th className="p-3 text-[10px] font-bold uppercase text-zinc-500 text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {mod.permission.map((perm, permIdx) => {
                            // Helper untuk cek apakah semua aksi terpilih
                            const allPermSelected = Object.values(
                              perm.actions,
                            ).every((v) => v === true);

                            return (
                              <React.Fragment key={permIdx}>
                                {/* Parent Row */}
                                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                  <td className="p-3 text-md font-medium flex items-center gap-2">
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: perm.icon,
                                      }}
                                      className="w-6 h-6 text-zinc-500"
                                    />
                                    {perm.menu_name}
                                  </td>
                                  <td className="p-3 text-sm text-zinc-500">
                                    {perm.path}
                                  </td>
                                  <td className="p-3">
                                    {/* Letakkan style ini di luar mapping atau di bagian atas return komponen Anda */}
                                    <style jsx>{`
                                      input[type="checkbox"].custom-checkbox:checked::after {
                                        content: "✓";
                                        position: absolute;
                                        color: white;
                                        font-size: 10px; /* Disesuaikan agar pas dengan ukuran box 1.1rem */
                                        font-weight: bold;
                                        top: 0px;
                                        left: 3px;
                                      }
                                    `}</style>

                                    {/* Bagian Actions di dalam Table */}
                                    <div className="flex flex-wrap items-center justify-end gap-3">
                                      {Object.keys(perm.actions).length > 0 && (
                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleSelectAll(
                                              modIdx,
                                              "permission",
                                              permIdx,
                                              null,
                                            )
                                          }
                                          className={`text-[9px] hover:cursor-pointer font-bold uppercase hover:underline ${allPermSelected ? "text-blue-600" : "text-zinc-400"}`}
                                        >
                                          All
                                        </button>
                                      )}

                                      <div className="grid grid-cols-4 gap-2 ml-2">
                                        {Object.entries(perm.actions).map(
                                          ([key, status]) => (
                                            <label
                                              key={key}
                                              className="flex items-center gap-1.5 cursor-pointer group"
                                            >
                                              <input
                                                type="checkbox"
                                                checked={status}
                                                onChange={() =>
                                                  toggleAction(
                                                    modIdx,
                                                    "permission",
                                                    permIdx,
                                                    null,
                                                    key,
                                                  )
                                                }
                                                // Class kustom diterapkan di sini
                                                className="custom-checkbox h-[1.1rem] w-[1.1rem] cursor-pointer appearance-none rounded-md border border-gray-400 dark:border-zinc-500 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 relative transition-all hover:border-blue-500 hover:shadow-md"
                                              />
                                              <span className="text-[10px] text-zinc-600 capitalize group-hover:text-blue-600 transition-colors">
                                                {key}
                                              </span>
                                            </label>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  </td>
                                </tr>

                                {/* Child Rows */}
                                {perm.children.map((child, childIdx) => {
                                  const allChildSelected = Object.values(
                                    child.actions,
                                  ).every((v) => v === true);

                                  return (
                                    <tr
                                      key={childIdx}
                                      className="bg-zinc-50/50 dark:bg-zinc-900/20"
                                    >
                                      <td className="p-3 pl-10 text-sm text-zinc-600 flex items-center gap-2">
                                        <span className="text-zinc-300">↳</span>{" "}
                                        {child.name}
                                      </td>
                                      <td className="p-3 text-sm text-zinc-400">
                                        {child.path}
                                      </td>
                                      <td className="p-3">
                                        <style jsx>{`
                                          input[type="checkbox"].custom-checkbox:checked::after {
                                            content: "✓";
                                            position: absolute;
                                            color: white;
                                            font-size: 10px; /* Disesuaikan agar pas dengan ukuran box 1.1rem */
                                            font-weight: bold;
                                            top: 0px;
                                            left: 3px;
                                          }
                                        `}</style>
                                        <div className="flex flex-wrap items-center justify-end gap-3">
                                          {Object.keys(child.actions).length >
                                            0 && (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                toggleSelectAll(
                                                  modIdx,
                                                  "children",
                                                  permIdx,
                                                  childIdx,
                                                )
                                              }
                                              className={`text-[9px] hover:cursor-pointer font-bold uppercase hover:underline ${allChildSelected ? "text-blue-600" : "text-zinc-400"}`}
                                            >
                                              All
                                            </button>
                                          )}

                                          <div className="grid grid-cols-4 gap-2 ml-2">
                                            {Object.entries(child.actions).map(
                                              ([key, status]) => (
                                                <label
                                                  key={key}
                                                  className="flex items-center gap-1.5 cursor-pointer group"
                                                >
                                                  <input
                                                    type="checkbox"
                                                    checked={status}
                                                    onChange={() =>
                                                      toggleAction(
                                                        modIdx,
                                                        "children",
                                                        permIdx,
                                                        childIdx,
                                                        key,
                                                      )
                                                    }
                                                    className="custom-checkbox h-[1.1rem] w-[1.1rem] cursor-pointer appearance-none rounded-md border border-gray-400 dark:border-zinc-500 checked:bg-blue-600 checked:border-blue-600 dark:checked:bg-blue-500 relative transition-all hover:border-blue-500 hover:shadow-md"
                                                  />
                                                  <span className="text-[10px] text-zinc-600 capitalize group-hover:text-blue-600 transition-colors">
                                                    {key}
                                                  </span>
                                                </label>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-4 text-zinc-400 text-xs italic">
                      Select a module to view permissions
                    </div>
                  )}
                </div>

                {/* BUTTON CTA */}
                <div className="col-span-1 pt-6 text-right order-2 lg:order-3 ">
                  <button
                    onClick={() => handleRemoveModule(modIdx)}
                    className="text-red-500 hover:cursor-pointer hover:text-red-700"
                  >
                    <FaTrash size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
