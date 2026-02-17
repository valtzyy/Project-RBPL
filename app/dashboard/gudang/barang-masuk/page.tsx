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

  // Ambil data Barang Masuk dari DB, include detail Barangnya
  const rawData = await prisma.barangMasuk.findMany({
    orderBy: { tanggalMasuk: "desc" },
    include: {
      barang: true, // Join ke tabel Barang untuk ambil Nama & Kode
    },
  });

  // Format data agar aman dikirim ke Client Component (Date object ke String)
  const dataBarangMasuk = rawData.map((item) => ({
    id: item.id,
    tanggal: item.tanggalMasuk.toISOString().split("T")[0], // "2025-12-08"
    kodeBarang: item.barang.kodeBarang,
    namaBarang: item.barang.namaBarang,
    jumlah: item.jumlahMasuk,
    supplier: item.supplier,
  }));

  return (
    <BarangMasukUI
      data={dataBarangMasuk}
      userName={session.user.name}
      userRole="Admin Gudang"
    />
  );
}
