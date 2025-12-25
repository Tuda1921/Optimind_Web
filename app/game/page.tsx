"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Coins, Play } from "lucide-react";

export default function GamePage() {
  const [gamePlays, setGamePlays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkGameAccess();
  }, []);

  const checkGameAccess = async () => {
    try {
      const inventoryRes = await fetch("/api/gamification/inventory");
      if (inventoryRes.ok) {
        const invData = await inventoryRes.json();
        const totalGamePlays = invData.inventory
          .filter((item: any) => item.item.type === 'game_play')
          .reduce((sum: number, item: any) => sum + item.quantity, 0);
        setGamePlays(totalGamePlays);
      }
    } catch (error) {
      console.error("Failed to check game access:", error);
    } finally {
      setLoading(false);
    }
  };

  const startGame = async () => {
    try {
      // Tìm game play item để consume
      const inventoryRes = await fetch("/api/gamification/inventory");
      if (inventoryRes.ok) {
        const invData = await inventoryRes.json();
        const gamePlayItem = invData.inventory.find((item: any) =>
          item.item.type === 'game_play' && item.quantity > 0
        );

        if (gamePlayItem) {
          // Consume 1 game play
          const consumeRes = await fetch("/api/gamification/consume-game-play", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ itemId: gamePlayItem.itemId }),
          });

          if (consumeRes.ok) {
            setGamePlays(prev => prev - 1);
            setGameStarted(true);
          } else {
            alert("Không thể bắt đầu game. Vui lòng thử lại.");
          }
        }
      }
    } catch (error) {
      console.error("Failed to start game:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (gamePlays <= 0 && !gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Gamepad2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle>Không đủ lượt chơi game</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Bạn cần mua lượt chơi game từ cửa hàng để có thể chơi.
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Coins className="w-4 h-4 mr-2" />
              Lượt chơi hiện tại: {gamePlays}
            </Badge>
            <div className="space-y-2">
              <Button onClick={() => router.push('/gamification')} className="w-full">
                Đi đến cửa hàng
              </Button>
              <Button variant="outline" onClick={() => router.back()} className="w-full">
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Gamepad2 className="mx-auto h-16 w-16 text-primary mb-4" />
            <CardTitle>Sẵn sàng chơi game!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Mỗi lần chơi sẽ tiêu tốn 1 lượt chơi game.
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Coins className="w-4 h-4 mr-2" />
              Lượt chơi còn lại: {gamePlays}
            </Badge>
            <div className="space-y-2">
              <Button onClick={startGame} className="w-full" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Bắt đầu chơi
              </Button>
              <Button variant="outline" onClick={() => router.push('/gamification')} className="w-full">
                Quay lại cửa hàng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Game UI */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-background/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Gamepad2 className="w-4 h-4 mr-1" />
                Lượt chơi còn lại: {gamePlays}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push('/gamification')}
              >
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unity Game */}
      <iframe
        src="/unity-game/index.html"
        className="w-full h-screen border-0"
        title="Unity Game"
        allowFullScreen
      />
    </div>
  );
}