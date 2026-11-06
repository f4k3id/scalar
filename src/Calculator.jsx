import React, { useCallback, useEffect, useRef, useState } from 'react';
import { evaluate, asFraction, formatResult } from './calc.js';
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
  const [expr, setExpr] = useState('');
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
    if (ins === 'DEL') { setExpr(e => e.replace(/(sin⁻¹\(|cos⁻¹\(|tan⁻¹\(|log\(|ln\(|sin\(|cos\(|tan\(|abs\(|Ans|10\^\(|e\^\(|\^\(1÷|⁻¹|.)$/u, '')); return; }
    if (ins === '=') {
      setExpr(e => {
        try { const v = evaluate(e, { angle: settings.angle, ans }); setRes({ value: v }); setAns(v);
          setHist(h => [{ expr: e, value: v }, ...h].slice(0, 100)); }
        catch (err) { setRes({ error: err.message }); }
        return e;
      });
      return;
    }
    setExpr(e => {
      // after a result, operators continue from Ans, digits start fresh
      if (res && res.value !== undefined && e) { setRes(null); return (/^[+−×÷^²³⁻¹!%]/.test(ins) ? 'Ans' : '') + ins; }
      return e + ins;
    });
    setRes(r => (r && r.error ? null : r));
  }, [settings.angle, ans, res]);

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
      if (ins) { e.preventDefault(); press(ins); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  }, [press]);

  const click = (k) => { const ins = shift && k[3] ? k[3] : k[1]; setShift(false); press(ins); };
  const copy = (t, what) => { navigator.clipboard?.writeText(t); setCopied(what); setTimeout(() => setCopied(''), 1200); };
  const showHist = settings.hist !== false;
  const frac = res?.value !== undefined && settings.frac ? asFraction(res.value) : null;
  const shown = res?.error || (res?.value !== undefined ? (frac || formatResult(res.value)) : '');
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
        <div className="expr" onClick={() => expr && copy(expr, 'expr')} title="Click to copy expression">{expr || <span className="muted">0</span>}<span className="caret" /></div>
        <div className={'result' + (res?.error ? ' error' : '')} onClick={() => res?.value !== undefined && copy(String(res.value), 'res')} title="Click to copy result">{shown}</div>
        {copied && <div className="toast">Copied {copied === 'expr' ? 'expression' : 'result'}</div>}
      </div>
      <div className="toolbar">
        <button className={'key shift' + (shift ? ' on' : '')} onClick={() => setShift(!shift)} aria-pressed={shift}>SHIFT</button>
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
          <li key={i}><button onClick={() => { setExpr(h.expr); setRes(null); }} title="Reuse expression">{h.expr}</button>
            <button className="hv" onClick={() => { setExpr(e => (res ? '' : e) + formatResult(h.value).replace('−','−')); setRes(null); }} title="Insert value">= {formatResult(h.value)}</button></li>))}</ul>
      </div>}
    </section>
  );
}
