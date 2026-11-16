const FRACTIONS = { 0.25: '¼', 0.5: '½', 0.75: '¾' };
const DECIMAL_UNITS = new Set(['ק"ג', 'ליטר']);

/** Format a quantity for display: fractions for spoons and items, decimals for kg and litres. */
export function fmtQty(qty, unit = '') {
  if (qty == null) return '';
  if (DECIMAL_UNITS.has(unit)) return String(Math.round(qty * 10) / 10);
  if (qty >= 100) return String(Math.round(qty / 10) * 10);
  if (qty >= 10) return String(Math.round(qty));
  const rounded = Math.max(0.25, Math.round(qty * 4) / 4);
  const whole = Math.floor(rounded);
  const frac = FRACTIONS[rounded - whole] ?? '';
  return whole ? `${whole}${frac}` : frac;
}
