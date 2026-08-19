'use client';

import { useState } from 'react';
import { INITIAL_PROFILES } from '@/lib/store/mock-store';
import { Profile } from '@/types/database.types';
import { Truck, CheckCircle2, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminMitraPage() {
  const [partners, setPartners] = useState<Profile[]>(
    INITIAL_PROFILES.filter((p) => p.id === 'pg-demo')
  );

  const handleToggleStatus = (id: string, name: string) => {
    toast.success(`Status mitra pengepul ${name} berhasil di-update (Aktif)!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-2xl font-display font-extrabold text-forest-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-forest-900" />
            Mitra Pengepul & Daur Ulang Rekanan (Admin)
          </h1>
          <p className="text-xs text-gray-600 font-sans mt-1">
            Kelola dan pantau jaringan pengepul & pabrik daur ulang mitra tempat PilahCash mendaur ulang sampah kemasan
          </p>
        </div>

        <div className="card-kraft p-6 space-y-4">
          <h2 className="text-base font-display font-extrabold text-forest-900">
            Daftar Mitra Pengepul Terdaftar
          </h2>

          <div className="space-y-3">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="p-4 bg-kraft-50 rounded-2xl border border-paper-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-extrabold text-sm text-forest-900">
                      {partner.business_name}
                    </span>
                    <span className="text-[10px] font-bold bg-lime-100 text-forest-900 px-2.5 py-0.5 rounded-full border border-lime-400/30">
                      Terverifikasi
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 flex items-center gap-1 font-sans">
                    <MapPin className="w-3.5 h-3.5 text-forest-900" />
                    {partner.address}
                  </p>

                  <p className="text-xs text-gray-600 flex items-center gap-1 font-mono">
                    <Phone className="w-3.5 h-3.5 text-forest-900" />
                    {partner.phone}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(partner.id, partner.business_name)}
                    className="px-4 py-2 bg-lime-100 text-forest-900 font-bold text-xs rounded-full border border-lime-400/40 hover:bg-lime-400 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-900" />
                    <span>Status: Aktif</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
