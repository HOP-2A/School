import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {  
  const classes = await prisma.class.findMany({
  
  });
return NextResponse.json(classes);

}
