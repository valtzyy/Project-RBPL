"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

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
    // 3. Gunakan Transaction (PENTING!)
    // Agar jika satu gagal, semua batal. Kita perlu:
    // a. Catat di tabel BarangMasuk
    // b. Tambah stok di tabel Barang

    await prisma.$transaction([
      // a. Create Log Barang Masuk
      prisma.barangMasuk.create({
        data: {
          barangId,
          jumlahMasuk: jumlah,
          supplier,
          tanggalMasuk: tanggal,
          userId: session.user.id, // ID User yang login
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

    // 4. Refresh Halaman agar data baru muncul
    revalidatePath("/dashboard/gudang/barang-masuk");
    return { success: true };
  } catch (error) {
    console.error("Gagal input barang masuk:", error);
    return { error: "Terjadi kesalahan sistem" };
  }
}
