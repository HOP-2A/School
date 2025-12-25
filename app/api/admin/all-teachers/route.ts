import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const teachersData = await prisma.teacher.findMany({});

  return NextResponse.json(teachersData);
}
