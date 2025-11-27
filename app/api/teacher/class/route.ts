import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

type DecodedTokenType = {
  data: {
    id: string;
    name: string;
    teacherId: string;
    password: string;
    email: string;
    classes: string[];
    subject: {
      id: string;
      subjectNmae: string;
    };
  };
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { teacherId } = body;

  if (!teacherId) {
    throw new Error("TeacgerId baihgu");
  }

  const classess = await prisma.teacher.findUnique({
    where: {
      id: teacherId,
    },

    include: {
      classes: {
        include: {
          students: true,
        },
      },
      subject: true,
    },
  });

  return NextResponse.json(classess);
}
