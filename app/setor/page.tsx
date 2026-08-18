'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/shared/navbar';
import { SubmissionForm } from '@/components/forms/submission-form';
import { mockStore } from '@/lib/store/mock-store';
import { UserRole } from '@/types/database.types';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SetorPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('coffee_shop');
  const categories = mockStore.getCategories();
  const { wallet } = mockStore.getWallet();

  const handleSubmissionSuccess = (data: {
    method: 'setor_langsung' | 'dijemput';
    estimatedWeightKg: number;
    categoryIds: string[];
    scheduledAt?: string;
  }) => {
    const newTx = mockStore.createSubmission(data);
    router.push(`/setor/${newTx.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
      <Navbar currentRole={role} onRoleChange={setRole} balance={wallet.balance} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-forest-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali Ke Dashboard</span>
        </Link>

        {/* Card Form */}
        <div className="card-kraft p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-forest-900">
                Pengajuan Setoran Sampah Kemasan
              </h1>
              <span className="p-1 bg-lime-100 text-forest-900 rounded-lg text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 fill-forest-900" /> Fast-Track
              </span>
            </div>
            <p className="text-xs text-gray-600 font-sans">
              Pilih metode penyaluran dan estimasi sampah operasional coffee shop Anda (&lt; 2 menit).
            </p>
          </div>

          <SubmissionForm
            categories={categories}
            onSubmitSuccess={handleSubmissionSuccess}
          />
        </div>
      </main>
    </div>
  );
}
