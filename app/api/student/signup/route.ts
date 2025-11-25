import { prisma } from "@/lib/db";
import bcrypt, { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstname, email, password, personalId } = body;
  const HashedPassword = await hash(password, 7);
  const secret = process.env.JWT_SECRET;

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const existing = await prisma.student.findFirst({
    where: {
      email: email,
    },
  });

  console.log(existing);

  if (existing) {
    return NextResponse.json({ message: "User exists" });
  } else {
    const createdUser = await prisma.student.create({
      data: {
        name: firstname,
        password: HashedPassword,
        email: email,
        studentId: personalId,
      },
    });

    const accessToken = jwt.sign(
      {
        data: createdUser,
      },
      secret!,
      { expiresIn: "2h" }
    );
    return NextResponse.json(accessToken);
  }
}
