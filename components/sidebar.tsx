"use client";

import {
  LayoutDashboard,
  Download,
  Upload,
  LogOut,
  Warehouse,
  X, // Tambahkan icon X untuk tombol close di HP
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// 1. INI KUNCI FIX-NYA: Tambahkan interface agar TypeScript tidak error
interface SidebarProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

// 2. Terapkan props ke dalam fungsi Sidebar
export default function Sidebar({ isOpen = false, setIsOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    return `flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;
  };

  return (
    <>
      {/* OVERLAY HITAM TRANSPARAN (Hanya muncul di Mobile saat sidebar terbuka) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setIsOpen && setIsOpen(false)}
        />
      )}

      {/* SIDEBAR CONTAINER dengan efek transisi geser */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-[#0F172A] text-white z-50 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-700 px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <Warehouse size={18} />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">SMDG</h1>
              <p className="text-[10px] text-slate-400">Distribution System</p>
            </div>
          </div>

          {/* Tombol Close untuk Mobile */}
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={() => setIsOpen && setIsOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-6 px-3 space-y-1">
          <div
            onClick={() => {
              router.push("/dashboard/gudang");
              if (setIsOpen) setIsOpen(false);
            }}
            className={getMenuClass("/dashboard/gudang")}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>

          <div
            onClick={() => {
              router.push("/dashboard/gudang/barang-masuk");
              if (setIsOpen) setIsOpen(false);
            }}
            className={getMenuClass("/dashboard/gudang/barang-masuk")}
          >
            <Download size={20} />
            <span>Barang Masuk</span>
          </div>

          <div
            className={getMenuClass("/dashboard/gudang/barang-keluar")}
            onClick={() => {
              router.push("/dashboard/gudang/barang-keluar");
              if (setIsOpen) setIsOpen(false);
            }}
          >
            <Upload size={20} />
            <span>Barang Keluar</span>
          </div>

          <div
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors mt-8"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>
    </>
  );
}
