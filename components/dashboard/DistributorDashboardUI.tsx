"use client";

import { DollarSign, FileText, Truck, Bell, User, LogOut } from "lucide-react";
import SidebarDistributor from "@/components/SidebarDistributor";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface DashboardProps {
  userName: string;
  userRole: string;
  stats: {
    totalTransaksi: number;
    totalInvoice: number;
    pengirimanAktif: number;
  };
  invoices: { no: string; mitra: string; total: string; status: string }[];
  pengirimans: { id: string; tujuan: string; kurir: string; status: string }[];
}

export default function DistributorDashboardUI({
  userName,
  userRole,
  stats,
  invoices,
  pengirimans,
}: DashboardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Helper untuk warna badge status Invoice
  const getInvoiceBadge = (status: string) => {
    if (status === "Lunas")
      return "bg-green-50 text-green-700 ring-green-600/20";
    if (status === "Pending")
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
    return "bg-blue-50 text-blue-700 ring-blue-600/20"; // Proses
  };

  // Helper untuk warna badge status Pengiriman
  const getPengirimanBadge = (status: string) => {
    if (status === "Selesai")
      return "bg-green-50 text-green-700 ring-green-600/20";
    if (status === "Diproses")
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
    return "bg-blue-50 text-blue-700 ring-blue-600/20"; // Dikirim
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <SidebarDistributor />

      <main className="ml-64 w-full min-h-screen flex flex-col">
        {/* TOPBAR */}
        <header className="flex h-16 items-center justify-between bg-white px-8 shadow-sm border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-700">
              Sistem Manajemen Distribusi Gudang
            </h2>
            <p className="text-xs text-slate-400">{userRole}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-700">
                  {userName}
                </p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={20} />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 border border-red-100 ml-2"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard Admin Distributor
            </h1>
            <p className="text-slate-500">Ringkasan transaksi dan pengiriman</p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <DollarSign size={24} />
              </div>
              <p className="text-sm font-medium text-slate-500">
                Total Transaksi
              </p>
              <h3 className="text-2xl font-bold text-blue-600 mt-1">
                {stats.totalTransaksi}
              </h3>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <FileText size={24} />
              </div>
              <p className="text-sm font-medium text-slate-500">
                Total Invoice
              </p>
              <h3 className="text-2xl font-bold text-green-600 mt-1">
                {stats.totalInvoice}
              </h3>
            </div>
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                <Truck size={24} />
              </div>
              <p className="text-sm font-medium text-slate-500">
                Pengiriman Aktif
              </p>
              <h3 className="text-2xl font-bold text-orange-600 mt-1">
                {stats.pengirimanAktif}
              </h3>
            </div>
          </div>

          {/* TABLES GRID (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* INVOICE TABLE */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">
                  Invoice Terbaru
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">No Invoice</th>
                      <th className="px-6 py-3 font-medium">Mitra</th>
                      <th className="px-6 py-3 font-medium">Total</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-600">{inv.no}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {inv.mitra}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {inv.total}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getInvoiceBadge(inv.status)}`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PENGIRIMAN TABLE */}
            <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">
                  Pengiriman Terbaru
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">ID</th>
                      <th className="px-6 py-3 font-medium">Tujuan</th>
                      <th className="px-6 py-3 font-medium">Kurir</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pengirimans.map((png, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-slate-600">{png.id}</td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {png.tujuan}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {png.kurir}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getPengirimanBadge(png.status)}`}
                          >
                            {png.status}
                          </span>
                        </td>
                      </tr>
                    ))}
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
