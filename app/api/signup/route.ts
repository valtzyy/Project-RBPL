import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    // Set role setelah user dibuat
    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: "ADMIN_GUDANG" },
    });

    return NextResponse.json({ message: "User created" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Signup failed" },
      { status: 400 },
    );
  }
}
