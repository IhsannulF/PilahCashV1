'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { withdrawalSchema, WithdrawalInput } from '@/lib/validators';
import { formatRupiah } from '@/lib/utils/pricing';
import { Wallet, Building, CreditCard, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface WithdrawalFormProps {
  currentBalance: number;
  onRequestSuccess: (data: WithdrawalInput) => void;
}

export function WithdrawalForm({ currentBalance, onRequestSuccess }: WithdrawalFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WithdrawalInput>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: Math.min(50000, currentBalance),
      bankName: 'BCA',
      bankAccount: '',
      accountHolder: 'PT Kopi Senja Indonesia',
    },
  });

  const amount = watch('amount') || 0;

  const onSubmit = (data: WithdrawalInput) => {
    if (data.amount > currentBalance) {
      toast.error(`Nominal penarikan melebihi saldo tersedia (${formatRupiah(currentBalance)})`);
      return;
    }

    try {
      onRequestSuccess(data);
      toast.success('Permintaan penarikan saldo berhasil diajukan!');
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengajukan penarikan');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Current Balance Banner */}
      <div className="p-4 bg-forest-900 text-kraft-50 rounded-2xl border border-forest-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="p-2.5 bg-forest-700 rounded-xl text-lime-400">
            <Wallet className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[10px] text-kraft-50/70 font-bold uppercase tracking-wider block">
              Saldo Tersedia
            </span>
            <span className="text-xl font-display font-extrabold text-lime-400">
              {formatRupiah(currentBalance)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setValue('amount', currentBalance)}
          className="text-xs font-bold text-lime-400 hover:underline"
        >
          Tarik Semua
        </button>
      </div>

      {/* Amount Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
          Nominal Penarikan (Rp)
        </label>
        <input
          type="number"
          step="5000"
          min="10000"
          {...register('amount', { valueAsNumber: true })}
          className="w-full px-4 py-2.5 bg-kraft-50 border border-paper-200 rounded-2xl text-lg font-display font-extrabold text-forest-900 outline-none focus:border-forest-900 focus:ring-2 focus:ring-lime-400/50"
        />
        {errors.amount && (
          <p className="text-xs text-red-600 font-medium">{errors.amount.message}</p>
        )}
      </div>

      {/* Bank Info Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-gray-400" /> Bank / E-Wallet
          </label>
          <select
            {...register('bankName')}
            className="w-full px-3 py-2 bg-kraft-card border border-paper-200 rounded-xl text-xs font-bold text-ink-900 outline-none"
          >
            <option value="BCA">Bank BCA</option>
            <option value="Mandiri">Bank Mandiri</option>
            <option value="BRI">Bank BRI</option>
            <option value="BNI">Bank BNI</option>
            <option value="GoPay">GoPay / GoTo</option>
            <option value="OVO">OVO</option>
            <option value="DANA">DANA</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5 text-gray-400" /> Nomor Rekening
          </label>
          <input
            type="text"
            placeholder="8820192841"
            {...register('bankAccount')}
            className="w-full px-3 py-2 bg-kraft-card border border-paper-200 rounded-xl text-xs font-mono font-bold text-ink-900 outline-none"
          />
          {errors.bankAccount && (
            <p className="text-xs text-red-600 font-medium">{errors.bankAccount.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-gray-400" /> Nama Pemilik
          </label>
          <input
            type="text"
            placeholder="A.N. Kopi Senja"
            {...register('accountHolder')}
            className="w-full px-3 py-2 bg-kraft-card border border-paper-200 rounded-xl text-xs font-bold text-ink-900 outline-none"
          />
          {errors.accountHolder && (
            <p className="text-xs text-red-600 font-medium">{errors.accountHolder.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || amount <= 0 || amount > currentBalance}
        className="btn-lime w-full py-3.5 px-6 text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span>Konfirmasi Penarikan ({formatRupiah(amount)})</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
