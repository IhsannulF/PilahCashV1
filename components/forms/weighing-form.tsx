'use client';

import { useState } from 'react';
import { Transaction, WasteCategory } from '@/types/database.types';
import { calculateTransactionPricing, formatRupiah } from '@/lib/utils/pricing';
import { Scale, Plus, Trash2, CheckCircle2, Calculator } from 'lucide-react';
import { toast } from 'sonner';

interface WeighingFormProps {
  transaction: Transaction;
  categories: WasteCategory[];
  onSubmitWeighing: (
    items: { categoryId: string; weightKg: number }[]
  ) => void;
}

export function WeighingForm({
  transaction,
  categories,
  onSubmitWeighing,
}: WeighingFormProps) {
  const [items, setItems] = useState<
    { categoryId: string; weightKg: number }[]
  >([
    { categoryId: categories[0]?.id || '', weightKg: 5 },
  ]);

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      { categoryId: categories[0]?.id || '', weightKg: 1 },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) {
      toast.error('Minimal harus ada 1 jenis sampah');
      return;
    }
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const updateItem = (
    index: number,
    field: 'categoryId' | 'weightKg',
    value: any
  ) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const pricingItems = items.map((item) => {
    const cat = categories.find((c) => c.id === item.categoryId);
    return {
      weight_kg: Number(item.weightKg) || 0,
      price_per_kg: cat ? cat.price_per_kg : 0,
    };
  });

  const { grossAmount, commissionAmount, netAmount, commissionRate } =
    calculateTransactionPricing(pricingItems, transaction.method);

  const totalActualWeight = items.reduce(
    (sum, i) => sum + (Number(i.weightKg) || 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.some((i) => i.weightKg <= 0)) {
      toast.error('Semua berat sampah harus lebih dari 0 kg');
      return;
    }

    try {
      onSubmitWeighing(items);
      toast.success('Input berat berhasil disimpan! Menunggu konfirmasi coffee shop.');
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyimpan hasil timbangan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-paper-200">
        <div>
          <h3 className="text-base font-display font-extrabold text-forest-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-forest-900" />
            Input Hasil Penimbangan Petugas
          </h3>
          <p className="text-xs text-gray-600 font-sans">
            Pilah & timbang sampah per kategori secara transparan
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-forest-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-400/40">
          {transaction.transaction_code}
        </span>
      </div>

      {/* Item Rows */}
      <div className="space-y-3">
        {items.map((row, idx) => {
          const selectedCat = categories.find((c) => c.id === row.categoryId);
          const subtotal = (row.weightKg || 0) * (selectedCat?.price_per_kg || 0);

          return (
            <div
              key={idx}
              className="p-4 bg-kraft-50 rounded-2xl border border-paper-200 grid grid-cols-12 gap-3 items-center"
            >
              {/* Category Select */}
              <div className="col-span-12 sm:col-span-5">
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                  Kategori #{idx + 1}
                </label>
                <select
                  value={row.categoryId}
                  onChange={(e) => updateItem(idx, 'categoryId', e.target.value)}
                  className="w-full px-3 py-2 bg-kraft-card border border-paper-200 rounded-xl text-xs font-bold text-ink-900 outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({formatRupiah(cat.price_per_kg)}/kg)
                    </option>
                  ))}
                </select>
              </div>

              {/* Weight Input */}
              <div className="col-span-6 sm:col-span-3">
                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">
                  Berat (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={row.weightKg}
                  onChange={(e) => updateItem(idx, 'weightKg', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-kraft-card border border-paper-200 rounded-xl text-xs font-mono font-bold text-ink-900 outline-none"
                />
              </div>

              {/* Subtotal Display */}
              <div className="col-span-4 sm:col-span-3 text-right">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Subtotal</span>
                <span className="text-xs font-mono font-extrabold text-forest-900">
                  {formatRupiah(subtotal)}
                </span>
              </div>

              {/* Remove Button */}
              <div className="col-span-2 sm:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeItemRow(idx)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addItemRow}
          className="w-full py-2.5 border border-dashed border-forest-900/40 hover:border-forest-900 rounded-2xl text-xs font-bold text-forest-900 hover:bg-lime-100/40 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Kategori Sampah</span>
        </button>
      </div>

      {/* Live Calculation Summary */}
      <div className="p-4 bg-forest-900 text-kraft-50 rounded-2xl space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-display font-extrabold text-lime-400 pb-2 border-b border-forest-700">
          <Calculator className="w-4 h-4 text-lime-400" />
          <span>Kalkulasi Otomatis Sistem PilahCash</span>
        </div>

        <div className="flex justify-between text-xs text-kraft-50/80 font-sans">
          <span>Total Berat Timbangan:</span>
          <span className="font-mono font-bold text-kraft-50">{totalActualWeight.toFixed(1)} kg</span>
        </div>

        <div className="flex justify-between text-xs text-kraft-50/80 font-sans">
          <span>Total Kotor (Gross):</span>
          <span className="font-mono font-bold text-kraft-50">{formatRupiah(grossAmount)}</span>
        </div>

        {transaction.method === 'dijemput' && (
          <div className="flex justify-between text-xs text-clay-500">
            <span>Potongan Layanan Penjemputan ({commissionRate * 100}%):</span>
            <span className="font-mono font-bold">- {formatRupiah(commissionAmount)}</span>
          </div>
        )}

        <div className="pt-2 border-t border-forest-700 flex justify-between items-center text-sm font-extrabold">
          <span className="text-kraft-50">Nominal Bersih Saldo:</span>
          <span className="text-lg font-display font-extrabold text-lime-400">
            {formatRupiah(netAmount)}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="btn-lime w-full py-3.5 text-sm flex items-center justify-center gap-2 shadow-md"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Kirim Struk Hasil Penimbangan Ke Coffee Shop</span>
      </button>
    </form>
  );
}
