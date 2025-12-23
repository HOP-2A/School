import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {  
    const body = await req.json()
  const createNewSchedule = await prisma.teacherSchedule.create({
  data:{
endTime:body.endTime,
startTime:body.startTime,
teacherId:body.teacherId,
day:body.day

  }
  });
return NextResponse.json(createNewSchedule);

}
