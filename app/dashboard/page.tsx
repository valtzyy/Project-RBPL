import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const h = await headers();

  const session = await auth.api.getSession({
    headers: h,
  });

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/login");

  if (user.role === "ADMIN_GUDANG") {
    redirect("/dashboard/gudang");
  }

  if (user.role === "ADMIN_DIST") {
    redirect("/dashboard/distributor");
  }

  if (user.role === "MANAJEMEN") {
    redirect("/dashboard/manajemen");
  }

  redirect("/unauthorized");
}
