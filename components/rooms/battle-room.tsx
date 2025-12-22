

// "use client";

// import { useEffect, useState } from "react";
// import { 
//   useStreamVideoClient, 
//   StreamCall, 
//   useCallStateHooks, 
//   useCall,
//   Call,
//   ToggleAudioPublishingButton,
//   ToggleVideoPublishingButton,
//   CancelCallButton,
// } from "@stream-io/video-react-sdk";
// import { VideoParticipant } from "./video-participant";
// import "@stream-io/video-react-sdk/dist/css/styles.css"; 

// import Loader from "./loader"; // Tận dụng loader cũ của bạn
// import { Button } from "../ui/button";
// import { Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function BattleRoom({ roomId }: { roomId: string }) {
//   const client = useStreamVideoClient();
//   const [call, setCall] = useState<Call | null>(null);

//   // 1. Tự động Join Call khi vào trang
//   useEffect(() => {
//     if (!client) return;
//     const myCall = client.call("default", roomId);
    
//     myCall.join({ create: true })
//       .then(() => setCall(myCall))
//       .catch((err) => console.error("Error joining call:", err));

//     return () => {
//       myCall.leave().catch(console.error);
//     };
//   }, [client, roomId]);

//   if (!call) return <Loader />;
//   return (
//     <StreamCall call={call}>
//       <div className="min-h-screen bg-slate-900">
//         <div className="max-w-[1200px] mx-auto my-10 p-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/8 shadow-lg">
//           <div className="flex items-center justify-between mb-6">
//             <div className="text-white font-semibold text-lg">Phòng thi đấu</div>
//             <div className="text-sm text-gray-300">Trạng thái: Live</div>
//           </div>

//           <div className="rounded-xl overflow-hidden border border-white/8 bg-black/60 p-6">
//             <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
//               <BattleArena />
//             </div>
//           </div>

//                 <div className="mt-6 flex justify-center">
//                   <div className="flex items-center gap-4">
//                     <ToggleAudioPublishingButton />
//                     <ToggleVideoPublishingButton />
//                     <CancelCallButton onLeave={() => window.location.href = '/rooms'} />
//                   </div>
//                 </div>
//         </div>
//       </div>
//     </StreamCall>
//   );
// }

// // Tách nhỏ UI để dùng hooks của Stream dễ hơn (vẫn nằm trong cùng 1 file)
// function BattleArena() {
//   const { useParticipants } = useCallStateHooks();
//   const participants = useParticipants();
//   const call = useCall();
  
//   const [myScore, setMyScore] = useState(0);
//   const [rivalScores, setRivalScores] = useState<Record<string, number>>({});

//   // Logic: Tính điểm và Gửi cho đối thủ
//   useEffect(() => {
//     if (!call) return;
//     const interval = setInterval(async () => {
//       // TODO: Thay bằng hàm AI tính điểm thật của bạn
//       const score = Math.floor(Math.random() * (100 - 50) + 50); 
//       setMyScore(score);

//       // Gửi event qua Stream SDK
//       await call.sendCustomEvent({
//         type: "score_update",
//         data: { userId: call.currentUserId, score },
//       });
//     }, 2000);

//     // Lắng nghe điểm từ đối thủ
//     const handleEvent = (event: any) => {
//       if (event.type === "score_update") {
//         setRivalScores(prev => ({ ...prev, [event.data.userId]: event.data.score }));
//       }
//     };
//     call.on("custom", handleEvent);

//     return () => {
//       clearInterval(interval);
//       call.off("custom", handleEvent);
//     };
//   }, [call]);

//   // Deduplicate by userId - simple and reliable
//   const unique = Array.from(
//     new Map(
//       participants
//         .filter((p): p is NonNullable<typeof p> => p != null)
//         .map(p => [p.userId, p])
//     ).values()
//   );

//   if (unique.length === 0) {
//     return <div className="col-span-full text-center text-gray-400 py-16">Đang kết nối...</div>;
//   }

//   return (
//     <>
//       {unique.map((p) => {
//         const score = p.isLocalParticipant ? myScore : (rivalScores[p.userId] || 0);
//         return (
//           <div key={p.userId} className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 aspect-video">
//             <VideoParticipant participant={p} showScore />

//             <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded-full font-bold shadow-lg z-10 animate-pulse">
//               {score}%
//             </div>

//             <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm z-20">
//               {p.name || p.userId} {p.isLocalParticipant && "(Bạn)"}
//             </div>
//           </div>
//         );
//       })}
//     </>
//   );
// }

// function BattleControls({ roomId }: { roomId: string }) {
//   const router = useRouter();
//   const call = useStreamVideoClient()?.call("default", roomId);
//   const [micOn, setMicOn] = useState(true);
//   const [camOn, setCamOn] = useState(true);

//   const handleEnd = async () => {
//     try {
//       await call?.leave();
//     } finally {
//       router.push('/rooms');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center gap-4 p-2">
//       <Button onClick={() => setMicOn(s => !s)} variant={micOn ? 'default' : 'destructive'} className="rounded-full p-3">
//         {micOn ? <Mic className="w-4 h-4"/> : <MicOff className="w-4 h-4"/>}
//       </Button>
//       <Button onClick={() => setCamOn(s => !s)} variant={camOn ? 'default' : 'destructive'} className="rounded-full p-3">
//         {camOn ? <Video className="w-4 h-4"/> : <VideoOff className="w-4 h-4"/>}
//       </Button>
//       <Button onClick={handleEnd} variant="destructive" className="rounded-full p-3">
//         <Phone className="w-4 h-4" />
//       </Button>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { 
  useStreamVideoClient, 
  StreamCall, 
  Call,
  useCallStateHooks, 
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import Loader from "./loader";
import { VideoParticipant } from "./video-participant";
import { Button } from "../ui/button";
import { 
  Mic, MicOff, Video, VideoOff, Phone, 
  Trophy, Users 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// --- CONTROLS ---
const BattleControls = ({ onLeave }: { onLeave: () => void }) => {
  const { useMicrophoneState, useCameraState } = useCallStateHooks();
  
  // FIX ERROR: Sửa tên biến 'optimisticIsMuted' thành 'optimisticIsMute'
  const { microphone, optimisticIsMute: isMicMuted } = useMicrophoneState();
  const { camera, optimisticIsMute: isCamMuted } = useCameraState();

  return (
    <div className="flex items-center gap-4 px-8 py-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl transition-all hover:bg-black/50">
      
      {/* MIC BUTTON */}
      <button
        onClick={() => microphone.toggle()}
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 border-2 shadow-lg group",
          isMicMuted 
            ? "bg-red-600 border-red-500 text-white hover:bg-red-700 hover:scale-105" // OFF: ĐỎ ĐẬM
            : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105" // ON: KÍNH
        )}
        title={isMicMuted ? "Bật Mic" : "Tắt Mic"}
      >
        {isMicMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      {/* CAMERA BUTTON */}
      <button
        onClick={() => camera.toggle()}
        className={cn(
          "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-200 border-2 shadow-lg group",
          isCamMuted
            ? "bg-red-600 border-red-500 text-white hover:bg-red-700 hover:scale-105" // OFF: ĐỎ ĐẬM
            : "bg-white/10 border-white/20 text-white hover:bg-white/20 hover:scale-105" // ON: KÍNH
        )}
        title={isCamMuted ? "Bật Camera" : "Tắt Camera"}
      >
        {isCamMuted ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
      </button>

      <div className="w-px h-10 bg-white/20 mx-2" />

      {/* LEAVE BUTTON */}
      <button 
        onClick={onLeave} 
        className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg border border-red-500/50 active:scale-95"
      >
        <Phone className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-lg">Thoát</span>
      </button>
    </div>
  );
};

const BattleGrid = ({ myScore, scores }: { myScore: number, scores: Record<string, number> }) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const uniqueParticipants = Array.from(new Map(participants.map(p => [p.userId, p])).values());

  if (uniqueParticipants.length === 0) return (
    <div className="flex flex-col items-center justify-center h-full text-white/30 gap-4">
      <Users className="w-16 h-16 opacity-30" />
      <p className="font-medium tracking-wide text-lg">Đang đợi đối thủ...</p>
    </div>
  );

  return (
    // FIX LAYOUT: Căn giữa Grid
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto h-full p-4 overflow-y-auto place-content-center">
      {uniqueParticipants.map((p) => (
        <div key={p.userId} className="aspect-video w-full transition-transform duration-500 ease-out hover:scale-[1.02]">
          <VideoParticipant 
            participant={p} 
            showScore={true}
            score={p.isLocalParticipant ? myScore : (scores[p.userId] || 0)}
          />
        </div>
      ))}
    </div>
  );
};

export default function BattleRoom({ roomId }: { roomId: string }) {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const router = useRouter();
  
  const [myScore, setMyScore] = useState(0);
  const [rivalScores, setRivalScores] = useState<Record<string, number>>({});
  const [roomName, setRoomName] = useState<string>("Đang kết nối...");

  useEffect(() => {
    if (!client) return;
    const myCall = client.call("default", roomId);
    myCall.join({ create: true }).then(async () => {
        const data = await myCall.get();
        setRoomName(data.call.custom?.title || `Phòng đấu #${roomId}`);
        setCall(myCall);
    }).catch(console.error);
    return () => {};
  }, [client, roomId]);

  useEffect(() => {
    if (!call) return;
    const interval = setInterval(async () => {
      const newScore = Math.floor(Math.random() * 40) + 60;
      setMyScore(newScore);
      await call.sendCustomEvent({ type: "score_update", data: { userId: call.currentUserId, score: newScore } });
    }, 3000);
    const handleEvent = (e: any) => {
      if (e.type === "score_update") setRivalScores(prev => ({ ...prev, [e.data.userId]: e.data.score }));
    };
    call.on("custom", handleEvent);
    return () => { clearInterval(interval); call.off("custom", handleEvent); };
  }, [call]);

  const handleLeave = async () => {
    await call?.leave();
    router.push('/rooms');
  };

  if (!call) return <Loader />;

  return (
    <StreamCall call={call}>
      <div className="flex h-screen w-full bg-[#050505] overflow-hidden relative font-sans text-slate-100 selection:bg-blue-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-xl pointer-events-none scale-105" />

        <div className="w-20 h-full flex flex-col items-center py-8 gap-8 z-10 border-r border-white/5 bg-white/5 backdrop-blur-xl">
           <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10 shadow-lg">
             <Trophy className="text-blue-400 w-6 h-6" />
           </div>
        </div>

        <div className="flex-1 flex flex-col p-6 z-10 relative overflow-hidden">
          <div className="h-20 flex items-center justify-between px-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] mb-6 shadow-2xl shrink-0">
             <div>
               <h1 className="text-white font-bold text-xl tracking-tight drop-shadow-lg">{roomName}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                 <span className="text-[10px] text-red-400 font-bold uppercase tracking-[0.2em]">Live Battle</span>
               </div>
             </div>
             <div className="flex items-center gap-3 bg-black/40 px-6 py-2.5 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
                <Trophy className="text-yellow-400 w-5 h-5 drop-shadow-md" />
                <span className="font-mono font-black text-2xl text-yellow-100">{myScore}</span>
             </div>
          </div>

          <div className="flex-1 rounded-[2.5rem] border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden relative shadow-inner flex flex-col justify-center">
             <BattleGrid myScore={myScore} scores={rivalScores} />
             
             {/* Controls nổi ở dưới */}
             <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 fade-in duration-500">
                <BattleControls onLeave={handleLeave} />
             </div>
          </div>
        </div>
      </div>
    </StreamCall>
  );
}