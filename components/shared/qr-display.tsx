'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, QrCode } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface QRDisplayProps {
  transactionCode: string;
  businessName?: string;
  method?: string;
}

export function QRDisplay({ transactionCode, businessName, method }: QRDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionCode);
    setCopied(true);
    toast.success('Kode Transaksi berhasil disalin!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-kraft-card rounded-3xl border border-paper-200 shadow-xl max-w-sm mx-auto text-center space-y-4">
      <div className="flex items-center gap-2 text-forest-900 font-display font-extrabold text-sm">
        <QrCode className="w-4 h-4 text-forest-900" />
        <span>Tunjukkan Struk QR / Kode ke Petugas</span>
      </div>

      {businessName && (
        <p className="text-xs text-ink-muted font-semibold">
          {businessName} • {method === 'dijemput' ? 'Layanan Penjemputan' : 'Setor Langsung'}
        </p>
      )}

      <div className="p-4 bg-lime-100/60 rounded-2xl border border-lime-400/40 shadow-inner">
        <QRCodeSVG
          value={transactionCode}
          size={180}
          bgColor={'transparent'}
          fgColor={'#16301F'}
          level={'H'}
          includeMargin={false}
        />
      </div>

      <div className="w-full space-y-2">
        <span className="text-[11px] uppercase tracking-wider text-ink-muted font-bold block">
          Kode Transaksi Struk
        </span>
        <div className="flex items-center justify-between gap-2 p-3 bg-forest-900 rounded-xl border border-forest-700 font-mono text-sm font-extrabold text-lime-400">
          <span className="tracking-widest">{transactionCode}</span>
          <button
            onClick={copyToClipboard}
            className="p-1.5 hover:bg-forest-700 rounded-lg text-lime-400 transition-colors"
            title="Salin Kode"
          >
            {copied ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
