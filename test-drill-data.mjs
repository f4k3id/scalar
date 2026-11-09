import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CUTTING_SPEEDS, FEEDS, DEPTH_REDUCTION, TAP_DRILL, TAP_GROUPS, LEGEND, DOCS,
  parseDiameter, rpm, commonInchTaps, metricTaps, feedFor, rowTitle,
} from './src/drillData.js';
import { existsSync, statSync } from 'node:fs';

const bySize = (s) => TAP_DRILL.find((r) => r.size === s);

test('page 1 tables have every printed row', () => {
  assert.equal(CUTTING_SPEEDS.length, 25);
  assert.equal(CUTTING_SPEEDS.filter((m) => m.sfm).length, 23);
  assert.equal(FEEDS.length, 6);
  assert.equal(DEPTH_REDUCTION.length, 4);
  assert.equal(CUTTING_SPEEDS[0].sfm, '200-300');
  assert.equal(CUTTING_SPEEDS.find((m) => m.name === 'Bronze (High Tensile)').sfm, '70-150');
  assert.equal(CUTTING_SPEEDS.find((m) => m.name === '50 to 55 Rockwell C').sfm, '7-15');
  assert.equal(CUTTING_SPEEDS.at(-1).sfm, '300-400');
  assert.deepEqual(FEEDS[5], { ...FEEDS[5], range: '3/4 to 1', light: '.0070 - .0100', medium: '.0090 - .0140', heavy: '.0140 - .0200' });
  assert.deepEqual(DEPTH_REDUCTION[3], { depth: 6, speed: '35-40%', feed: '20%' });
});

test('tap & drill chart: 187 rows in 4 printed groups, decimals never decrease', () => {
  assert.equal(TAP_DRILL.length, 187);
  assert.deepEqual(TAP_GROUPS, [47, 47, 47, 46]);
  assert.equal(TAP_GROUPS.reduce((a, b) => a + b), TAP_DRILL.length);
  for (let i = 1; i < TAP_DRILL.length; i++) {
    assert.ok(Number(TAP_DRILL[i].dec) >= Number(TAP_DRILL[i - 1].dec), `${TAP_DRILL[i - 1].size} -> ${TAP_DRILL[i].size}`);
  }
  // only tie in the source: letter E and 1/4" are both .2500
  const ties = TAP_DRILL.filter((r, i) => i && r.dec === TAP_DRILL[i - 1].dec).map((r) => r.size);
  assert.deepEqual(ties, ['1/4"']);
  // group boundaries match the printed columns
  assert.deepEqual([0, 47, 94, 141].map((i) => TAP_DRILL[i].size), ['1/64"', '9/64"', 'G', '1/2"']);
  // pipe taps only in groups 3-4, machine screw taps only in groups 1-2
  TAP_DRILL.forEach((r, i) => { if (i < 94) assert.ok(!r.pipe); else assert.ok(!r.ms); });
  assert.equal(new Set(TAP_DRILL.map((r) => r.size)).size, 187);
});

test('every gauge size is present', () => {
  for (let n = 1; n <= 60; n++) if (![].includes(n)) assert.ok(bySize(String(n)), '#' + n);
  for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') assert.ok(bySize(c), c);
  for (let k = 1; k <= 64; k++) {
    const g = (a, b) => (b ? g(b, a % b) : a); const d = g(k, 64);
    const name = k === 64 ? '1"' : `${k / d}/${64 / d}"`;
    assert.ok(bySize(name), name);
  }
});

test('fractional and metric sizes match their decimals', () => {
  for (const r of TAP_DRILL) {
    let v = null;
    if (/ mm$/.test(r.size)) v = parseFloat(r.size) / 25.4;
    else if (/"$/.test(r.size)) v = parseDiameter(r.size);
    if (v !== null) assert.ok(Math.abs(v - Number(r.dec)) < 0.00006, `${r.size} ${r.dec} vs ${v}`);
  }
});

test('spot checks against the printed chart', () => {
  assert.deepEqual(bySize('7'), { size: '7', dec: '.2010', frac: ['1/4" - 20 NC'] });
  assert.deepEqual(bySize('F'), { size: 'F', dec: '.2570', frac: ['5/16" - 18 NC'] });
  assert.deepEqual(bySize('27/64"'), { size: '27/64"', dec: '.4219', frac: ['1/2" - 13 NC'], metric: ['12 mm - 1.25'] });
  assert.deepEqual(bySize('23/32"'), { size: '23/32"', dec: '.7188' });
  assert.deepEqual(bySize('29/64"'), { size: '29/64"', dec: '.4531', frac: ['1/2" - 20 NF', '1/2" - 24 NS'], pipe: ['1/4" - 19 BSP'] });
  assert.deepEqual(bySize('Q'), { size: 'Q', dec: '.3320', frac: ['3/8" - 24 NF'], pipe: ['1/8" - 27 NPT'] });
  assert.deepEqual(bySize('53'), { size: '53', dec: '.0595', ms: ['1 - 64 NC', '1 - 72 NF'] });
  assert.deepEqual(bySize('30'), { size: '30', dec: '.1285', metric: ['4 mm - .70', '4 mm - .75'] });
  assert.deepEqual(bySize('1/2"'), { size: '1/2"', dec: '.5000', metric: ['14 mm - 1.25', '14 mm - 1.5'] });
  assert.equal(bySize('13/16"').ext, 'EX-8');
  assert.equal(bySize('9/64"').ext, 'ST-1');
  assert.deepEqual(bySize('1-1/2"'), { size: '1-1/2"', dec: '1.5000', pipe: ['1-1/4" - 11-1/2 NPT'] });
  assert.equal(TAP_DRILL.filter((r) => r.ext).length, 16);
  assert.equal(LEGEND.length, 6);
});

test('compact lists and RPM helper', () => {
  const inch = commonInchTaps();
  assert.equal(inch.length, 40);
  assert.equal(inch.find((x) => x.tap === '1/4" - 20 NC').drill, '#7');
  assert.equal(inch.find((x) => x.tap === '1/2" - 13 NC').drill, '27/64"');
  assert.equal(metricTaps().length, 31);
  assert.equal(parseDiameter('1/4'), 0.25);
  assert.equal(parseDiameter('#7'), 0.201);
  assert.equal(parseDiameter('f'), 0.257);
  assert.equal(parseDiameter('1-1/8'), 1.125);
  assert.ok(Math.abs(parseDiameter('6.35 mm') - 0.25) < 1e-9);
  assert.equal(Math.round(rpm(100, 0.25)), 1528);
  assert.equal(feedFor(0.3).range, '1/4 to 3/8');
  assert.match(rowTitle(bySize('7')), /No\. 7 drill = \.2010 in \(5\.11 mm\)\nFractional tap 1\/4" - 20 NC/);
});

test('bundled reference PDFs exist', () => {
  for (const d of DOCS) {
    const f = 'docs/reference/' + d.id;
    assert.ok(existsSync(f) && statSync(f).size > 100000, f);
    assert.match(d.web, /^https:\/\//);
  }
});
