import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {  
  const allhwsub= await prisma.homeworkSubmission.findMany({
  
  });
return NextResponse.json(allhwsub);

}
