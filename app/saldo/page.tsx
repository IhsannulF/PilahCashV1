'use client';

import { useState } from 'react';
import { WithdrawalForm } from '@/components/forms/withdrawal-form';
import { mockStore } from '@/lib/store/mock-store';
import { formatRupiah } from '@/lib/utils/pricing';
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, History } from 'lucide-react';
import { WithdrawalInput } from '@/lib/validators';

export default function SaldoPage() {
  const [, setTick] = useState(0);

  const { wallet, mutations } = mockStore.getWallet();
  const withdrawals = mockStore.getWithdrawals();

  const handleWithdrawalSuccess = (data: WithdrawalInput) => {
    mockStore.requestWithdrawal(data);
    setTick((t) => t + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-forest-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-forest-900" />
            Dompet & Penarikan Saldo
          </h1>
          <p className="text-xs text-gray-600 font-sans mt-1">
            Kelola pendapatan hasil daur ulang sampah dan ajukan penarikan dana ke rekening bank / e-wallet.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Withdrawal Request Form Card */}
          <div className="lg:col-span-6 card-kraft p-6 space-y-4">
            <h2 className="text-base font-display font-extrabold text-forest-900">
              Form Penarikan Dana (Withdrawal)
            </h2>
            <WithdrawalForm
              currentBalance={wallet.balance}
              onRequestSuccess={handleWithdrawalSuccess}
            />
          </div>

          {/* Withdrawal Requests Status List */}
          <div className="lg:col-span-6 card-kraft p-6 space-y-4">
            <h2 className="text-base font-display font-extrabold text-forest-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-900" />
              Status Pengajuan Penarikan
            </h2>

            {withdrawals.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">Belum ada riwayat penarikan saldo.</p>
            ) : (
              <div className="space-y-3">
                {withdrawals.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 bg-kraft-50 rounded-xl border border-paper-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-display font-extrabold text-forest-900 text-sm block">
                        {formatRupiah(req.amount)}
                      </span>
                      <span className="text-gray-500 font-sans text-[11px]">
                        {req.bank_name} • {req.bank_account} (a.n {req.account_holder})
                      </span>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                        req.status === 'paid'
                          ? 'bg-lime-100 text-forest-900 border border-lime-400/40'
                          : req.status === 'approved'
                          ? 'bg-clay-500/15 text-clay-500 border border-clay-500/30'
                          : 'bg-paper-200 text-ink-900'
                      }`}
                    >
                      {req.status === 'paid'
                        ? 'Selesai / Cair'
                        : req.status === 'approved'
                        ? 'Disetujui'
                        : 'Menunggu Diproses'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Audit Trail Mutasi Saldo */}
        <div className="card-kraft p-6 space-y-4">
          <h2 className="text-base font-display font-extrabold text-forest-900 flex items-center gap-2">
            <History className="w-4 h-4 text-forest-900" />
            Jejak Audit Mutasi Saldo
          </h2>

          <div className="space-y-2">
            {mutations.map((m) => (
              <div
                key={m.id}
                className="p-3.5 bg-kraft-50 rounded-xl border border-paper-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`p-2 rounded-xl ${
                      m.type === 'credit'
                        ? 'bg-lime-100 text-forest-900'
                        : 'bg-clay-500/15 text-clay-500'
                    }`}
                  >
                    {m.type === 'credit' ? (
                      <ArrowDownRight className="w-4 h-4" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4" />
                    )}
                  </span>
                  <div>
                    <span className="font-bold text-forest-900 block">
                      {m.type === 'credit' ? 'Setoran Sampah Selesai' : 'Penarikan Saldo'}
                    </span>
                    <span className="text-gray-500 font-sans text-[11px]" suppressHydrationWarning>
                      {new Date(m.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <span
                  className={`font-display font-extrabold text-sm ${
                    m.type === 'credit' ? 'text-forest-900' : 'text-clay-500'
                  }`}
                >
                  {m.type === 'credit' ? '+' : '-'} {formatRupiah(m.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
