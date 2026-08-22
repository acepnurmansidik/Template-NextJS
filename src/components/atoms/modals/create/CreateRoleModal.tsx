"use client";

import { useEffect, useMemo, useState } from "react";
import { ListResponse } from "@/types/api";
import AsyncSelect from "react-select/async";
import { FaPlus, FaTrash, FaGripVertical } from "react-icons/fa";
import Swal from "sweetalert2";
import debounce from "lodash/debounce";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Option = { value: string; label: string; data: any };

import { IoClose } from "react-icons/io5";
import React from "react";
import { RoleFormData, RoleApiDaum, RolePermissionItem } from "@/types/role";
import {
  MenuDetailResponseAPI,
  PermissionResponseAPI,
  ModuleApiDaum,
} from "@/types/module";
import { apiGet, apiPost } from "@/utils/api";

// actions (array string) -> { view: true, ... }
const transformActions = (actions: string[] = []): Record<string, boolean> =>
  actions.reduce(
    (acc, a) => {
      acc[a] = true;
      return acc;
    },
    {} as Record<string, boolean>,
  );

// Konversi permission master (module) -> item permission milik role.
const toRolePermission = (perm: PermissionResponseAPI): RolePermissionItem => ({
  icon: perm.icon,
  menu_name: perm.menu_name,
  path: perm.path,
  sequence: perm.sequence,
  actions: transformActions(perm.actions),
  children: (perm.children ?? []).map((c: MenuDetailResponseAPI) => ({
    name: c.name,
    path: c.path,
    actions: transformActions(c.actions),
  })),
});

// Urutkan menu mengikuti sequence (kecil -> besar); tanpa sequence ditaruh akhir.
const sortBySeq = (perms: RolePermissionItem[]): RolePermissionItem[] =>
  [...perms].sort(
    (a, b) => (a.sequence ?? Infinity) - (b.sequence ?? Infinity),
  );

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultValue: RoleFormData = {
  name: "",
  has_access_module: [],
};

// Kartu access-item yang bisa di-drag (naik/turun) untuk reposisi.
// Drag hanya aktif dari handle (grip) agar checkbox & select tetap bisa dipakai.
function SortableModuleCard({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl space-y-4 bg-zinc-50/30 dark:bg-zinc-900/20 ${
        isDragging ? "ring-2 ring-blue-300 dark:ring-blue-900 shadow-lg" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag untuk mengubah urutan"
          title="Drag untuk mengubah urutan"
          className="cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 touch-none"
        >
          <FaGripVertical size={14} />
        </button>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 select-none">
          Drag untuk reposisi
        </span>
      </div>
      {children}
    </div>
  );
}

export default function CreateRoleModal({ isOpen, onClose }: DataProps) {
  // ==================== C A C H E * F E T C H * D A T A ====================
  const [cacheDataModule, setCacheDataModule] = useState<Option[]>([]);

  // =============================== S T A T E ===============================
  const [formData, setFormData] = useState<RoleFormData>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Katalog seluruh menu per module (name -> daftar menu) untuk fitur
  // tambah/hapus menu di tiap module.
  const [moduleCatalog, setModuleCatalog] = useState<
    Record<string, RolePermissionItem[]>
  >({});

  // ====================== S E L E C T * O P T I O N ======================
  // Satu fungsi untuk semua: dipakai saat modal dibuka (via defaultOptions)
  // maupun saat user mengetik (loadOptions AsyncSelect). Di-debounce 3 detik;
  // leading:true agar saat modal pertama dibuka langsung hit, sedangkan saat
  // mengetik menunggu jeda 3 detik sebelum hit ke server.
  const loadModuleOptions = useMemo(
    () =>
      debounce(
        (inputValue: string, callback: (options: Option[]) => void) => {
          apiGet<ListResponse<ModuleApiDaum>>(
            "/module",
            { page: 1, limit: 5, search: inputValue },
            false,
          )
            .then((result) =>
              callback(
                (result.data ?? []).map((mod) => ({
                  value: mod.name,
                  label: mod.title,
                  data: mod,
                })),
              ),
            )
            .catch(() => callback([]));
        },
        3000,
        { leading: true },
      ),
    [],
  );

  // ======================== U S E * E F F E C T ==========================
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Ambil seluruh module (untuk katalog menu tambah/hapus).
  useEffect(() => {
    if (!isOpen) return;
    apiGet<ListResponse<ModuleApiDaum>>("/module", { limit: 1000 }, false)
      .then((res) => {
        const cat: Record<string, RolePermissionItem[]> = {};
        for (const mod of res.data ?? []) {
          cat[mod.name] = (mod.permission ?? []).map(toRolePermission);
        }
        setModuleCatalog(cat);
      })
      .catch(() => setModuleCatalog({}));
  }, [isOpen]);

  // Hapus sebuah menu dari sebuah module milik role.
  const handleRemoveMenu = (modIdx: number, permIdx: number) => {
    setFormData((prev) => {
      const mods = [...prev.has_access_module];
      mods[modIdx] = {
        ...mods[modIdx],
        permission: mods[modIdx].permission.filter((_, i) => i !== permIdx),
      };
      return { ...prev, has_access_module: mods };
    });
  };

  // Tambah kembali sebuah menu (dari katalog module) ke sebuah module.
  const handleAddMenu = (modIdx: number, path: string) => {
    if (!path) return;
    setFormData((prev) => {
      const mods = [...prev.has_access_module];
      const mod = mods[modIdx];
      const all = moduleCatalog[mod.name] ?? [];
      const found = all.find((p) => p.path === path);
      if (!found) return prev;
      if (mod.permission.some((p) => p.path === path)) return prev;
      mods[modIdx] = {
        ...mod,
        // Auto-sort mengikuti sequence master module.
        permission: sortBySeq([
          ...mod.permission,
          JSON.parse(JSON.stringify(found)),
        ]),
      };
      return { ...prev, has_access_module: mods };
    });
  };

  // ====================== H A N D L E R * S U B M I T ======================
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const result = await apiPost<ListResponse<RoleApiDaum>>(
        "/role",
        formData,
        false,
        false,
      );
      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Created successfully",
          text: result.message || "Your data has been saved successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
          timer: 2500,
          timerProgressBar: true,
        });

        // Reset form lalu tutup modal.
        setFormData(defaultValue);
        onClose();
      }
    } catch (error) {
      setIsLoading(false);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Failed to save data. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
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
        // Bangun + urutkan menu mengikuti sequence master module.
        permission: sortBySeq(
          selectedData.permission.map(toRolePermission),
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

  // ==================== D R A G * & * D R O P * (reorder) ====================
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    setFormData((prev) => ({
      ...prev,
      has_access_module: arrayMove(prev.has_access_module, oldIndex, newIndex),
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
              Role Name<span className="text-red-500">*</span>
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
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-100">
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

          {formData.has_access_module.length === 0 ? (
            <div
              onClick={handleAddModule}
              className="flex flex-col items-center hover:cursor-pointer justify-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20 m-2"
            >
              <p className="text-zinc-400 text-sm font-medium">
                No permissions added yet.
              </p>
              <button
                type="button"
                className="mt-2 text-blue-600 text-xs font-bold hover:underline"
              >
                Click here to add at least one permission
              </button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={formData.has_access_module.map((_, i) => i)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-8">
                  {formData.has_access_module.map((mod, modIdx) => (
                    <SortableModuleCard key={modIdx} id={modIdx}>
                      {/* Header Module */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        {/* MODULE */}
                        <div className="col-span-3 order-1">
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                            module <span className="text-red-600">*</span>
                          </label>
                          <AsyncSelect
                            isSearchable
                            cacheOptions
                            defaultOptions={true}
                            loadOptions={loadModuleOptions}
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
                            onChange={(vals) =>
                              handleSelectedModule(vals, modIdx)
                            }
                            menuPortalTarget={
                              typeof document !== "undefined"
                                ? document.body
                                : null
                            }
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        </div>

                        {/* MENU */}
                        <div className="col-span-8 order-3 lg:order-2">
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              menu
                            </label>
                            {(() => {
                              const remaining = (
                                moduleCatalog[mod.name] ?? []
                              ).filter(
                                (p) =>
                                  !mod.permission.some(
                                    (sel) => sel.path === p.path,
                                  ),
                              );
                              if (remaining.length === 0) return null;
                              return (
                                <select
                                  value=""
                                  onChange={(e) => {
                                    handleAddMenu(modIdx, e.target.value);
                                    e.currentTarget.value = "";
                                  }}
                                  className="text-[11px] font-medium border border-zinc-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-950 px-2 py-1 outline-none focus:border-blue-500 dark:text-zinc-100 hover:cursor-pointer"
                                >
                                  <option value="">+ Tambah menu…</option>
                                  {remaining.map((p) => (
                                    <option key={p.path} value={p.path}>
                                      {p.menu_name}
                                    </option>
                                  ))}
                                </select>
                              );
                            })()}
                          </div>

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
                                            <button
                                              type="button"
                                              title="Hapus menu"
                                              onClick={() =>
                                                handleRemoveMenu(
                                                  modIdx,
                                                  permIdx,
                                                )
                                              }
                                              className="ml-auto text-zinc-300 hover:text-red-600 hover:cursor-pointer"
                                            >
                                              <FaTrash size={11} />
                                            </button>
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
                                              {Object.keys(perm.actions)
                                                .length > 0 && (
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
                                                {Object.entries(
                                                  perm.actions,
                                                ).map(([key, status]) => (
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
                                                ))}
                                              </div>
                                            </div>
                                          </td>
                                        </tr>

                                        {/* Child Rows */}
                                        {perm.children.map(
                                          (child, childIdx) => {
                                            const allChildSelected =
                                              Object.values(
                                                child.actions,
                                              ).every((v) => v === true);

                                            return (
                                              <tr
                                                key={childIdx}
                                                className="bg-zinc-50/50 dark:bg-zinc-900/20"
                                              >
                                                <td className="p-3 pl-10 text-sm text-zinc-600 flex items-center gap-2">
                                                  <span className="text-zinc-300">
                                                    ↳
                                                  </span>{" "}
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
                                                    {Object.keys(child.actions)
                                                      .length > 0 && (
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
                                                      {Object.entries(
                                                        child.actions,
                                                      ).map(([key, status]) => (
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
                                                      ))}
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            );
                                          },
                                        )}
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
                    </SortableModuleCard>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
      <div className="px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 rounded-lg"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg ${isLoading ?? "italic"}`}
        >
          {isLoading ? "Creating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
