// Sixty-fourths of an inch have exact, terminating decimal representations.
export function inchTickDecimal(tick) {
  return `${tick / 64}\u0022`;
}

// Rows of the fractional-inch decimal-equivalents table (1/64 to 1 in, 64 rows):
// fraction in lowest terms, decimal without leading zero, millimeters to 3 decimals.
export function decimalEquivalentRows() {
  const g = (a, b) => (b ? g(b, a % b) : a);
  const rows = [];
  for (let i = 1; i <= 64; i++) {
    const k = g(i, 64);
    const n = i / k, d = 64 / k;
    const inch = i / 64;
    const decimal = inch === 1 ? '1' : String(inch).replace(/^0/, '');
    const mm = String(Math.round((i * 25400) / 64) / 1000); // exact thousandths, half rounds up like the printed chart
    rows.push({ i, n, d, decimal, mm });
  }
  return rows;
}
