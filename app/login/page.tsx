"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Warehouse, LogIn } from "lucide-react"; // Icon gudang & panah

export default function LoginPage() {
  const router = useRouter();

  // State untuk form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      },
    );
  };

  return (
    // Container Utama (Background Abu-abu halus)
    <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] font-sans">
      {/* Card Login (Putih, Shadow Halus, Rounded) */}
      <div className="w-full max-w-[420px] rounded-2xl bg-white p-10 shadow-sm border border-slate-100">
        {/* Header: Logo & Judul */}
        <div className="mb-8 flex flex-col items-center text-center">
          {/* Icon Gudang (Kotak Biru) */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-blue-200 shadow-md">
            <Warehouse size={28} strokeWidth={2} />
          </div>

          <h1 className="text-lg font-semibold text-slate-800">
            Sistem Manajemen Distribusi Gudang
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Silakan login untuk melanjutkan
          </p>
        </div>

        {/* Form Input */}
        <div className="space-y-5">
          {/* Input Email (Pengganti Username) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Pesan Error (Muncul jika salah password) */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {/* Tombol Login */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Memproses..."
            ) : (
              <>
                <LogIn size={18} />
                Login
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
