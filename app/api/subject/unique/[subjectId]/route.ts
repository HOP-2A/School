import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest, context: { params: { subjectId: string } }) {  
 
  const { subjectId } = await context.params;
  const theSubject =await  prisma.subject.findFirst({
    where:{
     id: subjectId,
     
    } , include: {
      teacher: true,
   
    },

  })
return NextResponse.json(theSubject);

}
