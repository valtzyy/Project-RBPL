"use client";

import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { updateBarangKeluar } from "@/app/actions/barangKeluarAction";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listBarang: { id: number; namaBarang: string; kodeBarang: string }[];
  dataEdit: any; // Data dari tabel
}

export default function ModalEditBarangKeluar({
  isOpen,
  onClose,
  listBarang,
  dataEdit,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [tanggal, setTanggal] = useState("");
  const [barangId, setBarangId] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [tujuan, setTujuan] = useState("");

  useEffect(() => {
    if (dataEdit && isOpen) {
      const formatTanggal = dataEdit.tanggal.includes("/")
        ? dataEdit.tanggal.split("/").reverse().join("-")
        : dataEdit.tanggal;

      setTanggal(formatTanggal);
      setBarangId(dataEdit.barangId?.toString() || "");
      setJumlah(dataEdit.jumlah.toString());
      setTujuan(dataEdit.tujuan);
    }
  }, [dataEdit, isOpen]);

  if (!isOpen || !dataEdit) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      barangId: Number(barangId),
      jumlahBaru: Number(jumlah),
      tujuan,
      tanggal,
    };

    const result = await updateBarangKeluar(dataEdit.id, payload);

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
            Edit Barang Keluar
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Tanggal Keluar
            </label>
            <input
              type="date"
              required
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Nama Barang
            </label>
            <select
              required
              value={barangId}
              onChange={(e) => setBarangId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 bg-white"
            >
              <option value="" disabled>
                Pilih Barang...
              </option>
              {listBarang.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.kodeBarang} - {b.namaBarang}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Jumlah Keluar
            </label>
            <input
              type="number"
              min="1"
              required
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Tujuan</label>
            <input
              type="text"
              required
              value={tujuan}
              onChange={(e) => setTujuan(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm text-slate-700 bg-white border rounded-lg hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Simpan Perubahan"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
