import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {classId } = body;

  const assignments = await prisma.homework.findMany({
    where: {
      classId: classId,
   
    },
    include:{
        teacher:{
            include:{
                subject:true
            }
        }
    }
  });

  return NextResponse.json(assignments);
}

