"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { buatInvoice } from "@/app/actions/invoiceAction";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  listBarang: {
    id: number;
    namaBarang: string;
    kodeBarang: string;
    harga: number;
  }[];
}

export default function ModalBuatInvoice({
  isOpen,
  onClose,
  listBarang,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State form
  const [mitraName, setMitraName] = useState("");
  const [tanggal, setTanggal] = useState("");
  // State dinamis untuk list barang yang dipesan
  const [items, setItems] = useState([{ barangId: "", qty: 1 }]);

  if (!isOpen) return null;

  // Helpers untuk form dinamis
  const handleAddItem = () => {
    setItems([...items, { barangId: "", qty: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Kalkulasi estimasi total secara realtime
  const hitungTotal = () => {
    return items.reduce((total, item) => {
      const barang = listBarang.find((b) => b.id.toString() === item.barangId);
      if (barang && item.qty) {
        return total + barang.harga * Number(item.qty);
      }
      return total;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validasi item kosong
    const validItems = items.filter((i) => i.barangId !== "" && i.qty > 0);
    if (validItems.length === 0) {
      setError("Pilih minimal satu barang yang valid.");
      setLoading(false);
      return;
    }

    const payload = {
      mitraName,
      tanggal,
      items: validItems.map((i) => ({
        barangId: Number(i.barangId),
        qty: Number(i.qty),
      })),
    };

    const result = await buatInvoice(payload);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Reset form dan tutup
      setMitraName("");
      setTanggal("");
      setItems([{ barangId: "", qty: 1 }]);
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 transition-opacity backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Buat Invoice Baru
            </h3>
            <p className="text-xs text-slate-500">
              Catat transaksi penjualan ke Toko/Mitra
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 overflow-y-auto space-y-5">
            {/* Informasi Dasar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Nama Mitra / Toko
                </label>
                <input
                  type="text"
                  required
                  value={mitraName}
                  onChange={(e) => setMitraName(e.target.value)}
                  placeholder="Contoh: Toko Sejahtera"
                  // DITAMBAHKAN: text-slate-900
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  // DITAMBAHKAN: text-slate-900
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* List Barang */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold text-slate-700">
                  Daftar Barang
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <Plus size={14} /> Tambah Barang
                </button>
              </div>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100"
                >
                  <div className="flex-1 space-y-1">
                    <select
                      required
                      value={item.barangId}
                      onChange={(e) =>
                        handleItemChange(index, "barangId", e.target.value)
                      }
                      // DITAMBAHKAN: text-slate-900
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                    >
                      <option value="" disabled>
                        Pilih Barang...
                      </option>
                      {listBarang.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.kodeBarang} - {b.namaBarang} (Rp{" "}
                          {b.harga.toLocaleString("id-ID")})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24 space-y-1">
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", Number(e.target.value))
                      }
                      // DITAMBAHKAN: text-slate-900
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                      placeholder="Qty"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="mt-1.5 rounded p-1.5 text-red-500 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Total Estimasi */}
            <div className="flex justify-between items-center rounded-lg bg-blue-50 p-4 border border-blue-100">
              <span className="text-sm font-semibold text-blue-800">
                Total Transaksi
              </span>
              <span className="text-lg font-bold text-blue-700">
                Rp {hitungTotal().toLocaleString("id-ID")}
              </span>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Menyimpan..." : "Simpan Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
