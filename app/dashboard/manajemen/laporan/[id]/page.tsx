import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DetailLaporanManajemenUI from "@/components/dashboard/DetailLaporanManajemenUI";

// Gunakan tipe Promise untuk params (Standar aman Next.js terbaru)
export default async function DetailLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || (user.role !== "MANAJEMEN" && user.role !== "ADMIN_DIST")) {
    redirect("/dashboard");
  }

  // Mengambil ID dari URL
  const resolvedParams = await params;
  const laporanDbId = Number(resolvedParams.id);

  // Jika ID di URL bukan angka (misal undefined atau string), kembalikan ke daftar
  if (isNaN(laporanDbId) || laporanDbId === 0) {
    console.log(
      "Mencoba membuka detail dengan ID tidak valid:",
      resolvedParams.id,
    );
    redirect("/dashboard/manajemen/laporan");
  }

  let detailLaporan = null;
  let listTransaksi: any[] = [];
  let produkTerjual = 0;

  try {
    detailLaporan = await prisma.laporan.findUnique({
      where: { id: laporanDbId },
    });

    if (detailLaporan) {
      const invoices = await prisma.invoice.findMany({
        where: {
          status: "PAID",
          tanggal: {
            gte: detailLaporan.periodeMulai,
            lte: detailLaporan.periodeSelesai,
          },
        },
      });

      const formatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      });

      invoices.forEach((inv) => {
        const estimatedQty = 1;
        produkTerjual += estimatedQty;

        listTransaksi.push({
          tanggal: inv.tanggal.toISOString().split("T")[0],
          produk: `Pesanan Mitra: ${inv.mitraName || "Toko"}`,
          jumlah: estimatedQty,
          harga: formatter.format(Number(inv.total) / estimatedQty),
          total: formatter.format(Number(inv.total)),
        });
      });
    }
  } catch (error) {
    console.log("Error mengambil detail laporan:", error);
  }

  // Pengaman: Jika database tidak menemukan laporan dengan ID tersebut
  if (!detailLaporan) {
    console.log(
      `Laporan dengan ID ${laporanDbId} tidak ditemukan di database.`,
    );
    redirect("/dashboard/manajemen/laporan");
  }

  const formatTgl = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  const formatTglLengkap = (d: Date) =>
    d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  const formatterRp = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const totalTrx = listTransaksi.length;
  const totalRupiah = Number(detailLaporan.totalPenjualan);
  const rataRataVal = totalTrx > 0 ? totalRupiah / totalTrx : 0;

  const stats = {
    totalTransaksi: totalTrx,
    totalPendapatan: formatterRp.format(totalRupiah),
    rataRata: formatterRp.format(rataRataVal),
    produkTerjual: produkTerjual,
  };

  return (
    <DetailLaporanManajemenUI
      userName={user.name}
      userRole={user.role === "ADMIN_DIST" ? "Admin Distributor" : "Manajemen"}
      laporanId={detailLaporan.idLaporan}
      periode={`${formatTgl(detailLaporan.periodeMulai)} - ${formatTgl(detailLaporan.periodeSelesai)}`}
      dibuatPada={formatTglLengkap(detailLaporan.createdAt)}
      stats={stats}
      transaksi={listTransaksi}
    />
  );
}
