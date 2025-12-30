import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { homeworkId: string } }
) {
  const { homeworkId } = await context.params;
  const body = await req.json();

  const submission = await prisma.homeworkSubmission.create({
    data: {
      homeworkId,
      studentId: body.studentId,
      description: body.description,
      content: body.content[0] || "",
    },
  });
  return NextResponse.json({ status: 200, submission });
}

export async function GET(
  req: Request,
  context: { params: Promise<{ homeworkId: string }> }
) {
  const { homeworkId } = await context.params;

  const submissions = await prisma.homeworkSubmission.findMany({
    where: { homeworkId },
  });

  return NextResponse.json({ status: 200, submissions });
}
