import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { classGiven, teacherId } = body;

  await prisma.class.create({
    data: {
   
      name: classGiven,
      teacherId: teacherId,
    },
  });

  return NextResponse.json("Success", { status: 200 });
}
