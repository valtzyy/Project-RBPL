"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. FUNGSI TAMBAH BARANG KELUAR
// ==========================================
export async function tambahBarangKeluar(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const barangId = parseInt(formData.get("barangId") as string);
  const jumlah = parseInt(formData.get("jumlah") as string);
  const tujuan = formData.get("tujuan") as string;
  const tanggal = new Date();

  // Validasi ketat: pastikan jumlah adalah angka positif
  if (!barangId || isNaN(jumlah) || jumlah <= 0 || !tujuan) {
    return { error: "Mohon lengkapi semua data dengan benar" };
  }

  try {
    const barang = await prisma.barang.findUnique({ where: { id: barangId } });

    // Kunci Anti-Minus: Jika barang tidak ada atau stok kurang
    if (!barang || barang.stok < jumlah) {
      return {
        error: `Stok tidak cukup! Sisa stok saat ini: ${barang?.stok || 0}`,
      };
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
        data: { stok: { decrement: jumlah } },
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
  if (payload.jumlahBaru <= 0) return { error: "Jumlah tidak valid" };

  try {
    const dataLama = await prisma.barangKeluar.findUnique({ where: { id } });
    if (!dataLama) return { error: "Data tidak ditemukan" };

    const selisih = payload.jumlahBaru - dataLama.jumlahKeluar;

    if (selisih > 0) {
      const barang = await prisma.barang.findUnique({
        where: { id: payload.barangId },
      });
      if (!barang || barang.stok < selisih) {
        return {
          error: `Stok tidak cukup untuk penambahan! Sisa stok: ${barang?.stok || 0}`,
        };
      }
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
        data: { stok: { decrement: selisih } },
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
