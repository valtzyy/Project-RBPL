"use client";

import { useState } from "react";
import { Bell, User, Plus, Pencil, Trash2, Eye, LogOut } from "lucide-react";
import SidebarDistributor from "@/components/SidebarDistributor";
import ModalTambahInvoice from "./ModalTambahInvoice";
import ModalEditStatus from "./ModalEditStatus";
import ModalTambahPO from "./ModalTambahPO"; 
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface TransactionItem {
  id: number;
  tipe: "Invoice" | "PO";
  nomor: string;
  tanggal: string;
  namaMitra: string;
  total: string;
  status: string;
}

interface Props {
  data: TransactionItem[];
  // Tambahkan listBarang agar bisa dikirim ke Modal
  listBarang: {
    id: number;
    namaBarang: string;
    kodeBarang: string;
    harga: number;
  }[];
  userName: string;
  userRole: string;
}

export default function InvoicePOUI({
  data,
  listBarang,
  userName,
  userRole,
}: Props) {
  const router = useRouter();
  // State untuk mengontrol modal Buat Invoice dan PO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalPOOpen, setIsModalPOOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TransactionItem | null>(
    null,
  );
  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Helper Style untuk Badge Tipe (Invoice/PO)
  const getTipeBadge = (tipe: string) => {
    if (tipe === "Invoice") return "bg-blue-50 text-blue-600 ring-blue-500/20";
    return "bg-purple-50 text-purple-600 ring-purple-500/20";
  };

  // Helper Style untuk Badge Status
  const getStatusBadge = (status: string) => {
    if (status === "PAID" || status === "RECEIVED")
      return "bg-green-50 text-green-700 ring-green-600/20";
    if (status === "DRAFT")
      return "bg-yellow-50 text-yellow-700 ring-yellow-600/20";
    if (status === "ISSUED" || status === "ORDERED")
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    if (status === "CANCELLED") return "bg-red-50 text-red-700 ring-red-600/20";
    return "bg-slate-50 text-slate-700 ring-slate-600/20";
  };

  const getStatusText = (status: string) => {
    if (status === "PAID") return "Lunas";
    if (status === "RECEIVED") return "Selesai";
    if (status === "DRAFT") return "Pending";
    if (status === "ISSUED" || status === "ORDERED") return "Proses";
    if (status === "CANCELLED") return "Batal";
    return status;
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
                Kelola Invoice & PO
              </h1>
              <p className="text-slate-500">
                Kelola data invoice dan purchase order
              </p>
            </div>

            <div className="flex gap-3">
              {/* Tombol Buat Invoice - SEKARANG MEMBUKA MODAL */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-all"
              >
                <Plus size={18} />
                Buat Invoice Baru
              </button>

              <button
                onClick={() => setIsModalPOOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-emerald-700 transition-all"
              >
                <Plus size={18} />
                Buat PO Baru
              </button>
            </div>
          </div>

          {/* TABLE SECTION */}
          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Tipe</th>
                    <th className="px-6 py-4 font-semibold">
                      Nomor Invoice/PO
                    </th>
                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                    <th className="px-6 py-4 font-semibold">Nama Mitra</th>
                    <th className="px-6 py-4 font-semibold">Total</th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Status
                    </th>
                    <th className="px-6 py-4 font-semibold text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${getTipeBadge(item.tipe)}`}
                          >
                            {item.tipe}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {item.nomor}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {item.tanggal}
                        </td>
                        <td className="px-6 py-4 text-slate-800">
                          {item.namaMitra}
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {item.total}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(item.status)}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem(item); // Simpan data baris yang diklik
                                setIsEditModalOpen(true); // Buka modal
                              }}
                              className="rounded p-1.5 text-green-600 hover:bg-green-50 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        Belum ada data Invoice atau Purchase Order.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Render Modal Tambah Invoice */}
      <ModalTambahInvoice
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        listBarang={listBarang}
      />

      {/* Render Modal Tambah PO */}
      <ModalTambahPO
        isOpen={isModalPOOpen}
        onClose={() => setIsModalPOOpen(false)}
        listBarang={listBarang}
      />

      <ModalEditStatus
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        dataTransaksi={selectedItem}
      />
    </div>
  );
}
