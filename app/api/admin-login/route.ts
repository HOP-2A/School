import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, password } = body;
  const admin = await prisma.admin.findFirst({
    where: {
      name: name,
      password: password,
    },
  });
  if (admin) {
    if (admin.password === password) {
      return NextResponse.json(
        { message: "Login successful" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }
  } else {
    return NextResponse.json(
      {
        message: "Admin not found",
      },
      { status: 404 }
    );
  }
}
