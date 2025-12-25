// File: components/rooms/room-presence.tsx
"use client";

import { useRoomPresence } from "@/hooks/use-room-presence";

interface RoomPresenceProps {
  roomId: string;
}

const RoomPresence = ({ roomId }: RoomPresenceProps) => {
  useRoomPresence(roomId);
  return null;
};

export default RoomPresence;