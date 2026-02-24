// app/actions/barangKeluarAction.ts
"use server";

import prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function tambahBarangKeluar(formData: FormData) {
  // 1. Cek Sesi Login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  // 2. Ambil Data dari Form
  const barangId = parseInt(formData.get("barangId") as string);
  const jumlah = parseInt(formData.get("jumlah") as string);
  const tujuan = formData.get("tujuan") as string;
  const tanggal = new Date(); // Waktu saat ini

  if (!barangId || !jumlah || !tujuan) {
    return { error: "Mohon lengkapi semua data" };
  }

  try {
    // 3. TRANSACTION: Cek Stok, Catat Keluar, Kurangi Stok
    await prisma.$transaction(async (tx) => {
      // a. Cek stok barang saat ini
      const barang = await tx.barang.findUnique({
        where: { id: barangId },
      });

      if (!barang) {
        throw new Error("Barang tidak ditemukan di database.");
      }

      // b. Validasi jika stok kurang
      if (barang.stok < jumlah) {
        throw new Error(
          `Stok tidak mencukupi! Sisa stok saat ini: ${barang.stok} ${barang.satuan}`,
        );
      }

      // c. Catat di tabel BarangKeluar
      await tx.barangKeluar.create({
        data: {
          barangId: barangId,
          jumlahKeluar: jumlah,
          tujuan: tujuan,
          tanggalKeluar: tanggal,
          userId: session.user.id,
        },
      });

      // d. Kurangi stok di tabel Barang
      await tx.barang.update({
        where: { id: barangId },
        data: {
          stok: {
            decrement: jumlah, // Gunakan decrement untuk mengurangi
          },
        },
      });
    });

    // 4. Refresh Halaman
    revalidatePath("/dashboard/gudang/barang-keluar");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal input barang keluar:", error);
    // Tangkap pesan error spesifik (seperti stok kurang)
    return { error: error.message || "Terjadi kesalahan sistem" };
  }
}
