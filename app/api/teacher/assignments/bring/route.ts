import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { teacherId, classId } = body;

  const assignments = await prisma.homework.findMany({
    where: {
      classId: classId,
      teacherId: teacherId,
    },
  });

  return NextResponse.json(assignments);
}
