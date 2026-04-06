"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. FUNGSI TAMBAH BARANG KELUAR (Asumsi dari kodemu)
// ==========================================
export async function tambahBarangKeluar(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const barangId = parseInt(formData.get("barangId") as string);
  const jumlah = parseInt(formData.get("jumlah") as string);
  const tujuan = formData.get("tujuan") as string;
  const tanggal = new Date();

  if (!barangId || !jumlah || !tujuan)
    return { error: "Mohon lengkapi semua data" };

  try {
    // Cek stok saat ini
    const barang = await prisma.barang.findUnique({ where: { id: barangId } });
    if (!barang || barang.stok < jumlah) {
      return { error: "Stok barang tidak mencukupi!" };
    }

    await prisma.$transaction([
      prisma.barangKeluar.create({
        data: {
          barangId,
          jumlahKeluar: jumlah,
          tujuan,
          tanggalKeluar: tanggal,
          userId: session.user.id,
        },
      }),
      prisma.barang.update({
        where: { id: barangId },
        data: { stok: { decrement: jumlah } }, // Kurangi stok
      }),
    ]);

    revalidatePath("/dashboard/gudang/barang-keluar");
    return { success: true };
  } catch (error) {
    console.error("Gagal input barang keluar:", error);
    return { error: "Terjadi kesalahan sistem" };
  }
}

// ==========================================
// 2. FUNGSI EDIT BARANG KELUAR
// ==========================================
export async function updateBarangKeluar(
  id: number,
  payload: {
    barangId: number;
    jumlahBaru: number;
    tujuan: string;
    tanggal: string;
  },
) {
  try {
    const dataLama = await prisma.barangKeluar.findUnique({ where: { id } });
    if (!dataLama) return { error: "Data tidak ditemukan" };

    // Hitung selisih: Jumlah Baru - Jumlah Lama
    // Contoh: Dulu keluar 5, sekarang diubah jadi 8 (selisih 3). Stok harus dikurangi 3 lagi.
    const selisih = payload.jumlahBaru - dataLama.jumlahKeluar;

    // Opsional: Cek apakah stok cukup jika selisihnya positif (barang yang keluar tambah banyak)
    if (selisih > 0) {
      const barang = await prisma.barang.findUnique({
        where: { id: payload.barangId },
      });
      if (!barang || barang.stok < selisih)
        return { error: "Stok tidak mencukupi untuk penambahan ini!" };
    }

    await prisma.$transaction([
      prisma.barangKeluar.update({
        where: { id },
        data: {
          barangId: payload.barangId,
          jumlahKeluar: payload.jumlahBaru,
          tujuan: payload.tujuan,
          tanggalKeluar: new Date(payload.tanggal),
        },
      }),
      prisma.barang.update({
        where: { id: payload.barangId },
        data: { stok: { decrement: selisih } }, // Decrement selisih
      }),
    ]);

    revalidatePath("/dashboard/gudang/barang-keluar");
    return { success: true };
  } catch (error) {
    console.error("Error update barang keluar:", error);
    return { error: "Gagal memperbarui data" };
  }
}

// ==========================================
// 3. FUNGSI HAPUS BARANG KELUAR
// ==========================================
export async function hapusBarangKeluar(id: number) {
  try {
    const dataLama = await prisma.barangKeluar.findUnique({ where: { id } });
    if (!dataLama) return { error: "Data tidak ditemukan" };

    await prisma.$transaction([
      // Kembalikan stok karena pengeluaran dibatalkan
      prisma.barang.update({
        where: { id: dataLama.barangId },
        data: { stok: { increment: dataLama.jumlahKeluar } },
      }),
      prisma.barangKeluar.delete({
        where: { id },
      }),
    ]);

    revalidatePath("/dashboard/gudang/barang-keluar");
    return { success: true };
  } catch (error) {
    console.error("Error hapus barang keluar:", error);
    return { error: "Gagal menghapus data" };
  }
}
