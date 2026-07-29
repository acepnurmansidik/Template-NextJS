export enum UpdateType {
  NONE = "NONE",
  OPTIONAL = "OPTIONAL",
  FORCE = "FORCE",
}

// Platform yang didukung (disimpan lower-case di backend).
export enum AppPlatform {
  WEB = "web",
  ANDROID = "android",
  IOS = "ios",
}

export interface AppConfigForm {
  platform: string;
  latest_version: string;
  update_type: UpdateType;
  download_url: string;
  status_maintenance: boolean;
  maintenance_message: string;
}

export interface AppConfigApiDaum {
  _id: string;
  platform: string;
  latest_version: string;
  update_type: UpdateType;
  download_url: string;
  status_maintenance: boolean;
  maintenance_message: string;
  created_at?: string;
  updated_at?: string;
}

// ============================ RELEASE LOG ============================
// Mirror dari AppReleaseLogSchema di backend (collection app_release_logs).
// Dipakai untuk menampilkan history version yang sudah dirilis (timeline).
export interface AppReleaseLogDaum {
  _id: string;
  platform: string; // "web" | "android" | "ios"
  version_released: string;
  update_type: UpdateType;
  release_notes: string;
  status_maintenance: boolean;
  // `released_by` di backend adalah ref User; bisa datang sebagai id string,
  // objek ter-populate, atau null.
  released_by?:
    | { _id: string; name?: string; username?: string }
    | string
    | null;
  createdAt?: string;
}

export interface BodyAppReleaseLogResponseApiDaum {
  success: boolean;
  message: string;
  data: AppReleaseLogDaum[];
  page_size?: number;
  current_page?: number;
}
