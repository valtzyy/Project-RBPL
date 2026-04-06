"use client";

import {
  LayoutDashboard,
  FileText,
  Truck,
  LineChart,
  LogOut,
  Warehouse,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SidebarDistributor() {
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
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0F172A] text-white z-50">
      <div className="flex h-16 items-center gap-3 border-b border-slate-700 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
          <Warehouse size={18} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-none">SMDG</h1>
          <p className="text-[10px] text-slate-400">Distribution System</p>
        </div>
      </div>

      <nav className="mt-6 px-3 space-y-1">
        <div
          onClick={() => router.push("/dashboard/distributor")}
          className={getMenuClass("/dashboard/distributor")}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div
          onClick={() => router.push("/dashboard/distributor/invoice")}
          className={getMenuClass("/dashboard/distributor/invoice")}
        >
          <FileText size={20} />
          <span>Kelola Invoice & PO</span>
        </div>

        <div
          onClick={() => router.push("/dashboard/distributor/pengiriman")}
          className={getMenuClass("/dashboard/distributor/pengiriman")}
        >
          <Truck size={20} />
          <span>Status Pengiriman</span>
        </div>

        <div
          onClick={() => router.push("/dashboard/distributor/laporan")}
          className={getMenuClass("/dashboard/distributor/laporan")}
        >
          <LineChart size={20} />
          <span>Laporan Penjualan</span>
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
