import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }

) {
  const { studentId } = await params;

  if (!studentId) return NextResponse.json("StudentId obso", { status: 500 });

  await prisma.student.update({
    where: {
      id: studentId,
    },
    data: {
      classId: null,
    },
  });

  return NextResponse.json("OK OK", { status: 200 });
}
