import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {  
  const students = await prisma.student.findMany({
  
  });
return NextResponse.json(students);

}
