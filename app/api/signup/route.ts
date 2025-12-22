import { prisma } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
export const GET = () => {
  return NextResponse.json("hi");
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstname, email, password, role } = body;

  const existingTeacher = await prisma.teacher.findFirst({
    where: {
      email: email,
    },
  });

  const existingStudent = await prisma.student.findFirst({
    where: {
      email: email,
    },
  });

  if (existingTeacher || existingStudent) {
    throw new Error("User exists");
  }

  try {
    const clerk = await clerkClient();
    console.log(email, password, firstname, role);
    const createdClerkUser = await clerk.users.createUser({
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
      emailAddress: [email],
      password,
      firstName: firstname,
      publicMetadata: {
        role: role,
      },
    });

    if (role === "TEACHER") {
      const createdUser = await prisma.teacher.create({
        data: {
          name: firstname,
          email: email,
          clerkId: createdClerkUser.id,
        },
      });
      return NextResponse.json(createdUser);
    }

    if (role === "STUDENT") {
      const createdUser = await prisma.student.create({
        data: {
          name: firstname,
          email: email,
          clerkId: createdClerkUser.id,
        },
      });

      return NextResponse.json(createdUser);
    }
  } catch (err: any) {
    console.error(err.errors);
    throw err;
  }
}
