'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockStore } from '@/lib/store/mock-store';
import { formatRupiah } from '@/lib/utils/pricing';
import { ShieldCheck, Eye, CheckCircle2, Truck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminTransaksiPage() {
  const [, setTick] = useState(0);
  const transactions = mockStore.getTransactions('admin');

  const handleVerifyPickup = (id: string) => {
    try {
      mockStore.assignPengepul(id);
      toast.success('Penjemputan diverifikasi oleh Tim Operasional PilahCash!');
      setTick((t) => t + 1);
    } catch (err: any) {
      toast.error(err.message || 'Gagal memproses penjemputan');
    }
  };

  const handleConfirmTransaction = (id: string) => {
    try {
      mockStore.confirmTransaction(id);
      toast.success('Setoran berhasil diverifikasi! Saldo disalurkan ke Coffee Shop.');
      setTick((t) => t + 1);
    } catch (err: any) {
      toast.error(err.message || 'Gagal menyelesaikan transaksi');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-forest-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-forest-900" />
            Operasional & Monitoring Setoran (PilahCash Admin)
          </h1>
          <p className="text-xs text-gray-600 font-sans mt-1">
            Kelola penjemputan, verifikasi timbangan sampah kemasan coffee shop, dan pantau penyaluran ke pengepul rekanan
          </p>
        </div>

        <div className="card-kraft p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-paper-200">
            <h2 className="text-base font-display font-extrabold text-forest-900">
              Semua Transaksi Platform ({transactions.length})
            </h2>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 bg-kraft-50 rounded-2xl border border-paper-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-forest-900 bg-lime-100 px-2 py-0.5 rounded">
                      {tx.transaction_code}
                    </span>
                    <StatusBadge status={tx.status} size="sm" />
                  </div>
                  <p className="text-xs font-bold text-forest-900 font-sans">
                    Coffee Shop: {tx.coffee_shop?.business_name}
                  </p>
                  <p className="text-xs text-gray-500 font-sans">
                    Metode Setor: <span className="font-semibold uppercase">{tx.method.replace('_', ' ')}</span> • Perkiraan Berat: {tx.estimated_weight_kg ? `${tx.estimated_weight_kg} kg` : '-'}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3">
                  <div className="text-left md:text-right mr-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      Nominal Setoran
                    </span>
                    <span className="font-display font-extrabold text-sm text-forest-900">
                      {tx.net_amount !== null ? formatRupiah(tx.net_amount) : 'Menunggu Timbangan'}
                    </span>
                  </div>

                  {tx.status === 'pending' && (
                    <button
                      onClick={() => handleVerifyPickup(tx.id)}
                      className="px-3 py-1.5 bg-forest-900 text-lime-400 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-forest-800 transition-colors"
                      title="Proses Penjemputan / Terima Setoran"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Proses Setoran</span>
                    </button>
                  )}

                  {tx.status === 'weighed' && (
                    <button
                      onClick={() => handleConfirmTransaction(tx.id)}
                      className="px-3 py-1.5 btn-lime text-ink-900 rounded-xl text-xs font-bold flex items-center gap-1"
                      title="Verifikasi Hasil Timbangan"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Konfirmasi</span>
                    </button>
                  )}

                  <Link
                    href={`/setor/${tx.id}`}
                    className="p-2 bg-kraft-card border border-paper-200 hover:border-forest-900 text-forest-900 rounded-xl transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
