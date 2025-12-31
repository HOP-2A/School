import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId } = await params;
  const body = await req.json();
  const { title, description, dueDate, teacherId } = body;
  const dueDateObj = new Date(dueDate);

  const createdHomework = await prisma.homework.create({
    data: {
      title,
      description,
      dueDate: dueDateObj,
      classId,
      teacherId,
    },
  });

  return NextResponse.json(createdHomework);
}
