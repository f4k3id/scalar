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
