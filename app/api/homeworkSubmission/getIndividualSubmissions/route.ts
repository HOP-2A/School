import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {  
    const body = await req.json()
  const allhwsub= await prisma.homeworkSubmission.findMany({
  where:{ studentId:body.studentId
  }
  });
return NextResponse.json(allhwsub);

}
