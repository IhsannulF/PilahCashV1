'use client';

import { useState } from 'react';
import { HistoryList } from '@/components/dashboard/history-list';
import { QRDisplay } from '@/components/shared/qr-display';
import { mockStore } from '@/lib/store/mock-store';
import { Transaction } from '@/types/database.types';
import { X, History } from 'lucide-react';
import { toast } from 'sonner';

export default function RiwayatPage() {
  const [activeQRTransaction, setActiveQRTransaction] = useState<Transaction | null>(null);
  const [, setTick] = useState(0);

  const transactions = mockStore.getTransactions('coffee_shop');

  const handleConfirm = (transactionId: string) => {
    try {
      mockStore.confirmTransaction(transactionId);
      toast.success('Transaksi dikonfirmasi! Saldo telah bertambah.');
      setTick((t) => t + 1);
    } catch (err: any) {
      toast.error(err.message || 'Gagal konfirmasi');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-extrabold text-forest-900 flex items-center gap-2">
              <History className="w-6 h-6 text-forest-900" />
              Riwayat Penyaluran Sampah
            </h1>
            <p className="text-xs text-gray-600 font-sans">
              Jejak digital struk transaksi penyaluran sampah kemasan operasional coffee shop Anda
            </p>
          </div>
        </div>

        <HistoryList
          transactions={transactions}
          onConfirmTransaction={handleConfirm}
          onOpenQR={(tx) => setActiveQRTransaction(tx)}
        />
      </main>

      {activeQRTransaction && (
        <div className="fixed inset-0 z-50 bg-forest-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm">
            <button
              onClick={() => setActiveQRTransaction(null)}
              className="absolute -top-3 -right-3 p-2 bg-forest-900 text-kraft-50 rounded-full shadow-lg hover:bg-forest-700 transition-colors z-10 border border-lime-400/30"
            >
              <X className="w-4 h-4" />
            </button>
            <QRDisplay
              transactionCode={activeQRTransaction.transaction_code}
              businessName={activeQRTransaction.coffee_shop?.business_name}
              method={activeQRTransaction.method}
            />
          </div>
        </div>
      )}
    </div>
  );
}
