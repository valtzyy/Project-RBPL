"use server";

import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

interface LaporanData {
  tanggalMulai: string;
  tanggalSelesai: string;
}

export async function buatLaporanPenjualan(data: LaporanData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  if (!data.tanggalMulai || !data.tanggalSelesai) {
    return { error: "Mohon lengkapi periode tanggal laporan." };
  }

  const start = new Date(data.tanggalMulai);
  const end = new Date(data.tanggalSelesai);

  // Pastikan jamnya mencakup satu hari penuh (00:00:00 - 23:59:59)
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  if (start > end) {
    return {
      error: "Tanggal mulai tidak boleh lebih besar dari tanggal selesai.",
    };
  }

  try {
    // 1. Cari semua invoice yang LUNAS pada periode tersebut
    const invoices = await prisma.invoice.findMany({
      where: {
        tanggal: {
          gte: start,
          lte: end,
        },
        status: "PAID", // Hanya hitung yang sudah lunas
      },
    });

    // 2. Hitung total penjualannya
    const totalPenjualan = invoices.reduce(
      (sum, inv) => sum + Number(inv.total),
      0,
    );

    // 3. Generate ID Laporan (Contoh: LPR-2025-001)
    const count = await prisma.laporan.count();
    const nomorLaporan = `LPR-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

    // 4. Simpan ke database
    await prisma.laporan.create({
      data: {
        idLaporan: nomorLaporan,
        periodeMulai: start,
        periodeSelesai: end,
        totalPenjualan: totalPenjualan,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/distributor/laporan");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal buat laporan:", error);
    return {
      error:
        "Terjadi kesalahan saat men-generate laporan. Pastikan tabel Laporan sudah ada di Prisma.",
    };
  }
}
