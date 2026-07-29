"use client";

import { useEffect, useState } from "react";
import { ListResponse } from "@/types/api";
import CreatableSelect from "react-select/creatable";
import { FaPlus, FaTrash } from "react-icons/fa";
import { actionDefaultOptions, formatModuleName } from "@/utils/utils";
import {
  MenuDetail,
  ModuleApiDaum,
  ModuleFormData,
  PermissionDataItem,
  PermissionResponseAPI,
} from "@/types/module";
import { IoClose } from "react-icons/io5";
import React from "react";
import { apiPut } from "@/utils/api";
import Swal from "sweetalert2";
import axios from "axios";

interface DataProps {
  initialData: ModuleApiDaum;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UpdateModuleModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DataProps) {
  // =============================== S T A T E ===============================
  const [formData, setFormData] = useState<ModuleFormData | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ======================== U S E * E F F E C T ==========================
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // INITAITE STATE FIRST TIME OPEN ========================================
  useEffect(() => {
    if (isOpen && initialData) {
      const formattedPermissions = initialData.permission.map(
        (item: PermissionResponseAPI) => ({
          ...item,
          // Mengubah array of string menjadi array of object
          actions: item.actions.map((actionString) => ({
            label: actionString,
            value: actionString,
          })),
          // Lakukan hal yang sama untuk children jika ada
          children: item.children.map((child) => ({
            ...child,
            actions: child.actions.map((actionString) => ({
              label: actionString,
              value: actionString,
            })),
          })),
        }),
      );

      setFormData({
        name: initialData.name,
        title: initialData.title,
        permission: formattedPermissions,
      });
    }
  }, [isOpen, initialData]);

  // ====================== H A N D L E R * S U B M I T ======================
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Bangun payload secara eksplisit — hanya kirim field yang dibutuhkan
      // backend. Ini penting karena formData di-seed dari respons API sehingga
      // permission/children masih membawa field asing (mis. _id) yang bila ikut
      // terkirim akan ditolak backend (400). actions juga diubah dari array of
      // object ({ label, value }) menjadi array of string.
      const payload = {
        name: formData.name,
        title: formData.title,
        permission: formData.permission.map((row: PermissionDataItem) => ({
          icon: row.icon,
          menu_name: row.menu_name,
          path: row.path,
          actions: (row.actions ?? []).map((action) => action.value),
          children: (row.children ?? []).map((child) => ({
            name: child.name,
            path: child.path,
            actions: (child.actions ?? []).map((action) => action.value),
          })),
        })),
      };

      const result = await apiPut<ListResponse<ModuleApiDaum>>(
        `/module/${initialData._id}`,
        payload,
        false,
        false,
      );

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Updated successfully",
          text: result.message || "Your data has been updated successfully.",
          confirmButtonText: "OK",
          confirmButtonColor: "#2563eb",
          timer: 2500,
          timerProgressBar: true,
        });

        // Tutup modal & refetch data terbaru bila parent menyediakan onSuccess,
        // jika tidak cukup tutup modalnya saja.
        if (onSuccess) {
          onSuccess();
        } else {
          onClose();
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      // Ambil pesan error dari respons backend bila ada (axios error).
      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);

      // console.error("update module error", error);

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: serverMessage || "Failed to update data. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  // ====================== H A N D L E R * A C T I O N ======================
  const handleChangeRow = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: string,
  ) => {
    setFormData((prev: ModuleFormData) => {
      const newValue = [...prev.permission];
      newValue[index] = {
        ...newValue[index],
        [field]: e.target.value,
      };
      return { ...prev, permission: newValue };
    });
  };

  const handleAddRow = () => {
    setFormData((prev: ModuleFormData) => {
      const newValue = [
        ...prev.permission,
        { icon: "", menu_name: "", path: "", actions: [], children: [] },
      ];
      return { ...prev, permission: newValue };
    });
  };

  const handleRemoveRow = (index: number) => {
    setFormData((prev: ModuleFormData) => {
      const newValue = prev.permission.filter((_, i) => i !== index);
      return { ...prev, permission: newValue };
    });
  };

  const handleRemoveChild = (
    e: React.MouseEvent,
    pIndex: number,
    cIndex: number,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setFormData((prev: ModuleFormData) => {
      const newPermissions = [...prev.permission];

      // Pastikan kita tidak menambah data jika kondisi tidak terpenuhi
      newPermissions[pIndex] = {
        ...newPermissions[pIndex],
        children: newPermissions[pIndex].children.filter(
          (_, i) => i !== cIndex,
        ),
      };

      return { ...prev, permission: newPermissions };
    });
  };

  // Fungsi khusus untuk menambah child di baris tertentu
  const handleAddChild = (e: React.MouseEvent, parentIndex: number) => {
    e.stopPropagation();
    e.preventDefault();
    setFormData((prev: ModuleFormData) => {
      const newPermissions = [...prev.permission];

      // Pastikan kita tidak menambah data jika kondisi tidak terpenuhi
      newPermissions[parentIndex] = {
        ...newPermissions[parentIndex],
        children: [
          ...newPermissions[parentIndex].children,
          { name: "", path: "", actions: [] },
        ],
        actions: [],
      };

      return { ...prev, permission: newPermissions };
    });
  };

  // Update handler untuk children
  const handleChangeChild = (
    e: React.ChangeEvent<HTMLInputElement>,
    pIndex: number,
    cIndex: number,
    field: string,
  ) => {
    setFormData((prev: ModuleFormData) => {
      const newPermissions = [...prev.permission];
      newPermissions[pIndex].children[cIndex] = {
        ...newPermissions[pIndex].children[cIndex],
        [field]: e.target.value,
      };
      return { ...prev, permission: newPermissions };
    });
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Update Module
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-center text-xl text-bold hover:scale-120 duration-300" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-full px-5 mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev: ModuleFormData) => ({
                    ...prev,
                    // Name selalu uppercase & spasi diubah jadi underscore.
                    name: formatModuleName(e.target.value),
                  }))
                }
                type="text"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Title<span className="text-red-500">*</span>
              </label>
              <input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev: ModuleFormData) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                type="text"
                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Permissions<span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:underline hover:cursor-pointer"
              >
                <FaPlus size={10} /> Add Row
              </button>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {formData.permission.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-0">
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/20 m-2">
                          <p className="text-zinc-400 text-sm font-medium">
                            No permissions added yet.
                          </p>
                          <button
                            type="button"
                            onClick={handleAddRow}
                            className="mt-2 text-blue-600 text-xs font-bold hover:underline"
                          >
                            Click here to add at least one permission
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    formData.permission.map(
                      (row: PermissionDataItem, indexRow: number) => (
                        <React.Fragment key={indexRow}>
                          {/* --- BARIS UTAMA (PARENT) --- */}
                          <tr className="group hover:bg-zinc-300/40 bg-zinc-200/40 dark:hover:bg-zinc-900/50 transition-colors">
                            {/* Kolom Induk memiliki lebar seimbang */}
                            <td
                              className={`p-3 ${formData.permission[indexRow].children.length > 0 ? "w-[29%]" : "w-[23%]"}`}
                            >
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                Icon
                              </label>
                              <input
                                value={row.icon}
                                onChange={(e) =>
                                  handleChangeRow(e, indexRow, "icon")
                                }
                                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                              />
                            </td>
                            <td
                              className={`p-3 ${formData.permission[indexRow].children.length > 0 ? "w-[29%]" : "w-[23%]"}`}
                            >
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                Menu Name
                              </label>
                              <input
                                value={row.menu_name}
                                onChange={(e) =>
                                  handleChangeRow(e, indexRow, "menu_name")
                                }
                                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                              />
                            </td>
                            <td
                              className={`p-3 ${formData.permission[indexRow].children.length > 0 ? "w-[29%]" : "w-[25%]"}`}
                            >
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                Path
                              </label>
                              <input
                                value={row.path}
                                onChange={(e) =>
                                  handleChangeRow(e, indexRow, "path")
                                }
                                className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                              />
                            </td>

                            {/* KOLOM ACTIONS (Lebar fleksibel) */}
                            <td className="p-3 w-[30%]">
                              {!formData.permission[indexRow].children
                                .length ? (
                                <>
                                  <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                                    Actions
                                  </label>
                                  <div className="min-w-[200px]">
                                    {/* Gunakan wrapper class agar tidak melebar sembarangan */}
                                    <CreatableSelect
                                      isMulti
                                      instanceId={`select-${indexRow}`}
                                      classNamePrefix="rs"
                                      menuPortalTarget={
                                        typeof document !== "undefined"
                                          ? document.body
                                          : null
                                      }
                                      styles={{
                                        menuPortal: (base) => ({
                                          ...base,
                                          zIndex: 9999,
                                        }),
                                      }}
                                      value={
                                        formData.permission[indexRow].actions
                                      }
                                      placeholder="Type & Enter..."
                                      isValidNewOption={(inputValue) =>
                                        inputValue.trim().length > 0
                                      }
                                      options={actionDefaultOptions}
                                      onChange={(vals) => {
                                        setFormData((prev: ModuleFormData) => {
                                          const newData = [...prev.permission];
                                          // Pastikan vals didefinisikan sebagai array untuk menghindari error null
                                          const selectedValues = vals || [];

                                          // Sesuaikan objek di sini agar memenuhi tipe ActionOption
                                          newData[indexRow].actions =
                                            selectedValues.map((v) => ({
                                              label: v.label, // Pastikan ada label
                                              value: v.value, // Pastikan ada value
                                            }));

                                          return {
                                            ...prev,
                                            permission: newData,
                                          };
                                        });
                                      }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className="text-[11px] text-zinc-400 italic pt-6">
                                  Managed by Sub-Menu
                                </div>
                              )}
                            </td>

                            <td className="p-3 w-[10%] text-center align-bottom pb-4">
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(indexRow)}
                                className="text-red-400 hover:text-red-600 hover:scale-110 hover:cursor-pointer duration-300"
                              >
                                <FaTrash size={14} />
                              </button>
                            </td>
                          </tr>

                          {/* --- BARIS SUB-MENU (CHILDREN) --- */}
                          {/* Gunakan background yang sedikit kontras untuk membedakan level */}
                          <tr className="bg-zinc-50/50 dark:bg-zinc-900/30">
                            <td colSpan={5} className="px-4 py-2">
                              <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                  Sub-Menu Items
                                </h3>
                                <button
                                  type="button"
                                  onClick={(e) => handleAddChild(e, indexRow)}
                                  className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  <FaPlus size={8} /> Add Sub Menu
                                </button>
                              </div>
                            </td>
                          </tr>

                          {row.children?.map(
                            (child: MenuDetail, cIndex: number) => (
                              <tr
                                key={`c-${indexRow}-${cIndex}`}
                                className="border-b border-zinc-100 dark:border-zinc-800"
                              >
                                {/* Spacer untuk indentasi */}
                                <td className="p-2 w-[35%]">
                                  <div className="pl-6">
                                    {" "}
                                    {/* Tambahkan pl-6 untuk indentasi visual sub-menu */}
                                    <input
                                      placeholder="Child Name"
                                      value={child.name}
                                      onChange={(e) =>
                                        handleChangeChild(
                                          e,
                                          indexRow,
                                          cIndex,
                                          "name",
                                        )
                                      }
                                      className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                                    />
                                  </div>
                                </td>
                                <td className="p-2 w-[35%]">
                                  <input
                                    placeholder="Child Path"
                                    value={child.path}
                                    onChange={(e) =>
                                      handleChangeChild(
                                        e,
                                        indexRow,
                                        cIndex,
                                        "path",
                                      )
                                    }
                                    className="w-full bg-white dark:bg-zinc-950 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100"
                                  />
                                </td>
                                <td className="p-2 w-[32%]">
                                  <CreatableSelect
                                    isMulti
                                    instanceId={`select-child-${indexRow}-${cIndex}`}
                                    classNamePrefix="rs"
                                    menuPortalTarget={
                                      typeof document !== "undefined"
                                        ? document.body
                                        : null
                                    }
                                    styles={{
                                      menuPortal: (base) => ({
                                        ...base,
                                        zIndex: 9999,
                                      }),
                                    }}
                                    value={row.children[cIndex].actions || []}
                                    placeholder="Type & Enter..."
                                    isValidNewOption={(inputValue) =>
                                      inputValue.trim().length > 0
                                    }
                                    options={actionDefaultOptions}
                                    onChange={(vals) => {
                                      setFormData((prev: ModuleFormData) => {
                                        const newData = [...prev.permission];

                                        // PERBAIKAN 3: Sinkronisasi total (bukan push manual)
                                        // Ini mencegah bug penambahan ganda atau error array
                                        newData[indexRow].children[
                                          cIndex
                                        ].actions = (vals || []).map((v) => ({
                                          label: v.label,
                                          value: v.value,
                                        }));

                                        return { ...prev, permission: newData };
                                      });
                                    }}
                                  />
                                </td>
                                <td className="p-2 text-center w-[10%]">
                                  <button
                                    onClick={(e) =>
                                      handleRemoveChild(e, indexRow, cIndex)
                                    }
                                    className="text-red-400 hover:text-red-600 hover:scale-110 hover:cursor-pointer duration-300"
                                  >
                                    <FaTrash size={12} />
                                  </button>
                                </td>
                              </tr>
                            ),
                          )}
                        </React.Fragment>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
          {isLoading ? "Updating..." : "Submit"}
        </button>
      </div>
    </div>
  );
}
