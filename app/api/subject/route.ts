import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {  
  const subjects = await prisma.subject.findMany({
  
  });
return NextResponse.json(subjects);

}
