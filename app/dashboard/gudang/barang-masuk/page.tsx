// app/dashboard/gudang/barang-masuk/page.tsx
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import BarangMasukUI from "@/components/dashboard/BarangMasukUI";

export default async function PageBarangMasuk() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // 1. Ambil Data History Barang Masuk
  const rawData = await prisma.barangMasuk.findMany({
    orderBy: { tanggalMasuk: "desc" },
    include: {
      barang: true,
    },
  });

  // 2. Ambil List Master Barang (Untuk Dropdown di Modal)
  const masterBarang = await prisma.barang.findMany({
    select: { id: true, namaBarang: true, kodeBarang: true },
    orderBy: { namaBarang: "asc" },
  });

  const dataBarangMasuk = rawData.map((item) => ({
    id: item.id,
    tanggal: item.tanggalMasuk.toISOString().split("T")[0],
    kodeBarang: item.barang.kodeBarang,
    namaBarang: item.barang.namaBarang,
    jumlah: item.jumlahMasuk,
    supplier: item.supplier,
  }));

  return (
    <BarangMasukUI
      data={dataBarangMasuk}
      listBarang={masterBarang} // <--- Kirim ini ke UI
      userName={session.user.name}
      userRole="Admin Gudang"
    />
  );
}
