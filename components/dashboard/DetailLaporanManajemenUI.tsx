"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Printer,
  Bell,
  User,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import SidebarManajemen from "@/components/SidebarManajemen";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface TransaksiItem {
  tanggal: string;
  produk: string;
  jumlah: number;
  harga: string;
  total: string;
}

interface DetailLaporanProps {
  userName: string;
  userRole: string;
  laporanId: string;
  periode: string;
  dibuatPada: string;
  stats: {
    totalTransaksi: number;
    totalPendapatan: string;
    rataRata: string;
    produkTerjual: number;
  };
  transaksi: TransaksiItem[];
}

export default function DetailLaporanManajemenUI({
  userName,
  userRole,
  laporanId,
  periode,
  dibuatPada,
  stats,
  transaksi,
}: DetailLaporanProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Fungsi untuk memicu print browser
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* SIDEBAR - Disembunyikan saat di-print (print:hidden) */}
      <div className="print:hidden">
        <SidebarManajemen isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      </div>

      {/* MAIN CONTENT - Margin dihilangkan saat print (print:ml-0) */}
      <main className="md:ml-64 w-full min-h-screen flex flex-col transition-all duration-300 print:ml-0 print:bg-white">
        {/* TOPBAR - Disembunyikan saat di-print */}
        <header className="flex h-16 items-center justify-between bg-white px-4 md:px-8 shadow-sm border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-md text-slate-600 hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-slate-700 hidden sm:block">
                Sistem Manajemen Distribusi Gudang
              </h2>
              <h2 className="text-lg font-semibold text-slate-700 sm:hidden">
                SMDG
              </h2>
              <p className="text-xs text-indigo-600 font-medium">{userRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hidden sm:block">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-700">
                  {userName}
                </p>
                <p className="text-xs text-slate-500">Manajemen</p>
              </div>
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <User size={18} />
              </div>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 border border-red-100 ml-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* KONTEN HALAMAN */}
        <div className="p-4 md:p-8 print:p-0">
          {/* Breadcrumb - Disembunyikan saat print */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6 print:hidden">
            <span
              className="cursor-pointer hover:text-slate-800"
              onClick={() => router.push("/dashboard/manajemen")}
            >
              Dashboard
            </span>
            <ChevronRight size={14} />
            <span
              className="cursor-pointer hover:text-slate-800"
              onClick={() => router.push("/dashboard/manajemen/laporan")}
            >
              Laporan Penjualan
            </span>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">Detail Laporan</span>
          </div>

          {/* HEADER DETAIL LAPORAN */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-start gap-3">
              <button
                onClick={() => router.back()}
                className="mt-1 text-slate-500 hover:text-slate-800 print:hidden"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                  Detail Laporan Penjualan
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Laporan ID: {laporanId}
                </p>
              </div>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all print:hidden"
            >
              <Printer size={18} />
              Cetak Laporan
            </button>
          </div>

          {/* BANNER BIRU */}
          <div className="bg-[#3b66f5] text-white rounded-xl p-6 md:p-8 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm print:bg-white print:text-slate-800 print:border print:border-slate-200">
            <div>
              <p className="text-blue-100 text-sm print:text-slate-500">
                Periode Laporan
              </p>
              <h2 className="text-xl md:text-2xl font-bold mt-1">{periode}</h2>
            </div>
            <div className="md:text-right">
              <p className="text-blue-100 text-sm print:text-slate-500">
                Digenerate Pada
              </p>
              <p className="font-medium mt-1">{dibuatPada}</p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="rounded-xl bg-white p-5 border border-slate-100 shadow-sm print:shadow-none">
              <p className="text-sm text-slate-500">Total Transaksi</p>
              <h3 className="text-xl font-bold text-slate-800 mt-2">
                {stats.totalTransaksi}
              </h3>
              <p className="text-xs text-slate-400 mt-1">transaksi</p>
            </div>
            <div className="rounded-xl bg-white p-5 border border-slate-100 shadow-sm print:shadow-none">
              <p className="text-sm text-slate-500">Total Pendapatan</p>
              <h3 className="text-xl font-bold text-blue-600 mt-2">
                {stats.totalPendapatan}
              </h3>
              <p className="text-xs text-green-500 mt-1">↑ Lunas</p>
            </div>
            <div className="rounded-xl bg-white p-5 border border-slate-100 shadow-sm print:shadow-none">
              <p className="text-sm text-slate-500">Rata-rata per Transaksi</p>
              <h3 className="text-xl font-bold text-slate-800 mt-2">
                {stats.rataRata}
              </h3>
              <p className="text-xs text-slate-400 mt-1">per transaksi</p>
            </div>
            <div className="rounded-xl bg-white p-5 border border-slate-100 shadow-sm print:shadow-none">
              <p className="text-sm text-slate-500">Produk Terjual</p>
              <h3 className="text-xl font-bold text-slate-800 mt-2">
                {stats.produkTerjual}
              </h3>
              <p className="text-xs text-slate-400 mt-1">unit</p>
            </div>
          </div>

          {/* TABLE DETAIL TRANSAKSI */}
          <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden print:shadow-none print:border-slate-300">
            <div className="px-6 py-4 border-b border-slate-100 print:border-slate-300">
              <h3 className="font-bold text-slate-800">Detail Transaksi</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-700 print:bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Tanggal</th>
                    <th className="px-6 py-3 font-semibold">Produk</th>
                    <th className="px-6 py-3 font-semibold">Jumlah</th>
                    <th className="px-6 py-3 font-semibold">Harga</th>
                    <th className="px-6 py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                  {transaksi.length > 0 ? (
                    transaksi.map((trx, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-600">
                          {trx.tanggal}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {trx.produk}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {trx.jumlah}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {trx.harga}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {trx.total}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        Tidak ada detail transaksi pada periode ini.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* FOOTER TABEL TOTAL */}
                {transaksi.length > 0 && (
                  <tfoot className="bg-slate-50 border-t border-slate-200 print:bg-slate-100">
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-right font-bold text-slate-800"
                      >
                        Total Penjualan:
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600 text-base">
                        {stats.totalPendapatan}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* FOOTER PRINT - Hanya tampil kecil di bawah */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-400">
            <p>Laporan digenerate pada: {dibuatPada}</p>
            <p>
              Sistem Manajemen Distribusi Gudang &copy;{" "}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
