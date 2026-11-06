import React, { useMemo, useState } from 'react';
import { CATEGORIES, convert, formatNum } from './units.js';
import { usePersist } from './store.js';
import ResizeHandle from './ResizeHandle.jsx';

const DEFAULT_ORDER = CATEGORIES.map(c => c.id);

export default function Converter({ showCats, showUnits, fit = 1 }) {
  const [catId, setCatId] = usePersist('category', 'length');
  const [favCats, setFavCats] = usePersist('favCats', []);
  const [favUnits, setFavUnits] = usePersist('favUnits', []);
  const [custom, setCustom] = usePersist('customUnits', {});
  const [values, setValues] = usePersist('convValues', {});
  const [favOnly, setFavOnly] = usePersist('favOnly', false);
  const [favCatsOnly, setFavCatsOnly] = usePersist('favCatsOnly', false);
  const [catOrder, setCatOrder] = usePersist('catOrder', DEFAULT_ORDER);
  const [catWidth, setCatWidth] = usePersist('catWidth', 190);
  const [unitsWidth, setUnitsWidth] = usePersist('unitsWidth', 430);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [dragId, setDragId] = useState(null);

  const cats = useMemo(() => CATEGORIES.map(c => ({ ...c, units: [...c.units, ...(custom[c.id] || []).map(u => ({ ...u, builtin: false }))] })), [custom]);
  const ql = q.trim().toLowerCase();
  const match = c => !ql || c.name.toLowerCase().includes(ql) || c.units.some(u => (u.name + ' ' + u.symbol).toLowerCase().includes(ql));
  const orderIds = [...catOrder.filter(id => cats.some(c => c.id === id)), ...cats.map(c => c.id).filter(id => !catOrder.includes(id))];
  const ordered = orderIds.map(id => cats.find(c => c.id === id)).filter(Boolean)
    .filter(match)
    .filter(c => !favCatsOnly || favCats.includes(c.id));
  const cat = ordered.find(c => c.id === catId) || ordered[0] || cats[0];
  const st = values[cat.id] || { unit: cat.units.find(u => u.factor === 1 || u.id === 'C')?.id, raw: '1' };
  const src = cat.units.find(u => u.id === st.unit) || cat.units[0];
  const num = parseFloat(String(st.raw).replace(/,/g, '.').replace(/\s/g, ''));
  const valid = st.raw.trim() !== '' && isFinite(num) && /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(String(st.raw).trim().replace(',', '.'));
  const fk = u => cat.id + ':' + u.id;
  const units = [...cat.units].filter(u => !ql || cat.name.toLowerCase().includes(ql) || (u.name + ' ' + u.symbol).toLowerCase().includes(ql))
    .filter(u => !favOnly || favUnits.includes(fk(u)))
    .sort((a, b) => favUnits.includes(fk(b)) - favUnits.includes(fk(a)));
  const toggle = (list, set, k) => set(list.includes(k) ? list.filter(x => x !== k) : [...list, k]);
  const setVal = (unit, raw) => setValues({ ...values, [cat.id]: { unit, raw } });
  const moveCat = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;
    const ids = [...orderIds];
    const from = ids.indexOf(fromId);
    const to = ids.indexOf(toId);
    if (from < 0 || to < 0) return;
    ids.splice(from, 1);
    ids.splice(to, 0, fromId);
    setCatOrder(ids);
  };

  const saveUnit = (u) => {
    const list = (custom[cat.id] || []).filter(x => x.id !== u.id);
    setCustom({ ...custom, [cat.id]: [...list, u] }); setEditing(null);
  };
  const delUnit = (u) => {
    if (!confirm(`Delete custom unit "${u.name}"?`)) return;
    setCustom({ ...custom, [cat.id]: (custom[cat.id] || []).filter(x => x.id !== u.id) });
  };

  return (
    <section className={"conv" + (showCats ? "" : " cats-hidden") + (showUnits ? "" : " units-hidden")} aria-label="Unit converter">
      <input className="search" placeholder="Search categories or units…" aria-label="Search" value={q} onChange={e => setQ(e.target.value)} />
      <div className="conv-body" style={{ gridTemplateColumns: [showCats && `${catWidth}px`, showUnits && `${Math.max(unitsWidth, 400)}px`].filter(Boolean).join(' ') }}>
        <div className="cat-col" id="cat-col">
          <nav className="cats" aria-label="Categories">
            {ordered.map(c => (
              <div key={c.id}
                className={'cat' + (c.id === cat.id ? ' active' : '') + (dragId === c.id ? ' dragging' : '')}
                draggable
                onDragStart={e => { setDragId(c.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', c.id); }}
                onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                onDrop={e => { e.preventDefault(); moveCat(e.dataTransfer.getData('text/plain') || dragId, c.id); setDragId(null); }}
                onDragEnd={() => setDragId(null)}>
                <span className="grip" title="Drag to reorder" aria-hidden>⋮⋮</span>
                <button className="cat-btn" onClick={() => setCatId(c.id)} aria-current={c.id === cat.id}>
                  <span aria-hidden>{c.icon}</span> {c.name}
                </button>
                <button className={'star' + (favCats.includes(c.id) ? ' on' : '')} aria-label={`Favorite ${c.name}`}
                  onClick={() => toggle(favCats, setFavCats, c.id)}>★</button>
              </div>
            ))}
            {!ordered.length && <p className="muted">{favCatsOnly ? 'Star categories to show them here.' : 'No match'}</p>}
          </nav>
          <div className="cat-tools">
            <div className="view-toggle" role="group" aria-label="Show all categories or favorite categories only">
              <button type="button" className={!favCatsOnly ? 'on' : ''} aria-pressed={!favCatsOnly} onClick={() => setFavCatsOnly(false)}>All</button>
              <button type="button" className={favCatsOnly ? 'on' : ''} aria-pressed={favCatsOnly} onClick={() => setFavCatsOnly(true)}>★ Favorites</button>
            </div>
          </div>
          <ResizeHandle value={catWidth} onChange={setCatWidth} min={140} max={420} scale={fit} label="Resize categories" />
        </div>
        <div className="units-wrap">
        <div className="units" id="units-col">
          <div className="units-head">
            <div className="units-title">
              <h2>{cat.icon} {cat.name}</h2>
            </div>
            <div className="units-head-acts">
              <div className="view-toggle" role="group" aria-label="Show all units or favorites only">
                <button type="button" className={!favOnly ? 'on' : ''} aria-pressed={!favOnly} onClick={() => setFavOnly(false)}>All</button>
                <button type="button" className={favOnly ? 'on' : ''} aria-pressed={favOnly} onClick={() => setFavOnly(true)}>★ Favorites</button>
              </div>
              <button className="small add-unit" onClick={() => setEditing({})}>+ Custom unit</button>
            </div>
          </div>
          {cat.note && <p className="note">{cat.note}</p>}
          {!valid && st.raw.trim() !== '' && <p className="err">Enter a valid number</p>}
          {favOnly && !units.length && <p className="note">Star units to keep them, then use Favorites to hide the rest.</p>}
          {units.map(u => {
            const isSrc = u.id === src.id;
            const shown = isSrc ? st.raw : valid ? formatNum(convert(src, u, num)) : '';
            return (
              <div key={u.id} className={'row' + (isSrc ? ' src' : '')}>
                <button className={'star' + (favUnits.includes(fk(u)) ? ' on' : '')} aria-label={`Favorite ${u.name}`}
                  onClick={() => toggle(favUnits, setFavUnits, fk(u))}>★</button>
                <label htmlFor={'u-' + u.id} className="uname">{u.name}{!u.builtin && <em> · custom</em>}</label>
                <input id={'u-' + u.id} inputMode="decimal" value={shown} onChange={e => setVal(u.id, e.target.value)}
                  onFocus={e => { if (!isSrc && shown) setVal(u.id, shown); setTimeout(() => e.target.select()); }} />
                <span className="sym">{u.symbol}</span>
                <span className="acts">
                  <button className="icon" title="Copy" aria-label={`Copy ${u.name}`} onClick={() => navigator.clipboard?.writeText(shown)}>⧉</button>
                  {!u.builtin && <>
                    <button className="icon" aria-label="Edit" onClick={() => setEditing(u)}>✎</button>
                    <button className="icon" aria-label="Delete" onClick={() => delUnit(u)}>🗑</button></>}
                </span>
              </div>);
          })}
        </div>
        <ResizeHandle value={Math.max(unitsWidth, 400)} onChange={setUnitsWidth} min={400} max={720} scale={fit} label="Resize units" />
        </div>
      </div>
      {editing && <UnitForm cat={cat} unit={editing} onSave={saveUnit} onClose={() => setEditing(null)} />}
    </section>
  );
}

function UnitForm({ cat, unit, onSave, onClose }) {
  const temp = cat.id === 'temperature';
  const [f, setF] = useState({ name: unit.name || '', symbol: unit.symbol || '', factor: unit.factor ?? '', offset: unit.offset ?? 0 });
  const factor = parseFloat(f.factor), offset = parseFloat(f.offset) || 0;
  const ok = f.name.trim() && f.symbol.trim() && isFinite(factor) && factor !== 0;
  const submit = e => { e.preventDefault(); if (ok) onSave({ id: unit.id || 'c_' + Date.now(), name: f.name.trim(), symbol: f.symbol.trim(), factor, offset: temp ? offset : 0 }); };
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Custom unit" onClick={onClose}>
      <form className="card" onClick={e => e.stopPropagation()} onSubmit={submit}>
        <h3>{unit.id ? 'Edit' : 'New'} custom unit — {cat.name}</h3>
        <label>Name<input autoFocus value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
        <label>Symbol<input value={f.symbol} onChange={e => setF({ ...f, symbol: e.target.value })} /></label>
        <label>1 {f.symbol || 'unit'} = how many {cat.base}?<input inputMode="decimal" value={f.factor} onChange={e => setF({ ...f, factor: e.target.value })} /></label>
        {temp && <label>Offset (K) — kelvin = value × factor + offset<input inputMode="decimal" value={f.offset} onChange={e => setF({ ...f, offset: e.target.value })} /></label>}
        <p className="muted">Base unit for {cat.name}: <b>{cat.base}</b>{temp && ' (e.g. Celsius would be factor 1, offset 273.15)'}</p>
        <div className="form-acts"><button type="button" onClick={onClose}>Cancel</button><button type="submit" className="primary" disabled={!ok}>Save</button></div>
      </form>
    </div>
  );
}
