"use client";

import { useState } from "react";
import { Menu, Bell, User, Plus, Pencil, Trash2 } from "lucide-react";
import SidebarGudang from "@/components/sidebar";
import ModalTambahBarangKeluar from "./ModalTambahBarangKeluar";
import ModalEditBarangKeluar from "./ModalEditBarangKeluar";
import { hapusBarangKeluar } from "@/app/actions/barangKeluarAction";

interface BarangKeluarItem {
  id: number;
  barangId: number;
  tanggal: string;
  kodeBarang: string;
  namaBarang: string;
  jumlah: number;
  tujuan: string;
}

interface Props {
  data: BarangKeluarItem[];
  listBarang: {
    id: number;
    namaBarang: string;
    kodeBarang: string;
    stok: number;
  }[];
  userName: string;
  userRole: string;
}

export default function BarangKeluarUI({
  data,
  listBarang,
  userName,
  userRole,
}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BarangKeluarItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Yakin ingin membatalkan barang keluar ini? Stok di gudang akan otomatis dikembalikan.",
    );
    if (confirmDelete) {
      setIsDeleting(id);
      await hapusBarangKeluar(id);
      setIsDeleting(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <SidebarGudang isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="md:ml-64 w-full min-h-screen flex flex-col transition-all duration-300">
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
              <p className="text-xs text-slate-400">{userRole}</p>
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
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Barang Keluar
              </h1>
              <p className="text-sm md:text-base text-slate-500">
                Kelola data pengeluaran dan distribusi barang
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all w-full md:w-auto"
            >
              <Plus size={18} />
              Tambah Barang Keluar
            </button>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden w-full max-w-[calc(100vw-2rem)] md:max-w-full">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[700px]">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                    <th className="px-6 py-4 font-semibold">Kode Barang</th>
                    <th className="px-6 py-4 font-semibold">Nama Barang</th>
                    <th className="px-6 py-4 font-semibold">Jumlah Keluar</th>
                    <th className="px-6 py-4 font-semibold">Tujuan</th>
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
                        <td className="px-6 py-4 font-semibold text-orange-600">
                          {item.jumlah}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {item.tujuan}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setIsEditModalOpen(true);
                              }}
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit Data"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={isDeleting === item.id}
                              className={`rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors ${isDeleting === item.id ? "opacity-50 cursor-not-allowed" : ""}`}
                              title="Hapus Data"
                            >
                              <Trash2
                                size={16}
                                className={
                                  isDeleting === item.id ? "animate-pulse" : ""
                                }
                              />
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
                        Belum ada data barang keluar
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ModalTambahBarangKeluar
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listBarang={listBarang}
      />

      <ModalEditBarangKeluar
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        listBarang={listBarang}
        dataEdit={selectedItem}
      />
    </div>
  );
}
