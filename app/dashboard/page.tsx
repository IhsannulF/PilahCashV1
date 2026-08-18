'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/navbar';
import { BalanceCard } from '@/components/dashboard/balance-card';
import { CategoryBreakdownChart } from '@/components/dashboard/category-breakdown-chart';
import { HistoryList } from '@/components/dashboard/history-list';
import { QRDisplay } from '@/components/shared/qr-display';
import { mockStore } from '@/lib/store/mock-store';
import { Transaction, UserRole, TransactionItem } from '@/types/database.types';
import { PlusCircle, Sparkles, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CoffeeShopDashboard() {
  const [role, setRole] = useState<UserRole>('coffee_shop');
  const [activeQRTransaction, setActiveQRTransaction] = useState<Transaction | null>(null);

  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const transactions = mockStore.getTransactions('coffee_shop');
  const { wallet } = mockStore.getWallet();

  const completedTransactions = transactions.filter((t) => t.status === 'completed');
  const totalWeightKg = completedTransactions.reduce(
    (sum, t) => sum + (t.actual_weight_kg || 0),
    0
  );

  const allItems: TransactionItem[] = completedTransactions.flatMap((t) => t.items || []);

  const handleConfirm = (transactionId: string) => {
    try {
      mockStore.confirmTransaction(transactionId);
      toast.success('Transaksi dikonfirmasi! Saldo pendapatan Anda telah bertambah.');
      refresh();
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengonfirmasi transaksi');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
      <Navbar currentRole={role} onRoleChange={setRole} balance={wallet.balance} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-forest-900">
                Kopi Senja Senopati
              </h1>
              <span className="text-xs font-bold bg-lime-100 text-forest-900 px-3 py-1 rounded-full border border-lime-400/50">
                Outlet Utama
              </span>
            </div>
            <p className="text-xs text-ink-muted font-sans font-medium mt-1">
              Kelola setoran sampah kemasan operasional & pantau dampak ekonomi daur ulang kopi Anda
            </p>
          </div>

          <Link
            href="/setor"
            className="btn-lime px-6 py-3.5 text-xs font-extrabold shadow flex items-center justify-center gap-2 hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Ajukan Setor Sampah</span>
          </Link>
        </div>

        {/* Balance Card & Stats */}
        <BalanceCard
          balance={wallet.balance}
          totalWeightKg={totalWeightKg}
          completedTransactionsCount={completedTransactions.length}
        />

        {/* Middle Section: Chart & Quick Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <CategoryBreakdownChart items={allItems} />
          </div>

          <div className="lg:col-span-5 card-kraft p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-forest-900 font-display font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-forest-900 fill-lime-400" />
                <span>Panduan Setor PilahCash</span>
              </div>
              <ul className="space-y-3 text-xs text-ink-900 font-sans font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-forest-900 text-lime-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <span>Pilah kemasan (kaleng SKM, botol sirup, dus kardus) sesuai kategori.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-forest-900 text-lime-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <span>Pilih metode <strong>Setor Langsung</strong> atau <strong>Dijemput Mitra</strong> (&ge;2kg).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 bg-forest-900 text-lime-400 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <span>Tunjukkan QR Code ke petugas pengepul untuk penimbangan & konfirmasi nominal.</span>
                </li>
              </ul>
            </div>

            <Link
              href="/setor"
              className="w-full py-3 bg-kraft-50 hover:bg-lime-100 text-forest-900 font-bold text-xs rounded-full border border-paper-200 text-center flex items-center justify-center gap-2 transition-colors"
            >
              <span>Mulai Pengajuan Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Transaction History List with Ticket Cards */}
        <HistoryList
          transactions={transactions}
          onConfirmTransaction={handleConfirm}
          onOpenQR={(tx) => setActiveQRTransaction(tx)}
        />
      </main>

      {/* QR Code Modal Popup */}
      {activeQRTransaction && (
        <div className="fixed inset-0 z-50 bg-forest-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm">
            <button
              onClick={() => setActiveQRTransaction(null)}
              className="absolute -top-3 -right-3 p-2 bg-forest-900 text-kraft-50 rounded-full shadow-lg hover:bg-forest-700 transition-colors z-10 border border-lime-400/40"
            >
              <X className="w-4 h-4 text-lime-400" />
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
