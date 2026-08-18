'use client';

import { useState, use } from 'react';
import { Navbar } from '@/components/shared/navbar';
import { QRDisplay } from '@/components/shared/qr-display';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockStore } from '@/lib/store/mock-store';
import { UserRole } from '@/types/database.types';
import { formatRupiah } from '@/lib/utils/pricing';
import { ArrowLeft, CheckCircle2, Clock, Truck, Store, Calendar } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const resolvedParams = use(params);
  const [role, setRole] = useState<UserRole>('coffee_shop');
  const [, setTick] = useState(0);

  const tx = mockStore.getTransactionById(resolvedParams.transactionId);
  const { wallet } = mockStore.getWallet();

  if (!tx) {
    return (
      <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
        <Navbar currentRole={role} onRoleChange={setRole} balance={wallet.balance} />
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center space-y-4">
          <p className="text-lg font-bold text-forest-900 font-display">Transaksi tidak ditemukan</p>
          <Link href="/dashboard" className="text-xs font-bold text-forest-900 underline">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleConfirm = () => {
    try {
      mockStore.confirmTransaction(tx.id);
      toast.success('Transaksi berhasil dikonfirmasi! Saldo telah masuk.');
      setTick((t) => t + 1);
    } catch (err: any) {
      toast.error(err.message || 'Gagal konfirmasi');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
      <Navbar currentRole={role} onRoleChange={setRole} balance={wallet.balance} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-forest-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali Ke Dashboard</span>
        </Link>

        <div className="card-kraft p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-paper-200">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Detail Transaksi Struk
              </span>
              <h1 className="text-xl font-mono font-bold text-forest-900">
                {tx.transaction_code}
              </h1>
            </div>
            <StatusBadge status={tx.status} size="lg" />
          </div>

          {/* QR Display */}
          <QRDisplay
            transactionCode={tx.transaction_code}
            businessName={tx.coffee_shop?.business_name}
            method={tx.method}
          />

          {/* Details Overview Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-kraft-50 rounded-2xl border border-paper-200 text-xs">
            <div>
              <span className="text-gray-500 font-bold block">Metode Penyaluran:</span>
              <span className="font-bold text-forest-900 flex items-center gap-1 mt-0.5">
                {tx.method === 'dijemput' ? (
                  <>
                    <Truck className="w-3.5 h-3.5 text-clay-500" /> Dijemput Mitra Pengepul
                  </>
                ) : (
                  <>
                    <Store className="w-3.5 h-3.5 text-forest-900" /> Setor Langsung Drop Point
                  </>
                )}
              </span>
            </div>

            <div>
              <span className="text-gray-500 font-bold block">Estimasi Berat:</span>
              <span className="font-mono font-extrabold text-forest-900 mt-0.5 block">
                {tx.estimated_weight_kg} kg
              </span>
            </div>

            {tx.actual_weight_kg && (
              <div>
                <span className="text-gray-500 font-bold block">Berat Aktual Timbangan:</span>
                <span className="font-mono font-extrabold text-forest-900 mt-0.5 block">
                  {tx.actual_weight_kg} kg
                </span>
              </div>
            )}

            {tx.net_amount !== null && (
              <div>
                <span className="text-gray-500 font-bold block">Nominal Masuk Saldo:</span>
                <span className="font-display font-extrabold text-forest-900 text-sm mt-0.5 block">
                  {formatRupiah(tx.net_amount)}
                </span>
              </div>
            )}
          </div>

          {/* Action If Weighed */}
          {tx.status === 'weighed' && (
            <div className="p-5 bg-clay-500/10 border border-clay-500/30 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-clay-500 font-bold text-xs">
                <Clock className="w-4 h-4" />
                <span>Petugas telah selesai menimbang! Harap konfirmasi nominal di atas.</span>
              </div>

              <button
                onClick={handleConfirm}
                className="btn-lime w-full py-3.5 text-xs shadow flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Konfirmasi Struk Timbangan & Klaim Saldo {formatRupiah(tx.net_amount || 0)}</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
