"use client";

import { Download, Upload, LogOut, Package, Bell, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar"; 

interface DashboardUIProps {
  user: {
    name: string;
    role: string;
  };
  totalBarang: number;
  barangMasuk: number;
  barangKeluar: number;
  aktivitas: {
    tanggal: string;
    tipe: string;
    nama: string;
    jumlah: number;
    keterangan: string;
  }[];
}

export default function DashboardUI({
  user,
  totalBarang,
  barangMasuk,
  barangKeluar,
  aktivitas,
}: DashboardUIProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* ================= SIDEBAR ================= */}
      {/* Kita ganti kode <aside> panjang tadi dengan satu baris ini */}
      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-64 w-full min-h-screen flex flex-col">
        {/* TOPBAR */}
        <header className="flex h-16 items-center justify-between bg-white px-8 shadow-sm border-b border-slate-200">
          <div>
            <h2 className="text-lg font-semibold text-slate-700">
              Sistem Manajemen Distribusi Gudang
            </h2>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 border border-white"></span>
            </button>

            {/* Profile & Logout */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-700">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={20} />
              </div>

              {/* Tombol Logout Topbar */}
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

        {/* CONTENT BODY */}
        <div className="p-8">
          {/* Header Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Dashboard Admin Gudang
            </h1>
            <p className="text-slate-500">
              Ringkasan aktivitas gudang hari ini
            </p>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Total Barang */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 flex items-start justify-between">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Package size={24} />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Total Barang
                </p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">
                  {totalBarang.toLocaleString("id-ID")}
                </h3>
              </div>
            </div>

            {/* Card 2: Barang Masuk */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 flex items-start justify-between">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <Download size={24} />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Barang Masuk Hari Ini
                </p>
                <h3 className="text-2xl font-bold text-green-600 mt-1">
                  {barangMasuk.toLocaleString("id-ID")}
                </h3>
              </div>
            </div>

            {/* Card 3: Barang Keluar */}
            <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100 flex items-start justify-between">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                  <Upload size={24} />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  Barang Keluar Hari Ini
                </p>
                <h3 className="text-2xl font-bold text-orange-600 mt-1">
                  {barangKeluar.toLocaleString("id-ID")}
                </h3>
              </div>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">
                Aktivitas Terbaru
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Tanggal</th>
                    <th className="px-6 py-3 font-medium">Tipe</th>
                    <th className="px-6 py-3 font-medium">Nama Barang</th>
                    <th className="px-6 py-3 font-medium">Jumlah</th>
                    <th className="px-6 py-3 font-medium">Supplier/Tujuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {aktivitas.length > 0 ? (
                    aktivitas.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-600">
                          {item.tanggal}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              item.tipe === "Masuk"
                                ? "bg-green-50 text-green-700 ring-green-600/20"
                                : "bg-orange-50 text-orange-700 ring-orange-600/20"
                            }`}
                          >
                            {item.tipe}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {item.nama}
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-semibold">
                          {item.jumlah}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {item.keterangan}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-slate-400"
                      >
                        Belum ada aktivitas hari ini
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
