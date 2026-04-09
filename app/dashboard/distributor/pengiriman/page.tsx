// app/dashboard/distributor/status-pengiriman/page.tsx
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import StatusPengirimanUI from "@/components/dashboard/PengirimanUI";

export default async function PageStatusPengiriman() {
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

  // 1. Ambil Semua Data Pengiriman
  const dataPengiriman = await prisma.pengiriman.findMany({
    include: { invoice: true },
    orderBy: { createdAt: "desc" },
  });

  // 2. Ambil Daftar Invoice yang BELUM punya pengiriman
  // (Agar admin tidak bisa membuat pengiriman ganda untuk 1 invoice)
  const availableInvoices = await prisma.invoice.findMany({
    where: {
      pengiriman: null, // Hanya yang pengirimannya masih kosong
      status: { in: ["ISSUED", "PAID"] }, // Hanya yang sudah diterbitkan/lunas
    },
    select: { id: true, nomorInvoice: true, mitraName: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedData = dataPengiriman.map((p) => ({
    id: p.id,
    nomorInvoice: p.invoice.nomorInvoice,
    tujuan: p.tujuan,
    kurir: p.kurir || "-",
    resi: p.nomorResi || "-",
    status: p.status,
  }));

  return (
    <StatusPengirimanUI
      data={formattedData}
      availableInvoices={availableInvoices} // Kirim data ini ke UI
      userName={user.name}
      userRole="Admin Distributor"
    />
  );
}
