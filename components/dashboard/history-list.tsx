'use client';

import { useState } from 'react';
import { Transaction } from '@/types/database.types';
import { TransactionTicketCard } from '../shared/transaction-ticket-card';

interface HistoryListProps {
  transactions: Transaction[];
  onConfirmTransaction?: (transactionId: string) => void;
  onOpenQR?: (transaction: Transaction) => void;
}

export function HistoryList({
  transactions,
  onConfirmTransaction,
  onOpenQR,
}: HistoryListProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="card-kraft p-6 space-y-5">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-paper-200">
        <div>
          <h3 className="text-lg font-display font-extrabold text-forest-900">
            Riwayat Setoran Sampah
          </h3>
          <p className="text-xs text-gray-600 font-sans">
            Daftar pengajuan & struk transaksi penyaluran sampah kemasan Anda
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-kraft-50 rounded-full border border-paper-200 text-xs">
          {[
            { id: 'all', label: 'Semua' },
            { id: 'pending', label: 'Pending' },
            { id: 'weighed', label: 'Perlu Konfirmasi' },
            { id: 'completed', label: 'Selesai' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-all whitespace-nowrap text-xs ${
                filter === tab.id
                  ? 'bg-forest-900 text-lime-400 shadow-sm'
                  : 'text-gray-600 hover:text-forest-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* List using TransactionTicketCard Signature Element */}
      {filteredTransactions.length === 0 ? (
        <div className="py-12 text-center text-gray-500 space-y-2">
          <p className="text-sm font-semibold">Tidak ada transaksi ditemukan.</p>
          <p className="text-xs">Cobalah mengubah filter atau ajukan setoran baru.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((tx) => (
            <TransactionTicketCard
              key={tx.id}
              transaction={tx}
              onConfirmTransaction={onConfirmTransaction}
              onOpenQR={onOpenQR}
            />
          ))}
        </div>
      )}
    </div>
  );
}
