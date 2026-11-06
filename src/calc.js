import { create, all } from 'mathjs';
const math = create(all, { number: 'number' });

// Display-string -> mathjs expression
export function toMath(s) {
  return s
    .replace(/(\d*\.?\d+)ᴇ(−|-)?(\d+)/g, (_, m, neg, e) => `(${m}e${neg ? '-' : ''}${e})`)
    .replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-')
    .replace(/π/g, 'pi').replace(/√\(/g, 'sqrt(').replace(/∛\(/g, 'cbrt(')
    .replace(/sin⁻¹\(/g, 'asin(').replace(/cos⁻¹\(/g, 'acos(').replace(/tan⁻¹\(/g, 'atan(')
    .replace(/log\(/g, 'log10(').replace(/ln\(/g, 'log(')
    .replace(/⁻¹/g, '^(-1)').replace(/²/g, '^2').replace(/³/g, '^3')
    .replace(/%/g, '/100');
}

export function evaluate(expr, { angle = 'deg', ans = 0 } = {}) {
  if (!expr.trim()) throw new Error('Empty');
  let src = toMath(expr);
  const open = (src.match(/\(/g) || []).length - (src.match(/\)/g) || []).length;
  if (open > 0) src += ')'.repeat(open); // auto-close like a Casio
  const k = Math.PI / 180, deg = angle === 'deg';
  const snap = x => Math.abs(x) < 1e-15 ? 0 : x;
  const scope = {
    Ans: ans,
    sin: x => snap(Math.sin(deg ? x * k : x)), cos: x => snap(Math.cos(deg ? x * k : x)),
    tan: x => { const r = deg ? x * k : x; if (deg && Math.abs(x % 180) === 90) throw new Error('Math ERROR'); return snap(Math.tan(r)); },
    asin: x => Math.asin(x) / (deg ? k : 1), acos: x => Math.acos(x) / (deg ? k : 1), atan: x => Math.atan(x) / (deg ? k : 1),
  };
  let r;
  try { r = math.evaluate(src, scope); } catch { throw new Error('Syntax ERROR'); }
  if (typeof r !== 'number' || !isFinite(r)) throw new Error('Math ERROR');
  return parseFloat(r.toPrecision(14));
}

// Readable fraction if result is a simple rational
export function asFraction(x) {
  if (Number.isInteger(x) || Math.abs(x) > 1e9) return null;
  try {
    const f = math.fraction(x);
    if (f.d > 10000 || Math.abs(Number(f.s * f.n) / Number(f.d) - x) > 1e-12) return null;
    return `${f.s < 0 ? '−' : ''}${f.n}⁄${f.d}`;
  } catch { return null; }
}

export function formatResult(x) {
  const a = Math.abs(x);
  if (x !== 0 && (a >= 1e10 || a < 1e-9)) return x.toExponential(9).replace(/\.?0+e/, 'e').replace('e+', '×10^').replace('e-', '×10^−');
  return String(parseFloat(x.toPrecision(10))).replace('-', '−');
}
