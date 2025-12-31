import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  const { clerkId } = await params;
  const students = await prisma.student.findUnique({
    where: { clerkId },
  });
  return NextResponse.json(students);
}
