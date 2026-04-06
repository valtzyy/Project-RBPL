// app/actions/statusAction.ts
"use server";

import  prisma  from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStatusTransaksi(
  id: number,
  tipe: "Invoice" | "PO",
  statusBaru: string,
) {
  try {
    if (tipe === "Invoice") {
      await prisma.invoice.update({
        where: { id: id },
        data: { status: statusBaru as any }, // 'as any' digunakan jika kamu memakai Enum di Prisma
      });
    } else if (tipe === "PO") {
      await prisma.pO.update({
        where: { id: id },
        data: { status: statusBaru as any },
      });
    }

    // Refresh halaman agar tabel menampilkan status terbaru
    revalidatePath("/dashboard/distributor/invoice");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal update status:", error);
    return { error: "Terjadi kesalahan saat memperbarui status." };
  }
}
