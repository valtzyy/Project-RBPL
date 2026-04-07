import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RootPage() {
  // Cek apakah user sudah login atau belum
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Jika sudah login, langsung lempar ke dashboard
  if (session) {
    redirect("/dashboard");
  }

  // Jika belum login, lempar ke halaman login
  redirect("/login");
}
