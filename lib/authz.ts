import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type { Role } from "@/generated/prisma/enums";

// Guard untuk Route Handler: 401 bila belum login, 403 bila peran tidak sesuai.
export async function requireRole(
  role: Role,
): Promise<{ userId: string } | { response: NextResponse }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== role) {
    return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { userId: user.id };
}
