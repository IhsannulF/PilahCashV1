'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/shared/navbar';
import { mockStore } from '@/lib/store/mock-store';
import { UserRole } from '@/types/database.types';
import { formatRupiah } from '@/lib/utils/pricing';
import { Leaf, Store, Truck, ShieldCheck, ArrowRight, CheckCircle2, Ticket, Sparkles } from 'lucide-react';

export default function Home() {
  const [role, setRole] = useState<UserRole>('coffee_shop');
  const categories = mockStore.getCategories();
  const { wallet } = mockStore.getWallet();

  return (
    <div className="min-h-screen flex flex-col bg-kraft-50 text-ink-900">
      <Navbar currentRole={role} onRoleChange={setRole} balance={wallet.balance} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-forest-900 text-kraft-50 pt-16 pb-24 px-4 sm:px-6 lg:px-8 shadow-2xl border-b border-forest-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-700 border border-lime-400/40 text-lime-400 text-xs font-extrabold">
              <Sparkles className="w-4 h-4 text-lime-400 fill-lime-400" />
              <span>IndonesiaNEXT Hackathon 2026 • Tahap Final</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-kraft-50">
              SAMPAH KEMASANMU,{' '}
              <span className="text-lime-400 underline decoration-lime-400 decoration-wavy decoration-2">
                BUKAN CUMA SAMPAH.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-kraft-50 max-w-2xl font-sans font-medium leading-relaxed">
              Jual sampah kemasan operasional coffee shop-mu (kaleng SKM, botol sirup, dus kardus) ke pengepul mitra — mudah, transparan & terjadwal.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/dashboard"
                className="btn-lime px-7 py-3.5 text-sm flex items-center gap-2 shadow-xl hover:scale-105"
              >
                <span>Mulai Setor Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/pengepul/dashboard"
                className="btn-forest-outline px-6 py-3.5 text-sm flex items-center gap-2"
              >
                <Truck className="w-4 h-4 text-lime-400" />
                <span>Mode Petugas Pengepul</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-forest-700 text-xs text-kraft-50 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>Alur &lt; 2 Menit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>Konfirmasi 2-Arah</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                <span>Tanpa Hardware IoT</span>
              </div>
            </div>
          </div>

          {/* Hero Signature Element Card (Transaction Receipt Ticket Card) */}
          <div className="lg:col-span-5">
            <div className="ticket-receipt-card overflow-hidden shadow-2xl text-ink-900 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-paper-200">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-lime-400 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-forest-900">
                    Struk Setor Sampah Real-time
                  </span>
                </div>
                <span className="font-mono text-xs font-extrabold text-forest-900 bg-lime-100 px-2 py-0.5 rounded">
                  PLC-20260818-8A3F
                </span>
              </div>

              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-muted font-bold">Coffee Shop:</span>
                  <span className="font-extrabold text-forest-900">Kopi Senja Senopati</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-ink-muted font-bold">Metode:</span>
                  <span className="font-bold text-clay-500 bg-clay-500/15 px-2.5 py-0.5 rounded-full border border-clay-500/30">
                    Dijemput Mitra (Pickup)
                  </span>
                </div>

                <div className="p-3.5 bg-kraft-50 rounded-xl border border-paper-200 space-y-2">
                  <div className="flex justify-between text-xs font-mono font-extrabold text-forest-900">
                    <span>Plastik UHT & Botol (8.5kg)</span>
                    <span>Rp 38.250</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono font-extrabold text-forest-900">
                    <span>Kaleng SKM Logam (6.0kg)</span>
                    <span>Rp 45.000</span>
                  </div>
                </div>

                {/* Tear Divider */}
                <div className="relative my-2">
                  <div className="border-t border-dashed border-paper-200 w-full" />
                </div>

                <div className="p-4 bg-forest-900 text-kraft-50 rounded-2xl flex justify-between items-center">
                  <span className="text-xs text-kraft-50 font-bold uppercase tracking-wider">
                    Saldo Diterima Coffee Shop
                  </span>
                  <span className="text-xl font-display font-extrabold text-lime-400">
                    {formatRupiah(61625)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waste Categories & Market Pricing Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-display font-extrabold text-forest-900">
            Tarif & Kategori Sampah Kemasan
          </h2>
          <p className="text-sm text-ink-muted font-sans font-medium">
            Harga beli per kilogram transparan, selalu di-update mengikuti patokan harga pasar daur ulang.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="card-kraft p-5 flex flex-col justify-between hover:border-forest-900 transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="p-3 bg-lime-100 text-forest-900 rounded-2xl">
                  <Leaf className="w-5 h-5 fill-forest-900" />
                </span>
                <span className="text-xs font-mono font-extrabold text-forest-900 bg-lime-100 px-3 py-1 rounded-full border border-lime-400/50">
                  {formatRupiah(cat.price_per_kg)} / kg
                </span>
              </div>

              <div className="mt-4">
                <h3 className="font-display font-bold text-sm text-forest-900">
                  {cat.name}
                </h3>
                <p className="text-xs text-ink-muted font-sans mt-1">
                  Kemasan bersih siap dipres atau dilebur oleh mitra pengepul.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Role Access Section */}
      <section className="bg-forest-900 text-kraft-50 py-16 px-4 sm:px-6 lg:px-8 border-t border-forest-700">
        <div className="max-w-7xl mx-auto space-y-8 text-center">
          <h2 className="text-3xl font-display font-extrabold text-kraft-50">
            Uji Alur Kerja Berdasarkan Role
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <Link
              href="/dashboard"
              className="p-6 bg-forest-700/70 hover:bg-forest-700 rounded-2xl border border-lime-400/30 transition-all space-y-3 block hover:border-lime-400"
            >
              <div className="flex items-center gap-2 text-lime-400">
                <Store className="w-5 h-5" />
                <span className="font-display font-extrabold text-base text-kraft-50">Coffee Shop</span>
              </div>
              <p className="text-xs text-kraft-50 leading-relaxed font-sans font-medium">
                Buat setoran baru, tunjukkan QR Code struk, konfirmasi hasil timbangan, dan tarik saldo pendapatan.
              </p>
            </Link>

            <Link
              href="/pengepul/dashboard"
              className="p-6 bg-forest-700/70 hover:bg-forest-700 rounded-2xl border border-lime-400/30 transition-all space-y-3 block hover:border-lime-400"
            >
              <div className="flex items-center gap-2 text-lime-400">
                <Truck className="w-5 h-5" />
                <span className="font-display font-extrabold text-base text-kraft-50">Petugas Pengepul</span>
              </div>
              <p className="text-xs text-kraft-50 leading-relaxed font-sans font-medium">
                Cari/scan kode transaksi coffee shop, timbang sampah per kategori, dan kirim nominal otomatis.
              </p>
            </Link>

            <Link
              href="/admin/kategori"
              className="p-6 bg-forest-700/70 hover:bg-forest-700 rounded-2xl border border-lime-400/30 transition-all space-y-3 block hover:border-lime-400"
            >
              <div className="flex items-center gap-2 text-lime-400">
                <ShieldCheck className="w-5 h-5" />
                <span className="font-display font-extrabold text-base text-kraft-50">Admin Platform</span>
              </div>
              <p className="text-xs text-kraft-50 leading-relaxed font-sans font-medium">
                Kelola tarif per kg, approve status pengepul mitra, dan pantau seluruh transaksi platform.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-forest-900 border-t border-forest-700 text-center text-xs text-kraft-50">
        <p>© 2026 PilahCash — Built for 10th IndonesiaNEXT Hackathon Telkomsel.</p>
      </footer>
    </div>
  );
}
