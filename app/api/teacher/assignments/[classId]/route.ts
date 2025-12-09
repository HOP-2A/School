import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { classId: string } }
) {
  const params = await context.params;
  const classId = params.classId;
  const body = await req.json();

  const { title, description, dueDate, teacherId } = body;

  const createdHomework = await prisma.homework.create({
    data: {
      title: title,
      description: description,
      dueDate: new Date(dueDate),
      classId: classId,
      teacherId: teacherId,
    },
  });

  return NextResponse.json(createdHomework);
}
