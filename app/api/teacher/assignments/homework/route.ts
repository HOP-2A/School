import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { homeworkId } = body;

  const submission = await prisma.homeworkSubmission.findMany({
    where: {
      homeworkId: homeworkId,
    },

    include: {
      homework: true,
      student: {
        include: {
          class: {
            include: {
              students: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json(submission);
}
