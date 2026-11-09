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

// Split a display expression into tokens for rendering, keeping string positions.
// Fractions become {t:'frac', num, den, ns, bar, de}: numerator is [ns, bar), denominator is [bar+1, de).
export function tokenizeExpr(s) {
  const out = [];
  let i = 0;
  const readGroup = (start) => {
    let depth = 0, j = start;
    for (; j < s.length; j++) { if (s[j] === '(') depth++; else if (s[j] === ')') { depth--; if (depth === 0) return j + 1; } }
    return j;
  };
  const push = (t, len, extra = {}) => { out.push({ t, v: s.slice(i, i + len), s: i, e: i + len, ...extra }); i += len; };
  while (i < s.length) {
    const rest = s.slice(i);
    let m;
    if ((m = rest.match(/^\d*\.?\d+(?:ᴇ[−-]?\d*)?|^\d+\.|^\.(?!\d)/))) { push('num', m[0].length); continue; }
    if ((m = rest.match(/^(Ans|π|e(?![\^]))/))) { push('const', m[0].length); continue; }
    if (rest[0] === '⁄') { push('fracbar', 1); continue; }
    if (rest[0] === '(') {
      const end = readGroup(i);
      if (s[end] === '⁄' || s[i - 1] === '⁄') { push('group', end - i); continue; }
    }
    if ('+−×÷'.includes(rest[0])) { push('op', 1); continue; }
    push('txt', 1);
  }
  const isOperand = (tk) => tk && ['num', 'const', 'group'].includes(tk.t);
  const folded = [];
  for (let k = 0; k < out.length; k++) {
    const tk = out[k];
    if (tk.t === 'fracbar') {
      const prev = isOperand(folded[folded.length - 1]) ? folded.pop() : null;
      const next = isOperand(out[k + 1]) ? out[++k] : null;
      folded.push({ t: 'frac', num: prev ? prev.v : '', den: next ? next.v : '',
        ns: prev ? prev.s : tk.s, bar: tk.s, de: next ? next.e : tk.s + 1, s: prev ? prev.s : tk.s, e: next ? next.e : tk.s + 1 });
    } else folded.push(tk);
  }
  return folded;
}

// True when the text before the caret ends with something a fraction can use as its numerator
export function endsWithOperand(prefix) {
  return /(\d|\.|\)|π|Ans|(^|[^a-zA-Z])e)$/u.test(prefix);
}

// Where Up/Down should move the caret inside a typed fraction (or null when not in one)
export function fractionCaretMove(s, caret, dir) {
  for (const tk of tokenizeExpr(s)) {
    if (tk.t !== 'frac') continue;
    if (dir === 'down' && caret >= tk.ns && caret <= tk.bar) return tk.de;
    if (dir === 'up' && caret > tk.bar && caret <= tk.de) return tk.bar;
  }
  return null;
}
export function formatResult(x) {
  const a = Math.abs(x);
  if (x !== 0 && (a >= 1e10 || a < 1e-9)) return x.toExponential(9).replace(/\.?0+e/, 'e').replace('e+', '×10^').replace('e-', '×10^−');
  return String(parseFloat(x.toPrecision(10))).replace('-', '−');
}
