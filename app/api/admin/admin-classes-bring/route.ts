import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const classes = await prisma.class.findMany({
      include: { teacher: true, students: true },
    });
    return NextResponse.json(classes);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { classId } = body;

  try {
    const data = await prisma.class.findFirst({
      where: {
        id: classId,
      },

      include: {
        teacher: true,
        students: true,
      },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch individual class info" },
      { status: 500 }
    );
  }
}
