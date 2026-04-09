// components/dashboard/ModalTambahPengiriman.tsx
"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { buatPengiriman } from "@/app/actions/PengirimanAction";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableInvoices: { id: number; nomorInvoice: string; mitraName: string }[];
}

export default function ModalTambahPengiriman({
  isOpen,
  onClose,
  availableInvoices,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMitra, setSelectedMitra] = useState("");

  if (!isOpen) return null;

  const handleInvoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const invoiceId = e.target.value;
    const selected = availableInvoices.find(
      (inv) => inv.id.toString() === invoiceId,
    );
    if (selected) setSelectedMitra(selected.mitraName); // Auto-fill tujuan
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const result = await buatPengiriman(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      setSelectedMitra("");
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 transition-opacity backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-800">
            Buat Pengiriman Baru
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:bg-slate-100 p-2 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Pilih Invoice
            </label>
            <select
              name="invoiceId"
              required
              onChange={handleInvoiceChange}
              defaultValue=""
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Pilih Invoice yang akan dikirim --
              </option>
              {availableInvoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.nomorInvoice} - {inv.mitraName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Tujuan Pengiriman
            </label>
            <input
              name="tujuan"
              type="text"
              required
              defaultValue={selectedMitra}
              placeholder="Nama Toko / Alamat"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Kurir / Ekspedisi (Opsional)
            </label>
            <input
              name="kurir"
              type="text"
              placeholder="Misal: Kurir Internal, JNE, dll"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
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
