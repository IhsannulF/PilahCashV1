'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockStore } from '@/lib/store/mock-store';
import { UserRole } from '@/types/database.types';
import { QrCode, Search, Scale, Truck } from 'lucide-react';
import { toast } from 'sonner';

export default function PengepulDashboard() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('pengepul');
  const [searchCode, setSearchCode] = useState('');
  const [, setTick] = useState(0);

  const transactions = mockStore.getTransactions('pengepul');
  const { wallet } = mockStore.getWallet();

  const handleSearchOrScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) {
      toast.error('Masukkan kode transaksi');
      return;
    }

    const tx = mockStore.getTransactionById(searchCode.trim());
    if (!tx) {
      toast.error('Kode transaksi tidak ditemukan!');
      return;
    }

    router.push(`/pengepul/transaksi/${tx.id}`);
  };

  const handleTakeJob = (transactionId: string) => {
    mockStore.assignPengepul(transactionId);
    toast.success('Penjemputan berhasil ditugaskan ke Anda!');
    setTick((t) => t + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
      <Navbar currentRole={role} onRoleChange={setRole} balance={wallet.balance} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-display font-extrabold text-forest-900 flex items-center gap-2">
                <Truck className="w-6 h-6 text-forest-900" />
                Dashboard Petugas Pengepul
              </h1>
              <span className="text-xs font-bold bg-lime-100 text-forest-900 px-3 py-1 rounded-full border border-lime-400/40">
                Mitra Berkah
              </span>
            </div>
            <p className="text-xs text-gray-600 font-sans mt-1">
              Cari kode QR transaksi coffee shop atau kelola antrean penjemputan sampah hari ini
            </p>
          </div>
        </div>

        {/* Quick QR Code / Code Search Input Card */}
        <div className="card-kraft p-6 sm:p-8 space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
              Scan / Input Kode Transaksi
            </span>
            <h2 className="text-lg font-display font-bold text-forest-900">
              Input Kode Transaksi Coffee Shop
            </h2>
          </div>

          <form onSubmit={handleSearchOrScan} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <QrCode className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Contoh: PLC-20260818-8A3F"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-kraft-50 border border-paper-200 rounded-2xl text-sm font-mono font-bold text-ink-900 uppercase tracking-wider outline-none focus:border-forest-900"
              />
            </div>
            <button
              type="submit"
              className="btn-lime py-3 px-6 text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Buka Transaksi & Timbang</span>
            </button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500 font-medium">Contoh Kode Demo:</span>
            {transactions.slice(0, 3).map((t) => (
              <button
                key={t.id}
                onClick={() => setSearchCode(t.transaction_code)}
                className="px-3 py-1 bg-kraft-50 hover:bg-lime-100 text-forest-900 font-mono font-bold rounded-lg border border-paper-200 text-[11px]"
              >
                {t.transaction_code}
              </button>
            ))}
          </div>
        </div>

        {/* Assigned Jobs & Pickup Queue */}
        <div className="card-kraft p-6 space-y-4">
          <h2 className="text-base font-display font-extrabold text-forest-900">
            Daftar Tugas Penjemputan & Setoran
          </h2>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl bg-kraft-50 border border-paper-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-forest-900 bg-lime-100 px-2 py-0.5 rounded">
                      {tx.transaction_code}
                    </span>
                    <StatusBadge status={tx.status} size="sm" />
                  </div>
                  <p className="text-xs font-bold text-forest-900">
                    {tx.coffee_shop?.business_name} • {tx.coffee_shop?.address}
                  </p>
                  <p className="text-xs text-gray-600 font-sans">
                    Estimasi Sampah: <strong className="font-mono">{tx.estimated_weight_kg} kg</strong> ({tx.method === 'dijemput' ? 'Dijemput' : 'Setor Langsung'})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {tx.status === 'pending' && (
                    <button
                      onClick={() => handleTakeJob(tx.id)}
                      className="px-4 py-2 bg-clay-500 text-white font-bold text-xs rounded-full shadow hover:bg-opacity-90"
                    >
                      Ambil Tugas Penjemputan
                    </button>
                  )}

                  <Link
                    href={`/pengepul/transaksi/${tx.id}`}
                    className="btn-lime px-4 py-2 text-xs flex items-center gap-1.5 shadow"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{tx.status === 'weighed' ? 'Edit Timbangan' : 'Timbang Sekarang'}</span>
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
