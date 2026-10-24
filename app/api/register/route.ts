import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { requireRole } from "@/lib/authz";
import { Role } from "@/generated/prisma/enums";

export async function POST(req: Request) {
  // Hanya Admin Gudang yang login boleh membuat akun (sebelumnya anonim + role bebas dari body)
  const akses = await requireRole("ADMIN_GUDANG");
  if ("response" in akses) return akses.response;

  const body = await req.json();
  const { name, email, password, role } = body;

  if (!Object.values(Role).includes(role)) {
    return NextResponse.json({ error: "Role tidak valid" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      emailVerified: true,
      role, // hati-hati di sini
      accounts: {
        create: {
          accountId: email,
          providerId: "credentials",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  });

  return NextResponse.json({ message: "User created", user });
}
