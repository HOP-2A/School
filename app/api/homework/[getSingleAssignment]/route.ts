import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { getSingleAssignment: string } }
) {
  const { getSingleAssignment } = await context.params;

  const assignment = await prisma.homework.findFirst({
    where: { id: getSingleAssignment},
  });
  return NextResponse.json(assignment);
}
