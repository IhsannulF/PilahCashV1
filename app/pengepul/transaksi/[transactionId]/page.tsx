'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { WeighingForm } from '@/components/forms/weighing-form';
import { mockStore } from '@/lib/store/mock-store';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

export default function PengepulWeighingPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const tx = mockStore.getTransactionById(resolvedParams.transactionId);
  const categories = mockStore.getCategories();

  if (!tx) {
    return (
      <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-4">
          <p className="text-lg font-display font-bold text-forest-900">Transaksi tidak ditemukan</p>
          <Link href="/pengepul/dashboard" className="text-xs font-bold text-forest-900 underline">
            Kembali ke Dashboard Pengepul
          </Link>
        </div>
      </div>
    );
  }

  const handleWeighingSubmit = (items: { categoryId: string; weightKg: number }[]) => {
    mockStore.submitWeighing(tx.id, items);
    router.push('/pengepul/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <Link
          href="/pengepul/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-forest-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali Ke Dashboard Pengepul</span>
        </Link>

        {/* Coffee Shop Profile Info Header */}
        <div className="card-kraft p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Profil Coffee Shop</span>
            <h2 className="text-lg font-display font-extrabold text-forest-900">
              {tx.coffee_shop?.business_name || 'Kopi Senja Senopati'}
            </h2>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5 font-sans">
              <MapPin className="w-3.5 h-3.5 text-forest-900" />
              {tx.coffee_shop?.address}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-forest-900 bg-lime-100 px-3.5 py-1.5 rounded-full border border-lime-400/40">
            <Phone className="w-3.5 h-3.5" />
            <span>{tx.coffee_shop?.phone || '081298765432'}</span>
          </div>
        </div>

        {/* Weighing Form Card */}
        <div className="card-kraft p-6 sm:p-8">
          <WeighingForm
            transaction={tx}
            categories={categories}
            onSubmitWeighing={handleWeighingSubmit}
          />
        </div>
      </main>
    </div>
  );
}
