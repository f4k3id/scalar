import React from 'react';
import { tokenizeExpr } from './calc.js';

const Caret = () => <span className="caret" />;

// Plain text with the caret drawn at absolute position `caret` (if it falls inside [start, start+text.length])
function TextWithCaret({ text, start, caret }) {
  if (caret == null || caret < start || caret > start + text.length) return text;
  const k = caret - start;
  return <>{text.slice(0, k)}<Caret />{text.slice(k)}</>;
}

// Stacked fraction: numerator over a bar over the denominator. Empty slots show a box.
export function Frac({ num, den, className = '', numCaret = false, denCaret = false, numStart, denStart, caret, onNum, onDen }) {
  const slot = (txt, start, hasCaret, onPick) => (
    <span className={(txt ? '' : 'slot-wrap ') + (onPick ? 'pickable' : '')} onMouseUp={onPick}>
      {txt ? (hasCaret ? <TextWithCaret text={txt} start={start} caret={caret} /> : txt)
        : <>{hasCaret && <Caret />}<span className="slot">□</span></>}
    </span>
  );
  return (
    <span className={'mfrac ' + className}>
      <span className="mfrac-num">{slot(num, numStart, numCaret, onNum)}</span>
      <span className="mfrac-den">{slot(den, denStart, denCaret, onDen)}</span>
    </span>
  );
}

// Renders a calculator expression with spaced operators and stacked fractions.
// With `caret`, draws the cursor; `onCaret(pos)` is called when a fraction box is tapped.
export default function MathText({ expr, caret = null, onCaret }) {
  const tokens = tokenizeExpr(expr);
  let placed = false;
  const nodes = tokens.map((tk, i) => {
    if (tk.t === 'frac') {
      const inNum = caret != null && !placed && caret >= tk.ns && caret <= tk.bar;
      const inDen = caret != null && !placed && !inNum && caret > tk.bar && caret <= tk.de;
      if (inNum || inDen) placed = true;
      const pick = (pos) => onCaret && ((e) => { if (!window.getSelection()?.toString()) { e.stopPropagation(); onCaret(pos); } });
      return <Frac key={i} num={tk.num} den={tk.den} numCaret={inNum} denCaret={inDen} numStart={tk.ns} denStart={tk.bar + 1} caret={caret}
        onNum={pick(tk.bar)} onDen={pick(tk.de)} />;
    }
    let pre = null;
    if (caret != null && !placed && caret >= tk.s && caret < tk.e) {
      placed = true;
      if (caret === tk.s) pre = <Caret />;
      else return <span key={i} className={tk.t === 'op' ? 'mop' : undefined}><TextWithCaret text={tk.v} start={tk.s} caret={caret} /></span>;
    }
    return <React.Fragment key={i}>{pre}<span className={tk.t === 'op' ? 'mop' : undefined}>{tk.v}</span></React.Fragment>;
  });
  return <>{nodes}{caret != null && !placed && <Caret />}</>;
}
