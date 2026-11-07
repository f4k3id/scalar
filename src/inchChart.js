// Sixty-fourths of an inch have exact, terminating decimal representations.
export function inchTickDecimal(tick) {
  return `${tick / 64}\u0022`;
}
