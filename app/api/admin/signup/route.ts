import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const GET = () => {
  return NextResponse.json("hi");
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstname, password, role, id } = body;

  const existingAdmin = await prisma.admin.findFirst({
    where: {
      name: firstname,
    },
  });

  if (existingAdmin) {
    throw new Error("User exists");
  }

  try {
    if (role === "ADMIN") {
      const createdUser = await prisma.admin.create({
        data: {
          name: firstname,
          password: password,
          id: id,
        },
      });

      return NextResponse.json(createdUser);
    }
  } catch (err: any) {
    console.error(err.errors);
    throw err;
  }
}
