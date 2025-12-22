"use client";

import { useCallStateHooks } from "@stream-io/video-react-sdk";
import { VideoParticipant } from "./video-participant";
import { useEffect, useState } from "react";

interface CallListProps {
  mode: "battle" | "study";
  scores?: Record<string, number>; // Map userId -> score
  myScore?: number;
}

export default function CallList({ mode, scores = {}, myScore = 0 }: CallListProps) {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  
  // Lọc trùng lặp người tham gia (đôi khi SDK trả về duplicate)
  const uniqueParticipants = Array.from(
    new Map(participants.map((p) => [p.userId, p])).values()
  );

  if (uniqueParticipants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-white/50 text-lg animate-pulse">Đang đợi người tham gia...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full h-full auto-rows-fr">
      {uniqueParticipants.map((participant) => {
        // Xác định điểm số
        const currentScore = participant.isLocalParticipant 
          ? myScore 
          : (scores[participant.userId] || 0);

        return (
          <div key={participant.userId} className="w-full h-full min-h-[200px]">
            <VideoParticipant 
              participant={participant} 
              // Chỉ hiện điểm nếu là chế độ Battle
              showScore={mode === "battle"}
              score={currentScore}
            />
          </div>
        );
      })}
    </div>
  );
}