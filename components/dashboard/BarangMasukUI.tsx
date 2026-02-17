// components/dashboard/BarangMasukUI.tsx
"use client";

import Sidebar from "@/components/sidebar"; // Reuse Sidebar
import { Bell, User, Plus, Pencil, Trash2, Search } from "lucide-react";

interface BarangMasukItem {
  id: number;
  tanggal: string;
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  supplier: string;
}

interface Props {
  data: BarangMasukItem[];
  userName: string;
  userRole: string;
}

export default function BarangMasukUI({ data, userName, userRole }: Props) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* 1. Panggil Sidebar */}
      <Sidebar />

      {/* 2. Main Content */}
      <main className="ml-64 w-full min-h-screen flex flex-col">
        {/* TOPBAR (Sama seperti dashboard) */}
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
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <div className="p-8">
          {/* HEADER SECTION (Judul & Tombol Tambah) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Barang Masuk
              </h1>
              <p className="text-slate-500">Kelola data barang masuk gudang</p>
            </div>

            <button
              onClick={() => alert("Fitur Tambah akan dibuat selanjutnya!")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all"
            >
              <Plus size={18} />
              Tambah Barang Masuk
            </button>
          </div>

          {/* TABLE SECTION */}
          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                    <th className="px-6 py-4 font-semibold">Kode Barang</th>
                    <th className="px-6 py-4 font-semibold">Nama Barang</th>
                    <th className="px-6 py-4 font-semibold">Jumlah Masuk</th>
                    <th className="px-6 py-4 font-semibold">Supplier</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length > 0 ? (
                    data.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-600">
                          {item.tanggal}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {item.kodeBarang}
                        </td>
                        <td className="px-6 py-4 text-slate-800">
                          {item.namaBarang}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {item.jumlah}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {item.supplier}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors">
                              <Pencil size={16} />
                            </button>
                            <button className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search size={32} className="text-slate-200" />
                          <p>Belum ada data barang masuk</p>
                        </div>
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
