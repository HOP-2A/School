import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { clerkId: string } }
) {
  const { clerkId } = await context.params;
  const students = await prisma.student.findUnique({
    where: { clerkId },
  });
  return NextResponse.json(students);
}
