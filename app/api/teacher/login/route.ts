import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, email } = body;
  const user = await prisma.teacher.findFirst({
    where: {
      email: email,
    },
    select: {
      id: true,
      email: true,
      password: true,
    },
  });

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  if (user) {
    const existing = await compare(password, user.password);

    if (existing) {
      const accessToken = jwt.sign(
        {
          data: user,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "2h" }
      );
      return NextResponse.json({ accessToken }, { status: 200 });
    } else
      return NextResponse.json({ message: "wrong password" }, { status: 400 });
  } else return NextResponse.json("please register");
}
