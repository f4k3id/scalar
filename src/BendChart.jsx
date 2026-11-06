import React from 'react';
import { usePersist } from './store.js';
import ResizeHandle from './ResizeHandle.jsx';
import { TITLE, F_UNIT, DIM_NOTE, V, FLANGE, RADIUS, ROWS, NOTES } from './bendData.js';
import FitScale from './FitScale.jsx';

function cell(row, col) {
  const i = col - row.start;
  if (i < 0 || i >= row.f.length) return null;
  const n = row.f[i];
  return Number.isInteger(n) ? String(n) : String(n);
}

export default function BendChart({ show = true, fit = 1 }) {
  const [width, setWidth] = usePersist('bendWidth', 640);

  if (!show) return null;

  return (
    <aside className="bend-chart" style={{ width }} aria-label={TITLE}>
      <FitScale>
      <div className="bend-head">
        <h3>{TITLE}</h3>
        <p className="bend-sub"><span>{F_UNIT}</span><span>{DIM_NOTE}</span></p>
      </div>
      <div className="bend-scroll">
        <table className="bend-table">
          <thead>
            <tr>
              <th>t</th>
              <th></th>
              <th className="lab">v</th>
              {V.map((v) => <th key={'v'+v}>{v}</th>)}
              <th className="lab">v</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th className="lab">f</th>
              {FLANGE.map((f) => <th key={'f'+f}>{f}</th>)}
              <th className="lab">f</th>
            </tr>
            <tr>
              <th>ga.</th>
              <th>in.</th>
              <th className="lab">r</th>
              {RADIUS.map((r) => <th key={'r'+r}>{r}</th>)}
              <th className="lab">ga.</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.ga}>
                <th>{row.ga}</th>
                <th className="tin">{row.t}</th>
                <td></td>
                {V.map((_, col) => {
                  const val = cell(row, col);
                  const rec = val !== null && (col === 0 ? false : V[col] && recommended(row, col));
                  return <td key={col} className={val === null ? 'empty' : rec ? 'fval rec' : 'fval'}>{val ?? ''}</td>;
                })}
                <th>{row.ga}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="bend-notes">
        {NOTES.map((n) => <li key={n}>{n}</li>)}
        <li>t = Workpiece thickness · r = Inside radius of formed part · v = Vee-die opening · f = Minimum flange</li>
      </ul>
      </FitScale>
      <ResizeHandle value={width} onChange={setWidth} min={280} max={1100} scale={fit} label="Resize folding table" />
    </aside>
  );
}

function recommended(row, col) {
  const t = parseFloat(row.t);
  const vIn = toInch(V[col]);
  if (!t || !vIn) return false;
  const ratio = vIn / t;
  const target = t >= 0.5 ? 10 : 8;
  return Math.abs(ratio - target) < 0.55;
}

function toInch(frac) {
  if (!frac) return 0;
  if (frac.includes('-')) {
    const [w, rest] = frac.split('-');
    const [n, d] = rest.split('/').map(Number);
    return Number(w) + n / d;
  }
  if (frac.includes('/')) {
    const [n, d] = frac.split('/').map(Number);
    return n / d;
  }
  return Number(frac);
}
