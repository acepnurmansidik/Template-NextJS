"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { IoClose } from "react-icons/io5";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { apiDelete, apiGet, apiPost } from "@/utils/api";
import {
  BuildingApiDaum,
  BuildingFloorApiDaum,
  BUILDING_TYPE_LABEL,
  BuildingType,
  refImagePath,
  refName,
  SingleResponse,
} from "@/types/facility";
import UpdateBuildingFloorModal from "../update/UpdateBuildingFloorModal";

interface DataProps {
  isOpen: boolean;
  buildingId: string;
  onClose: () => void;
  onRefresh?: () => void;
}

const Field = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
      {label}
    </p>
    <p className="text-sm text-zinc-800 dark:text-zinc-200">{value || "—"}</p>
  </div>
);

export default function ViewBuildingModal({
  isOpen,
  buildingId,
  onClose,
  onRefresh,
}: DataProps) {
  const [building, setBuilding] = useState<BuildingApiDaum | null>(null);
  const [floors, setFloors] = useState<BuildingFloorApiDaum[]>([]);
  const [loading, setLoading] = useState(false);
  const [editFloor, setEditFloor] = useState<BuildingFloorApiDaum | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const result = await apiGet<
        SingleResponse<BuildingApiDaum & { floors: BuildingFloorApiDaum[] }>
      >(`/building/${buildingId}`, {}, false);
      setBuilding(result.data ?? null);
      setFloors(result.data?.floors ?? []);
    } catch {
      setBuilding(null);
      setFloors([]);
    } finally {
      setLoading(false);
    }
  }, [buildingId]);

  useEffect(() => {
    if (isOpen) fetchDetail();
  }, [isOpen, fetchDetail]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleAddFloor = async () => {
    try {
      await apiPost<SingleResponse<BuildingFloorApiDaum>>(
        "/building-floor",
        { building_id: buildingId },
        false,
        false,
      );
      await fetchDetail();
      onRefresh?.();
    } catch (error) {
      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: serverMessage || "Failed to add floor.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  const handleDeleteFloor = async (floor: BuildingFloorApiDaum) => {
    const confirmation = await Swal.fire({
      title: "Delete this floor?",
      text: `${floor.name} (${floor.code}) beserta ruangan di dalamnya akan dihapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
    });
    if (!confirmation.isConfirmed) return;
    try {
      await apiDelete<SingleResponse<BuildingFloorApiDaum>>(
        `/building-floor/${floor._id}`,
        {},
        false,
      );
      await fetchDetail();
      onRefresh?.();
    } catch (error) {
      const serverMessage =
        axios.isAxiosError(error) &&
        (error.response?.data?.message || error.response?.data?.error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: serverMessage || "Failed to delete floor.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      <div className="flex justify-between items-center px-8 py-6 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            {building?.code ?? "…"}
          </span>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {building?.name ?? "Building"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-900 flex items-center duration-300 justify-center dark:hover:text-zinc-100 text-sm font-medium hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
        >
          <IoClose className="text-red-500 text-xl" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto space-y-8">
          {loading ? (
            <p className="text-sm text-zinc-400">Loading…</p>
          ) : (
            building && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <Field label="Branch" value={refName(building.branch_id)} />
                  <Field
                    label="Type"
                    value={
                      BUILDING_TYPE_LABEL[
                        building.building_type as BuildingType
                      ] ?? building.building_type
                    }
                  />
                  <Field
                    label="Total Floors"
                    value={String(building.total_floors)}
                  />
                  <Field
                    label="Status"
                    value={building.is_active ? "Active" : "Inactive"}
                  />
                  <Field
                    label="Building Area"
                    value={
                      building.building_area_sqm
                        ? `${building.building_area_sqm} m²`
                        : "—"
                    }
                  />
                  <Field
                    label="Land Area"
                    value={
                      building.land_area_sqm
                        ? `${building.land_area_sqm} m²`
                        : "—"
                    }
                  />
                  <Field label="City" value={building.address?.city} />
                  <Field label="Notes" value={building.notes} />
                </div>

                {/* FLOORS */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      Floors ({floors.length})
                    </h3>
                    <button
                      onClick={handleAddFloor}
                      className="h-8 rounded-lg text-xs font-medium bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer px-3 flex items-center gap-2 outline-none text-gray-700 dark:text-zinc-200 transition-all shadow-sm border border-zinc-200 dark:border-zinc-700"
                    >
                      <FiPlus size={12} />
                      <span>Add Floor</span>
                    </button>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-zinc-100 dark:border-zinc-800">
                    <table className="w-full text-left">
                      <thead className="bg-zinc-50 dark:bg-zinc-800/60">
                        <tr className="text-xs text-zinc-600 dark:text-zinc-300">
                          <th className="py-2 px-3 font-bold">Code</th>
                          <th className="py-2 px-3 font-bold">Name</th>
                          <th className="py-2 px-3 font-bold text-center">
                            Level
                          </th>
                          <th className="py-2 px-3 font-bold text-right">
                            Area
                          </th>
                          <th className="py-2 px-3 font-bold text-right">
                            Capacity
                          </th>
                          <th className="py-2 px-3 font-bold">Plan</th>
                          <th className="py-2 px-3 font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {floors.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-8 text-center text-xs text-zinc-400"
                            >
                              No floors yet.
                            </td>
                          </tr>
                        ) : (
                          floors.map((f, i) => (
                            <tr
                              key={f._id}
                              className={`text-sm border-t border-zinc-100/70 dark:border-zinc-800 ${
                                i % 2 === 0
                                  ? "bg-white dark:bg-transparent"
                                  : "bg-zinc-50/60 dark:bg-zinc-800/30"
                              }`}
                            >
                              <td className="py-2.5 px-3 font-mono text-xs font-bold text-zinc-500 dark:text-zinc-400">
                                {f.code}
                              </td>
                              <td className="py-2.5 px-3 text-zinc-700 dark:text-zinc-300">
                                {f.name}
                              </td>
                              <td className="py-2.5 px-3 text-center text-zinc-600 dark:text-zinc-400">
                                {f.floor_level}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-zinc-600 dark:text-zinc-400">
                                {f.floor_area_sqm || 0}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-zinc-600 dark:text-zinc-400">
                                {f.max_capacity || 0}
                              </td>
                              <td className="py-2.5 px-3">
                                {refImagePath(f.floor_plan_url_id) ? (
                                  <span className="text-[10px] font-bold text-emerald-600">
                                    ✓
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-zinc-400">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-0.5 text-gray-500 dark:text-zinc-400">
                                  <button
                                    onClick={() => setEditFloor(f)}
                                    title="Edit floor"
                                    className="h-7 w-7 flex items-center justify-center rounded-md hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 cursor-pointer"
                                  >
                                    <FiEdit2 size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteFloor(f)}
                                    title="Delete floor"
                                    className="h-7 w-7 flex items-center justify-center rounded-md hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer"
                                  >
                                    <FiTrash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      </div>

      <div className="px-8 py-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end bg-zinc-50 dark:bg-zinc-900/50">
        <button
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 rounded-lg"
        >
          Close
        </button>
      </div>

      {editFloor && (
        <UpdateBuildingFloorModal
          isOpen={!!editFloor}
          initialData={editFloor}
          onClose={() => setEditFloor(null)}
          onSuccess={() => {
            setEditFloor(null);
            fetchDetail();
          }}
        />
      )}
    </div>
  );
}
