import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { teacherId } = body;

  if (!teacherId) {
    throw new Error("TeacgerId baihgu");
  }

  const teacher = await prisma.teacher.findUnique({
    where: {
      clerkId: teacherId,
    },

    include: {
      teacherClasses: {
        include: {
          Class: {
            include: {
              students: true,
            },
          },
        },
      },
    },
  });

  const subject = await prisma.subject.findFirst({
    where: {
      teacherId: teacher?.id,
    },
  });

  return NextResponse.json({ teacher: teacher, subject: subject });
}
