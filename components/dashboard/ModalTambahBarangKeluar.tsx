"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { tambahBarangKeluar } from "@/app/actions/barangKeluarAction";

// PERUBAHAN 1: Wajib tambahkan tipe 'stok: number' agar UI tahu sisa stok
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listBarang: {
    id: number;
    namaBarang: string;
    kodeBarang: string;
    stok: number;
  }[];
}

export default function ModalTambahBarangKeluar({
  isOpen,
  onClose,
  listBarang,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State untuk memantau barang mana yang sedang dipilih di dropdown
  const [selectedId, setSelectedId] = useState("");

  if (!isOpen) return null;

  // Cari data detail barang yang sedang dipilih
  const barangTerpilih = listBarang.find((b) => b.id.toString() === selectedId);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await tambahBarangKeluar(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setSelectedId(""); // Reset pilihan saat sukses
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 transition-opacity backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-800">
            Tambah Barang Keluar
          </h3>
          <button
            onClick={() => {
              setSelectedId("");
              onClose();
            }}
            className="text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* INPUT BARANG */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Nama Barang
            </label>
            <div className="relative">
              <select
                name="barangId"
                required
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Pilih Barang...
                </option>
                {listBarang.map((b) => (
                  <option key={b.id} value={b.id} disabled={b.stok === 0}>
                    {b.kodeBarang} - {b.namaBarang}{" "}
                    {b.stok === 0 ? "(Habis)" : ""}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* INDIKATOR STOK */}
            {barangTerpilih && (
              <p
                className={`text-[11px] mt-1 font-medium ${barangTerpilih.stok === 0 ? "text-red-500" : "text-blue-600"}`}
              >
                Sisa stok di gudang: {barangTerpilih.stok}
              </p>
            )}
          </div>

          {/* INPUT JUMLAH */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Jumlah Keluar
            </label>
            <input
              name="jumlah"
              type="number"
              min="1"
              max={barangTerpilih ? barangTerpilih.stok : undefined} // PERUBAHAN 2: Kunci input maksimal
              required
              disabled={!selectedId || barangTerpilih?.stok === 0}
              placeholder="Masukkan jumlah pengeluaran"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Tujuan Pengiriman
            </label>
            <input
              name="tujuan"
              type="text"
              required
              placeholder="Masukkan tujuan (mis: Toko A)"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={() => {
                setSelectedId("");
                onClose();
              }}
              className="flex-1 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || !selectedId || barangTerpilih?.stok === 0}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Simpan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
