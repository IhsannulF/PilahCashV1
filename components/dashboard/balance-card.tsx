'use client';

import { formatRupiah } from '@/lib/utils/pricing';
import { Wallet, Scale, Award, ArrowUpRight, TrendingUp, Sparkles, PlusCircle } from 'lucide-react';
import Link from 'next/link';

interface BalanceCardProps {
  balance: number;
  totalWeightKg: number;
  completedTransactionsCount: number;
  badgeName?: string;
}

export function BalanceCard({
  balance,
  totalWeightKg,
  completedTransactionsCount,
  badgeName = 'Pahlawan Hijau',
}: BalanceCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Primary Balance Display (Forest-900 Card) */}
      <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-forest-900 p-6 sm:p-8 text-kraft-50 shadow-xl flex flex-col justify-between min-h-[180px] border border-forest-700">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-forest-700 rounded-xl">
              <Wallet className="w-5 h-5 text-lime-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-kraft-50">
              Total Pendapatan Sampah
            </span>
          </div>

          <span className="inline-flex items-center gap-1 text-xs font-bold bg-lime-400/20 text-lime-400 px-3 py-1 rounded-full border border-lime-400/40">
            <TrendingUp className="w-3.5 h-3.5" /> Real-time Saldo
          </span>
        </div>

        <div className="my-4 z-10">
          <span className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-lime-400">
            {formatRupiah(balance)}
          </span>
          <p className="text-xs text-kraft-50/90 mt-1.5 font-sans font-medium max-w-xl leading-relaxed">
            Saldo terkumpul dari transaksi sampah kemasan yang telah diverifikasi & terkonfirmasi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 z-10">
          <Link
            href="/saldo"
            className="btn-lime px-5 py-2.5 text-xs font-extrabold shadow flex items-center gap-1.5"
          >
            <span>Tarik Saldo Ke Rekening</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          <Link
            href="/setor"
            className="btn-forest-outline px-5 py-2.5 text-xs font-bold flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-lime-400" />
            <span>+ Setor Sampah Baru</span>
          </Link>
        </div>
      </div>

      {/* Environmental & Gamification Impact Card */}
      <div className="card-kraft p-6 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-forest-900 uppercase tracking-wider">
              Dampak Daur Ulang
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-extrabold text-forest-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-400/50">
              <Sparkles className="w-3.5 h-3.5 text-forest-900 fill-forest-900" />
              {badgeName}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-kraft-50 rounded-2xl border border-paper-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-muted mb-1">
                <Scale className="w-3.5 h-3.5 text-forest-900" />
                <span>Total Sampah</span>
              </div>
              <span className="text-2xl font-mono font-extrabold text-forest-900">
                {totalWeightKg.toFixed(1)} <span className="text-xs font-sans text-ink-muted">kg</span>
              </span>
            </div>

            <div className="p-3.5 bg-kraft-50 rounded-2xl border border-paper-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-ink-muted mb-1">
                <Award className="w-3.5 h-3.5 text-forest-900" />
                <span>Transaksi</span>
              </div>
              <span className="text-2xl font-mono font-extrabold text-forest-900">
                {completedTransactionsCount} <span className="text-xs font-sans text-ink-muted">kali</span>
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-paper-200 flex items-center justify-between text-xs text-ink-muted font-sans font-semibold">
          <span>Target Bulan Ini (50kg):</span>
          <span className="font-extrabold text-forest-900 font-mono">
            {Math.min(100, Math.round((totalWeightKg / 50) * 100))}%
          </span>
        </div>
      </div>
    </div>
  );
}
