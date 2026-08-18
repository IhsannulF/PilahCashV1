'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Store, Truck, ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('coffeeshop@pilahcash.id');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'coffee_shop' | 'pengepul' | 'admin'>('coffee_shop');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Login berhasil sebagai ${role === 'coffee_shop' ? 'Coffee Shop' : role === 'pengepul' ? 'Pengepul' : 'Admin'}!`);

    if (role === 'coffee_shop') {
      router.push('/dashboard');
    } else if (role === 'pengepul') {
      router.push('/pengepul/dashboard');
    } else {
      router.push('/admin/transaksi');
    }
  };

  return (
    <div className="min-h-screen eco-hero-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl border border-emerald-500/20 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl eco-gradient-bg flex items-center justify-center text-white shadow-md">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="font-black text-2xl text-emerald-950 dark:text-emerald-50">
              Pilah<span className="text-emerald-600">Cash</span>
            </span>
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 pt-2">
            Selamat Datang Kembali
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Masuk ke akun usaha coffee shop atau pengepul mitra Anda
          </p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setRole('coffee_shop')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'coffee_shop'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Coffee Shop</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('pengepul')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'pengepul'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Pengepul</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              role === 'admin'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Email Usaha</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 eco-gradient-bg text-white font-extrabold text-sm rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Masuk Ke Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Belum punya akun?{' '}
          <Link href="/register" className="font-bold text-emerald-600 hover:underline">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
