'use client';

import { Transaction } from '@/types/database.types';
import { StatusBadge } from './status-badge';
import { formatRupiah } from '@/lib/utils/pricing';
import { QrCode, CheckCircle2, Truck, Store, Calendar, Eye, Ticket } from 'lucide-react';
import Link from 'next/link';

interface TransactionTicketCardProps {
  transaction: Transaction;
  onConfirmTransaction?: (transactionId: string) => void;
  onOpenQR?: (transaction: Transaction) => void;
}

export function TransactionTicketCard({
  transaction,
  onConfirmTransaction,
  onOpenQR,
}: TransactionTicketCardProps) {
  const tx = transaction;

  return (
    <div className="ticket-receipt-card overflow-hidden shadow-sm hover:shadow-md">
      {/* Top Ticket Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FFFDF7]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded bg-forest-900 text-lime-400">
              <Ticket className="w-3.5 h-3.5 text-lime-400" />
              {tx.transaction_code}
            </span>

            <span
              className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                tx.method === 'dijemput'
                  ? 'bg-clay-500/15 text-clay-500 border border-clay-500/30'
                  : 'bg-lime-100 text-forest-900 border border-lime-400/40'
              }`}
            >
              {tx.method === 'dijemput' ? (
                <>
                  <Truck className="w-3 h-3" /> Dijemput Mitra
                </>
              ) : (
                <>
                  <Store className="w-3 h-3" /> Setor Langsung
                </>
              )}
            </span>

            <StatusBadge status={tx.status} size="sm" />
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-ink-muted pt-1">
            <Calendar className="w-3.5 h-3.5 text-forest-900 shrink-0" />
            <span>
              {new Date(tx.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {tx.pengepul?.business_name && (
              <span className="text-ink-900">• Mitra: <strong className="text-forest-900 font-extrabold">{tx.pengepul.business_name}</strong></span>
            )}
          </div>
        </div>

        {/* Action Controls Top Right */}
        <div className="flex items-center gap-2">
          {onOpenQR && (
            <button
              onClick={() => onOpenQR(tx)}
              className="p-2 bg-paper-200 hover:bg-lime-100 text-forest-900 rounded-xl transition-colors font-bold"
              title="Lihat Kode QR"
            >
              <QrCode className="w-4 h-4" />
            </button>
          )}

          <Link
            href={`/setor/${tx.id}`}
            className="p-2 text-forest-900 hover:bg-paper-200 rounded-xl transition-colors font-bold"
            title="Lihat Detail Transaksi"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Dashed Horizontal Tear Line Signature Element */}
      <div className="relative my-0">
        <div className="border-t border-dashed border-paper-200 w-full" />
        <div className="absolute -left-2.5 -top-2 w-4 h-4 rounded-full bg-kraft-50 border-r border-paper-200" />
        <div className="absolute -right-2.5 -top-2 w-4 h-4 rounded-full bg-kraft-50 border-l border-paper-200" />
      </div>

      {/* Bottom Ticket Body (Amounts & Confirmation) */}
      <div className="p-4 sm:p-5 bg-lime-100/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {tx.items && tx.items.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 text-xs text-forest-900">
              {tx.items.map((item) => (
                <span
                  key={item.id}
                  className="px-2.5 py-1 bg-kraft-card border border-paper-200 rounded-lg font-mono text-[11px] font-bold text-forest-900"
                >
                  {item.category?.name?.split(' ')[0]}: <strong className="text-forest-900">{item.weight_kg}kg</strong>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs font-semibold text-ink-muted">
              Estimasi Total: <strong className="font-mono text-forest-900 font-bold">{tx.estimated_weight_kg} kg</strong>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-paper-200">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-ink-muted font-extrabold uppercase tracking-wider block">
              {tx.status === 'completed' ? 'Pendapatan Saldo Bersih' : 'Estimasi Nominal'}
            </span>
            <span className="text-lg font-display font-extrabold text-forest-900">
              {tx.net_amount !== null
                ? formatRupiah(tx.net_amount)
                : tx.gross_amount !== null
                ? formatRupiah(tx.gross_amount)
                : 'Menunggu Penimbangan'}
            </span>
          </div>

          {tx.status === 'weighed' && onConfirmTransaction && (
            <button
              onClick={() => onConfirmTransaction(tx.id)}
              className="btn-lime px-4 py-2 text-xs flex items-center gap-1.5 shadow"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Klaim Saldo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
