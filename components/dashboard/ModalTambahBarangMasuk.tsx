"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { tambahBarangMasuk } from "@/app/actions/barangMasukAction";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listBarang: { id: number; namaBarang: string; kodeBarang: string }[]; // Data untuk dropdown
}

export default function ModalTambahBarangMasuk({
  isOpen,
  onClose,
  listBarang,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await tambahBarangMasuk(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose(); // Tutup modal jika sukses
      // Opsional: Tampilkan notifikasi sukses / Toast
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-800">
            Tambah Barang Masuk
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Input Nama Barang (Dropdown Select agar sesuai Schema Relation) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Nama Barang
            </label>
            <div className="relative">
              <select
                name="barangId"
                required
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="" disabled selected>
                  Pilih Barang...
                </option>
                {listBarang.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.kodeBarang} - {b.namaBarang}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              *Barang harus terdaftar di Master Barang
            </p>
          </div>

          {/* Input Jumlah */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Jumlah</label>
            <input
              name="jumlah"
              type="number"
              min="1"
              required
              placeholder="Masukkan jumlah"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Input Supplier */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Supplier
            </label>
            <input
              name="supplier"
              type="text"
              required
              placeholder="Masukkan nama supplier"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
