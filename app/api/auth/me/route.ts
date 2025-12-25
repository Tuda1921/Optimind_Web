import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const userCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("user_data="));

  if (!userCookie) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const value = decodeURIComponent(userCookie.split("=")[1]);
    const userData = JSON.parse(value);

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { id: userData.id },
    });

    if (!user) {
      // Create user if not exists
      user = await prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email || "unknown@example.com",
          name: userData.name || "Unknown User",
          username: userData.username || userData.name || "unknown",
          passwordHash: "dummy", // Since authenticated via cookie
          level: 1,
          experience: 0,
          exp: 0,
          coins: 100, // Give some coins
        },
      });

      // Create default pet
      await prisma.pet.create({
        data: {
          userId: user.id,
          name: "My Pet",
          type: "cat",
          hunger: 50,
          happiness: 50,
          energy: 50,
        },
      });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
