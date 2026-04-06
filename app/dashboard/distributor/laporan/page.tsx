import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LaporanUI from "@/components/dashboard/LaporanUI";

export default async function PageLaporan() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN_DIST") {
    redirect("/dashboard");
  }

  // Ambil data laporan dari database
  // Gunakan try-catch agar tidak crash jika tabel belum ada
  let rawLaporan: any[] = [];
  try {
    rawLaporan = await prisma.laporan.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.log("Tabel laporan mungkin belum dibuat di database.");
  }

  // Format Helper
  const formatTanggalSingkat = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formattedData = rawLaporan.map((l) => ({
    id_db: l.id,
    id_laporan: l.idLaporan,
    periode: `${formatTanggalSingkat(l.periodeMulai)} - ${formatTanggalSingkat(l.periodeSelesai)}`,
    total: `Rp ${Number(l.totalPenjualan).toLocaleString("id-ID")}`,
  }));

  return (
    <LaporanUI
      data={formattedData}
      userName={user.name}
      userRole="Admin Distributor"
    />
  );
}
