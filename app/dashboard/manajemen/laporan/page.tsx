import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ManajemenLaporanUI from "@/components/dashboard/ManajemenLaporanUI";

export default async function LaporanManajemenPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || (user.role !== "MANAJEMEN" && user.role !== "ADMIN_DIST")) {
    redirect("/dashboard");
  }

  let rawLaporan: any[] = [];
  try {
    rawLaporan = await prisma.laporan.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.log("Tabel laporan mungkin belum ada atau kosong.");
  }

  const formatTgl = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const formattedData = rawLaporan.map((lap) => ({
    id_db: lap.id, // <--- INI SANGAT PENTING: Harus berupa angka (Primary Key Database)
    id: lap.idLaporan, // LPR-2025-001
    periode: `${formatTgl(lap.periodeMulai)} - ${formatTgl(lap.periodeSelesai)}`,
    total: formatter.format(Number(lap.totalPenjualan)),
    dibuatPada: formatTgl(lap.createdAt),
  }));

  return (
    <ManajemenLaporanUI
      userName={user.name}
      userRole={user.role === "ADMIN_DIST" ? "Admin Distributor" : "Manajemen"}
      data={formattedData}
    />
  );
}
