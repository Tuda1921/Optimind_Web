

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
// (Import các UI component khác nếu cần)

export default function RoomSetup() {
  const router = useRouter();
  const [name, setName] = useState("");
  // Thêm state cho Type
  const [type, setType] = useState<"STUDY" | "BATTLE">("STUDY");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        body: JSON.stringify({ name, type }), // Gửi type lên API
      });
      const data = await res.json();
      router.push(`/rooms/room/${data.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-bold">Tạo Phòng Mới</h2>
      
      <div className="space-y-2">
        <Label>Tên phòng</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên..." />
      </div>

      <div className="space-y-2">
        <Label>Chế độ</Label>
        <div className="flex gap-4">
          <button
            onClick={() => setType("STUDY")}
            className={`flex-1 p-3 border rounded ${type === "STUDY" ? "bg-blue-100 border-blue-500" : ""}`}
          >
            📚 Tự học
          </button>
          <button
            onClick={() => setType("BATTLE")}
            className={`flex-1 p-3 border rounded ${type === "BATTLE" ? "bg-red-100 border-red-500" : ""}`}
          >
            ⚔️ Thi đấu
          </button>
        </div>
      </div>

      <Button onClick={handleCreate} disabled={!name || isLoading} className="w-full">
        {isLoading ? "Đang tạo..." : "Bắt đầu ngay"}
      </Button>
    </Card>
  );
}