import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ getSingleAssignment: string }> }
) {
  const { getSingleAssignment } = await params;

  const assignment = await prisma.homework.findFirst({
    where: { id: getSingleAssignment},
  });
  return NextResponse.json(assignment);
}
