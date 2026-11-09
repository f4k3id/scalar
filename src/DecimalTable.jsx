import React from 'react';
import { decimalEquivalentRows } from './inchChart.js';

// "Decimal equivalents of fractional inches & millimeters": two columns of 32 rows,
// each fraction circled and indented by its denominator, then the decimal and the mm value.
const ROWS = decimalEquivalentRows();
const COL_W = 300;
const H = 1000;
const HEAD = 34;
const ROW_H = (H - HEAD - 6) / 32;
const X_BY_DEN = { 64: 124, 32: 94, 16: 62, 8: 32, 4: 32, 2: 32, 1: 32 };
const R_BY_DEN = { 64: 13, 32: 14, 16: 15, 8: 16, 4: 18, 2: 19, 1: 19 };
const X_DEC = 156;
const X_MM = 236;

function Column({ rows, x0 }) {
  return (
    <g transform={`translate(${x0},0)`}>
      <text x={X_DEC + 2} y={HEAD - 12} className="dec-head">DECIMAL</text>
      <text x={X_MM + 2} y={HEAD - 12} className="dec-head">MM</text>
      <line x1={X_DEC - 6} y1={HEAD - 4} x2={X_DEC - 6} y2={H - 2} className="dec-rule" />
      {rows.map((r, k) => {
        const y = HEAD + k * ROW_H;
        const cy = y + ROW_H / 2;
        const cx = X_BY_DEN[r.d];
        const rad = R_BY_DEN[r.d];
        const shade = r.d <= 8 ? 'dec-row strong' : r.d <= 32 ? 'dec-row light' : 'dec-row';
        const label = `${r.d === 1 ? '1' : `${r.n}/${r.d}`} in = ${r.decimal} in = ${r.mm} mm`;
        return (
          <g key={r.i} aria-label={label}>
            <title>{label}</title>
            <rect x={X_DEC - 6} y={y + 1} width={COL_W - X_DEC} height={ROW_H - 2} className={shade} />
            <line x1={cx + rad} y1={cy} x2={X_DEC - 6} y2={cy} className="dec-leader" />
            <circle cx={cx} cy={cy} r={rad} className={'dec-circle d' + r.d} />
            {r.d === 1 ? (
              <text x={cx} y={cy + 7} textAnchor="middle" className="dec-frac whole">1</text>
            ) : (
              <>
                <text x={cx} y={cy - 2.5} textAnchor="middle" className={'dec-frac d' + r.d}>{r.n}</text>
                <line x1={cx - rad * 0.62} y1={cy + 0.5} x2={cx + rad * 0.62} y2={cy + 0.5} className="dec-bar" />
                <text x={cx} y={cy + (r.d >= 16 ? 10 : 11)} textAnchor="middle" className={'dec-frac d' + r.d}>{r.d}</text>
              </>
            )}
            <text x={X_DEC + 2} y={cy + 4.5} className={'dec-val' + (r.d <= 8 ? ' strong' : '')}>{r.decimal}</text>
            <text x={X_MM + 2} y={cy + 4.5} className={'dec-val' + (r.d <= 8 ? ' strong' : '')}>{r.mm}</text>
          </g>
        );
      })}
    </g>
  );
}

export default function DecimalTable() {
  const W = COL_W * 2 + 24;
  return (
    <div className="dec-table">
      <div className="inch-chart-head">
        <h3>Decimal equivalents, 0–1 in</h3>
        <div className="chart-units"><span>fraction</span><span>decimal in · mm</span></div>
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Decimal equivalents of fractional inches and millimeters, 1/64 to 1 inch">
        <Column rows={ROWS.slice(0, 32)} x0={0} />
        <line x1={COL_W + 12} y1={6} x2={COL_W + 12} y2={H - 2} className="dec-sep" />
        <Column rows={ROWS.slice(32)} x0={COL_W + 24} />
      </svg>
    </div>
  );
}
