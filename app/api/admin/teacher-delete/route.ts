import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { teacherId, classId } = body;

  if (!teacherId || !classId) {
    return NextResponse.json(
      { error: "Missing teacherId or classId" },
      { status: 400 }
    );
  }

  await prisma.teacherClass.deleteMany({
    where: {
      teacherId: teacherId,
      classId: classId,
    },
  });

  return NextResponse.json(
    { message: "Deleted successfully" },
    { status: 200 }
  );
}
