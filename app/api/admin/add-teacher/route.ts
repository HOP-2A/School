import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { classId, teacherId } = body;
const existed  = await prisma.teacherClass.findFirst({
  where:{
    teacherId : teacherId,
    classId: classId,
  }
 
})
if(existed){
  return NextResponse.json("Can't add teacher", { status: 400 });
}else { await prisma.teacherClass.create({
  data: {
    classId: classId,
    teacherId: teacherId,
  },
});

return NextResponse.json("Success", { status: 200 });
}
}
