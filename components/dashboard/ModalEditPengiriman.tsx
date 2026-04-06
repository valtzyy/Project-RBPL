"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { updateStatusPengiriman } from "@/app/actions/PengirimanAction";

interface PengirimanItem {
  id_db: number;
  id_pengiriman: string;
  nomorInvoice: string;
  tujuan: string;
  kurir: string;
  status: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  dataPengiriman: PengirimanItem | null;
}

export default function ModalEditPengiriman({
  isOpen,
  onClose,
  dataPengiriman,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (dataPengiriman) {
      // Mapping dari text UI ke nilai ENUM database jika diperlukan
      let dbStatus = "DIPROSES";
      if (dataPengiriman.status === "Dikirim") dbStatus = "DIKIRIM";
      if (dataPengiriman.status === "Selesai") dbStatus = "SELESAI";
      if (dataPengiriman.status === "Dibatalkan") dbStatus = "DIBATALKAN";

      setStatus(dbStatus);
    }
  }, [dataPengiriman]);

  if (!isOpen || !dataPengiriman) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await updateStatusPengiriman(dataPengiriman.id_db, status);

    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-800">
            Update Status Pengiriman
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <p className="text-xs text-slate-500">ID Pengiriman</p>
              <p className="font-semibold text-slate-800">
                {dataPengiriman.id_pengiriman}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Nomor Invoice</p>
              <p className="font-semibold text-slate-800">
                {dataPengiriman.nomorInvoice}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Pilih Status Baru
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="DIPROSES">Diproses</option>
              <option value="DIKIRIM">Dikirim</option>
              <option value="SELESAI">Selesai</option>
              <option value="DIBATALKAN">Dibatalkan</option>
            </select>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Simpan Status"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
