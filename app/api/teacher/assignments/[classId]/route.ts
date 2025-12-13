import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { classId: string } }
) {

  const { classId } = await context.params;
  console.log(classId, 'gg')
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
