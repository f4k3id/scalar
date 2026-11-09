import React from 'react';
import { tokenizeExpr } from './calc.js';

// Stacked fraction: numerator over a bar over the denominator. Empty slots show a box.
export function Frac({ num, den, className = '' }) {
  return (
    <span className={'mfrac ' + className}>
      <span className="mfrac-num">{num || <span className="slot">□</span>}</span>
      <span className="mfrac-den">{den || <span className="slot">□</span>}</span>
    </span>
  );
}

// Renders a calculator expression with spaced operators and stacked fractions.
export default function MathText({ expr }) {
  return (
    <>
      {tokenizeExpr(expr).map((tk, i) => {
        if (tk.t === 'frac') return <Frac key={i} num={tk.num} den={tk.den} />;
        if (tk.t === 'op') return <span key={i} className="mop">{tk.v}</span>;
        return <span key={i}>{tk.v}</span>;
      })}
    </>
  );
}
