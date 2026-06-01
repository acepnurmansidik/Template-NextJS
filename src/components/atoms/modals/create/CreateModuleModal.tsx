"use client";

import { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { actionDefaultOptions } from "@/utils/utils";
import { ModuleFormData } from "@/types/module";
import { IoClose } from "react-icons/io5";

interface DataProps {
  isOpen: boolean;
  onClose: () => void;
}

const defaultValue: ModuleFormData = {
  name: "",
  title: "",
  permission: [],
};

export default function CreateModuleModal({ isOpen, onClose }: DataProps) {
  const [formData, setFormData] = useState<ModuleFormData>(defaultValue);

  const handleChangeRow = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    setFormData((prev: ModuleFormData) => {
      const newValue = [...prev.permission];
      newValue[index] = {
        ...newValue[index],
        [e.target.name]: e.target.value,
      };
      prev.permission = newValue;
      return prev;
    });
  };

  const handleAddRow = () => {
    setFormData((prev) => {
      const newValue = [
        ...prev.permission,
        { icon: "", menu_name: "", path: "", actions: [] },
      ];
      return { ...prev, permission: newValue };
    });
  };
  const handleRemoveRow = (id: number) => {
    setFormData((prev) => {
      const newValue = prev.permission.filter((_, index) => index !== id);
      return { ...prev, permission: newValue };
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          Create Module
        </h2>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-center text-xl text-bold hover:scale-120 duration-300" />
        </button>
      </div>

      <form className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-full px-5 mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Name
              </label>
              <input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                type="text"
                className="w-full bg-white dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-zinc-100"
              />
            </div>
            <div className="group">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1.5">
                Title
              </label>
              <input
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                type="text"
                className="w-full bg-white dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Table Permissions */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Permissions
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
                <thead className="bg-zinc-50 dark:bg-zinc-900 text-[10px] uppercase text-zinc-500">
                  <tr>
                    <th className="p-3">Icon</th>
                    <th className="p-3">Menu Name</th>
                    <th className="p-3">Path</th>
                    <th className="p-3 w-72">Actions</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {formData.permission.map((row, indexRow) => (
                    <tr key={indexRow}>
                      <td className="p-2">
                        <input
                          type="text"
                          className="w-full bg-white dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-zinc-100"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          onChange={(e) => handleChangeRow(e, indexRow)}
                          type="text"
                          className="w-full bg-white dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-zinc-100"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          onChange={(e) => handleChangeRow(e, indexRow)}
                          type="text"
                          className="w-full bg-white dark:bg-zinc-900 p-2.5 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 dark:text-zinc-100"
                        />
                      </td>
                      <td className="p-2 min-w-62.5">
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
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          options={actionDefaultOptions}
                          placeholder="Type & Enter..."
                          isValidNewOption={(inputValue) =>
                            inputValue.trim().length > 0
                          }
                          onChange={(vals) => {
                            setFormData((prev) => {
                              // 1. Ambil nilai unik dari input (string)
                              const newActions = vals
                                ? vals.map((v) => ({
                                    label: v.label,
                                    value: v.value, // Asumsikan value diambil dari input
                                  }))
                                : [];

                              // 2. Update state dengan mempertahankan struktur objek
                              return {
                                ...prev,
                                permission: prev.permission.map(
                                  (item, index) => {
                                    // Logika ini harus disesuaikan dengan posisi baris (indexRow)
                                    if (index === indexRow) {
                                      return {
                                        ...item,
                                        actions: newActions, // Update array actions di sini
                                      };
                                    }
                                    return item;
                                  },
                                ),
                              };
                            });

                            console.log(formData);
                          }}
                          // Opsional: gaya khusus label untuk opsi baru
                          formatCreateLabel={(inputValue) =>
                            `Add action: "${inputValue}"`
                          }
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(indexRow)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash
                            size={14}
                            className="hover:scale-115 duration-300 hover:cursor-pointer"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>

      <div className="px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50 dark:bg-zinc-900/50">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 rounded-lg"
        >
          Cancel
        </button>
        <button className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-500/20">
          Submit
        </button>
      </div>
    </div>
  );
}
