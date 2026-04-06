"use server";

import prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

interface InvoiceData {
  mitraName: string;
  tanggal: string;
  items: { barangId: number; qty: number }[];
}

export async function buatInvoice(data: InvoiceData) {
  // 1. Cek Autentikasi
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return { error: "Unauthorized" };

  if (!data.mitraName || !data.tanggal || data.items.length === 0) {
    return { error: "Mohon lengkapi data dan minimal pilih satu barang." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 2. Generate Nomor Invoice (Contoh: INV-20260327-001)
      const count = await tx.invoice.count();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const nomorInvoice = `INV-${dateStr}-${String(count + 1).padStart(3, "0")}`;

      let totalInvoice = 0;
      const invoiceItems = [];

      // 3. Kalkulasi harga untuk setiap item yang dipilih
      for (const item of data.items) {
        const barang = await tx.barang.findUnique({
          where: { id: item.barangId },
        });

        if (!barang)
          throw new Error(`Barang dengan ID ${item.barangId} tidak ditemukan.`);

        const hargaSatuan = Number(barang.harga);
        const subtotal = hargaSatuan * item.qty;
        totalInvoice += subtotal;

        invoiceItems.push({
          barangId: item.barangId,
          qty: item.qty,
          hargaSatuan: hargaSatuan,
          subtotal: subtotal,
        });
      }

      // 4. Buat Record Invoice beserta Relasi Items-nya
      await tx.invoice.create({
        data: {
          nomorInvoice: nomorInvoice,
          tanggal: new Date(data.tanggal),
          mitraName: data.mitraName,
          total: totalInvoice,
          status: "ISSUED", // Status awal saat invoice dibuat
          userId: session.user.id,
          items: {
            create: invoiceItems,
          },
        },
      });
    });

    // 5. Refresh data di halaman UI
    revalidatePath("/dashboard/distributor/invoice");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal buat invoice:", error);
    return { error: error.message || "Terjadi kesalahan sistem" };
  }
}
