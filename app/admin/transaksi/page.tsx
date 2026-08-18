'use client';

import { useState } from 'react';
import { Navbar } from '@/components/shared/navbar';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockStore } from '@/lib/store/mock-store';
import { UserRole } from '@/types/database.types';
import { formatRupiah } from '@/lib/utils/pricing';
import { ShieldCheck, Eye } from 'lucide-react';
import Link from 'next/link';

export default function AdminTransaksiPage() {
  const [role, setRole] = useState<UserRole>('admin');
  const transactions = mockStore.getTransactions('admin');
  const { wallet } = mockStore.getWallet();

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
      <Navbar currentRole={role} onRoleChange={setRole} balance={wallet.balance} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-forest-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-forest-900" />
            Monitoring Transaksi Platform (Admin)
          </h1>
          <p className="text-xs text-gray-600 font-sans mt-1">
            Pantau seluruh arus transaksi setoran sampah kemasan antar coffee shop dan pengepul
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
                    Mitra: {tx.pengepul?.business_name || 'Belum di-assign'} • Metode: {tx.method}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      Nominal Bersih
                    </span>
                    <span className="font-display font-extrabold text-sm text-forest-900">
                      {tx.net_amount !== null ? formatRupiah(tx.net_amount) : 'Pending'}
                    </span>
                  </div>

                  <Link
                    href={`/setor/${tx.id}`}
                    className="p-2.5 bg-kraft-card border border-paper-200 hover:border-forest-900 text-forest-900 rounded-xl transition-colors"
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
