import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PengirimanUI from "@/components/dashboard/PengirimanUI";

export default async function PagePengiriman() {
  // 1. Cek Autentikasi & Role
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

  // 2. Ambil Data Pengiriman dari Database (Include Relasi Invoice)
  const rawPengiriman = await prisma.pengiriman.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      invoice: true, // Pastikan relasi ke tabel invoice ada di schema.prisma
    },
  });

  // Helper Text Status
  const getStatusText = (status: string) => {
    if (status === "DIPROSES") return "Diproses";
    if (status === "DIKIRIM") return "Dikirim";
    if (status === "SELESAI") return "Selesai";
    if (status === "DIBATALKAN") return "Dibatalkan";
    return status;
  };

  // 3. Format data untuk UI
  const formattedData = rawPengiriman.map((p) => ({
    id_db: p.id,
    id_pengiriman: p.nomorResi || `SHP-00${p.id}`,
    nomorInvoice: p.invoice?.nomorInvoice || "-",
    tujuan: p.tujuan,
    kurir: p.kurir || "-",
    status: getStatusText(p.status),
  }));

  return (
    <PengirimanUI
      data={formattedData}
      userName={user.name}
      userRole="Admin Distributor"
    />
  );
}
