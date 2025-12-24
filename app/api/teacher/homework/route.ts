import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { grade, feedback, submissionId } = body;

  if (!submissionId && !grade && !feedback) {
    return NextResponse.json(
      { message: "Missing submission ID" },
      { status: 400 }
    );
  }

  const updated = await prisma.homeworkSubmission.update({
    where: { id: submissionId },
    data: {
      score: Number(grade),
      feedback: feedback,
      status: "CHECKED",
    },
  });

  return NextResponse.json(updated, { status: 200 });
}
