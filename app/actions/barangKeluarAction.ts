"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ==========================================
// 0. HELPER OTORISASI (hanya ADMIN_GUDANG)
// ==========================================
async function cekAdminGudang() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" as const };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "ADMIN_GUDANG") {
    return { error: "Forbidden" as const };
  }

  return { userId: user.id };
}

// ==========================================
// 1. FUNGSI TAMBAH BARANG KELUAR
// ==========================================
export async function tambahBarangKeluar(formData: FormData) {
  const akses = await cekAdminGudang();
  if ("error" in akses) return { error: akses.error };

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
          userId: akses.userId,
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
  const akses = await cekAdminGudang();
  if ("error" in akses) return { error: akses.error };

  if (!Number.isInteger(payload.jumlahBaru) || payload.jumlahBaru <= 0) {
    return { error: "Jumlah tidak valid" };
  }

  try {
    const dataLama = await prisma.barangKeluar.findUnique({ where: { id } });
    if (!dataLama) return { error: "Data tidak ditemukan" };

    const barangBerubah = payload.barangId !== dataLama.barangId;

    // Jika barang diganti, kebutuhan stok = jumlah penuh di barang baru.
    // Jika barang sama, kebutuhan stok = selisih terhadap jumlah lama.
    const selisih = payload.jumlahBaru - dataLama.jumlahKeluar;
    const kebutuhanStok = barangBerubah ? payload.jumlahBaru : selisih;

    if (kebutuhanStok > 0) {
      const barang = await prisma.barang.findUnique({
        where: { id: payload.barangId },
      });
      if (!barang || barang.stok < kebutuhanStok) {
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
      // Kembalikan stok barang lama bila barang diganti
      ...(barangBerubah
        ? [
            prisma.barang.update({
              where: { id: dataLama.barangId },
              data: { stok: { increment: dataLama.jumlahKeluar } },
            }),
          ]
        : []),
      prisma.barang.update({
        where: { id: payload.barangId },
        data: { stok: { decrement: kebutuhanStok } },
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
  const akses = await cekAdminGudang();
  if ("error" in akses) return { error: akses.error };

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
