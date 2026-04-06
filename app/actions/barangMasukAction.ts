"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. FUNGSI TAMBAH BARANG MASUK
// ==========================================
export async function tambahBarangMasuk(formData: FormData) {
  // 1. Cek Sesi Login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  // 2. Ambil Data dari Form
  const barangId = parseInt(formData.get("barangId") as string);
  const jumlah = parseInt(formData.get("jumlah") as string);
  const supplier = formData.get("supplier") as string;
  const tanggal = new Date(); // Default hari ini

  if (!barangId || !jumlah || !supplier) {
    return { error: "Mohon lengkapi semua data" };
  }

  try {
    // 3. Gunakan Transaction
    await prisma.$transaction([
      // a. Create Log Barang Masuk
      prisma.barangMasuk.create({
        data: {
          barangId,
          jumlahMasuk: jumlah,
          supplier,
          tanggalMasuk: tanggal,
          userId: session.user.id,
        },
      }),

      // b. Update Stok Barang (+ Increment)
      prisma.barang.update({
        where: { id: barangId },
        data: {
          stok: {
            increment: jumlah,
          },
        },
      }),
    ]);

    // 4. Refresh Halaman
    revalidatePath("/dashboard/gudang/barang-masuk");
    return { success: true };
  } catch (error) {
    console.error("Gagal input barang masuk:", error);
    return { error: "Terjadi kesalahan sistem" };
  }
}

// ==========================================
// 2. FUNGSI EDIT BARANG MASUK
// ==========================================
export async function updateBarangMasuk(
  id: number,
  payload: {
    barangId: number;
    jumlahBaru: number;
    supplier: string;
    tanggal: string;
  },
) {
  try {
    // 1. Cari data lama di database
    const dataLama = await prisma.barangMasuk.findUnique({ where: { id } });
    if (!dataLama) return { error: "Data tidak ditemukan" };

    // 2. Hitung selisih jumlah (Baru - Lama)
    const selisih = payload.jumlahBaru - dataLama.jumlahMasuk;

    // 3. Update dengan Transaksi (Aman)
    await prisma.$transaction([
      // a. Update data histori barang masuk
      prisma.barangMasuk.update({
        where: { id },
        data: {
          barangId: payload.barangId,
          jumlahMasuk: payload.jumlahBaru,
          supplier: payload.supplier,
          tanggalMasuk: new Date(payload.tanggal),
        },
      }),
      // b. Sesuaikan stok di gudang utama
      prisma.barang.update({
        where: { id: payload.barangId },
        data: { stok: { increment: selisih } },
      }),
    ]);

    revalidatePath("/dashboard/gudang/barang-masuk");
    return { success: true };
  } catch (error) {
    console.error("Error update barang masuk:", error);
    return { error: "Gagal memperbarui data" };
  }
}

// ==========================================
// 3. FUNGSI HAPUS BARANG MASUK
// ==========================================
export async function hapusBarangMasuk(id: number) {
  try {
    // 1. Cari data sebelum dihapus untuk mengetahui jumlah yang harus dikurangi
    const dataLama = await prisma.barangMasuk.findUnique({ where: { id } });
    if (!dataLama) return { error: "Data tidak ditemukan" };

    // 2. Hapus dan sesuaikan stok
    await prisma.$transaction([
      // a. Kurangi stok barang karena data masuknya dibatalkan
      prisma.barang.update({
        where: { id: dataLama.barangId },
        data: { stok: { decrement: dataLama.jumlahMasuk } },
      }),
      // b. Hapus log barang masuk
      prisma.barangMasuk.delete({
        where: { id },
      }),
    ]);

    revalidatePath("/dashboard/gudang/barang-masuk");
    return { success: true };
  } catch (error) {
    console.error("Error hapus barang masuk:", error);
    return { error: "Gagal menghapus data" };
  }
}
