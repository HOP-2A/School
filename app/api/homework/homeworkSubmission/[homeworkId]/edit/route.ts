import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ homeworkId: string }> }

) {
  const { homeworkId } = await params;
  const body = await req.json();

  const editSubmission = await prisma.homeworkSubmission.update({
    where: {
      studentId_homeworkId: {
        studentId: body.studentId,
        homeworkId: homeworkId,
      },
    },
    data: {
      description: body.description,
      content: body.content[0] || null,
    },
  });

  return NextResponse.json({ status: 200, editSubmission });
}
