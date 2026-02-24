// app/dashboard/gudang/barang-keluar/page.tsx
import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BarangKeluarUI from "@/components/dashboard/BarangKeluarUI";

export default async function PageBarangKeluar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // 1. Ambil History Barang Keluar
  const historyData = await prisma.barangKeluar.findMany({
    orderBy: { tanggalKeluar: "desc" },
    include: { barang: true },
  });

  // 2. Ambil Master Barang untuk opsi Dropdown (Hanya yang stoknya > 0)
  const masterBarang = await prisma.barang.findMany({
    where: { stok: { gt: 0 } }, // Hanya tampilkan barang yang ada stoknya
    select: { id: true, namaBarang: true, kodeBarang: true, stok: true },
    orderBy: { namaBarang: "asc" },
  });

  // Format Data
  const formattedData = historyData.map((item) => ({
    id: item.id,
    tanggal: item.tanggalKeluar.toISOString().split("T")[0],
    kodeBarang: item.barang.kodeBarang,
    namaBarang: item.barang.namaBarang,
    jumlah: item.jumlahKeluar,
    tujuan: item.tujuan,
  }));

  return (
    <BarangKeluarUI
      data={formattedData}
      listBarang={masterBarang}
      userName={session.user.name}
      userRole="Admin Gudang"
    />
  );
}
