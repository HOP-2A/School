import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ classId: string }> }

) {
  const { classId } = await params;

  if (!classId) return NextResponse.json("ClassId obso", { status: 500 });

  await prisma.teacherClass.deleteMany({
    where: {
      classId: classId,
    },
  });

  await prisma.homework.deleteMany({
    where: {
      classId: classId,
    },
  });

  await prisma.class.delete({
    where: {
      id: classId,
    },
  });

  return NextResponse.json("success", { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId } = await params;

  if (!classId) return NextResponse.json("ClassId obso", { status: 500 });

  await prisma.student.updateMany({
    where: {
      classId: classId,
    },
    data: {
      classId: null,
    },
  });

  return NextResponse.json("success", { status: 200 });
}
