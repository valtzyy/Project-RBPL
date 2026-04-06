"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { buatPO } from "@/app/actions/POAction";

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

export default function ModalTambahPO({
  isOpen,
  onClose,
  listBarang,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // State untuk feedback sukses

  const [supplierName, setSupplierName] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [items, setItems] = useState([{ barangId: "", qty: 1 }]);

  if (!isOpen) return null;

  const handleAddItem = () => setItems([...items, { barangId: "", qty: 1 }]);
  const handleRemoveItem = (index: number) => {
    if (items.length > 1) setItems(items.filter((_, i) => i !== index));
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

  const hitungTotal = () => {
    return items.reduce((total, item) => {
      const barang = listBarang.find((b) => b.id.toString() === item.barangId);
      if (barang && item.qty) return total + barang.harga * Number(item.qty);
      return total;
    }, 0);
  };

  // Fungsi saat modal ditutup manual
  const handleTutupModal = () => {
    setSuccess(false); // Hilangkan pesan sukses saat ditutup
    setError("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const validItems = items.filter((i) => i.barangId !== "" && i.qty > 0);
    if (validItems.length === 0) {
      setError("Pilih minimal satu barang yang valid.");
      setLoading(false);
      return;
    }

    const payload = {
      supplierName,
      tanggal,
      items: validItems.map((i) => ({
        barangId: Number(i.barangId),
        qty: Number(i.qty),
      })),
    };

    const result = await buatPO(payload);

    if (result.error) {
      setError(result.error);
    } else {
      // JIKA SUKSES: Tampilkan pesan, kosongkan form, tapi JANGAN panggil onClose()
      setSuccess(true);
      setSupplierName("");
      setTanggal("");
      setItems([{ barangId: "", qty: 1 }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 transition-opacity backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Buat Purchase Order (PO)
            </h3>
            <p className="text-xs text-slate-500">
              Pesan stok barang ke Supplier
            </p>
          </div>
          <button
            onClick={handleTutupModal}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="p-6 overflow-y-auto space-y-5">
            {/* --- FEEDBACK MESSAGES --- */}
            {success && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Purchase Order berhasil dibuat dan disimpan!
              </div>
            )}
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Nama Supplier
                </label>
                <input
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Contoh: PT Parfum Nusantara"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Tanggal PO
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <hr className="border-slate-100" />

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-sm font-semibold text-slate-700">
                  Daftar Barang Pesanan
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
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
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
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
                  <div className="w-24 space-y-1">
                    <input
                      type="number"
                      min="1"
                      required
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(index, "qty", Number(e.target.value))
                      }
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500"
                      placeholder="Qty"
                    />
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="mt-1.5 rounded p-1.5 text-red-500 hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center rounded-lg bg-emerald-50 p-4 border border-emerald-100">
              <span className="text-sm font-semibold text-emerald-800">
                Estimasi Total PO
              </span>
              <span className="text-lg font-bold text-emerald-700">
                Rp {hitungTotal().toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 p-6 bg-slate-50/50 rounded-b-2xl">
            <button
              type="button"
              onClick={handleTutupModal}
              className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Batal / Tutup
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-70"
            >
              {loading ? "Memproses..." : "Simpan PO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
