import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { homeworkId: string } }
) {
  const body = await req.json()
  const { homeworkId} = await context.params;

  const createHomeworkSubmission = await prisma.homeworkSubmission.create({
  data:{
    homeworkId,
    studentId : body.studentId,
    content : body.content,


  }

  });
  return NextResponse.json(createHomeworkSubmission);
}
