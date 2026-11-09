import { create, all } from 'mathjs';
const math = create(all, { number: 'number' });

// Display-string -> mathjs expression
const OPERAND = String.raw`(\d*\.?\d+(?:ᴇ[−-]?\d+)?|Ans|π|e|\([^()]*\))`;
const FRAC_RE = new RegExp(OPERAND + '⁄' + OPERAND, 'gu');

// a⁄b typed with the fraction key binds tighter than any operator: 1⁄32 → (1÷32)
export function groupFractions(s) {
  let prev;
  do { prev = s; s = s.replace(FRAC_RE, '($1÷$2)'); } while (s !== prev);
  return s.replace(/⁄/g, '÷');
}

export function toMath(s) {
  return groupFractions(s)
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

// Fraction parts {neg, n, d} if the result is a simple rational, else null
export function fractionParts(x) {
  if (Number.isInteger(x) || Math.abs(x) > 1e9) return null;
  try {
    const f = math.fraction(x);
    if (f.d > 10000 || Math.abs(Number(f.s * f.n) / Number(f.d) - x) > 1e-12) return null;
    return { neg: f.s < 0, n: String(f.n), d: String(f.d) };
  } catch { return null; }
}

// Readable fraction string (e.g. "1/32") if the result is a simple rational
export function asFraction(x) {
  const f = fractionParts(x);
  return f ? `${f.neg ? '−' : ''}${f.n}/${f.d}` : null;
}

// Split a display expression into tokens for rendering; fractions become {frac:[num, den]}
export function tokenizeExpr(s) {
  const out = [];
  let i = 0;
  const readGroup = (start) => { // returns index after matching ')', or end of string
    let depth = 0, j = start;
    for (; j < s.length; j++) { if (s[j] === '(') depth++; else if (s[j] === ')') { depth--; if (depth === 0) return j + 1; } }
    return j;
  };
  while (i < s.length) {
    const rest = s.slice(i);
    let m;
    if ((m = rest.match(/^\d*\.?\d+(?:ᴇ[−-]?\d*)?|^\d+\.|^\.(?!\d)/))) { out.push({ t: 'num', v: m[0] }); i += m[0].length; continue; }
    if ((m = rest.match(/^(Ans|π|e(?![\^]))/))) { out.push({ t: 'const', v: m[0] }); i += m[0].length; continue; }
    if (rest[0] === '⁄') { out.push({ t: 'fracbar' }); i++; continue; }
    if (rest[0] === '(') {
      // keep a parenthesized group together only when it is a fraction operand
      const end = readGroup(i);
      if (s[end] === '⁄' || s[i - 1] === '⁄') { out.push({ t: 'group', v: s.slice(i, end) }); i = end; continue; }
    }
    if ('+−×÷'.includes(rest[0])) { out.push({ t: 'op', v: rest[0] }); i++; continue; }
    out.push({ t: 'txt', v: rest[0] }); i++;
  }
  // fold  operand ⁄ operand  into fraction nodes
  const folded = [];
  for (let k = 0; k < out.length; k++) {
    const tk = out[k];
    if (tk.t === 'fracbar') {
      const prev = folded.length && ['num', 'const', 'group'].includes(folded[folded.length - 1].t) ? folded.pop() : null;
      const next = out[k + 1] && ['num', 'const', 'group'].includes(out[k + 1].t) ? out[++k] : null;
      folded.push({ t: 'frac', num: prev ? prev.v : '', den: next ? next.v : '' });
    } else folded.push(tk);
  }
  return folded;
}

export function formatResult(x) {
  const a = Math.abs(x);
  if (x !== 0 && (a >= 1e10 || a < 1e-9)) return x.toExponential(9).replace(/\.?0+e/, 'e').replace('e+', '×10^').replace('e-', '×10^−');
  return String(parseFloat(x.toPrecision(10))).replace('-', '−');
}
