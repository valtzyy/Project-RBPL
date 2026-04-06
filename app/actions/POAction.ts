// app/actions/poAction.ts
"use server";

import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

interface POData {
  supplierName: string;
  tanggal: string;
  items: { barangId: number; qty: number }[];
}

export async function buatPO(data: POData) {
  // 1. Cek Sesi Login
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  if (!data.supplierName || !data.tanggal || data.items.length === 0) {
    return { error: "Mohon lengkapi data dan minimal pilih satu barang." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 2. Generate Nomor PO Otomatis (Contoh: PO-20260327-001)
      const count = await tx.pO.count();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const nomorPO = `PO-${dateStr}-${String(count + 1).padStart(3, "0")}`;

      let totalPO = 0;
      const poItems = [];

      // 3. Kalkulasi harga dan persiapkan data item
      for (const item of data.items) {
        const barang = await tx.barang.findUnique({
          where: { id: item.barangId },
        });

        if (!barang)
          throw new Error(`Barang dengan ID ${item.barangId} tidak ditemukan.`);

        // Harga yang disepakati dengan supplier (menggunakan harga master sementara)
        const hargaSatuan = Number(barang.harga);
        const subtotal = hargaSatuan * item.qty;
        totalPO += subtotal;

        poItems.push({
          barangId: item.barangId,
          qty: item.qty,
          hargaSatuan: hargaSatuan,
          subtotal: subtotal,
        });
      }

      // 4. Simpan Data PO ke Database beserta Item-nya
      await tx.pO.create({
        data: {
          nomorPO: nomorPO,
          tanggal: new Date(data.tanggal),
          supplierName: data.supplierName,
          total: totalPO,
          status: "ORDERED", // Status pesanan dikirim ke supplier
          userId: session.user.id,
          items: {
            create: poItems,
          },
        },
      });
    });

    // 5. Refresh Halaman UI agar tabel ter-update
    revalidatePath("/dashboard/distributor/invoice");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal buat PO:", error);
    return { error: error.message || "Terjadi kesalahan sistem" };
  }
}
