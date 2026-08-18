'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Leaf, Wallet, PlusCircle, History, ArrowUpRight, ShieldCheck, Truck, LogOut } from 'lucide-react';
import { UserRole } from '@/types/database.types';
import { RoleSwitcher } from './role-switcher';
import { formatRupiah } from '@/lib/utils/pricing';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  balance?: number;
}

interface NavLinkItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export function Navbar({ currentRole, onRoleChange, balance = 0 }: NavbarProps) {
  const pathname = usePathname();

  const coffeeShopLinks: NavLinkItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: Leaf },
    { href: '/setor', label: '+ Setor Sampah', icon: PlusCircle, highlight: true },
    { href: '/riwayat', label: 'Riwayat Sampah', icon: History },
    { href: '/saldo', label: 'Saldo & Penarikan', icon: Wallet },
  ];

  const pengepulLinks: NavLinkItem[] = [
    { href: '/pengepul/dashboard', label: 'Daftar Penjemputan / Scan', icon: Truck },
  ];

  const adminLinks: NavLinkItem[] = [
    { href: '/admin/kategori', label: 'Kategori & Tarif', icon: Leaf },
    { href: '/admin/mitra', label: 'Kelola Pengepul', icon: Truck },
    { href: '/admin/transaksi', label: 'Monitoring Transaksi', icon: ShieldCheck },
  ];

  const activeLinks =
    currentRole === 'coffee_shop'
      ? coffeeShopLinks
      : currentRole === 'pengepul'
      ? pengepulLinks
      : adminLinks;

  return (
    <header className="sticky top-0 z-40 w-full bg-forest-900 text-kraft-50 border-b border-forest-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-full bg-lime-400 text-ink-900 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <Leaf className="w-5 h-5 fill-ink-900" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-xl text-kraft-50 tracking-tight flex items-center gap-1">
                  Pilah<span className="text-lime-400">Cash</span>
                </span>
                <span className="text-[10px] text-lime-100/70 -mt-1 font-medium hidden sm:inline">
                  Sampah Kemasan Jadi Uang
                </span>
              </div>
            </Link>

            {/* Nav Links Desktop */}
            <nav className="hidden md:flex items-center gap-1">
              {activeLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-150 ${
                      link.highlight
                        ? 'btn-lime text-ink-900 px-4'
                        : isActive
                        ? 'bg-forest-700 text-lime-400 font-bold'
                        : 'text-kraft-50/80 hover:bg-forest-700/60 hover:text-lime-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Role Switcher & Balance Badge */}
          <div className="flex items-center gap-3">
            <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />

            {currentRole === 'coffee_shop' && (
              <Link
                href="/saldo"
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-forest-700 border border-lime-400/30 rounded-full hover:border-lime-400 transition-colors"
              >
                <Wallet className="w-4 h-4 text-lime-400" />
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[9px] text-kraft-50/60 uppercase tracking-wider font-bold">Saldo</span>
                  <span className="text-xs font-display font-extrabold text-lime-400">
                    {formatRupiah(balance)}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-lime-400" />
              </Link>
            )}

            <Link
              href="/login"
              className="p-2 rounded-full text-kraft-50/60 hover:text-red-400 hover:bg-forest-700 transition-colors"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-forest-700">
          {activeLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg ${
                  isActive
                    ? 'text-lime-400 font-bold'
                    : 'text-kraft-50/70 hover:text-lime-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label.replace('+ ', '')}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
