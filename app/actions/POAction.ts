"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

interface POData {
  supplierName: string;
  tanggal: string;
  items: { barangId: number; qty: number }[];
}

export async function buatPO(data: POData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  if (!data.supplierName || !data.tanggal || data.items.length === 0) {
    return { error: "Mohon lengkapi data dan minimal pilih satu barang." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const count = await tx.pO.count();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const nomorPO = `PO-${dateStr}-${String(count + 1).padStart(3, "0")}`;

      let totalPO = 0;
      const poItems = [];

      for (const item of data.items) {
        const barang = await tx.barang.findUnique({
          where: { id: item.barangId },
        });

        if (!barang)
          throw new Error(`Barang dengan ID ${item.barangId} tidak ditemukan.`);

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

      await tx.pO.create({
        data: {
          nomorPO: nomorPO,
          tanggal: new Date(data.tanggal),
          supplierName: data.supplierName,
          total: totalPO,
          status: "ORDERED",
          userId: session.user.id,
          items: {
            create: poItems,
          },
        },
      });
    });

    revalidatePath("/dashboard/distributor/invoice");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal buat PO:", error);
    return { error: error.message || "Terjadi kesalahan sistem" };
  }
}

// ==========================================
// FUNGSI HAPUS PO
// ==========================================
export async function hapusPO(id: number) {
  try {
    await prisma.$transaction([
      // Hapus item-item di dalam PO terlebih dahulu
      prisma.pOItem.deleteMany({ where: { poId: id } }),
      // Baru hapus PO utamanya
      prisma.pO.delete({ where: { id } }),
    ]);

    revalidatePath("/dashboard/distributor/invoice");
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus PO:", error);
    return { error: "Gagal menghapus data Purchase Order" };
  }
}
