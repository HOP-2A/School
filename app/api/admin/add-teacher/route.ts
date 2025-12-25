import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { classId, teacherId } = body;

  await prisma.teacherClass.create({
    data: {
      classId: classId,
      teacherId: teacherId,
    },
  });

  return NextResponse.json("Success", { status: 200 });
}
