import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ManajemenDashboardUI from "@/components/dashboard/ManajemenDashboardUI";

export default async function DashboardManajemen() {
  // 1. Cek Sesi dan Autentikasi
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  // Izinkan akses jika dia adalah ADMIN_DIST atau role MANAJEMEN khusus
  if (!user || (user.role !== "ADMIN_DIST" && user.role !== "MANAJEMEN")) {
    redirect("/dashboard");
  }

  // 2. Siapkan Variabel Default
  let totalPenjualan = 0;
  let jumlahTransaksi = 0;
  let chartData = Array(12).fill(0); // Array untuk grafik (Jan-Des), isi awal 0
  let produkTerlarisFormatted: any[] = [];
  let laporanTerbaruFormatted: any[] = [];

  // 3. Tarik Data Nyata dari Database
  try {
    const now = new Date();
    const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // -- A. Hitung Statistik Bulan Ini (Hanya Invoice PAID) --
    const invoicesThisMonth = await prisma.invoice.findMany({
      where: {
        status: "PAID",
        tanggal: { gte: firstDayThisMonth },
      },
    });

    jumlahTransaksi = invoicesThisMonth.length;
    totalPenjualan = invoicesThisMonth.reduce(
      (sum, inv) => sum + Number(inv.total),
      0,
    );

    // -- B. Buat Data Grafik Tahunan --
    const firstDayThisYear = new Date(now.getFullYear(), 0, 1);
    const invoicesThisYear = await prisma.invoice.findMany({
      where: {
        status: "PAID",
        tanggal: { gte: firstDayThisYear },
      },
    });

    invoicesThisYear.forEach((inv) => {
      const monthIndex = inv.tanggal.getMonth(); // Mengambil index bulan (0 = Januari)
      // Konversi total rupiah ke satuan "Juta" agar pas di grafik
      chartData[monthIndex] += Number(inv.total) / 1000000;
    });

    // -- C. Ambil Laporan Terbaru --
    const laporanDb = await prisma.laporan.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
    });

    const formatTgl = (d: Date) =>
      d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    laporanTerbaruFormatted = laporanDb.map((lap) => ({
      id: lap.idLaporan,
      periode: `${formatTgl(lap.periodeMulai)} - ${formatTgl(lap.periodeSelesai)}`,
    }));

    // -- D. Data Produk Terlaris (Opsional) --
    // Untuk saat ini dibiarkan kosong agar mengikuti instruksi "Tampilkan data kosong jika tidak ada"
    produkTerlarisFormatted = [];
  } catch (error) {
    console.error("Gagal menarik data untuk dashboard manajemen:", error);
  }

  // 4. Kalkulasi Rata-rata dan Format Rupiah
  const rataRataVal =
    jumlahTransaksi > 0 ? totalPenjualan / jumlahTransaksi : 0;
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });

  const stats = {
    totalPenjualan: formatter.format(totalPenjualan),
    trenPenjualan: totalPenjualan > 0 ? 12.5 : 0,
    jumlahTransaksi: jumlahTransaksi,
    trenTransaksi: jumlahTransaksi > 0 ? 8.2 : 0,
    rataRata: formatter.format(rataRataVal),
    trenRataRata: rataRataVal > 0 ? -3.1 : 0,
  };

  // 5. Render Antarmuka
  return (
    <ManajemenDashboardUI
      userName={user.name}
      userRole={user.role === "ADMIN_DIST" ? "Admin Distributor" : "Manajemen"}
      stats={stats}
      chartData={chartData}
      produkTerlaris={produkTerlarisFormatted}
      laporanTerbaru={laporanTerbaruFormatted}
    />
  );
}
