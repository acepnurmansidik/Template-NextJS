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
    autoConnect: true,
    // --- Auto-reconnect untuk putus koneksi yang tidak disengaja ---
    reconnection: true,
    reconnectionAttempts: Infinity, // terus coba, jangan menyerah
    reconnectionDelay: 1000, // jeda awal 1s
    reconnectionDelayMax: 5000, // jeda maksimum 5s (exponential backoff)
    randomizationFactor: 0.5, // acak jeda supaya tidak "thundering herd"
    timeout: 20000, // batas waktu satu upaya koneksi
    // Kirim token untuk otentikasi di server (io.use middleware).
    auth: accessToken ? { token: accessToken } : undefined,
  });

  // Bila SERVER yang memutus paksa (io server disconnect), Socket.IO TIDAK
  // otomatis reconnect. Sambungkan ulang manual untuk kasus ini.
  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect") {
      socket?.connect();
    }
    // reason lain (mis. "transport close"/"ping timeout") ditangani otomatis
    // oleh mekanisme reconnection bawaan Socket.IO.
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
