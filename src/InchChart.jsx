import React, { useState } from 'react';
import { usePersist } from './store.js';
import ResizeHandle from './ResizeHandle.jsx';
import FitScale from './FitScale.jsx';
import { inchTickDecimal } from './inchChart.js';
import PanelPopup from './PanelPopup.jsx';
import DecimalTable from './DecimalTable.jsx';

const INCH_MAX = 2;
const MM_MAX = INCH_MAX * 25.4;
const TOP = 20;
const BOT = 20;
const H = 1000;
const SCALE = H - TOP - BOT;
const W = 460;
const CX = 226;
const HALF = 52;

function yFromInch(inch) {
  return TOP + ((INCH_MAX - inch) / INCH_MAX) * SCALE;
}

function fracLabel(i, den) {
  if (i === 0) return '0 in.';
  if (i === den * INCH_MAX) return '2 in.';
  const whole = Math.floor(i / den);
  const rem = i % den;
  if (rem === 0 && whole === 1) return '1 in.';
  if (rem === 0) return String(whole);
  let n = rem, d = den;
  const g = (a, b) => (b ? g(b, a % b) : a);
  const k = g(n, d);
  n /= k; d /= k;
  return whole ? `${whole}-${n}/${d}` : `${n}/${d}`;
}

export default function InchChart({ show = true, fit = 1 }) {
  const [width, setWidth] = usePersist('inchWidth', 640);
  const inchTicks = [];
  for (let i = 0; i <= 128; i++) {
    const inch = i / 64;
    const y = yFromInch(inch);
    let kind = 'fine';
    if (i % 16 === 0) kind = 'quarter';
    else if (i % 8 === 0) kind = 'eighth';
    else if (i % 4 === 0) kind = 'sixteenth';
    else if (i % 2 === 0) kind = 'thirtysecond';
    let label = null;
    let col = null;
    if (i % 4 === 0) { label = fracLabel(i, 64); col = 'outer'; }
    else if (i % 2 === 0) { label = fracLabel(i, 64); col = 'inner'; }
    inchTicks.push({ y, kind, label, col, major: i % 16 === 0, fine: i % 2 !== 0 });
  }

  const mmTicks = [];
  for (let mm = 0; mm <= Math.floor(MM_MAX); mm++) {
    const y = yFromInch(mm / 25.4);
    const mid = mm % 5 === 0;
    mmTicks.push({
      y,
      major: mm % 10 === 0,
      mid,
      label: String(mm),
      col: mid ? 'outer' : 'inner',
      draw: false,
      mm,
    });
  }
  mmTicks.push({
    y: yFromInch(INCH_MAX),
    major: true,
    mid: true,
    label: '50.8',
    col: 'outer',
    draw: false,
    mm: MM_MAX,
  });

  const [zoom, setZoom] = useState(false);
  if (!show) return null;

  const content = (
    <div className="inch-layout">
      <DecimalTable />
      <div className="inch-ruler">
      <div className="inch-chart-head">
        <h3>0–2 in → mm</h3>
        <div className="chart-units"><span>in</span><span>mm</span></div>
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMin meet" role="img" aria-hidden="false">
        <title>Conversion scale from 2 inches at the top to 0 at the bottom, with millimeters on the right</title>
        <line x1={CX} y1={TOP} x2={CX} y2={H - BOT} className="chart-spine" />
        {inchTicks.map((t, i) => {
          const len = t.fine ? 18 : t.kind === 'thirtysecond' ? 32 : t.kind === 'sixteenth' ? 42 : t.kind === 'eighth' ? 50 : HALF + 8;
          return (
            <g key={'in-' + i} aria-label={`${fracLabel(i, 64)} = ${inchTickDecimal(i)}`}>
              <title>{`${fracLabel(i, 64)} = ${inchTickDecimal(i)}`}</title>
              <line
                x1={CX}
                y1={t.y}
                x2={CX - len}
                y2={t.y}
                className={t.major ? 'chart-tick major' : t.kind === 'eighth' ? 'chart-tick eighth' : t.fine ? 'chart-tick fine' : 'chart-tick'}
              />
              {t.label !== null && t.col === 'outer' && (
                <text x={8} y={t.y + 4} textAnchor="start" className={'chart-lab ' + t.kind}>{t.label}</text>
              )}
              {t.label !== null && t.col === 'inner' && (
                <text x={CX - HALF - 8} y={t.y + 3} textAnchor="end" className="chart-lab thirtysecond">{t.label}</text>
              )}
            </g>
          );
        })}
        {mmTicks.map((t, i) => {
          const len = t.mid ? HALF + 8 : 22;
          return (
            <g key={'mm-' + i}>
              <line
                x1={CX}
                y1={t.y}
                x2={CX + len}
                y2={t.y}
                className={t.mid ? 'chart-tick major' : 'chart-tick'}
              />
              {t.col === 'inner' && (
                <text x={CX + HALF + 8} y={t.y + 3} textAnchor="start" className="chart-lab mm-inner">{t.label}</text>
              )}
              {t.col === 'outer' && (
                <text x={W - 6} y={t.y + (t.label === '50.8' ? -2 : t.label === '50' ? 12 : 4)} textAnchor="end" className="chart-lab mm-outer">{t.label}</text>
              )}
            </g>
          );
        })}
      </svg>
      </div>
    </div>
  );

  return (
    <aside className="inch-chart" style={{ width }} aria-label="Inch decimal equivalents and inch to millimeter scale">
      <div className="panel-click" onClick={() => setZoom(true)} title="Click to enlarge">
        <FitScale>
      {content}
        </FitScale>
      </div>
      <PanelPopup open={zoom} onClose={() => setZoom(false)} label="Inch to millimeter scale, enlarged">{content}</PanelPopup>
      <ResizeHandle value={width} onChange={setWidth} min={260} max={720} scale={fit} label="Resize inch chart" />
    </aside>
  );
}
