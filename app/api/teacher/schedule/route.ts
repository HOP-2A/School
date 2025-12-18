import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const date = new Date(body.dueDate);
  const schedule = await prisma.homework.findMany({
    where: {
      dueDate: date,
    },
  });

  return NextResponse.json(schedule);
}
