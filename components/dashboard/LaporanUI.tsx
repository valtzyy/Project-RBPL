"use client";

import { useState } from "react";
import {
  Bell,
  User,
  Plus,
  Search,
  Eye,
  ArrowUpDown,
  LogOut,
} from "lucide-react";
import SidebarDistributor from "@/components/SidebarDistributor";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import ModalBuatLaporan from "./ModalBuatLaporan";

interface LaporanItem {
  id_db: number;
  id_laporan: string;
  periode: string;
  total: string;
}

interface Props {
  data: LaporanItem[];
  userName: string;
  userRole: string;
}

export default function LaporanUI({ data, userName, userRole }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Simple Search Filter
  const filteredData = data.filter(
    (item) =>
      item.id_laporan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.periode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Laporan Penjualan
              </h1>
              <p className="text-slate-500 mt-1">
                Kelola dan lihat laporan penjualan
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all"
            >
              <Plus size={18} />
              Buat Laporan Baru
            </button>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden p-6">
            {/* ACTION BAR (Search & Sort) */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari ID Laporan atau Periode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="w-full md:w-48">
                <select className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 bg-white">
                  <option value="terbaru">Urutkan Berdasarkan</option>
                  <option value="terbaru">Terbaru</option>
                  <option value="terlama">Terlama</option>
                  <option value="tertinggi">Penjualan Tertinggi</option>
                </select>
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto border rounded-lg border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold cursor-pointer hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        ID Laporan{" "}
                        <ArrowUpDown size={14} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 font-bold cursor-pointer hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        Periode{" "}
                        <ArrowUpDown size={14} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 font-bold cursor-pointer hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        Total Penjualan{" "}
                        <ArrowUpDown size={14} className="text-slate-400" />
                      </div>
                    </th>
                    <th className="px-6 py-4 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-5 text-slate-700">
                          {item.id_laporan}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {item.periode}
                        </td>
                        <td className="px-6 py-5 text-slate-700 font-medium">
                          {item.total}
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() =>
                              alert(`Membuka detail ${item.id_laporan}`)
                            }
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            <Eye size={16} />
                            <span>Lihat</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        {searchQuery
                          ? "Laporan tidak ditemukan."
                          : "Belum ada laporan penjualan."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ModalBuatLaporan
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
