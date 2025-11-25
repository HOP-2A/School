import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
export const POST = async (req: Request, res: Response) => {
  const body = await req.json();
  const user = await prisma.teacher.findFirst({
    where: {
      email: body.email
    },
    select: {
      id: true,
      email: true,
      password: true,
    }
  });
  
  console.log(process.env.JWT_SECRET)
  if (user) {
    const existing = await compare(body.password, user.password);

    if (existing) {
      const accessToken = jwt.sign(
        {
          data: user,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "2h" }
      )  ;
     return NextResponse.json({accessToken}, { status: 200})
;
    } else   return NextResponse.json({ message: "wrong password" }, { status: 400 });
  } else   return NextResponse.json("please register");
  };