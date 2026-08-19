'use client';

import { UserRole } from '@/types/database.types';
import { Store, Truck, ShieldCheck } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange?: (role: UserRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect = (role: UserRole) => {
    if (onRoleChange) {
      onRoleChange(role);
    }
    if (role === 'coffee_shop' && !pathname.startsWith('/dashboard')) {
      router.push('/dashboard');
    } else if (role === 'admin' && !pathname.startsWith('/admin')) {
      router.push('/admin/transaksi');
    }
  };

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-forest-700 rounded-full border border-lime-400/20 text-xs font-medium backdrop-blur-md">
      <span className="px-2 text-lime-400 font-bold hidden lg:inline text-[11px] uppercase tracking-wider">
        Demo:
      </span>
      <button
        onClick={() => handleSelect('coffee_shop')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-xs ${
          currentRole === 'coffee_shop'
            ? 'bg-lime-400 text-ink-900 font-bold shadow'
            : 'text-kraft-50/70 hover:text-lime-400'
        }`}
      >
        <Store className="w-3.5 h-3.5" />
        <span>Coffee Shop</span>
      </button>

      <button
        onClick={() => handleSelect('admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 text-xs ${
          currentRole === 'admin'
            ? 'bg-lime-400 text-ink-900 font-bold shadow'
            : 'text-kraft-50/70 hover:text-lime-400'
        }`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Admin (PilahCash)</span>
      </button>
    </div>
  );
}
