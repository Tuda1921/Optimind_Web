
// "use client";

// import { useState, useEffect, FC } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
// import { Users, Lock, LogIn, Plus } from "lucide-react";

// // --- Định nghĩa Types ---
// export interface Room {
// 	id: string;
// 	name: string;
// 	hostId: string;
// 	hostName?: string;
// 	maxMembers: number;
// 	members?: any[];
// 	isPrivate: boolean;
// 	createdAt: string;
// }

// export type RoomType = Room;

// // --- Component Chính ---
// const StudyRoomPage: FC = () => {
// 	const router = useRouter();
// 	const [rooms, setRooms] = useState<Room[]>([]);
// 	const [loading, setLoading] = useState(true);
// 	const [isCreatingRoom, setIsCreatingRoom] = useState(false);
// 	const [newRoomName, setNewRoomName] = useState("");
// 	const [newRoomType, setNewRoomType] = useState<"STUDY" | "BATTLE">("STUDY");
// 	const [newRoomMax, setNewRoomMax] = useState(4);
// 	const [newRoomPassword, setNewRoomPassword] = useState("");
// 	const [joinRoomId, setJoinRoomId] = useState<string | null>(null);
// 	const [joinPassword, setJoinPassword] = useState("");

// 	useEffect(() => {
// 		fetchRooms();
// 	}, []);

// 	const fetchRooms = async () => {
// 		try {
// 			setLoading(true);
// 			const res = await fetch("/api/rooms");
// 			if (res.ok) {
// 				const data = await res.json();
// 				setRooms(data.rooms);
// 			}
// 		} catch (error) {
// 			console.error("Failed to fetch rooms:", error);
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleCreateRoom = async () => {
// 		if (!newRoomName.trim()) {
// 			alert("Vui lòng nhập tên phòng");
// 			return;
// 		}
// 		try {
// 			const res = await fetch("/api/rooms", {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({
// 					name: newRoomName,
// 					type: newRoomType,
// 					maxMembers: newRoomMax,
// 					password: newRoomPassword || undefined,
// 				}),
// 			});

// 			if (res.ok) {
// 				const data = await res.json();
// 				if (data.room) {
// 					setRooms([...rooms, data.room]);
// 					setNewRoomName("");
// 					setNewRoomType("STUDY");
// 					setNewRoomMax(4);
// 					setNewRoomPassword("");
// 					setIsCreatingRoom(false);
// 					alert("Phòng tạo thành công!");
// 					router.push(`/rooms/room/${data.room.id}`);
// 				}
// 			} else {
// 				const error = await res.json();
// 				alert(`Lỗi: ${error.error}`);
// 				console.error("Create room error:", error);
// 			}
// 		} catch (error) {
// 			console.error("Failed to create room:", error);
// 			alert("Không thể tạo phòng");
// 		}
// 	};

// 	const handleJoinRoom = async (roomId: string) => {
// 		try {
// 			const res = await fetch(`/api/rooms/${roomId}/join`, {
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({
// 					password: joinPassword || undefined,
// 				}),
// 			});

// 			const data = await res.json();

// 			if (res.ok || data.success) {
// 				alert("Đã tham gia phòng thành công!");
// 				setJoinRoomId(null);
// 				setJoinPassword("");
// 				// Redirect to room detail page
// 				router.push(`/rooms/room/${roomId}`);
// 			} else {
// 				alert(`Lỗi: ${data.error}`);
// 				console.error("Join room error:", data);
// 			}
// 		} catch (error) {
// 			console.error("Failed to join room:", error);
// 			alert("Không thể tham gia phòng");
// 		}
// 	};

// 	const glassEffect = "bg-black/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg";

// 	return (
// 		<TooltipProvider>
// 			<main className="h-screen w-screen text-white p-6 transition-all duration-500">
// 				<div className="max-w-6xl mx-auto space-y-6">
// 					{/* Header */}
// 					<div className="flex items-center justify-between">
// 						<div>
// 							<h1 className="text-3xl font-bold">Phòng Học</h1>
// 							<p className="text-muted-foreground">Học tập cùng mọi người</p>
// 						</div>
// 						<Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
// 							<DialogTrigger asChild>
// 								<Button className="gap-2">
// 									<Plus className="w-4 h-4" /> Tạo Phòng Mới
// 								</Button>
// 							</DialogTrigger>
// 							<DialogContent className={glassEffect}>
// 								<DialogHeader>
// 									<DialogTitle>Tạo Phòng Học Mới</DialogTitle>
// 								</DialogHeader>
// 								<div className="space-y-4">
// 									<div>
// 										<Label>Tên Phòng</Label>
// 										<Input
// 											value={newRoomName}
// 											onChange={(e) => setNewRoomName(e.target.value)}
// 											placeholder="Nhập tên phòng"
// 										/>
// 									</div>
// 									<div>
// 										<Label>Loại Phòng</Label>
// 										<select
// 											value={newRoomType}
// 											onChange={(e) => setNewRoomType(e.target.value as "STUDY" | "BATTLE")}
// 											className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
// 										>
// 											<option value="STUDY" className="bg-gray-900">Phòng Học Tập</option>
// 											<option value="BATTLE" className="bg-gray-900">Phòng Thi Đấu</option>
// 										</select>
// 									</div>
// 									<div>
// 										<Label>Số Thành Viên Tối Đa</Label>
// 										<Input
// 											type="number"
// 											min="2"
// 											max="10"
// 											value={newRoomMax}
// 											onChange={(e) => setNewRoomMax(parseInt(e.target.value))}
// 										/>
// 									</div>
// 									<div>
// 										<Label>Mật Khẩu (Tùy Chọn)</Label>
// 										<Input
// 											type="password"
// 											value={newRoomPassword}
// 											onChange={(e) => setNewRoomPassword(e.target.value)}
// 											placeholder="Để trống nếu không cần"
// 										/>
// 									</div>
// 									<Button onClick={handleCreateRoom} className="w-full">
// 										Tạo Phòng
// 									</Button>
// 								</div>
// 							</DialogContent>
// 						</Dialog>
// 					</div>

// 					{/* Rooms Grid */}
// 					{loading ? (
// 						<div className="text-center">Loading...</div>
// 					) : rooms.length === 0 ? (
// 						<Card className={glassEffect}>
// 							<CardContent className="py-12 text-center">
// 								<Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
// 								<p className="text-muted-foreground">Chưa có phòng. Hãy tạo một phòng mới!</p>
// 							</CardContent>
// 						</Card>
// 					) : (
// 						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// 							{rooms.map((room) => (
// 								<Card key={room.id} className={cn(glassEffect, "hover:shadow-lg transition")}>
// 									<CardHeader>
// 										<div className="flex items-start justify-between">
// 											<CardTitle className="text-lg">{room.name}</CardTitle>
// 											{room.isPrivate && <Lock className="w-4 h-4" />}
// 										</div>
// 									</CardHeader>
// 									<CardContent className="space-y-4">
// 										<div className="space-y-2">
// 											<p className="text-sm text-muted-foreground">
// 												<Users className="w-4 h-4 inline mr-2" />
// 												{room.members?.length || 0} / {room.maxMembers} thành viên
// 											</p>
// 											<p className="text-sm text-muted-foreground">
// 												Chủ phòng: {room.hostName || "Unknown"}
// 											</p>
// 										</div>

// 										<Dialog open={joinRoomId === room.id} onOpenChange={(open) => {
// 											if (!open) setJoinRoomId(null);
// 										}}>
// 											<DialogTrigger asChild>
// 												<Button
// 													onClick={() => setJoinRoomId(room.id)}
// 													disabled={(room.members?.length || 0) >= room.maxMembers}
// 													className="w-full gap-2"
// 												>
// 													<LogIn className="w-4 h-4" /> Tham Gia
// 												</Button>
// 											</DialogTrigger>
// 											<DialogContent className={glassEffect}>
// 												<DialogHeader>
// 													<DialogTitle>Tham Gia Phòng: {room.name}</DialogTitle>
// 												</DialogHeader>
// 												{room.isPrivate && (
// 													<div>
// 														<Label>Mật Khẩu</Label>
// 														<Input
// 															type="password"
// 															value={joinPassword}
// 															onChange={(e) => setJoinPassword(e.target.value)}
// 															placeholder="Nhập mật khẩu"
// 														/>
// 													</div>
// 												)}
// 												<Button
// 													onClick={() => handleJoinRoom(room.id)}
// 													className="w-full"
// 												>
// 													Tham Gia
// 												</Button>
// 											</DialogContent>
// 										</Dialog>
// 									</CardContent>
// 								</Card>
// 							))}
// 						</div>
// 					)}
// 				</div>
// 			</main>
// 		</TooltipProvider>
// 	);
// };

// export default StudyRoomPage;


// Tên file: app/(api)/rooms/page.tsx
"use client";

import { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Users, Lock, LogIn, Plus, Unlock } from "lucide-react";

// --- Định nghĩa Types ---
export interface Room {
	id: string;
	name: string;
	hostId?: string;
	hostName?: string;
	maxMembers: number;
	members?: any[];
	isPrivate: boolean; // Field này giờ sẽ luôn đúng từ API
	createdAt: string;
    _count?: { members: number };
}

// --- Component Chính ---
const StudyRoomPage: FC = () => {
	const router = useRouter();
	const [rooms, setRooms] = useState<Room[]>([]);
	const [loading, setLoading] = useState(true);
	const [isCreatingRoom, setIsCreatingRoom] = useState(false);
	
    // State tạo phòng
	const [newRoomName, setNewRoomName] = useState("");
	const [newRoomType, setNewRoomType] = useState<"STUDY" | "BATTLE">("STUDY");
	const [newRoomMax, setNewRoomMax] = useState(4);
	const [newRoomPassword, setNewRoomPassword] = useState("");
	
    // State tham gia phòng
	const [joinRoomId, setJoinRoomId] = useState<string | null>(null);
	const [joinPassword, setJoinPassword] = useState("");

	useEffect(() => {
		fetchRooms();
	}, []);

	const fetchRooms = async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/rooms", { cache: "no-store" });
			if (res.ok) {
				const data = await res.json();
				setRooms(data.rooms);
			}
		} catch (error) {
			console.error("Failed to fetch rooms:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateRoom = async () => {
		if (!newRoomName.trim()) {
			alert("Vui lòng nhập tên phòng");
			return;
		}
		try {
			const res = await fetch("/api/rooms", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: newRoomName,
					type: newRoomType,
					maxMembers: newRoomMax,
					password: newRoomPassword || undefined,
				}),
			});

			if (res.ok) {
				const data = await res.json();
				if (data.room) {
					setRooms([data.room, ...rooms]); // Thêm vào đầu danh sách
					setNewRoomName("");
					setNewRoomType("STUDY");
					setNewRoomMax(4);
					setNewRoomPassword("");
					setIsCreatingRoom(false);
					router.push(`/rooms/room/${data.room.id}`);
				}
			} else {
				const error = await res.json();
				alert(`Lỗi: ${error.error}`);
			}
		} catch (error) {
			console.error("Failed to create room:", error);
			alert("Không thể tạo phòng");
		}
	};

	const handleJoinRoom = async (roomId: string) => {
		try {
			const res = await fetch(`/api/rooms/${roomId}/join`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					password: joinPassword,
				}),
			});

			const data = await res.json();

			if (res.ok || data.success) {
				setJoinRoomId(null);
				setJoinPassword("");
				router.push(`/rooms/room/${roomId}`);
			} else {
				alert(`Lỗi: ${data.error}`);
			}
		} catch (error) {
			console.error("Failed to join room:", error);
			alert("Không thể tham gia phòng");
		}
	};

	const glassEffect = "bg-black/30 backdrop-blur-md border border-white/20 rounded-xl shadow-lg";

	return (
		<TooltipProvider>
			<main className="h-screen w-screen text-white p-6 transition-all duration-500">
				<div className="max-w-6xl mx-auto space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between">
						<div>
							<h1 className="text-3xl font-bold">Phòng Học</h1>
							<p className="text-muted-foreground">Học tập cùng mọi người</p>
						</div>
						<Dialog open={isCreatingRoom} onOpenChange={setIsCreatingRoom}>
							<DialogTrigger asChild>
								<Button className="gap-2">
									<Plus className="w-4 h-4" /> Tạo Phòng Mới
								</Button>
							</DialogTrigger>
							<DialogContent className={glassEffect}>
								<DialogHeader>
									<DialogTitle>Tạo Phòng Học Mới</DialogTitle>
								</DialogHeader>
								<div className="space-y-4">
									<div>
										<Label>Tên Phòng</Label>
										<Input
											value={newRoomName}
											onChange={(e) => setNewRoomName(e.target.value)}
											placeholder="Nhập tên phòng"
										/>
									</div>
									<div>
										<Label>Loại Phòng</Label>
										<select
											value={newRoomType}
											onChange={(e) => setNewRoomType(e.target.value as "STUDY" | "BATTLE")}
											className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
										>
											<option value="STUDY" className="bg-gray-900">Phòng Học Tập</option>
											<option value="BATTLE" className="bg-gray-900">Phòng Thi Đấu</option>
										</select>
									</div>
									<div>
										<Label>Số Thành Viên Tối Đa</Label>
										<Input
											type="number"
											min="2"
											max="10"
											value={newRoomMax || ""} 
											onChange={(e) => {
												const val = parseInt(e.target.value);
												setNewRoomMax(isNaN(val) ? 0 : val);
											}}
										/>
									</div>
									<div>
										<Label>Mật Khẩu (Tùy Chọn)</Label>
										<Input
											type="password"
											value={newRoomPassword}
											onChange={(e) => setNewRoomPassword(e.target.value)}
											placeholder="Để trống nếu không cần"
										/>
									</div>
									<Button onClick={handleCreateRoom} className="w-full">
										Tạo Phòng
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>

					{/* Rooms Grid */}
					{loading ? (
						<div className="text-center">Loading...</div>
					) : rooms.length === 0 ? (
						<Card className={glassEffect}>
							<CardContent className="py-12 text-center">
								<Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
								<p className="text-muted-foreground">Chưa có phòng. Hãy tạo một phòng mới!</p>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{rooms.map((room) => (
								<Card key={room.id} className={cn(glassEffect, "hover:shadow-lg transition relative overflow-hidden")}>
                                     {/* Badge Private/Public */}
                                    <div className="absolute top-2 right-2">
                                        {room.isPrivate ? (
                                            <Badge variant="destructive" className="gap-1 bg-red-500/80"><Lock className="w-3 h-3" /> Riêng tư</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 gap-1"><Unlock className="w-3 h-3" /> Công khai</Badge>
                                        )}
                                    </div>

									<CardHeader>
										<div className="flex items-start justify-between pr-20">
											<CardTitle className="text-lg truncate" title={room.name}>{room.name}</CardTitle>
										</div>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="space-y-2">
											<p className="text-sm text-muted-foreground flex items-center">
												<Users className="w-4 h-4 mr-2" />
												{/* Xử lý hiển thị số lượng thành viên an toàn */}
												{room._count?.members ?? room.members?.length ?? 0} / {room.maxMembers} thành viên
											</p>
											<p className="text-sm text-muted-foreground">
												Chủ phòng: {room.hostName || "Unknown"}
											</p>
										</div>

										<Dialog open={joinRoomId === room.id} onOpenChange={(open) => {
											if (!open) {
                                                setJoinRoomId(null);
                                                setJoinPassword(""); // Reset password khi đóng
                                            }
										}}>
											<DialogTrigger asChild>
												<Button
													onClick={() => setJoinRoomId(room.id)}
													disabled={(room._count?.members ?? 0) >= room.maxMembers}
													className="w-full gap-2"
                                                    variant={room.isPrivate ? "outline" : "default"}
												>
													<LogIn className="w-4 h-4" /> {room.isPrivate ? "Nhập mật khẩu để vào" : "Tham Gia Ngay"}
												</Button>
											</DialogTrigger>
											<DialogContent className={glassEffect}>
												<DialogHeader>
													<DialogTitle>Tham Gia Phòng: {room.name}</DialogTitle>
												</DialogHeader>
												
                                                <div className="py-4">
                                                    {room.isPrivate ? (
                                                        <div className="space-y-3">
                                                            <Label>Phòng này yêu cầu mật khẩu</Label>
                                                            <Input
                                                                type="password"
                                                                value={joinPassword}
                                                                onChange={(e) => setJoinPassword(e.target.value)}
                                                                placeholder="Nhập mật khẩu phòng..."
                                                                autoFocus
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p>Bạn có chắc chắn muốn tham gia phòng này?</p>
                                                    )}
                                                </div>

												<Button
													onClick={() => handleJoinRoom(room.id)}
													className="w-full"
												>
													Xác Nhận Tham Gia
												</Button>
											</DialogContent>
										</Dialog>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</main>
		</TooltipProvider>
	);
};

export default StudyRoomPage;