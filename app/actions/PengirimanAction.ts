"use server";

import  prisma  from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStatusPengiriman(id: number, statusBaru: string) {
  try {
    await prisma.pengiriman.update({
      where: { id: id },
      data: { status: statusBaru as any }, // 'as any' jika menggunakan Enum
    });

    // Refresh halaman agar tabel terupdate
    revalidatePath("/dashboard/distributor/pengiriman");
    return { success: true };
  } catch (error: any) {
    console.error("Gagal update status pengiriman:", error);
    return { error: "Terjadi kesalahan saat memperbarui status pengiriman." };
  }
}
