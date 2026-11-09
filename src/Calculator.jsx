import React, { useCallback, useEffect, useRef, useState } from 'react';
import { evaluate, fractionParts, formatResult, endsWithOperand, fractionCaretMove } from './calc.js';
import MathText, { Frac } from './MathText.jsx';
import { usePersist } from './store.js';
import ResizeHandle from './ResizeHandle.jsx';

// [label, insert, shiftLabel, shiftInsert, class]
const SCI = [
  ['x⁻¹','⁻¹','x!','!'], ['√','√(','∛','∛('], ['x²','²','x³','³'], ['xʸ','^(','ʸ√x','^(1÷'], ['log','log(','10ˣ','10^('], ['ln','ln(','eˣ','e^('],
  ['(−)','−','|x|','abs('], ['sin','sin(','sin⁻¹','sin⁻¹('], ['cos','cos(','cos⁻¹','cos⁻¹('], ['tan','tan(','tan⁻¹','tan⁻¹('], ['(','(','π','π'], [')',')','e','e'],
];
const MAIN = [
  ['7','7'],['8','8'],['9','9'],['DEL','DEL',null,null,'fn'],['AC','AC',null,null,'fn'],
  ['4','4'],['5','5'],['6','6'],['×','×',null,null,'op'],['÷','÷',null,null,'op'],
  ['1','1'],['2','2'],['3','3'],['+','+',null,null,'op'],['−','−',null,null,'op'],
  ['0','0'],['.','.'],['×10ˣ','ᴇ','%','%'],['Ans','Ans'],['=','=',null,null,'eq'],
];

export default function Calculator({ showKeypad, settings, setSettings, fit = 1 }) {
  const [ed, setEd] = useState({ e: '', c: 0 }); // expression text and caret position
  const expr = ed.e;
  const setExpr = (next) => setEd((cur) => { const e = typeof next === 'function' ? next(cur.e) : next; return { e, c: e.length }; });
  const moveCaret = (dir) => setEd((cur) => {
    if (dir === 'left') return { ...cur, c: Math.max(0, cur.c - 1) };
    if (dir === 'right') return { ...cur, c: Math.min(cur.e.length, cur.c + 1) };
    const to = fractionCaretMove(cur.e, cur.c, dir);
    return to == null ? cur : { ...cur, c: to };
  });
  const [res, setRes] = useState(null); // {value, error}
  const [shift, setShift] = useState(false);
  const [ans, setAns] = usePersist('ans', 0);
  const [hist, setHist] = usePersist('history', []);
  const [copied, setCopied] = useState('');
  const [keypadScale, setKeypadScale] = usePersist('keypadScale', 1);
  const [calcWidth, setCalcWidth] = usePersist('calcWidth', 440);
  const dragRef = useRef(null);

  const press = useCallback((ins) => {
    if (ins === 'AC') { setExpr(''); setRes(null); return; }
    if (ins === 'DEL') {
      setEd(({ e, c }) => {
        const pre = e.slice(0, c).replace(/(sin⁻¹\(|cos⁻¹\(|tan⁻¹\(|log\(|ln\(|sin\(|cos\(|tan\(|abs\(|Ans|10\^\(|e\^\(|\^\(1÷|⁻¹|.)$/u, '');
        return { e: pre + e.slice(c), c: pre.length };
      });
      return;
    }
    if (ins === '=') {
      setExpr(e => {
        try { const v = evaluate(e, { angle: settings.angle, ans }); setRes({ value: v }); setAns(v);
          setHist(h => [{ expr: e, value: v }, ...h].slice(0, 100)); }
        catch (err) { setRes({ error: err.message }); }
        return e;
      });
      return;
    }
    const fresh = res && res.value !== undefined && ed.e;
    if (fresh) setRes(null);
    setEd(({ e, c }) => {
      // after a result, operators continue from Ans, digits start fresh
      if (fresh) { e = /^[+−×÷^²³⁻¹!%⁄]/.test(ins) ? 'Ans' : ''; c = e.length; }
      const pre = e.slice(0, c), post = e.slice(c);
      // fraction key with nothing before it: cursor goes into the empty numerator (top box) first
      if (ins === '⁄' && !endsWithOperand(pre)) return { e: pre + ins + post, c: pre.length };
      return { e: pre + ins + post, c: pre.length + ins.length };
    });
    setRes(r => (r && r.error ? null : r));
  }, [settings.angle, ans, res, ed.e]);

  useEffect(() => {
    const map = { '*': '×', '/': '÷', '-': '−', '+': '+', '(': '(', ')': ')', '.': '.', ',': '.', '^': '^(', '%': '%', '!': '!' };
    const h = (e) => {
      if (e.target.closest('input, textarea, .modal') || e.ctrlKey || e.metaKey || e.altKey) return;
      let ins = null;
      if (/^[0-9]$/.test(e.key)) ins = e.key;
      else if (map[e.key]) ins = map[e.key];
      else if (e.key === 'Enter' || e.key === '=') ins = '=';
      else if (e.key === 'Backspace') ins = 'DEL';
      else if (e.key === 'Escape') ins = 'AC';
      else if (e.key === 'p') ins = 'π';
      else if (e.key.startsWith('Arrow')) { e.preventDefault(); moveCaret(e.key.slice(5).toLowerCase()); return; }
      if (ins) { e.preventDefault(); press(ins); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [press]);

  const click = (k) => { const ins = shift && k[3] ? k[3] : k[1]; setShift(false); press(ins); };
  const copy = (t, what) => { navigator.clipboard?.writeText(t); setCopied(what); setTimeout(() => setCopied(''), 1200); };
  const showHist = settings.hist !== false;
  const showLcdHist = settings.lcdHist !== false;
  const lcdHistRef = useRef(null);
  useEffect(() => { const el = lcdHistRef.current; if (el) el.scrollTop = el.scrollHeight; }, [hist, res]);
  const renderValue = (v, big) => {
    const f = settings.frac ? fractionParts(v) : null;
    if (!f) return <span className="rdec-only">{formatResult(v)}</span>;
    return (
      <span className={'rpair' + (big ? ' big' : '')}>
        <span className="rfrac">{f.neg && <span className="mneg">−</span>}<Frac num={f.n} den={f.d} /></span>
        <span className="rdec">{formatResult(v)}</span>
      </span>
    );
  };
  // previous calculations shown inside the display, oldest first (the current result is the newest entry)
  const lcdHist = (res?.value !== undefined ? hist.slice(1, 51) : hist.slice(0, 50)).slice().reverse();
  const key = (k, i) => (
    <button key={i} className={'key ' + (k[4] || '')} onClick={() => click(k)} aria-label={shift && k[2] ? k[2] : k[0]}>
      {k[2] && <span className="shl">{k[2]}</span>}<span>{shift && k[2] ? k[2] : k[0]}</span>
    </button>);

  const startResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startS = Number(keypadScale) || 1;
    dragRef.current = { startX, startS };
    const move = (ev) => {
      const d = dragRef.current;
      if (!d) return;
      const next = Math.min(1.8, Math.max(0.7, (d.startS * 440 + (ev.clientX - d.startX)) / 440));
      setKeypadScale(Math.round(next * 100) / 100);
    };
    const up = () => {
      dragRef.current = null;
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  if (!showKeypad && !showHist) return null;

  return (
    <section className={"calc" + (showHist && showKeypad ? " show-hist" : "") + (showHist && !showKeypad ? " hist-only" : "")} aria-label="Scientific calculator">
      {showKeypad && <div className="calc-pad" style={{ width: calcWidth, zoom: keypadScale }}>
      <div className="lcd" aria-live="polite">
        <div className="ind"><span className={shift ? 'on' : ''}>S</span><span>{settings.angle === 'deg' ? 'D' : 'R'}</span><span>{settings.frac ? 'a b/c' : ''}</span></div>
        {showLcdHist && lcdHist.length > 0 && <div className="lcd-hist" ref={lcdHistRef}>
          {lcdHist.map((h, i) => (
            <div key={i} role="button" tabIndex={0} className="lcd-hrow" onClick={() => { if (window.getSelection()?.toString()) return; setExpr(h.expr); setRes(null); }} title="Click to reuse, or drag to select">
              <span className="lcd-hexpr"><MathText expr={h.expr} /></span>
              <span className="lcd-hval">{renderValue(h.value, false)}</span>
            </div>))}
        </div>}
        {!(showLcdHist && lcdHist.length > 0) && <div className="lcd-spacer" />}
        <div className="expr">{expr ? <MathText expr={expr} caret={res?.value !== undefined ? null : ed.c} onCaret={(c) => setEd((cur) => ({ ...cur, c }))} /> : <><span className="caret" /><span className="muted">0</span></>}</div>
        <div className={'result' + (res?.error ? ' error' : '')}>{res?.error || (res?.value !== undefined ? renderValue(res.value, true) : '')}</div>
        {copied && <div className="toast">Copied {copied === 'expr' ? 'expression' : 'result'}</div>}
      </div>
      <div className="toolbar">
        <button className={'key shift' + (shift ? ' on' : '')} onClick={() => setShift(!shift)} aria-pressed={shift}>SHIFT</button>
        <button className="key mode fkey" onClick={() => { setShift(false); press('⁄'); }} aria-label="Fraction" title="Fraction: type the numerator, press this key, then the denominator"><Frac num="" den="" /></button>
        <button className="key mode" onClick={() => setSettings({ ...settings, angle: settings.angle === 'deg' ? 'rad' : 'deg' })}>{settings.angle === 'deg' ? 'DEG' : 'RAD'}</button>
        <button className="key mode" onClick={() => setSettings({ ...settings, frac: !settings.frac })} title="Toggle fraction / decimal">S⇔D</button>
        <button className="key mode" onClick={() => res?.value !== undefined && copy(String(res.value), 'res')}>Copy</button>
      </div>
      <div className="sci">{SCI.map(key)}</div>
      <div className="main">{MAIN.map(key)}</div>
      <button type="button" className="calc-resize" onPointerDown={startResize} aria-label="Resize keypad" title="Drag to resize keypad" />
      </div>}
      <ResizeHandle value={calcWidth} onChange={setCalcWidth} min={280} max={800} scale={fit * (showKeypad ? keypadScale || 1 : 1)} label="Resize calculator" />
      {showHist && <div className="hist">
        <div className="hist-head"><h3>History</h3><div className="hist-head-acts">{hist.length > 0 && <button className="small" onClick={() => setHist([])}>Clear</button>}<button className="small" onClick={() => setSettings(cur => ({ ...cur, hist: false }))}>Hide</button></div></div>
        {!hist.length && <p className="muted">No calculations yet</p>}
        <ul>{hist.map((h, i) => (
          <li key={i}><button onClick={() => { setExpr(h.expr); setRes(null); }} title="Reuse expression"><MathText expr={h.expr} /></button>
            <button className="hv" onClick={() => { setExpr(e => (res ? '' : e) + formatResult(h.value).replace('−','−')); setRes(null); }} title="Insert value">= {formatResult(h.value)}</button></li>))}</ul>
      </div>}
    </section>
  );
}
