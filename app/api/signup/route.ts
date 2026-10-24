import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/authz";

export async function POST(req: Request) {
  // Pendaftaran hanya oleh Admin Gudang yang sudah login (sebelumnya terbuka untuk anonim)
  const akses = await requireRole("ADMIN_GUDANG");
  if ("response" in akses) return akses.response;

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
