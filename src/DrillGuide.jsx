import React, { useState } from 'react';
import { usePersist } from './store.js';
import ResizeHandle from './ResizeHandle.jsx';
import FitScale from './FitScale.jsx';
import PanelPopup from './PanelPopup.jsx';
import {
  TITLE, CUTTING_SPEEDS, SFM_NOTE, FEED_HEAD, FEEDS, DEEP_HOLE_TEXT, DEPTH_REDUCTION,
  TAP_DRILL, TAP_GROUPS, LEGEND, DOCS, rowTitle, commonInchTaps, metricTaps, drillLabel,
  sfmRange, rpm, parseDiameter, feedFor,
} from './drillData.js';

// Usual ISO coarse pitch per metric size, used for the compact metric list.
const COARSE = { 3: '.50', 4: '.70', 5: '.80', 6: '1.00', 7: '1.00', 8: '1.25', 9: '1.25', 10: '1.50', 11: '1.50', 12: '1.75', 14: '2.0', 16: '2.0', 18: '2.5', 20: '2.5', 24: '3.0' };
const INCH = commonInchTaps();
const SCREW = INCH.filter((x) => x.screw);
const FRACT = INCH.filter((x) => !x.screw);
const METRIC = metricTaps().filter(({ tap }) => {
  const m = tap.match(/^(\d+) mm - ([\d.]+)$/);
  return m && COARSE[m[1]] === m[2];
});
const MATERIALS = CUTTING_SPEEDS.filter((m) => m.sfm);

const stop = (e) => e.stopPropagation();

function openDoc(e, doc) {
  e.preventDefault();
  e.stopPropagation();
  if (typeof window !== 'undefined' && window.scalarDocs) window.scalarDocs.open(doc.id);
  else window.open(doc.web, '_blank', 'noopener');
}

function DocLinks() {
  return (
    <div className="drill-docs">
      {DOCS.map((d) => (
        <a key={d.id} href={d.web} target="_blank" rel="noopener noreferrer" onClick={(e) => openDoc(e, d)} onMouseDown={stop} title={'Open ' + d.label}>
          <span aria-hidden="true">▤</span> {d.label}
        </a>
      ))}
    </div>
  );
}

function fmt(n) {
  return Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '–';
}

function RpmCalc() {
  const [st, setSt] = usePersist('drillCalc', { mat: 'Aluminum and its Alloys', dia: '1/4' });
  const mat = MATERIALS.find((m) => m.name === st.mat) || MATERIALS[0];
  const d = parseDiameter(st.dia);
  const [lo, hi] = sfmRange(mat.sfm);
  const feed = Number.isFinite(d) ? feedFor(d) : null;
  const label = (m) => (m.parent ? m.parent + ' – ' : '') + m.name;
  return (
    <div className="drill-calc" onClick={stop} onMouseDown={stop}>
      <div className="drill-calc-row">
        <label>Material
          <select value={mat.name} onChange={(e) => setSt({ ...st, mat: e.target.value })}>
            {MATERIALS.map((m) => <option key={label(m)} value={m.name}>{label(m)} · {m.sfm} SFM</option>)}
          </select>
        </label>
        <label className="dia">Drill Ø
          <input value={st.dia} onChange={(e) => setSt({ ...st, dia: e.target.value })} placeholder={'1/4, .25, #7, F, 6 mm'} spellCheck={false} />
        </label>
      </div>
      <div className="drill-calc-out">
        <span className="rpm">{Number.isFinite(d) ? `${fmt(rpm(lo, d))} – ${fmt(rpm(hi, d))}` : '–'} <small>RPM</small></span>
        <span className="muted">
          {Number.isFinite(d) ? `Ø ${d.toFixed(4).replace(/^0/, '')} in · ${mat.sfm} SFM` : 'Enter a drill size'}
          {feed ? ` · feed ${feed.medium} in/rev (medium)` : ''}
        </span>
      </div>
      <div className="drill-formula">RPM = SFM × 3.82 ÷ Drill Diameter</div>
    </div>
  );
}

function MiniTable({ head, rows, dec = true }) {
  return (
    <table className="drill-table mini">
      <thead><tr><th>{head}</th><th>Drill</th>{dec && <th>Dec.</th>}</tr></thead>
      <tbody>
        {rows.map((x) => (
          <tr key={x.tap} title={x.title}>
            <td className="tap">{x.tap}</td><td>{x.drill}</td>{dec && <td className="num">{x.dec}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Compact() {
  const inchRows = (list) => list.map((x) => ({ tap: x.tap, drill: x.drill, dec: x.dec, title: rowTitle(x.row) }));
  const metricRows = METRIC.map(({ tap, rows }) => ({
    tap,
    drill: rows.map((r) => drillLabel(r.size)).join(' / '),
    dec: rows.map((r) => r.dec).join(' / '),
    title: rows.map(rowTitle).join('\n\n'),
  }));
  return (
    <div className="drill-compact">
      <div className="drill-head">
        <h3>{TITLE}</h3>
        <p className="bend-sub"><span>HSS drills · tap drills</span><span>Click for the full guide</span></p>
      </div>
      <RpmCalc />
      <h4 className="drill-sub">Inch taps (NC / NF)</h4>
      <div className="drill-minis">
        <MiniTable head="Machine screw" rows={inchRows(SCREW)} />
        <MiniTable head="Fractional" rows={inchRows(FRACT)} />
      </div>
      <h4 className="drill-sub">Metric taps (coarse)</h4>
      <div className="drill-minis">
        <MiniTable head="Metric" rows={metricRows.slice(0, 8)} dec={false} />
        <MiniTable head="Metric" rows={metricRows.slice(8)} dec={false} />
      </div>
      <p className="drill-foot">Hover a row for decimals and mm. Click the panel for the full guide: all 187 tap & drill rows (NS, NEF, pipe, fine metric, screw extractors), cutting speeds, feeds and deep-hole reductions.</p>
      <DocLinks />
    </div>
  );
}

function TapGroup({ rows, pipe }) {
  return (
    <table className="drill-table full">
      <thead>
        <tr><th>Dia./<br />Type</th><th>Dec.<br />Equiv.</th><th>Fractional<br />Tap</th><th>{pipe ? <>Pipe<br />Tap</> : <>Machine Screw<br />Tap</>}</th><th>Metric<br />Tap</th><th>Screw<br />Ext.</th></tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.size + r.dec} title={rowTitle(r)} className={i % 2 ? 'alt' : ''}>
            <th>{r.size}</th>
            <td className="num">{r.dec}</td>
            <td>{(r.frac || []).join(', ')}</td>
            <td>{((pipe ? r.pipe : r.ms) || []).join(', ')}</td>
            <td>{(r.metric || []).join(', ')}</td>
            <td>{r.ext || ''}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Full() {
  let at = 0;
  const groups = TAP_GROUPS.map((n, g) => { const rows = TAP_DRILL.slice(at, at + n); at += n; return { rows, pipe: g >= 2 }; });
  return (
    <div className="drill-full">
      <div className="drill-ref">
        <h3>{TITLE}</h3>
        <h4>Cutting Speeds – by Working Material</h4>
        <table className="drill-table speeds">
          <thead><tr><th>Speeds for High Speed Steel Drills</th><th>SFM*</th></tr></thead>
          <tbody>
            {CUTTING_SPEEDS.map((m) => (
              <tr key={(m.parent || '') + m.name} className={m.depth ? 'sub' : ''}>
                <td>{m.name}</td><td className="num">{m.sfm ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="drill-note">{SFM_NOTE}</p>
        <div className="drill-formula big">RPM = <span className="frac"><span>SFM × 3.82</span><span>Drill Diameter</span></span></div>
        <h4>Feed Per Drill Revolution</h4>
        <table className="drill-table feeds">
          <thead><tr>{FEED_HEAD.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {FEEDS.map((f, i) => (
              <tr key={f.range} className={i % 2 ? 'alt' : ''}><th>{f.range}</th><td className="num">{f.light}</td><td className="num">{f.medium}</td><td className="num">{f.heavy}</td></tr>
            ))}
          </tbody>
        </table>
        <h4>Speeds and Feeds for Deep Hole Drilling</h4>
        <p className="drill-text">{DEEP_HOLE_TEXT}</p>
        <h4>Speed and Feed Reduction <span className="muted">(based upon hole depth)</span></h4>
        <table className="drill-table depth">
          <thead><tr><th>Hole Depth to Diameter<br /><small>(times drill diameter)</small></th><th>Ratio Speed<br />Reduction</th><th>Feed<br />Reduction</th></tr></thead>
          <tbody>
            {DEPTH_REDUCTION.map((r, i) => (
              <tr key={r.depth} className={i % 2 ? 'alt' : ''}><th>{r.depth}</th><td className="num">{r.speed}</td><td className="num">{r.feed}</td></tr>
            ))}
          </tbody>
        </table>
        <DocLinks />
      </div>
      <div className="drill-chart">
        <h3>Tap &amp; Drill Selection Chart</h3>
        <div className="drill-groups">
          {groups.map((g, i) => <TapGroup key={i} rows={g.rows} pipe={g.pipe} />)}
        </div>
        <div className="drill-legend">
          {LEGEND.map(([k, v]) => <span key={k}><b>{k}</b> = {v}</span>)}
        </div>
      </div>
    </div>
  );
}

export default function DrillGuide({ show = true, fit = 1 }) {
  const [width, setWidth] = usePersist('drillWidth', 560);
  const [zoom, setZoom] = useState(false);
  if (!show) return null;
  return (
    <aside className="bend-chart drill-guide" style={{ width }} aria-label={TITLE}>
      <div className="panel-click" onClick={() => setZoom(true)} title="Click to enlarge">
        <FitScale><Compact /></FitScale>
      </div>
      <PanelPopup open={zoom} onClose={() => setZoom(false)} label={TITLE + ', full guide'}><Full /></PanelPopup>
      <ResizeHandle value={width} onChange={setWidth} min={300} max={1100} scale={fit} label="Resize drilling guide" />
    </aside>
  );
}
