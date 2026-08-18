'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submissionSchema, SubmissionInput } from '@/lib/validators';
import { WasteCategory } from '@/types/database.types';
import { formatRupiah } from '@/lib/utils/pricing';
import { Store, Truck, Info, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SubmissionFormProps {
  categories: WasteCategory[];
  onSubmitSuccess: (data: {
    method: 'setor_langsung' | 'dijemput';
    estimatedWeightKg: number;
    categoryIds: string[];
    scheduledAt?: string;
  }) => void;
}

export function SubmissionForm({ categories, onSubmitSuccess }: SubmissionFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [method, setMethod] = useState<'setor_langsung' | 'dijemput'>('dijemput');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionInput>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      method: 'dijemput',
      estimatedWeightKg: 5,
      categories: [],
    },
  });

  const estimatedWeight = watch('estimatedWeightKg') || 0;

  const toggleCategory = (id: string) => {
    const updated = selectedCategories.includes(id)
      ? selectedCategories.filter((c) => c !== id)
      : [...selectedCategories, id];

    setSelectedCategories(updated);
    setValue('categories', updated, { shouldValidate: true });
  };

  const onSubmit = (data: SubmissionInput) => {
    if (selectedCategories.length === 0) {
      toast.error('Pilih minimal 1 jenis sampah kemasan');
      return;
    }

    try {
      onSubmitSuccess({
        method: data.method,
        estimatedWeightKg: data.estimatedWeightKg,
        categoryIds: selectedCategories,
        scheduledAt: data.scheduledAt,
      });
      toast.success('Pengajuan setoran berhasil dibuat!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengajukan setoran');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 1. Select Method */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-forest-900 uppercase tracking-wider flex items-center justify-between">
          <span>1. Pilih Metode Setor</span>
          <span className="text-xs text-gray-500 font-normal lowercase">*Langkah 1 dari 3</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Method Pickup (Clay Accent according to design.md) */}
          <div
            onClick={() => {
              setMethod('dijemput');
              setValue('method', 'dijemput', { shouldValidate: true });
            }}
            className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
              method === 'dijemput'
                ? 'bg-clay-500/10 border-clay-500 ring-2 ring-clay-500/20 shadow-sm'
                : 'bg-kraft-card border-paper-200 hover:border-clay-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-clay-500 text-white rounded-xl shadow-sm">
                <Truck className="w-5 h-5" />
              </span>
              {method === 'dijemput' && (
                <span className="w-5 h-5 bg-clay-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
            </div>

            <div>
              <span className="font-display font-extrabold text-sm text-forest-900 block">
                Dijemput Mitra (Pickup)
              </span>
              <p className="text-xs text-gray-600 mt-0.5 font-sans">
                Petugas pengepul datang ke lokasi. Min. 2kg (Potongan 15% layanan).
              </p>
            </div>
          </div>

          {/* Method Direct (Forest / Lime Accent) */}
          <div
            onClick={() => {
              setMethod('setor_langsung');
              setValue('method', 'setor_langsung', { shouldValidate: true });
            }}
            className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
              method === 'setor_langsung'
                ? 'bg-lime-100/60 border-forest-900 ring-2 ring-forest-900/20 shadow-sm'
                : 'bg-kraft-card border-paper-200 hover:border-forest-900/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="p-2.5 bg-forest-900 text-lime-400 rounded-xl shadow-sm">
                <Store className="w-5 h-5" />
              </span>
              {method === 'setor_langsung' && (
                <span className="w-5 h-5 bg-forest-900 text-lime-400 rounded-full flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
              )}
            </div>

            <div>
              <span className="font-display font-extrabold text-sm text-forest-900 block">
                Setor Langsung (Drop Point)
              </span>
              <p className="text-xs text-gray-600 mt-0.5 font-sans">
                Bawa sendiri ke mitra pengepul terdekat. Tanpa minimal berat & komisi 0%.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Select Waste Categories */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-forest-900 uppercase tracking-wider flex items-center justify-between">
          <span>2. Pilih Jenis Sampah Kemasan</span>
          <span className="text-xs font-bold text-forest-900">
            {selectedCategories.length} terpilih
          </span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {categories.map((cat) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <div
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`cursor-pointer p-3.5 rounded-2xl border transition-all duration-150 flex items-center justify-between ${
                  isSelected
                    ? 'bg-lime-100 border-forest-900 text-forest-900 shadow-sm font-bold'
                    : 'bg-kraft-card border-paper-200 hover:border-forest-900/30 text-ink-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                      isSelected
                        ? 'bg-forest-900 border-forest-900 text-lime-400'
                        : 'border-gray-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs font-semibold">{cat.name}</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-forest-900">
                  {formatRupiah(cat.price_per_kg)}/kg
                </span>
              </div>
            );
          })}
        </div>
        {errors.categories && (
          <p className="text-xs text-red-600 font-medium">{errors.categories.message}</p>
        )}
      </div>

      {/* 3. Input Estimated Weight & Schedule */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
            Estimasi Total Berat (kg)
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            {...register('estimatedWeightKg', { valueAsNumber: true })}
            className="w-full px-4 py-2.5 bg-kraft-50 border border-paper-200 rounded-2xl text-sm font-mono font-bold text-ink-900 outline-none focus:border-forest-900 focus:ring-2 focus:ring-lime-400/50"
          />
          {errors.estimatedWeightKg && (
            <p className="text-xs text-red-600 font-medium">{errors.estimatedWeightKg.message}</p>
          )}
          {method === 'dijemput' && estimatedWeight < 2 && (
            <p className="text-xs text-clay-500 font-semibold flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> Metode dijemput memerlukan minimal 2kg
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
            Jadwal Penjemputan (Opsional)
          </label>
          <input
            type="datetime-local"
            {...register('scheduledAt')}
            className="w-full px-4 py-2.5 bg-kraft-50 border border-paper-200 rounded-2xl text-xs font-medium text-ink-900 outline-none focus:border-forest-900"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-paper-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-lime w-full py-3.5 px-6 text-sm shadow-md flex items-center justify-center gap-2"
        >
          <span>Ajukan Setoran & Generate Struk QR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
