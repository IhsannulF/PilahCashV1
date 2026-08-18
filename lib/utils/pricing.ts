/**
 * PilahCash Pricing Calculation Engine
 * 
 * Rules:
 * - subtotal_kategori = weight_kg * price_per_kg
 * - gross_amount = sum(subtotal_kategori)
 * - method === 'dijemput' -> commission = gross_amount * commissionRate (default 15%)
 * - method === 'setor_langsung' -> commission = 0
 * - net_amount = gross_amount - commission_amount
 */

export interface PricingItem {
  weight_kg: number;
  price_per_kg: number;
}

export interface PricingResult {
  grossAmount: number;
  commissionAmount: number;
  netAmount: number;
  commissionRate: number;
}

export function calculateTransactionPricing(
  items: PricingItem[],
  method: 'setor_langsung' | 'dijemput',
  commissionRate = 0.15
): PricingResult {
  const grossAmount = items.reduce((sum, item) => {
    const validWeight = Math.max(0, item.weight_kg || 0);
    const validPrice = Math.max(0, item.price_per_kg || 0);
    return sum + validWeight * validPrice;
  }, 0);

  const effectiveRate = method === 'dijemput' ? Math.min(Math.max(commissionRate, 0.15), 0.20) : 0;
  const commissionAmount = Math.round(grossAmount * effectiveRate);
  const netAmount = grossAmount - commissionAmount;

  return {
    grossAmount,
    commissionAmount,
    netAmount,
    commissionRate: effectiveRate,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
