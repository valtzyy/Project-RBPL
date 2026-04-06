"use client";

import { useState } from "react";
import { Bell, User, LogOut, ExternalLink } from "lucide-react";
import SidebarDistributor from "@/components/SidebarDistributor";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import ModalEditPengiriman from "./ModalEditPengiriman";

interface PengirimanItem {
  id_db: number;
  id_pengiriman: string;
  nomorInvoice: string;
  tujuan: string;
  kurir: string;
  status: string;
}

interface Props {
  data: PengirimanItem[];
  userName: string;
  userRole: string;
}

export default function PengirimanUI({ data, userName, userRole }: Props) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengirimanItem | null>(null);

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Helper Badge Status persis seperti desain
  const getStatusBadge = (status: string) => {
    if (status === "Selesai") return "bg-green-100 text-green-700";
    if (status === "Diproses") return "bg-yellow-100 text-yellow-700";
    if (status === "Dikirim") return "bg-blue-100 text-blue-700";
    if (status === "Dibatalkan") return "bg-red-100 text-red-700";
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-800">
              Status Pengiriman
            </h1>
            <p className="text-slate-500 mt-1">
              Kelola dan update status pengiriman
            </p>
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white border-b border-slate-100 text-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold">ID Pengiriman</th>
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
                        <td className="px-6 py-5 text-slate-700">
                          {item.id_pengiriman}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {item.nomorInvoice.split("-").map((part, i, arr) => (
                            <span key={i}>
                              {part}
                              {i !== arr.length - 1 && <br />}
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {item.tujuan}
                        </td>
                        <td className="px-6 py-5 text-slate-700">
                          {item.kurir}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${getStatusBadge(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setIsModalOpen(true);
                            }}
                            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                          >
                            <ExternalLink size={14} />
                            <span className="flex flex-col text-left leading-tight">
                              <span>Update</span>
                              <span>Status</span>
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-slate-400"
                      >
                        Belum ada data pengiriman.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ModalEditPengiriman
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataPengiriman={selectedItem}
      />
    </div>
  );
}
