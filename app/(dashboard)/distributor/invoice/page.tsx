import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import InvoicePOUI from "@/components/dashboard/InvoicePOUI";

export default async function PageInvoicePO() {
  // 1. Cek Autentikasi & Role
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN_DIST") {
    redirect("/dashboard");
  }

  // --- Ambil Data Master Barang ---
  const rawBarang = await prisma.barang.findMany({
    select: { id: true, namaBarang: true, kodeBarang: true, harga: true },
    orderBy: { namaBarang: "asc" },
  });

  // Konversi tipe Decimal dari Prisma ke Number agar bisa dibaca Client Component
  const masterBarang = rawBarang.map((b) => ({
    ...b,
    harga: Number(b.harga),
  }));
  // ---------------------------------------------------------

  // 2. Ambil Data Invoice dan PO dari Database
  const rawInvoices = await prisma.invoice.findMany({
    orderBy: { tanggal: "desc" },
  });

  const rawPOs = await prisma.pO.findMany({
    orderBy: { tanggal: "desc" },
  });

  // 3. Gabungkan Kedua Data Menjadi Satu Array
  const combinedRawData = [
    ...rawInvoices.map((inv) => ({
      id: inv.id,
      tipe: "Invoice" as const,
      nomor: inv.nomorInvoice,
      tanggalAsli: inv.tanggal,
      namaMitra: inv.mitraName,
      total: Number(inv.total),
      status: inv.status,
    })),
    ...rawPOs.map((po) => ({
      id: po.id,
      tipe: "PO" as const,
      nomor: po.nomorPO,
      tanggalAsli: po.tanggal,
      namaMitra: po.supplierName,
      total: Number(po.total),
      status: po.status,
    })),
  ];

  // 4. Urutkan berdasarkan tanggal terbaru (descending)
  combinedRawData.sort(
    (a, b) => b.tanggalAsli.getTime() - a.tanggalAsli.getTime(),
  );

  // Helper Format Tanggal WIB (YYYY-MM-DD)
  const formatWIBDateOnly = (date: Date) => {
    const wibDate = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    );
    const yyyy = wibDate.getFullYear();
    const mm = String(wibDate.getMonth() + 1).padStart(2, "0");
    const dd = String(wibDate.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 5. Format Data untuk dikirim ke UI
  const formattedData = combinedRawData.map((item) => ({
    id: item.id,
    tipe: item.tipe,
    nomor: item.nomor,
    tanggal: formatWIBDateOnly(item.tanggalAsli),
    namaMitra: item.namaMitra,
    total: `Rp ${item.total.toLocaleString("id-ID")}`,
    status: item.status,
  }));

  return (
    <InvoicePOUI
      data={formattedData}
      userName={user.name}
      listBarang={masterBarang} 
      userRole="Admin Distributor"
    />
  );
}
