import React, { useEffect, useRef, useState } from 'react';
import Converter from './Converter.jsx';
import Calculator from './Calculator.jsx';
import InchChart from './InchChart.jsx';
import BendChart from './BendChart.jsx';
import { usePersist } from './store.js';

const TOGGLES = [
  { key: 'cats', hide: 'Hide categories', show: 'Show categories' },
  { key: 'units', hide: 'Hide units', show: 'Show units' },
  { key: 'keypad', hide: 'Hide keypad', show: 'Show keypad' },
  { key: 'hist', hide: 'Hide history', show: 'Show history' },
  { key: 'inch', hide: 'Hide inch chart', show: 'Show inch chart' },
  { key: 'bend', hide: 'Hide folding table', show: 'Show folding table' },
];

export default function App() {
  const stageRef = useRef(null);
  const innerRef = useRef(null);
  const fitRef = useRef(1);
  const [fit, setFit] = useState(1);
  const [showCats, setShowCats] = usePersist('showCats', true);
  const [showUnits, setShowUnits] = usePersist('showUnits', true);
  const [showKeypad, setShowKeypad] = usePersist('showKeypad', true);
  const [showInch, setShowInch] = usePersist('showInch', true);
  const [showBend, setShowBend] = usePersist('showBend', true);
  const [settings, setSettings] = usePersist('settings', { angle: 'deg', frac: true, hist: true });
  const showHist = settings.hist !== false;

  const visible = {
    cats: showCats,
    units: showUnits,
    keypad: showKeypad,
    inch: showInch,
    bend: showBend,
    hist: showHist,
  };
  const setters = {
    cats: setShowCats,
    units: setShowUnits,
    keypad: setShowKeypad,
    inch: setShowInch,
    bend: setShowBend,
    hist: (on) => setSettings((cur) => ({ ...cur, hist: on })),
  };

  useEffect(() => {
    fitRef.current = fit;
  }, [fit]);

  useEffect(() => {
    const stage = stageRef.current;
    const inner = innerRef.current;
    if (!stage || !inner) return;

    const measure = () => {
      const current = fitRef.current || 1;
      const naturalW = inner.offsetWidth;
      const availW = stage.clientWidth;
      if (naturalW <= 0 || availW <= 0) return;
      const next = Math.min(1, availW / naturalW);
      if (Math.abs(next - current) > 0.008) setFit(Math.round(next * 1000) / 1000);
    };

    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(inner);
    window.addEventListener('resize', measure);
    measure();
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [showCats, showUnits, showKeypad, showInch, showBend, showHist]);

  return (
    <div className="app">
      <header>
        <h1>Scalar <span className="sub">Calculator and Unit Converter</span></h1>
        <nav className="header-toggles" aria-label="Show or hide panels">
          {TOGGLES.map((t) => (
            <button
              key={t.key}
              type="button"
              className="cats-toggle"
              aria-pressed={visible[t.key]}
              aria-expanded={visible[t.key]}
              onClick={() => setters[t.key](!visible[t.key])}
            >
              {visible[t.key] ? t.hide : t.show}
            </button>
          ))}
        </nav>
      </header>
      <main ref={stageRef}>
        <div className="workspace-inner" ref={innerRef} style={{ transform: `scale(${fit})`, transformOrigin: 'top left', height: `${100 / (fit || 1)}%` }}>
          <Converter showCats={showCats} showUnits={showUnits} fit={fit} />
          <div className="stage">
            <Calculator showKeypad={showKeypad} settings={settings} setSettings={setSettings} fit={fit} />
            <InchChart show={showInch} fit={fit} />
            <BendChart show={showBend} fit={fit} />
          </div>
        </div>
      </main>
    </div>
  );
}
