import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { teacherId } = body;

  const schedule = await prisma.teacherSchedule.findMany({
    where: {
      teacherId: teacherId,
    },
    orderBy: { day: "asc" },
  });

  return NextResponse.json(schedule);
}
