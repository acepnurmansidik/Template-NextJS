"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "@/utils/socket";

// Opsi hook: `enabled` untuk menunda koneksi (mis. tunggu user login),
// `disconnectOnUnmount` bila ingin memutus koneksi saat komponen unmount.
interface UseSocketOptions {
  enabled?: boolean;
  disconnectOnUnmount?: boolean;
}

// Hook untuk memakai socket singleton di komponen React.
// Menyediakan status koneksi + helper `on` (subscribe) dan `emit`.
const useSocket = (options: UseSocketOptions = {}) => {
  const { enabled = true, disconnectOnUnmount = false } = options;

  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Sinkronkan status awal bila socket sudah terhubung sebelumnya.
    if (socket.connected) setIsConnected(true);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      if (disconnectOnUnmount) disconnectSocket();
    };
  }, [enabled, disconnectOnUnmount]);

  // Subscribe ke sebuah event. Mengembalikan fungsi unsubscribe.
  const on = useCallback(
    <T = unknown>(event: string, handler: (data: T) => void) => {
      const socket = socketRef.current;
      if (!socket) return () => {};
      socket.on(event, handler as (...args: unknown[]) => void);
      return () => socket.off(event, handler as (...args: unknown[]) => void);
    },
    [],
  );

  // Kirim event ke server.
  const emit = useCallback(<T = unknown>(event: string, data?: T) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { socket: socketRef.current, isConnected, on, emit };
};

export default useSocket;
