// Tipe & konfigurasi bersama untuk modul Facility:
// Branch, Building, Building Floor, Room Unit. Mirror endpoint backend
// /branch, /building, /building-floor, /room-unit.

import { API_BASE_URL } from "@/utils/api";

/* ----------------------------- IMAGE HELPER ----------------------------- */

// Referensi gambar (populate dari koleksi Image).
export interface ImageRef {
  _id: string;
  path: string;
}

// Ubah path gambar (dari model Image) menjadi URL yang bisa diakses browser.
// Backend menyajikan file statis di `${host}/uploads/images/...`, sedangkan
// path tersimpan bisa berupa path absolut disk — jadi kita ambil potongan
// mulai dari "/uploads".
export const imageUrl = (path?: string | null): string => {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  const host = (API_BASE_URL ?? "").replace(/\/api\/v1\/?$/, "");
  const normalized = path.replace(/\\/g, "/");
  const idx = normalized.indexOf("/uploads/");
  const rel =
    idx >= 0
      ? normalized.slice(idx)
      : `/uploads/images/${normalized.replace(/^\/+/, "")}`;
  return `${host}${rel}`;
};

/* -------------------------------- BRANCH -------------------------------- */

export interface BranchContact {
  phone?: string[];
  email?: string;
  manager_name?: string;
}

export interface AddressInfo {
  street?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  country?: string;
}

export interface BranchApiDaum {
  _id: string;
  code: string;
  name: string;
  slug: string;
  description?: string;
  contact_info?: BranchContact;
  address?: AddressInfo;
  location?: { type: string; coordinates: number[] };
  is_active: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BranchPayload {
  name: string;
  description?: string;
  contact_info?: BranchContact;
  address?: AddressInfo;
  // GeoJSON Point: coordinates = [longitude, latitude].
  location?: { type: "Point"; coordinates: number[] };
  is_active?: boolean;
  notes?: string;
}

/* ------------------------------- BUILDING ------------------------------- */

export enum BuildingType {
  OFFICE = "office",
  WAREHOUSE = "warehouse",
  FACTORY = "factory",
  RETAIL = "retail",
  MIXED_USE = "mixed_use",
  OTHERS = "others",
}

export const BUILDING_TYPE_LABEL: Record<BuildingType, string> = {
  [BuildingType.OFFICE]: "Office",
  [BuildingType.WAREHOUSE]: "Warehouse",
  [BuildingType.FACTORY]: "Factory",
  [BuildingType.RETAIL]: "Retail",
  [BuildingType.MIXED_USE]: "Mixed Use",
  [BuildingType.OTHERS]: "Others",
};

export const BUILDING_TYPE_BADGE: Record<BuildingType, string> = {
  [BuildingType.OFFICE]:
    "border-sky-300 bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-700",
  [BuildingType.WAREHOUSE]:
    "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  [BuildingType.FACTORY]:
    "border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700",
  [BuildingType.RETAIL]:
    "border-violet-300 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
  [BuildingType.MIXED_USE]:
    "border-teal-300 bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700",
  [BuildingType.OTHERS]:
    "border-purple-300 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700",
};

// branch_id / image_id bisa berupa string (id) atau objek populate.
export type BranchRef = string | { _id: string; name?: string; code?: string };

export interface BuildingApiDaum {
  _id: string;
  branch_id: BranchRef;
  code: string;
  name: string;
  slug: string;
  building_type: BuildingType;
  total_floors: number;
  building_area_sqm?: number;
  land_area_sqm?: number;
  address?: AddressInfo;
  image_id?: ImageRef | string | null;
  is_active: boolean;
  notes?: string;
  floors?: BuildingFloorApiDaum[];
  created_at?: string;
}

export interface BuildingPayload {
  branch_id: string;
  name: string;
  building_type?: BuildingType;
  total_floors?: number;
  building_area_sqm?: number;
  land_area_sqm?: number;
  address?: AddressInfo;
  image_id?: string | null;
  notes?: string;
}

/* ---------------------------- BUILDING FLOOR ---------------------------- */

export enum FloorType {
  FLOOR = "floor",
  BASEMENT = "basement",
  ROOFTOP = "rooftop",
}

export interface BuildingFloorApiDaum {
  _id: string;
  building_id: BranchRef;
  code: string;
  type: FloorType;
  name: string;
  slug: string;
  floor_level: number;
  floor_area_sqm?: number;
  max_capacity?: number;
  floor_plan_url_id?: ImageRef | string | null;
  is_active: boolean;
  notes?: string;
}

export interface BuildingFloorPayload {
  building_id?: string;
  type?: FloorType;
  name?: string;
  floor_level?: number;
  floor_area_sqm?: number;
  max_capacity?: number;
  floor_plan_url_id?: string | null;
  notes?: string;
}

/* ------------------------------ ROOM UNIT ------------------------------- */

export enum RoomStatus {
  AVAILABLE = "available",
  OCCUPIED = "occupied",
  UNDER_MAINTENANCE = "under_maintenance",
  RESERVED = "reserved",
}

export const ROOM_STATUS_LABEL: Record<RoomStatus, string> = {
  [RoomStatus.AVAILABLE]: "Available",
  [RoomStatus.OCCUPIED]: "Occupied",
  [RoomStatus.UNDER_MAINTENANCE]: "Maintenance",
  [RoomStatus.RESERVED]: "Reserved",
};

export const ROOM_STATUS_BADGE: Record<RoomStatus, string> = {
  [RoomStatus.AVAILABLE]:
    "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700",
  [RoomStatus.OCCUPIED]:
    "border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700",
  [RoomStatus.UNDER_MAINTENANCE]:
    "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700",
  [RoomStatus.RESERVED]:
    "border-violet-300 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-700",
};

export const ROOM_UNIT_TYPES = [
  "room",
  "bedroom",
  "guest_room",
  "dorm_room",
  "office_space",
  "meeting_room",
  "storage",
  "server_room",
  "retail_shop",
  "utility_room",
  "other",
] as const;

export type RoomUnitType = (typeof ROOM_UNIT_TYPES)[number];

// Referensi komponen master di dalam room.component (bisa id atau populate).
export type ComponentRef =
  | string
  | {
      _id: string;
      name?: string;
      category?: string;
      image_id?: ImageRef | string | null;
    }
  | null;

// Penempatan komponen pada kanvas denah (base space). snake_case = mirror model.
export interface RoomComponent {
  component_id?: ComponentRef;
  x: number;
  y: number;
  width: number;
  height: number;
  scale_x: number;
  scale_y: number;
  rotation: number;
  color: string;
  opacity: number;
}

// Amenity = referensi ke ReffParameter (id atau objek populate).
export type AmenityRef =
  | string
  | { _id: string; value?: string; type?: string; key?: number };

// Ekstrak id dari daftar amenity (baik string id maupun objek populate).
export const amenityIds = (list?: AmenityRef[]): string[] =>
  (list ?? [])
    .map((a) => (a && typeof a === "object" ? a._id : a))
    .filter((x): x is string => Boolean(x));

export interface RoomUnitApiDaum {
  _id: string;
  branch_id: BranchRef;
  building_id: BranchRef;
  floor_id:
    | string
    | { _id: string; name?: string; code?: string; floor_level?: number };
  code: string;
  name: string;
  slug: string;
  unit_type: RoomUnitType;
  status: RoomStatus;
  capacity?: number;
  area_sqm?: number;
  amenities?: AmenityRef[];
  image_id?: ImageRef | string | null;
  component?: RoomComponent;
  is_active: boolean;
  notes?: string;
  created_at?: string;
}

export interface RoomUnitPayload {
  floor_id: string;
  name?: string;
  unit_type?: RoomUnitType;
  status?: RoomStatus;
  capacity?: number;
  area_sqm?: number;
  amenities?: string[];
  image_id?: string | null;
  notes?: string;
}

/* ---------------------------- RESPONSE WRAPPERS -------------------------- */

export interface ListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  page_size?: number;
  current_page?: number;
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

// Response upload gambar: { data: [{ _id, path }] }.
export interface UploadImageResponse {
  success: boolean;
  message: string;
  data: ImageRef[];
}

/* ------------------------------- HELPERS -------------------------------- */

// Ambil nama dari field yang bisa string-id atau objek populate.
export const refName = (ref?: BranchRef | null): string =>
  ref && typeof ref === "object" ? (ref.name ?? ref.code ?? "—") : "—";

export const refImagePath = (img?: ImageRef | string | null): string | null =>
  img && typeof img === "object" ? img.path : null;
