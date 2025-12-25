// File: hooks/use-room-presence.ts
"use client";

import { useEffect } from "react";

export const useRoomPresence = (roomId: string) => {
  useEffect(() => {
    const leaveRoom = () => {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({})], { type: 'application/json' });
        navigator.sendBeacon(`/api/rooms/${roomId}/leave`, blob);
      } else {
        fetch(`/api/rooms/${roomId}/leave`, {
          method: "POST",
          keepalive: true,
        }).catch((err) => console.error("Failed to leave room:", err));
      }
    };

    // Xử lý khi đóng tab / refresh / tắt trình duyệt
    const handleBeforeUnload = () => {
      leaveRoom();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Xử lý khi chuyển trang (Unmount component)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      leaveRoom();
    };
  }, [roomId]);
};