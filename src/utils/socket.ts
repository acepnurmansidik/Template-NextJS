// Manager koneksi Socket.IO terpusat (singleton) dipakai oleh seluruh app.
// Satu instance socket dipakai bersama supaya tidak membuka banyak koneksi.

import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

// Base URL socket bisa dioverride lewat env NEXT_PUBLIC_SOCKET_URL.
// Fallback ke NEXT_PUBLIC_API_URL bila belum diset.
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || "";

// Simpan satu instance socket di level modul (singleton).
let socket: Socket | null = null;

// Ambil (atau buat) instance socket. Auth memakai Bearer token dari cookie "TT",
// sama seperti helper api.ts. Panggilan berikutnya mengembalikan instance yang sama.
export const getSocket = (): Socket => {
  if (socket) return socket;

  const accessToken = Cookies.get("TT");

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
    // Kirim token untuk otentikasi di server (io.use middleware).
    auth: accessToken ? { token: accessToken } : undefined,
  });

  return socket;
};

// Perbarui token auth lalu re-connect. Berguna setelah login/refresh token.
export const refreshSocketAuth = (): void => {
  if (!socket) return;
  const accessToken = Cookies.get("TT");
  socket.auth = accessToken ? { token: accessToken } : {};
  socket.disconnect().connect();
};

// Putus koneksi dan buang instance singleton. Panggil saat logout.
export const disconnectSocket = (): void => {
  if (!socket) return;
  socket.disconnect();
  socket = null;
};
