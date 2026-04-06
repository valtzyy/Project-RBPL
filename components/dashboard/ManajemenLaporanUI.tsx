"use client";

import { useState } from "react";
import { Eye, Bell, User, LogOut, Menu, ChevronRight } from "lucide-react";
import SidebarManajemen from "@/components/SidebarManajemen";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Tambahkan id_db agar button Lihat bisa bekerja dengan parameter yang benar
interface LaporanItem {
  id_db: number;
  id: string; // LPR-2025-001
  periode: string;
  total: string;
  dibuatPada: string;
}

interface ManajemenLaporanUIProps {
  userName: string;
  userRole: string;
  data: LaporanItem[];
}

export default function ManajemenLaporanUI({
  userName,
  userRole,
  data,
}: ManajemenLaporanUIProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
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
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <span
              className="cursor-pointer hover:text-slate-800 transition-colors"
              onClick={() => router.push("/dashboard/manajemen")}
            >
              Dashboard
            </span>
            <ChevronRight size={14} />
            <span className="text-slate-800 font-medium">
              Laporan Penjualan
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">
              Laporan Penjualan
            </h1>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              Kelola dan lihat laporan penjualan distribusi
            </p>
          </div>

          {/* TABLE SECTION */}
          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden w-full max-w-[calc(100vw-2rem)] md:max-w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold">ID Laporan</th>
                    <th className="px-6 py-4 font-bold">Periode</th>
                    <th className="px-6 py-4 font-bold">Total Penjualan</th>
                    <th className="px-6 py-4 font-bold">Dibuat Pada</th>
                    <th className="px-6 py-4 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-5 text-slate-700">{item.id}</td>
                        <td className="px-6 py-5 text-slate-700">
                          {item.periode}
                        </td>
                        <td className="px-6 py-5 text-blue-600 font-medium">
                          {item.total}
                        </td>
                        <td className="px-6 py-5 text-slate-500">
                          {item.dibuatPada}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center">
                            {/* PENTING: Gunakan item.id_db, BUKAN item.id */}
                            <button
                              onClick={() =>
                                router.push(
                                  `/dashboard/manajemen/laporan/${item.id_db}`,
                                )
                              }
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                            >
                              <Eye size={16} />
                              <span>Lihat</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        Belum ada laporan penjualan yang dibuat.
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
