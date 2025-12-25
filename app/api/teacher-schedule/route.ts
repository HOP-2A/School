import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {  
    const body = await req.json()
    const existed = await prisma.teacherSchedule.findFirst({
      where:{
        endTime:body.endTime,
        startTime:body.startTime,
        day:body.day,
        teacherId:body.teacherId
      }

    })
    if(!existed){
      const createNewSchedule = await prisma.teacherSchedule.create({
        data:{
      endTime:body.endTime,
      startTime:body.startTime,
      teacherId:body.teacherId,
      day:body.day,
      classId:body.classId
      
        }
        });
        return NextResponse.json(createNewSchedule, {status:200});
    }
else return NextResponse.json("time's are coin",{status:404});
    

}
