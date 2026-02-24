// components/Sidebar.tsx
"use client";

import {
  LayoutDashboard,
  Download,
  Upload,
  LogOut,
  Warehouse,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Untuk cek halaman aktif

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  // Helper untuk menentukan style menu aktif
  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    return `flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0F172A] text-white">
      {/* Logo Section */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-700 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
          <Warehouse size={18} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">SMDG</h1>
          <p className="text-[10px] text-slate-400">Distribution System</p>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 px-3 space-y-1">
        <div
          onClick={() => router.push("/dashboard/gudang")}
          className={getMenuClass("/dashboard/gudang")}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div
          onClick={() => router.push("/dashboard/gudang/barang-masuk")}
          className={getMenuClass("/dashboard/gudang/barang-masuk")}
        >
          <Download size={20} />
          <span>Barang Masuk</span>
        </div>

        <div
          className={getMenuClass("/dashboard/gudang/barang-keluar")}
          onClick={() => router.push("/dashboard/gudang/barang-keluar")}
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
  );
}
