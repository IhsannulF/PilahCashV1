/**
 * Generate unique PilahCash Transaction Code (e.g. PLC-20260818-8A3F)
 */
export function generateTransactionCode(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PLC-${dateStr}-${randomSuffix}`;
}
