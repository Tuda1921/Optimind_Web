import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/utils/auth-server";

// POST /api/rooms/[id]/join - Join room
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;
    const body = await req.json();
    const { password } = body;

    console.log("Join room attempt:", { roomId, userId: user.id });

    // Check if room exists
    const room = await prisma.room.findUnique({
      where: { id: roomId },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    if (!room) {
      console.warn("Room not found:", roomId);
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    console.log("Room found:", { id: room.id, isActive: room.isActive, memberCount: room._count.members, maxMembers: room.maxMembers });

    if (!room.isActive) {
      console.warn("Room not active:", roomId);
      return NextResponse.json({ error: "Room is not active" }, { status: 400 });
    }

    if (room._count.members >= room.maxMembers) {
      console.warn("Room is full:", { roomId, members: room._count.members, max: room.maxMembers });
      return NextResponse.json({ error: "Room is full" }, { status: 400 });
    }

    if (room.password && room.password !== password) {
      console.warn("Invalid password for room:", roomId);
      return NextResponse.json({ error: "Invalid password" }, { status: 403 });
    }

    // Check if already a member
    const existing = await prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId: user.id,
        },
      },
    });

    if (existing) {
      console.log("User already a member:", { roomId, userId: user.id });
      return NextResponse.json({ error: "Already a member of this room", success: true }, { status: 200 });
    }

    console.log("Creating room member:", { roomId, userId: user.id });

    // Join room
    const member = await prisma.roomMember.create({
      data: {
        roomId,
        userId: user.id,
      },
      include: {
        user: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    console.log("Successfully joined room:", { roomId, userId: user.id });

    return NextResponse.json({ member, success: true });
  } catch (e: any) {
    console.error("Join room error:", e);
    return NextResponse.json(
      { error: "Failed to join room - " + e.message },
      { status: 500 }
    );
  }
}
