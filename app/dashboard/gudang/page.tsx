import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth"; // Sesuaikan path auth Anda
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DashboardUI from "@/components/dashboard/DashboardUI";

export default async function DashboardGudang() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // Pastikan user ada & role benar
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN_GUDANG") {
    redirect("/unauthorized"); // Atau halaman lain
  }

  // 1. Total Barang
  const totalBarang = await prisma.barang.count();

  // Tanggal hari ini (mulai jam 00:00)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 2. Barang Masuk Hari Ini
  const barangMasukHariIni = await prisma.barangMasuk.count({
    where: {
      tanggalMasuk: { gte: today },
    },
  });

  // 3. Barang Keluar Hari Ini
  const barangKeluarHariIni = await prisma.barangKeluar.count({
    where: {
      tanggalKeluar: { gte: today },
    },
  });

  // 4. Aktivitas Terbaru (Gabungan Masuk & Keluar)
  const masuk = await prisma.barangMasuk.findMany({
    take: 5,
    orderBy: { tanggalMasuk: "desc" },
    include: { barang: true },
  });

  const keluar = await prisma.barangKeluar.findMany({
    take: 5,
    orderBy: { tanggalKeluar: "desc" },
    include: { barang: true },
  });

  // Gabungkan dan format data untuk UI
  const aktivitasRaw = [
    ...masuk.map((m) => ({
      originalDate: m.tanggalMasuk,
      tipe: "Masuk",
      nama: m.barang.namaBarang,
      jumlah: m.jumlahMasuk,
      keterangan: m.supplier, // Supplier
    })),
    ...keluar.map((k) => ({
      originalDate: k.tanggalKeluar,
      tipe: "Keluar",
      nama: k.barang.namaBarang,
      jumlah: k.jumlahKeluar,
      keterangan: k.tujuan, // Tujuan
    })),
  ];

  // Sort descending & ambil 5 teratas
  const aktivitas = aktivitasRaw
    .sort((a, b) => b.originalDate.getTime() - a.originalDate.getTime())
    .slice(0, 5)
    .map((item) => ({
      // Format tanggal jadi String: "2025-12-08 09:30"
      tanggal: item.originalDate.toISOString().slice(0, 16).replace("T", " "),
      tipe: item.tipe,
      nama: item.nama,
      jumlah: item.jumlah,
      keterangan: item.keterangan,
    }));

  return (
    <DashboardUI
      user={{ name: user.name, role: "Admin Gudang" }} // Data user untuk Topbar
      totalBarang={totalBarang}
      barangMasuk={barangMasukHariIni}
      barangKeluar={barangKeluarHariIni}
      aktivitas={aktivitas}
    />
  );
}
