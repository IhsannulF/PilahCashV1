import { TransactionStatus } from '@/types/database.types';
import { Clock, CheckCircle2, AlertCircle, XCircle, Scale, ShieldAlert } from 'lucide-react';

interface StatusBadgeProps {
  status: TransactionStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-3 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-4 py-1.5 gap-2 font-bold',
  };

  const statusConfig: Record<
    TransactionStatus,
    { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
  > = {
    pending: {
      label: 'Menunggu Setor/Jemput',
      className: 'badge-pending',
      icon: Clock,
    },
    matched: {
      label: 'Mitra Ditugaskan',
      className: 'badge-matched',
      icon: AlertCircle,
    },
    weighed: {
      label: 'Menunggu Konfirmasi',
      className: 'badge-weighed',
      icon: Scale,
    },
    completed: {
      label: 'Selesai & Masuk Saldo',
      className: 'badge-completed',
      icon: CheckCircle2,
    },
    cancelled: {
      label: 'Dibatalkan',
      className: 'badge-cancelled',
      icon: XCircle,
    },
    disputed: {
      label: 'Dalam Sengketa',
      className: 'badge-disputed',
      icon: ShieldAlert,
    },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full transition-all ${config.className} ${sizeClasses[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
}
