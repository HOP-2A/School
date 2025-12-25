import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {  
    const body = await req.json()
  const oneSub= await prisma.homeworkSubmission.findFirst({
  where:{ homeworkId:body.homeworkId
  }
  });
return NextResponse.json(oneSub);

}
