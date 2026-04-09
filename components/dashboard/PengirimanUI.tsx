"use client";

import { useState } from "react";
import { Bell, User, LogOut, ExternalLink, Plus } from "lucide-react"; // Tambahkan icon Plus
import SidebarDistributor from "@/components/SidebarDistributor";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import ModalEditPengiriman from "./ModalEditPengiriman";

// 1. IMPORT MODAL TAMBAH PENGIRIMAN
import ModalTambahPengiriman from "./ModalTambahPengiriman";

interface PengirimanItem {
  id: number;
  nomorInvoice: string;
  tujuan: string;
  kurir: string;
  resi: string;
  status: string;
}

interface Props {
  data: PengirimanItem[];
  // 2. TAMBAHKAN availableInvoices UNTUK MODAL
  availableInvoices: { id: number; nomorInvoice: string; mitraName: string }[];
  userName: string;
  userRole: string;
}

export default function PengirimanUI({
  data,
  availableInvoices,
  userName,
  userRole,
}: Props) {
  const router = useRouter();

  // State untuk modal edit
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengirimanItem | null>(null);

  // 3. STATE UNTUK MODAL TAMBAH BARU
  const [isModalTambahOpen, setIsModalTambahOpen] = useState(false);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Helper Badge Status
  const getStatusBadge = (status: string) => {
    // Sesuaikan dengan enum Prisma kamu (DIPROSES, DIKIRIM, SELESAI, DIBATALKAN)
    const normalizedStatus = status.toUpperCase();
    if (normalizedStatus === "SELESAI") return "bg-green-100 text-green-700";
    if (normalizedStatus === "DIPROSES") return "bg-yellow-100 text-yellow-700";
    if (normalizedStatus === "DIKIRIM") return "bg-blue-100 text-blue-700";
    if (normalizedStatus === "DIBATALKAN") return "bg-red-100 text-red-700";
    return "bg-slate-100 text-slate-700";
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
          {/* 4. PERBAIKI BAGIAN INI UNTUK MENAMPILKAN TOMBOL */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Status Pengiriman
              </h1>
              <p className="text-slate-500 mt-1">
                Kelola dan update status pengiriman
              </p>
            </div>

            {/* TOMBOL TAMBAH PENGIRIMAN */}
            <button
              onClick={() => setIsModalTambahOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all"
            >
              <Plus size={18} />
              Buat Pengiriman
            </button>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-slate-100 text-slate-700">
                  <tr>
                    {/* Hapus ID Pengiriman jika tidak digunakan di database */}
                    {/* <th className="px-6 py-4 font-bold">ID Pengiriman</th> */}
                    <th className="px-6 py-4 font-bold">Nomor Invoice</th>
                    <th className="px-6 py-4 font-bold">Tujuan</th>
                    <th className="px-6 py-4 font-bold">Kurir</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        {/* <td className="px-6 py-5 text-slate-700">{item.id_pengiriman}</td> */}
                        <td className="px-6 py-5 text-slate-700 font-medium">
                          {item.nomorInvoice}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {item.tujuan}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {item.kurir || "-"}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium uppercase tracking-wider ${getStatusBadge(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsModalEditOpen(true);
                            }}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100"
                          >
                            <ExternalLink size={14} />
                            <span>Update</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        Belum ada data pengiriman. Klik "Buat Pengiriman" untuk
                        menambahkan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* RENDER MODAL EDIT STATUS LAMA */}
      <ModalEditPengiriman
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        dataPengiriman={selectedItem}
      />

      {/* 5. RENDER MODAL TAMBAH BARU */}
      <ModalTambahPengiriman
        isOpen={isModalTambahOpen}
        onClose={() => setIsModalTambahOpen(false)}
        availableInvoices={availableInvoices}
      />
    </div>
  );
}
