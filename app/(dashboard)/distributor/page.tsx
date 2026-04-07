import  prisma  from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import DistributorDashboardUI from "@/components/dashboard/DistributorDashboardUI";

export default async function DashboardDistributor() {
  // 1. Cek Autentikasi
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  // 2. Cek Role User
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN_DIST") {
    if (user?.role === "ADMIN_GUDANG") redirect("/dashboard/gudang");
    redirect("/login");
  }

  // 3. Tarik Data Real dari Database
  const totalPO = await prisma.pO.count();
  const totalInv = await prisma.invoice.count();
  const pengirimanAktif = await prisma.pengiriman.count({
    where: { status: { in: ["DIPROSES", "DIKIRIM"] } },
  });

  const recentInvoices = await prisma.invoice.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const recentPengiriman = await prisma.pengiriman.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // 4. FALLBACK DATA (Agar Tampilan Awal Persis Seperti Gambar UI)
  // Jika database sudah ada isinya, akan pakai data DB. Jika kosong, pakai mock data.
  const displayTotalTransaksi =
    totalPO + totalInv > 0 ? totalPO + totalInv : 342;
  const displayTotalInvoice = totalInv > 0 ? totalInv : 128;
  const displayPengirimanAktif = pengirimanAktif > 0 ? pengirimanAktif : 45;

  const displayInvoices =
    recentInvoices.length > 0
      ? recentInvoices.map((i) => ({
          no: i.nomorInvoice,
          mitra: i.mitraName,
          total: `Rp ${Number(i.total).toLocaleString("id-ID")}`,
          status:
            i.status === "PAID"
              ? "Lunas"
              : i.status === "DRAFT"
                ? "Pending"
                : "Proses",
        }))
      : [
          {
            no: "INV-2025-001",
            mitra: "PT Maju Jaya",
            total: "Rp 45.000.000",
            status: "Lunas",
          },
          {
            no: "INV-2025-002",
            mitra: "CV Berkah Sentosa",
            total: "Rp 32.500.000",
            status: "Pending",
          },
          {
            no: "INV-2025-003",
            mitra: "UD Sejahtera",
            total: "Rp 28.750.000",
            status: "Lunas",
          },
          {
            no: "INV-2025-004",
            mitra: "PT Global Tech",
            total: "Rp 67.200.000",
            status: "Proses",
          },
          {
            no: "INV-2025-005",
            mitra: "CV Mandiri",
            total: "Rp 19.800.000",
            status: "Lunas",
          },
        ];

  const displayPengiriman =
    recentPengiriman.length > 0
      ? recentPengiriman.map((p) => ({
          id: p.nomorResi || `SHP-${p.id}`,
          tujuan: p.tujuan,
          kurir: p.kurir || "-",
          status:
            p.status === "DIKIRIM"
              ? "Dikirim"
              : p.status === "SELESAI"
                ? "Selesai"
                : "Diproses",
        }))
      : [
          { id: "SHP-001", tujuan: "Jakarta", kurir: "JNE", status: "Dikirim" },
          { id: "SHP-002", tujuan: "Bandung", kurir: "JNT", status: "Selesai" },
          {
            id: "SHP-003",
            tujuan: "Surabaya",
            kurir: "SiCepat",
            status: "Diproses",
          },
          {
            id: "SHP-004",
            tujuan: "Medan",
            kurir: "AnterAja",
            status: "Dikirim",
          },
        ];

  return (
    <DistributorDashboardUI
      userName={user.name}
      userRole="Admin Distributor"
      stats={{
        totalTransaksi: displayTotalTransaksi,
        totalInvoice: displayTotalInvoice,
        pengirimanAktif: displayPengirimanAktif,
      }}
      invoices={displayInvoices}
      pengirimans={displayPengiriman}
    />
  );
}
