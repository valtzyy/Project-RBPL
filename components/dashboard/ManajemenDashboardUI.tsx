"use client";

import { useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Eye,
  Bell,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import SidebarManajemen from "@/components/SidebarManajemen";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface ProdukTerlaris {
  nama: string;
  terjual: number;
  pendapatan: string;
}

interface LaporanRingkas {
  id: string;
  periode: string;
}

interface DashboardProps {
  userName: string;
  userRole: string;
  stats: {
    totalPenjualan: string;
    trenPenjualan: number;
    jumlahTransaksi: number;
    trenTransaksi: number;
    rataRata: string;
    trenRataRata: number;
  };
  chartData: number[]; // Array berisi 12 angka (Jan - Des) dalam satuan Juta
  produkTerlaris: ProdukTerlaris[];
  laporanTerbaru: LaporanRingkas[];
}

export default function ManajemenDashboardUI({
  userName,
  userRole,
  stats,
  chartData,
  produkTerlaris,
  laporanTerbaru,
}: DashboardProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Helper untuk menggambar SVG Chart Dinamis secara manual tanpa library tambahan
  const maxChartValue = Math.max(...chartData, 100); // Minimal skala 100
  const chartHeight = 200;
  const chartWidth = 800;
  const padding = 20;

  const points = chartData
    .map((val, index) => {
      const x = padding + (index * (chartWidth - padding * 2)) / 11;
      const y =
        chartHeight -
        padding -
        (val / maxChartValue) * (chartHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar Khusus Manajemen */}
      <SidebarManajemen isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="md:ml-64 w-full min-h-screen flex flex-col transition-all duration-300">
        {/* TOPBAR */}
        <header className="flex h-16 items-center justify-between bg-white px-4 md:px-8 shadow-sm border-b border-slate-200">
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
                <p className="text-xs text-slate-500">Manajemen Eksekutif</p>
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

        {/* CONTENT */}
        <div className="p-4 md:p-8">
          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              Dashboard Manajemen
            </h1>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              Ringkasan penjualan dan performa bisnis
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
            {/* Card 1 */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <DollarSign size={24} />
                </div>
                <span
                  className={`text-sm font-semibold ${stats.trenPenjualan >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {stats.trenPenjualan >= 0 ? "+" : ""}
                  {stats.trenPenjualan}%
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Total Penjualan Bulan Ini
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-blue-600 mt-1 truncate">
                {stats.totalPenjualan}
              </h3>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <ShoppingCart size={24} />
                </div>
                <span
                  className={`text-sm font-semibold ${stats.trenTransaksi >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {stats.trenTransaksi >= 0 ? "+" : ""}
                  {stats.trenTransaksi}%
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Jumlah Transaksi
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-green-600 mt-1">
                {stats.jumlahTransaksi}
              </h3>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  {stats.trenRataRata >= 0 ? (
                    <TrendingUp size={24} />
                  ) : (
                    <TrendingDown size={24} />
                  )}
                </div>
                <span
                  className={`text-sm font-semibold ${stats.trenRataRata >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {stats.trenRataRata >= 0 ? "+" : ""}
                  {stats.trenRataRata}%
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500">
                Rata-rata Transaksi
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-orange-600 mt-1 truncate">
                {stats.rataRata}
              </h3>
            </div>
          </div>

          {/* CHART SECTION */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 mb-8 overflow-hidden w-full max-w-[calc(100vw-2rem)] md:max-w-full">
            <h3 className="font-semibold text-slate-800 mb-6">
              Grafik Penjualan Tahunan (dalam juta)
            </h3>
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px] h-[250px] flex items-end">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-full overflow-visible"
                >
                  {/* Grid Lines Hori */}
                  {[0, 1, 2, 3, 4].map((line) => {
                    const y =
                      padding + (line * (chartHeight - padding * 2)) / 4;
                    const val = maxChartValue - (line * maxChartValue) / 4;
                    return (
                      <g key={`grid-${line}`}>
                        <line
                          x1={padding}
                          y1={y}
                          x2={chartWidth - padding}
                          y2={y}
                          stroke="#e2e8f0"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={0}
                          y={y + 4}
                          fill="#64748b"
                          fontSize="12"
                          className="text-xs"
                        >
                          {Math.round(val)}
                        </text>
                      </g>
                    );
                  })}
                  {/* Garis Data */}
                  <polyline
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="3"
                    points={points}
                    className="drop-shadow-sm"
                  />
                  {/* Titik & Label Bulan */}
                  {chartData.map((val, index) => {
                    const x =
                      padding + (index * (chartWidth - padding * 2)) / 11;
                    const y =
                      chartHeight -
                      padding -
                      (val / maxChartValue) * (chartHeight - padding * 2);
                    const months = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "Mei",
                      "Jun",
                      "Jul",
                      "Agt",
                      "Sep",
                      "Okt",
                      "Nov",
                      "Des",
                    ];
                    return (
                      <g key={`point-${index}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="white"
                          stroke="#4f46e5"
                          strokeWidth="2"
                        />
                        <text
                          x={x}
                          y={chartHeight}
                          fill="#64748b"
                          fontSize="12"
                          textAnchor="middle"
                        >
                          {months[index]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* BOTTOM GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Produk Terlaris */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden w-full">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">
                  Produk Terlaris
                </h3>
              </div>
              <div className="p-2">
                {produkTerlaris.length > 0 ? (
                  produkTerlaris.map((prod, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="font-medium text-slate-800">
                          {prod.nama}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {prod.terjual} unit terjual
                        </p>
                      </div>
                      <p className="font-medium text-indigo-600">
                        {prod.pendapatan}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 text-sm">
                    Belum ada data penjualan produk.
                  </div>
                )}
              </div>
            </div>

            {/* Laporan Terbaru */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden w-full">
              <div className="px-6 py-5 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">
                  Laporan Terbaru
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-6 py-3 font-medium">ID Laporan</th>
                      <th className="px-6 py-3 font-medium">Periode</th>
                      <th className="px-6 py-3 font-medium text-center">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {laporanTerbaru.length > 0 ? (
                      laporanTerbaru.map((lap, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-700">{lap.id}</td>
                          <td className="px-6 py-4 text-slate-600">
                            {lap.periode}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded transition-colors">
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-6 py-8 text-center text-slate-400 text-sm"
                        >
                          Belum ada laporan yang di-generate.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
