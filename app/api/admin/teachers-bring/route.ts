import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { classId } = body;

  const teachersData = await prisma.teacherClass.findMany({
    where: {
      classId: classId,
    },

    include: {
      Teacher: {
        include: {
          subject: true,
        },
      },
    },
  });

  return NextResponse.json(teachersData);
}
