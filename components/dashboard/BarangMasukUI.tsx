"use client";

import { useState } from "react"; // Tambah useState
import Sidebar from "@/components/sidebar";
import { Bell, User, Plus, Pencil, Trash2, Search } from "lucide-react";
import ModalTambahBarangMasuk from "./ModalTambahBarangMasuk"; // Import Modal

interface BarangMasukItem {
  id: number;
  tanggal: string;
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  supplier: string;
}

// Tambah tipe untuk prop baru
interface Props {
  data: BarangMasukItem[];
  listBarang: { id: number; namaBarang: string; kodeBarang: string }[];
  userName: string;
  userRole: string;
}

export default function BarangMasukUI({
  data,
  listBarang,
  userName,
  userRole,
}: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false); // State Modal

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar />

      <main className="ml-64 w-full min-h-screen flex flex-col">
        {/* ... (Header code sama seperti sebelumnya) ... */}
        <header className="flex h-16 items-center justify-between bg-white px-8 shadow-sm border-b border-slate-200">
          {/* ... Header content ... */}
          <div></div>
          <div className="flex items-center gap-4">
            {/* User Profile logic here same as before */}
          </div>
        </header>

        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Barang Masuk
              </h1>
              <p className="text-slate-500">Kelola data barang masuk gudang</p>
            </div>

            {/* Tombol Trigger Modal */}
            <button
              onClick={() => setIsModalOpen(true)} // Buka Modal
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all"
            >
              <Plus size={18} />
              Tambah Barang Masuk
            </button>
          </div>

          {/* ... (Table code sama seperti sebelumnya) ... */}
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
                        Belum ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Render Modal */}
      <ModalTambahBarangMasuk
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listBarang={listBarang}
      />
    </div>
  );
}
