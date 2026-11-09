import test from 'node:test';
import assert from 'node:assert/strict';
import { inchTickDecimal } from './src/inchChart.js';

test('inch fractions show exact decimals without trailing zeros', () => {
  for (const [tick, expected] of [[0, '0"'], [1, '0.015625"'], [2, '0.03125"'], [24, '0.375"'], [64, '1"'], [88, '1.375"'], [127, '1.984375"'], [128, '2"']]) {
    assert.equal(inchTickDecimal(tick), expected);
  }
});

test('every tick across the 0–2 inch chart has an exact decimal', () => {
  for (let tick = 0; tick <= 128; tick++) {
    const label = inchTickDecimal(tick);
    assert.match(label, /^\d(?:\.\d{1,6})?"$/);
    assert.equal(Number(label.slice(0, -1)) * 64, tick);
  }
});

import { decimalEquivalentRows } from './src/inchChart.js';
test('decimal-equivalents table matches the Hepworth chart format', () => {
  const rows = decimalEquivalentRows();
  assert.equal(rows.length, 64);
  const pick = (i) => rows[i - 1];
  for (const [i, n, d, dec, mm] of [[1, 1, 64, '.015625', '0.397'], [2, 1, 32, '.03125', '0.794'], [7, 7, 64, '.109375', '2.778'], [16, 1, 4, '.25', '6.35'], [32, 1, 2, '.5', '12.7'], [33, 33, 64, '.515625', '13.097'], [41, 41, 64, '.640625', '16.272'], [63, 63, 64, '.984375', '25.003'], [64, 1, 1, '1', '25.4']]) {
    const r = pick(i);
    assert.deepEqual([r.n, r.d, r.decimal, r.mm], [n, d, dec, mm]);
  }
});
test('half-thousandth mm values round up like the printed chart', () => {
  const rows = decimalEquivalentRows();
  assert.deepEqual([4, 12, 28, 36, 44, 52].map((i) => rows[i - 1].mm), ['1.588', '4.763', '11.113', '14.288', '17.463', '20.638']);
});
