import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId } = await params;
  const body = await req.json();

  const { title, description, dueDate, teacherId, points } = body;

  const dueDateObj = new Date(dueDate);


  const parsedPoints =
    points === undefined || points === null || points === ""
      ? null
      : Number(points);

  if (parsedPoints !== null && Number.isNaN(parsedPoints)) {
    return NextResponse.json(
      { error: "Invalid points value" },
      { status: 400 }
    );
  }

  const createdHomework = await prisma.homework.create({
    data: {
      title,
      description,
      dueDate: dueDateObj,
      classId,
      teacherId,
      content: body.content?.[0] ?? "",
      points: parsedPoints, 
    },
  });

  return NextResponse.json(createdHomework);
}
