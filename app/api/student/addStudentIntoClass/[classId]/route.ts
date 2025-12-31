import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
const body = await req.json()
  const { classId } = await params;

  const { id } = body;

  const updated = await prisma.student.update({
    where: { id },
    data: { classId },
  });

  return NextResponse.json(updated);
}
