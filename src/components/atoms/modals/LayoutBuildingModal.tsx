"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Swal from "sweetalert2";
import useImage from "use-image";
import { IoClose } from "react-icons/io5";
import { FiChevronDown, FiSave } from "react-icons/fi";
import { apiDelete, apiGet, apiPost, apiPut } from "@/utils/api";
import {
  amenityIds,
  BuildingApiDaum,
  BuildingFloorApiDaum,
  imageUrl,
  refImagePath,
  RoomUnitApiDaum,
  RoomStatus,
  ROOM_STATUS_LABEL,
  ROOM_UNIT_TYPES,
  RoomUnitType,
} from "@/types/facility";
import {
  LayoutComponentGroup,
  LayoutComponentGroupedResponse,
} from "@/types/LayoutComponent";
import type { CanvasItem } from "@/components/atoms/shared/LayoutCanvas";
import NumberInput from "@/components/atoms/shared/NumberInput";
import AmenitiesSelect from "@/components/atoms/shared/AmenitiesSelect";
import { ListResponse, SingleResponse } from "@/types/api";

const LayoutCanvas = dynamic(
  () => import("@/components/atoms/shared/LayoutCanvas"),
  { ssr: false },
);

interface DataProps {
  isOpen: boolean;
  buildingId: string;
  onClose: () => void;
}

const DEFAULT_BASE_W = 1200;
const DEFAULT_BASE_H = 800;
const DEFAULT_COLOR = "#3B82F6";

type ItemState = "new" | "dirty" | "clean";

// Item terstage di lokal: geometri kanvas + field room unit + status simpan.
interface PlacedItem extends CanvasItem {
  _state: ItemState;
  unit_type: string;
  unit_status: string;
  capacity: number;
  area_sqm: number;
  amenities: string[];
  notes: string;
}

const inputCls =
  "w-full bg-white dark:bg-zinc-900 p-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:text-zinc-100";
const labelCls =
  "block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1";

const roomToPlaced = (room: RoomUnitApiDaum): PlacedItem | null => {
  const c = room.component;
  if (!c) return null;
  const cid =
    c.component_id && typeof c.component_id === "object"
      ? c.component_id._id
      : ((c.component_id as string) ?? null);
  if (!cid) return null;
  return {
    _id: room._id,
    component_id: cid,
    name: room.name,
    x: c.x ?? 0,
    y: c.y ?? 0,
    width: c.width ?? 100,
    height: c.height ?? 100,
    scale_x: c.scale_x ?? 1,
    scale_y: c.scale_y ?? 1,
    rotation: c.rotation ?? 0,
    color: c.color ?? DEFAULT_COLOR,
    opacity: c.opacity ?? 1,
    _state: "clean",
    unit_type: room.unit_type ?? "other",
    unit_status: room.status ?? "available",
    capacity: room.capacity ?? 0,
    area_sqm: room.area_sqm ?? 0,
    amenities: amenityIds(room.amenities),
    notes: room.notes ?? "",
  };
};

const itemToComponent = (it: PlacedItem) => ({
  component_id: it.component_id,
  x: it.x,
  y: it.y,
  width: it.width,
  height: it.height,
  scale_x: it.scale_x,
  scale_y: it.scale_y,
  rotation: it.rotation,
  color: it.color,
  opacity: it.opacity,
});

// new tetap new; selain itu jadi dirty (perlu di-PUT saat save).
const touch = (it: PlacedItem): PlacedItem =>
  it._state === "new" ? it : { ...it, _state: "dirty" };

export default function LayoutBuildingModal({
  isOpen,
  buildingId,
  onClose,
}: DataProps) {
  const [building, setBuilding] = useState<BuildingApiDaum | null>(null);
  const [floors, setFloors] = useState<BuildingFloorApiDaum[]>([]);
  const [floorId, setFloorId] = useState<string>("");
  const [groups, setGroups] = useState<LayoutComponentGroup[]>([]);
  const [items, setItems] = useState<PlacedItem[]>([]);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const itemsRef = useRef<PlacedItem[]>(items);
  itemsRef.current = items;
  const deletedRef = useRef<string[]>(deletedIds);
  deletedRef.current = deletedIds;
  const tmpCounter = useRef(0);

  const selectedFloor = floors.find((f) => f._id === floorId) || null;
  const planPath = refImagePath(selectedFloor?.floor_plan_url_id);
  const planUrl = planPath ? imageUrl(planPath) : null;

  const [planImg] = useImage(planUrl || "");
  const baseWidth = planImg?.naturalWidth || DEFAULT_BASE_W;
  const baseHeight = planImg?.naturalHeight || DEFAULT_BASE_H;
  const baseReady = !planUrl || !!planImg;

  const selected = items.find((i) => i._id === selectedId) || null;
  const dirty =
    items.some((i) => i._state !== "clean") || deletedIds.length > 0;
  // Nama item terpilih bentrok dengan item lain di lantai ini?
  const nameDup =
    !!selected &&
    items.some(
      (i) =>
        i._id !== selected._id &&
        (i.name ?? "").trim().toLowerCase() ===
          (selected.name ?? "").trim().toLowerCase(),
    );

  /* ------------------------------ FETCH ------------------------------ */

  const fetchBuilding = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiGet<
        SingleResponse<BuildingApiDaum & { floors: BuildingFloorApiDaum[] }>
      >(`/building/${buildingId}`, {}, false);
      const b = res.data ?? null;
      setBuilding(b);
      const fl = (b?.floors ?? []).sort(
        (a, c) => (a.floor_level ?? 0) - (c.floor_level ?? 0),
      );
      setFloors(fl);
      setFloorId((prev) => prev || fl[0]?._id || "");
    } catch {
      setBuilding(null);
      setFloors([]);
    } finally {
      setLoading(false);
    }
  }, [buildingId]);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await apiGet<LayoutComponentGroupedResponse>(
        "/layout-component/grouped",
        {},
        false,
      );
      setGroups(res.data ?? []);
    } catch {
      setGroups([]);
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    if (!floorId) {
      setItems([]);
      return;
    }
    try {
      const res = await apiGet<ListResponse<RoomUnitApiDaum>>(
        "/room-unit",
        { floor_id: floorId, limit: 1000 },
        false,
      );
      const mapped = (res.data ?? [])
        .map(roomToPlaced)
        .filter((x): x is PlacedItem => x !== null);
      setItems(mapped);
      setDeletedIds([]);
      setSelectedId(null);
    } catch {
      setItems([]);
    }
  }, [floorId]);

  useEffect(() => {
    if (isOpen) {
      fetchBuilding();
      fetchGroups();
    }
  }, [isOpen, fetchBuilding, fetchGroups]);

  useEffect(() => {
    if (isOpen) fetchRooms();
  }, [isOpen, fetchRooms]);

  /* --------------------------- PERSISTENCE --------------------------- */

  // Simpan semua perubahan (create/update/delete) ke API sekaligus.
  const save = useCallback(async (targetFloor: string) => {
    // Validasi: nama room unit wajib & tidak boleh sama dalam satu lantai.
    const seen = new Set<string>();
    for (const it of itemsRef.current) {
      const key = (it.name ?? "").trim().toLowerCase();
      if (!key) {
        Swal.fire({
          icon: "warning",
          title: "Room name is required",
          text: "Setiap item harus punya nama.",
          confirmButtonColor: "#2563eb",
        });
        return false;
      }
      if (seen.has(key)) {
        Swal.fire({
          icon: "warning",
          title: "Duplicate room name",
          text: `Nama '${it.name}' dipakai lebih dari sekali di lantai ini.`,
          confirmButtonColor: "#2563eb",
        });
        return false;
      }
      seen.add(key);
    }

    setSaving(true);
    try {
      for (const id of deletedRef.current) {
        await apiDelete<SingleResponse<RoomUnitApiDaum>>(
          `/room-unit/${id}`,
          {},
          false,
        );
      }
      const next: PlacedItem[] = [];
      for (const it of itemsRef.current) {
        const body = {
          name: it.name,
          unit_type: it.unit_type,
          status: it.unit_status,
          capacity: it.capacity,
          area_sqm: it.area_sqm,
          amenities: it.amenities,
          notes: it.notes,
          component: itemToComponent(it),
        };
        if (it._state === "new") {
          const res = await apiPost<SingleResponse<RoomUnitApiDaum>>(
            "/room-unit",
            { floor_id: targetFloor, ...body },
            false,
            false,
          );
          next.push({ ...it, _id: res.data?._id ?? it._id, _state: "clean" });
        } else if (it._state === "dirty") {
          await apiPut<SingleResponse<RoomUnitApiDaum>>(
            `/room-unit/${it._id}`,
            body,
            false,
            false,
          );
          next.push({ ...it, _state: "clean" });
        } else {
          next.push(it);
        }
      }
      setItems(next);
      setDeletedIds([]);
      setSelectedId(null);
      return true;
    } catch (error) {
      const serverMessage =
        (typeof error === "object" &&
          error &&
          "message" in error &&
          String((error as { message?: string }).message)) ||
        "Please try again.";
      Swal.fire({
        icon: "error",
        title: "Failed to save layout",
        text: serverMessage,
        confirmButtonColor: "#dc2626",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const handleSaveClick = async () => {
    const ok = await save(floorId);
    if (ok) {
      Swal.fire({
        icon: "success",
        title: "Saved",
        timer: 1400,
        showConfirmButton: false,
      });
    }
  };

  // Ganti lantai: auto-save perubahan lantai saat ini dulu, baru pindah.
  // Bila save gagal (mis. nama duplikat), batalkan perpindahan.
  const changeFloor = async (newId: string) => {
    if (newId === floorId) return;
    if (dirty) {
      const ok = await save(floorId);
      if (!ok) return;
    }
    setSelectedId(null);
    setFloorId(newId);
  };

  // Buat nama unik dalam satu lantai (tambah sufiks angka bila bentrok).
  const uniqueName = (base: string, excludeId?: string) => {
    const taken = new Set(
      items
        .filter((i) => i._id !== excludeId)
        .map((i) => (i.name ?? "").trim().toLowerCase()),
    );
    const b = base.trim() || "Room";
    if (!taken.has(b.toLowerCase())) return b;
    let n = 2;
    while (taken.has(`${b} ${n}`.toLowerCase())) n += 1;
    return `${b} ${n}`;
  };

  const handleClose = async () => {
    if (!dirty) {
      onClose();
      return;
    }
    const r = await Swal.fire({
      title: "Simpan perubahan?",
      text: "Ada perubahan layout yang belum disimpan.",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Simpan",
      denyButtonText: "Buang",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      denyButtonColor: "#dc2626",
    });
    if (r.isConfirmed) {
      const ok = await save(floorId);
      if (ok) onClose();
    } else if (r.isDenied) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirty, floorId, items, deletedIds]);

  /* ----------------------- LOCAL (STAGED) ACTIONS -------------------- */

  const patchGeometry = (id: string, patch: Partial<CanvasItem>) => {
    setItems((prev) =>
      prev.map((it) => (it._id === id ? touch({ ...it, ...patch }) : it)),
    );
  };

  const patchFields = (id: string, patch: Partial<PlacedItem>) => {
    setItems((prev) =>
      prev.map((it) => (it._id === id ? touch({ ...it, ...patch }) : it)),
    );
  };

  const addComponent = (componentId: string, name: string) => {
    if (!floorId) {
      Swal.fire({
        icon: "info",
        title: "Select a floor first",
        confirmButtonColor: "#2563eb",
      });
      return;
    }
    tmpCounter.current += 1;
    const item: PlacedItem = {
      _id: `tmp-${tmpCounter.current}`,
      component_id: componentId,
      // Nama room unit = nama component (visual); unik per lantai.
      name: uniqueName(name),
      x: Math.round(baseWidth / 2 - 50),
      y: Math.round(baseHeight / 2 - 50),
      width: 100,
      height: 100,
      scale_x: 1,
      scale_y: 1,
      rotation: 0,
      color: DEFAULT_COLOR,
      opacity: 1,
      _state: "new",
      unit_type: "other",
      unit_status: "available",
      capacity: 0,
      area_sqm: 0,
      amenities: [],
      notes: "",
    };
    setItems((prev) => [...prev, item]);
    setSelectedId(item._id);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    tmpCounter.current += 1;
    const item: PlacedItem = {
      ...selected,
      _id: `tmp-${tmpCounter.current}`,
      name: uniqueName(selected.name ?? "Room", selected._id),
      x: selected.x + 24,
      y: selected.y + 24,
      _state: "new",
    };
    setItems((prev) => [...prev, item]);
    setSelectedId(item._id);
  };

  const deleteSelected = () => {
    if (!selected) return;
    const it = selected;
    if (it._state !== "new" && !it._id.startsWith("tmp-")) {
      setDeletedIds((d) => [...d, it._id]);
    }
    setItems((prev) => prev.filter((x) => x._id !== it._id));
    setSelectedId(null);
  };

  if (!isOpen) return null;

  const floorLabel = (f: BuildingFloorApiDaum) => `${f.name} (${f.code})`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950">
      {/* HEADER */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            {building?.code ?? "…"}
          </span>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Floor Plan Layout — {building?.name ?? ""}
          </h2>
          {dirty && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Unsaved
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* FLOOR DROPDOWN (auto-save saat ganti) */}
          <select
            value={floorId}
            onChange={(e) => changeFloor(e.target.value)}
            className="border border-zinc-300 dark:border-zinc-700 outline-none px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 text-sm text-zinc-800 dark:text-zinc-200"
          >
            {floors.length === 0 && <option value="">No floors</option>}
            {floors.map((f) => (
              <option key={f._id} value={f._id}>
                {floorLabel(f)}
              </option>
            ))}
          </select>

          <button
            onClick={handleSaveClick}
            disabled={!dirty || saving}
            className={`h-9 px-4 rounded-lg text-sm font-bold text-white flex items-center gap-2 transition-all ${
              !dirty || saving
                ? "bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow"
            }`}
          >
            <FiSave size={15} />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-900 flex items-center justify-center dark:hover:text-zinc-100 hover:bg-zinc-300/20 rounded-md hover:cursor-pointer h-9 w-9"
          >
            <IoClose className="text-red-500 text-xl" />
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {/* CANVAS — fit penuh, ada zoom & pan */}
        <div className="absolute inset-0 p-4">
          {loading || !baseReady ? (
            <p className="text-sm text-zinc-400 text-center py-20">Loading…</p>
          ) : (
            <LayoutCanvas
              bgUrl={planUrl}
              baseWidth={baseWidth}
              baseHeight={baseHeight}
              items={items}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={patchGeometry}
              onDuplicate={duplicateSelected}
              onDelete={deleteSelected}
            />
          )}
          {!planUrl && baseReady && (
            <p className="absolute bottom-2 left-0 right-0 text-center text-[11px] text-zinc-400">
              Lantai ini belum punya denah. Unggah denah lewat Edit Floor untuk
              latar belakang kanvas.
            </p>
          )}
        </div>

        <div className="absolute top-4 left-4 z-40 w-72 max-h-[calc(100%-2rem)] flex flex-col gap-3">
          {/* DETAIL ROOM UNIT (muncul saat item dipilih) */}
          {selected && (
            <div className="flex flex-col bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  Room Unit Details
                </p>
                <p className="text-[11px] text-zinc-400">
                  Lengkapi data unit untuk item ini.
                </p>
              </div>
              <div className="p-3 space-y-3 overflow-y-auto max-h-[40vh] custom-scrollbar">
                <div>
                  <label className={labelCls}>Name (dari component)</label>
                  <input
                    value={selected.name ?? ""}
                    onChange={(e) =>
                      patchFields(selected._id, { name: e.target.value })
                    }
                    className={`${inputCls} ${
                      nameDup
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                  />
                  {nameDup && (
                    <p className="mt-1 text-[11px] text-red-500">
                      Nama sudah dipakai unit lain di lantai ini.
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelCls}>Unit Type</label>
                    <select
                      value={selected.unit_type}
                      onChange={(e) =>
                        patchFields(selected._id, {
                          unit_type: e.target.value as RoomUnitType,
                        })
                      }
                      className={inputCls}
                    >
                      {ROOM_UNIT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select
                      value={selected.unit_status}
                      onChange={(e) =>
                        patchFields(selected._id, {
                          unit_status: e.target.value,
                        })
                      }
                      className={inputCls}
                    >
                      {Object.values(RoomStatus).map((s) => (
                        <option key={s} value={s}>
                          {ROOM_STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Capacity</label>
                    <NumberInput
                      integer
                      value={selected.capacity}
                      onChange={(v) =>
                        patchFields(selected._id, { capacity: v })
                      }
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Area (m²)</label>
                    <NumberInput
                      value={selected.area_sqm}
                      onChange={(v) =>
                        patchFields(selected._id, { area_sqm: v })
                      }
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Amenities</label>
                  <AmenitiesSelect
                    instanceId="amenities-layout-room"
                    value={selected.amenities}
                    onChange={(ids) =>
                      patchFields(selected._id, { amenities: ids })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Notes</label>
                  <textarea
                    value={selected.notes}
                    onChange={(e) =>
                      patchFields(selected._id, { notes: e.target.value })
                    }
                    rows={2}
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: palette + detail form */}
        <div className="absolute top-4 right-4 z-40 w-72 max-h-[calc(100%-2rem)] flex flex-col gap-3">
          {/* COMPONENT PALETTE (accordion) */}
          <div className="flex flex-col min-h-0 bg-white dark:bg-zinc-800 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                Components
              </p>
              <p className="text-[11px] text-zinc-400">
                Pilih kategori, lalu klik komponen untuk ditambahkan.
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar">
              {groups.length === 0 ? (
                <p className="text-xs text-zinc-400 text-center py-6">
                  No components yet.
                </p>
              ) : (
                groups.map((g) => {
                  const isOpenCat = openCategory === g.category;
                  return (
                    <div
                      key={g.category}
                      className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setOpenCategory(isOpenCat ? null : g.category)
                        }
                        className="w-full flex items-center justify-between px-3 py-2 bg-zinc-50 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/70 cursor-pointer transition-colors"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-300">
                          {g.category}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-zinc-400">
                            {g.items.length}
                          </span>
                          <FiChevronDown
                            size={14}
                            className={`text-zinc-400 transition-transform ${
                              isOpenCat ? "rotate-180" : ""
                            }`}
                          />
                        </span>
                      </button>

                      {isOpenCat && (
                        <div className="grid grid-cols-2 gap-2 p-2">
                          {g.items.map((c) => {
                            const img = refImagePath(c.image_id);
                            return (
                              <button
                                key={c._id}
                                onClick={() => addComponent(c._id, c.name)}
                                title={`Add ${c.name}`}
                                className="flex flex-col items-center gap-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer transition-all"
                              >
                                {img ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={imageUrl(img)}
                                    alt={c.name}
                                    className="h-10 w-10 object-contain"
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded bg-blue-500/20" />
                                )}
                                <span className="text-[10px] text-zinc-600 dark:text-zinc-300 text-center truncate w-full">
                                  {c.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
