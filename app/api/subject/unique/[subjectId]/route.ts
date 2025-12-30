import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest, context: any) {
  const { subjectId } = await context.params;

  const theSubject = await prisma.subject.findFirst({
    where: { id: subjectId },
    include: { teacher: true },
  });

  return NextResponse.json(theSubject);
}
