// app/actions/pengirimanAction.ts
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// 1. BUAT PENGIRIMAN BARU
export async function buatPengiriman(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const invoiceId = parseInt(formData.get("invoiceId") as string);
  const tujuan = formData.get("tujuan") as string;
  const kurir = formData.get("kurir") as string;
  const nomorResi = formData.get("nomorResi") as string;

  if (!invoiceId || !tujuan) {
    return { error: "Invoice dan Tujuan wajib diisi!" };
  }

  try {
    // Cek apakah invoice sudah punya pengiriman
    const existing = await prisma.pengiriman.findUnique({
      where: { invoiceId },
    });
    if (existing)
      return { error: "Invoice ini sudah memiliki data pengiriman!" };

    await prisma.pengiriman.create({
      data: {
        invoiceId,
        tujuan,
        kurir: kurir || null,
        nomorResi: nomorResi || null,
        status: "DIPROSES",
      },
    });

    revalidatePath("/dashboard/distributor/status-pengiriman");
    return { success: true };
  } catch (error) {
    console.error("Gagal buat pengiriman:", error);
    return { error: "Terjadi kesalahan sistem" };
  }
}

// 2. UPDATE STATUS PENGIRIMAN
export async function updateStatusPengiriman(id: number, statusBaru: any) {
  try {
    const dataUpdate: any = { status: statusBaru };

    // Jika status dikirim, catat tanggal kirim
    if (statusBaru === "DIKIRIM") dataUpdate.tanggalKirim = new Date();
    // Jika status selesai, catat tanggal terima
    if (statusBaru === "SELESAI") dataUpdate.tanggalTerima = new Date();

    await prisma.pengiriman.update({
      where: { id },
      data: dataUpdate,
    });

    revalidatePath("/dashboard/distributor/status-pengiriman");
    return { success: true };
  } catch (error) {
    console.error("Gagal update status:", error);
    return { error: "Gagal memperbarui status pengiriman" };
  }
}

// 3. HAPUS PENGIRIMAN
export async function hapusPengiriman(id: number) {
  try {
    await prisma.pengiriman.delete({ where: { id } });
    revalidatePath("/dashboard/distributor/status-pengiriman");
    return { success: true };
  } catch (error) {
    console.error("Gagal hapus pengiriman:", error);
    return { error: "Gagal menghapus data pengiriman" };
  }
}
