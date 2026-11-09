// IRWIN "Metal Drilling Reference Guide" (MD04-300, 2004), transcribed value for value.
// Page 1: cutting speeds, RPM formula, feed per revolution, deep-hole reduction.
// Page 2: Tap & Drill Selection Chart (4 printed column groups merged, sorted by decimal).

export const TITLE = 'Metal Drilling Reference Guide';

/** SFM for high speed steel drills. depth 1 = indented sub-row in the source. sfm null = heading only. */
export const CUTTING_SPEEDS = [
  { name: 'Aluminum and its Alloys', sfm: '200-300' },
  { name: 'Brass and Bronze (Ordinary)', sfm: '150-300' },
  { name: 'Bronze (High Tensile)', sfm: '70-150' },
  { name: 'Die Castings (Zinc Base)', sfm: '300-400' },
  { name: 'Iron-Cast (Soft)', sfm: '100-150' },
  { name: 'Cast (Medium hard)', sfm: '70-100', depth: 1, parent: 'Iron' },
  { name: 'Hard Chilled', sfm: '30-40', depth: 1, parent: 'Iron' },
  { name: 'Malleable', sfm: '80-90', depth: 1, parent: 'Iron' },
  { name: 'Magnesium and its Alloys', sfm: '250-400' },
  { name: 'Monel Metal or High-Nickel Steel', sfm: '30-50' },
  { name: 'Plastics or Similar Materials (Bakelite)', sfm: '100-300' },
  { name: 'Steel - Mild (.2 carbon to .3 carbon)', sfm: '80-110' },
  { name: 'Steel (.4 carbon to .5 carbon)', sfm: '70-80', depth: 1, parent: 'Steel' },
  { name: 'Tool (1.2 carbon)', sfm: '50-60', depth: 1, parent: 'Steel' },
  { name: 'Forgings', sfm: '40-50', depth: 1, parent: 'Steel' },
  { name: 'Alloy - 300 to 400 Brinell', sfm: '20-30', depth: 1, parent: 'Steel' },
  { name: 'High Tensile (Heat Treated)', sfm: null, depth: 1, parent: 'Steel' },
  { name: '35 to 40 Rockwell C', sfm: '30-40', depth: 1, parent: 'Steel, High Tensile' },
  { name: '40 to 45 Rockwell C', sfm: '25-35', depth: 1, parent: 'Steel, High Tensile' },
  { name: '45 to 50 Rockwell C', sfm: '15-25', depth: 1, parent: 'Steel, High Tensile' },
  { name: '50 to 55 Rockwell C', sfm: '7-15', depth: 1, parent: 'Steel, High Tensile' },
  { name: 'Stainless Steel', sfm: null },
  { name: 'Free Machining Grades', sfm: '30-80', depth: 1, parent: 'Stainless Steel' },
  { name: 'Work Hardening Grades', sfm: '15-50', depth: 1, parent: 'Stainless Steel' },
  { name: 'Wood', sfm: '300-400' },
];
export const SFM_NOTE = '*Surface Feet per Minute (SFM)';
export const RPM_FACTOR = 3.82;

export const FEED_HEAD = ['Drill Diameter Range', 'Light', 'Medium', 'Heavy'];
/** Feed per drill revolution, inches. lo/hi = diameter range in inches. */
export const FEEDS = [
  { range: '1/16 to 1/8', lo: 1 / 16, hi: 1 / 8, light: '.0005 - .0010', medium: '.0010 - .0020', heavy: '.0020 - .0040' },
  { range: '1/8 to 1/4', lo: 1 / 8, hi: 1 / 4, light: '.0010 - .0030', medium: '.0030 - .0050', heavy: '.0040 - .0050' },
  { range: '1/4 to 3/8', lo: 1 / 4, hi: 3 / 8, light: '.0030 - .0050', medium: '.0050 - .0070', heavy: '.0060 - .0100' },
  { range: '3/8 to 1/2', lo: 3 / 8, hi: 1 / 2, light: '.0040 - .0060', medium: '.0050 - .0080', heavy: '.0080 - .0120' },
  { range: '1/2 to 3/4', lo: 1 / 2, hi: 3 / 4, light: '.0050 - .0070', medium: '.0070 - .0100', heavy: '.0090 - .0140' },
  { range: '3/4 to 1', lo: 3 / 4, hi: 1, light: '.0070 - .0100', medium: '.0090 - .0140', heavy: '.0140 - .0200' },
];

export const DEEP_HOLE_TEXT = 'Holes that fall into the “deep-hole drilling” category are three or more drill bit diameters in depth. When you are drilling this deep, you must adjust your speeds and feeds accordingly. The deeper the hole is, the more probable that chips might lodge in the flutes and clog the drill. When the flute clogs, the amount of friction and heat will increase. Heat build-up in the drill bit could cause failure and breakage. Lubricants always help the dissipation of heat from the tip of the drill bit, which prolongs the drill’s life. Removing the drill and evacuating the chips after drilling short distances, often called “step-drilling,” will also lessen the chance of heat build-up. Some good rules of thumb when deep-hole drilling are to reduce your rate of speed and feed, remove the bit more often from the material, and use lubricant whenever you can.';

/** Speed and feed reduction, based upon hole depth (times drill diameter). Source header reads "Ration". */
export const DEPTH_REDUCTION = [
  { depth: 3, speed: '10%', feed: '10%' },
  { depth: 4, speed: '20%', feed: '10%' },
  { depth: 5, speed: '30%', feed: '20%' },
  { depth: 6, speed: '35-40%', feed: '20%' },
];

/**
 * Tap & Drill Selection Chart, every printed row (187), in printed order, which is ascending decimal.
 * size: drill as printed (number gauge, letter, fractional inch, or mm). dec: decimal inch as printed.
 * frac: Fractional Tap column. ms: Machine Screw Tap column (printed groups 1-2).
 * pipe: Pipe Tap column (printed groups 3-4). metric: Metric Tap. ext: Screw Extractor.
 */
export const TAP_DRILL = [
  {size: "1/64\"", dec: ".0156"},
  {size: "1/32\"", dec: ".0312"},
  {size: "1.0 mm", dec: ".0394"},
  {size: "60", dec: ".0400"},
  {size: "59", dec: ".0410"},
  {size: "58", dec: ".0420"},
  {size: "57", dec: ".0430"},
  {size: "56", dec: ".0465"},
  {size: "3/64\"", dec: ".0469", ms: ["0 - 80 NF"]},
  {size: "55", dec: ".0520"},
  {size: "54", dec: ".0550"},
  {size: "1.5 mm", dec: ".0591"},
  {size: "53", dec: ".0595", ms: ["1 - 64 NC", "1 - 72 NF"]},
  {size: "1/16\"", dec: ".0625"},
  {size: "52", dec: ".0635"},
  {size: "51", dec: ".0670"},
  {size: "50", dec: ".0700", ms: ["2 - 56 NC", "2 - 64 NF"]},
  {size: "49", dec: ".0730"},
  {size: "48", dec: ".0760"},
  {size: "5/64\"", dec: ".0781", ms: ["3 - 48 NC"], ext: "EX-1"},
  {size: "47", dec: ".0785"},
  {size: "2.0 mm", dec: ".0787"},
  {size: "46", dec: ".0810"},
  {size: "45", dec: ".0820", ms: ["3 - 56 NF"]},
  {size: "44", dec: ".0860", ms: ["4 - 36 NS"]},
  {size: "43", dec: ".0890", ms: ["4 - 40 NC"]},
  {size: "42", dec: ".0935"},
  {size: "3/32\"", dec: ".0938", ms: ["4 - 48 NF"]},
  {size: "41", dec: ".0960", metric: ["3 mm - .60"]},
  {size: "40", dec: ".0980"},
  {size: "2.5 mm", dec: ".0984", metric: ["3 mm - .50"]},
  {size: "39", dec: ".0995", metric: ["3 mm - .50"]},
  {size: "38", dec: ".1015", frac: ["1/8\" - 40 NS"], ms: ["5 - 40 NC"]},
  {size: "37", dec: ".1040", ms: ["5 - 44 NF"]},
  {size: "36", dec: ".1065", ms: ["6 - 32 NC"]},
  {size: "7/64\"", dec: ".1094", ext: "EX-2"},
  {size: "35", dec: ".1100"},
  {size: "34", dec: ".1110", ms: ["6 - 36 NS"]},
  {size: "33", dec: ".1130", ms: ["6 - 40 NF"]},
  {size: "32", dec: ".1160", ms: ["6 - 48 NS"]},
  {size: "3.0 mm", dec: ".1181"},
  {size: "31", dec: ".1200"},
  {size: "1/8\"", dec: ".1250"},
  {size: "30", dec: ".1285", metric: ["4 mm - .70", "4 mm - .75"]},
  {size: "29", dec: ".1360", ms: ["8 - 32 NC", "8 - 36 NF"]},
  {size: "3.5 mm", dec: ".1378"},
  {size: "28", dec: ".1405"},
  {size: "9/64\"", dec: ".1406", frac: ["8 - 40 NS"], ext: "ST-1"},
  {size: "27", dec: ".1440"},
  {size: "26", dec: ".1470", frac: ["3/16\" - 24 NS"]},
  {size: "25", dec: ".1495", ms: ["10 - 24 NC"]},
  {size: "24", dec: ".1520"},
  {size: "23", dec: ".1540"},
  {size: "5/32\"", dec: ".1562", frac: ["3/16\" - 32 NS"], ext: "EX-3"},
  {size: "22", dec: ".1570"},
  {size: "4.0 mm", dec: ".1575"},
  {size: "21", dec: ".1590", ms: ["10 - 32 NF"]},
  {size: "20", dec: ".1600", metric: ["5 mm - .90"]},
  {size: "19", dec: ".1660", metric: ["5 mm - .80"]},
  {size: "18", dec: ".1695"},
  {size: "11/64\"", dec: ".1719"},
  {size: "17", dec: ".1730"},
  {size: "16", dec: ".1770", ms: ["12 - 24 NC"]},
  {size: "4.5 mm", dec: ".1772"},
  {size: "15", dec: ".1800"},
  {size: "14", dec: ".1820", ms: ["12 - 28 NF"]},
  {size: "13", dec: ".1850", ms: ["12 - 32 NEF"]},
  {size: "3/16\"", dec: ".1875", ext: "ST-2"},
  {size: "12", dec: ".1890"},
  {size: "11", dec: ".1910"},
  {size: "10", dec: ".1935", ms: ["14 - 20 NS"]},
  {size: "9", dec: ".1960"},
  {size: "5.0 mm", dec: ".1969", metric: ["6 mm - 1.00"]},
  {size: "8", dec: ".1990", metric: ["6 mm - 1.00"]},
  {size: "7", dec: ".2010", frac: ["1/4\" - 20 NC"]},
  {size: "13/64\"", dec: ".2031", ms: ["14 - 24 NS"]},
  {size: "6", dec: ".2040"},
  {size: "5", dec: ".2055"},
  {size: "4", dec: ".2090", frac: ["1/4\" - 24 NS"]},
  {size: "3", dec: ".2130", frac: ["1/4\" - 28 NF"]},
  {size: "5.5 mm", dec: ".2165"},
  {size: "7/32\"", dec: ".2188", frac: ["1/4\" - 32 NEF"]},
  {size: "2", dec: ".2210"},
  {size: "1", dec: ".2280", frac: ["1/4\" - 40 NS"]},
  {size: "A", dec: ".2340"},
  {size: "15/64\"", dec: ".2344", metric: ["7 mm - 1.00"], ext: "ST-3"},
  {size: "6.0 mm", dec: ".2362", metric: ["7 mm - 1.00"]},
  {size: "B", dec: ".2380"},
  {size: "C", dec: ".2420"},
  {size: "D", dec: ".2460"},
  {size: "E", dec: ".2500"},
  {size: "1/4\"", dec: ".2500", ext: "EX-4"},
  {size: "6.5 mm", dec: ".2559"},
  {size: "F", dec: ".2570", frac: ["5/16\" - 18 NC"]},
  {size: "G", dec: ".2610"},
  {size: "17/64\"", dec: ".2656", metric: ["8 mm - 1.25"]},
  {size: "H", dec: ".2660"},
  {size: "I", dec: ".2720", frac: ["5/16\" - 24 NF"]},
  {size: "7.0 mm", dec: ".2756", metric: ["8 mm - 1.00"]},
  {size: "J", dec: ".2770", metric: ["8 mm - 1.00"]},
  {size: "K", dec: ".2810"},
  {size: "9/32\"", dec: ".2812", frac: ["5/16\" - 32 NEF"]},
  {size: "L", dec: ".2900"},
  {size: "M", dec: ".2950"},
  {size: "7.5 mm", dec: ".2953"},
  {size: "19/64\"", dec: ".2969", ext: "EX-5"},
  {size: "N", dec: ".3020", metric: ["9 mm - 1.25"]},
  {size: "5/16\"", dec: ".3125", frac: ["3/8\" - 16 NC"], ext: "ST-4"},
  {size: "8.0 mm", dec: ".3150", metric: ["9 mm - 1.00"]},
  {size: "O", dec: ".3160", metric: ["9 mm - 1.00"]},
  {size: "P", dec: ".3230", metric: ["9 mm - .75"]},
  {size: "21/64\"", dec: ".3281", pipe: ["1/8\" - 28 BSP"]},
  {size: "Q", dec: ".3320", frac: ["3/8\" - 24 NF"], pipe: ["1/8\" - 27 NPT"]},
  {size: "8.5 mm", dec: ".3346", metric: ["10 mm - 1.50"]},
  {size: "R", dec: ".3390", metric: ["10 mm - 1.50"]},
  {size: "11/32\"", dec: ".3438", metric: ["10 mm - 1.25"]},
  {size: "S", dec: ".3480"},
  {size: "9.0 mm", dec: ".3543", metric: ["10 mm - 1.00"]},
  {size: "T", dec: ".3580", metric: ["10 mm - 1.00"]},
  {size: "23/64\"", dec: ".3594"},
  {size: "U", dec: ".3680", frac: ["7/16\" - 14 NC"]},
  {size: "9.5 mm", dec: ".3740", metric: ["11 mm - 1.50"]},
  {size: "3/8\"", dec: ".3750", metric: ["11 mm - 1.50"], ext: "ST-5"},
  {size: "V", dec: ".3770"},
  {size: "W", dec: ".3860"},
  {size: "25/64\"", dec: ".3906", frac: ["7/16\" - 20 NF"]},
  {size: "10.0 mm", dec: ".3937"},
  {size: "X", dec: ".3970"},
  {size: "Y", dec: ".4040"},
  {size: "13/32\"", dec: ".4062", metric: ["12 mm - 1.75"], ext: "EX-6"},
  {size: "Z", dec: ".4130", metric: ["12 mm - 1.50"]},
  {size: "10.5 mm", dec: ".4134", metric: ["12 mm - 1.50"]},
  {size: "27/64\"", dec: ".4219", frac: ["1/2\" - 13 NC"], metric: ["12 mm - 1.25"]},
  {size: "11.0 mm", dec: ".4331"},
  {size: "7/16\"", dec: ".4375", pipe: ["1/4\" - 18 NPT"]},
  {size: "11.5 mm", dec: ".4528"},
  {size: "29/64\"", dec: ".4531", frac: ["1/2\" - 20 NF", "1/2\" - 24 NS"], pipe: ["1/4\" - 19 BSP"]},
  {size: "15/32\"", dec: ".4688", metric: ["14 mm - 2.0"], ext: "ST-6"},
  {size: "12.0 mm", dec: ".4724", metric: ["14 mm - 2.0"]},
  {size: "31/64\"", dec: ".4844", frac: ["9/16\" - 12 NC"]},
  {size: "12.5 mm", dec: ".4921", metric: ["14 mm - 1.5"]},
  {size: "1/2\"", dec: ".5000", metric: ["14 mm - 1.25", "14 mm - 1.5"]},
  {size: "13.0 mm", dec: ".5118", metric: ["14 mm - 1.25"]},
  {size: "33/64\"", dec: ".5156", frac: ["9/16\" - 18 NF"]},
  {size: "17/32\"", dec: ".5313", frac: ["5/8\" - 11 NC"], ext: "EX-7"},
  {size: "35/64\"", dec: ".5469", metric: ["16 mm - 2.0"]},
  {size: "9/16\"", dec: ".5625", pipe: ["3/8\" - 18 NPT"], ext: "ST-7"},
  {size: "37/64\"", dec: ".5781", frac: ["5/8\" - 18 NF"], metric: ["16 mm - 1.5"]},
  {size: "19/32\"", dec: ".5938", frac: ["11/16\" - 11 NS"]},
  {size: "39/64\"", dec: ".6094", metric: ["18 mm - 2.5"]},
  {size: "5/8\"", dec: ".6250", frac: ["11/16\" - 16 NS"]},
  {size: "41/64\"", dec: ".6406"},
  {size: "21/32\"", dec: ".6562", frac: ["3/4\" - 10 NC"], metric: ["18 mm - 1.5"]},
  {size: "43/64\"", dec: ".6719"},
  {size: "11/16\"", dec: ".6875", frac: ["3/4\" - 16 NF"], metric: ["20 mm - 2.5"]},
  {size: "45/64\"", dec: ".7031", pipe: ["1/2\" - 14 NPT"]},
  {size: "23/32\"", dec: ".7188"},
  {size: "47/64\"", dec: ".7344"},
  {size: "3/4\"", dec: ".7500"},
  {size: "49/64\"", dec: ".7656", frac: ["7/8\" - 9 NC"]},
  {size: "25/32\"", dec: ".7812"},
  {size: "51/64\"", dec: ".7969"},
  {size: "13/16\"", dec: ".8125", frac: ["7/8\" - 14 NF"], metric: ["22 mm - 1.5"], ext: "EX-8"},
  {size: "53/64\"", dec: ".8281", metric: ["24 mm - 3.0"]},
  {size: "27/32\"", dec: ".8438"},
  {size: "55/64\"", dec: ".8594"},
  {size: "7/8\"", dec: ".8750", frac: ["1\" - 8 NC"], metric: ["24 mm - 2.0"]},
  {size: "57/64\"", dec: ".8906"},
  {size: "29/32\"", dec: ".9062"},
  {size: "59/64\"", dec: ".9219", frac: ["1\" - 12 NF"], pipe: ["3/4\" - 14 NPT"]},
  {size: "15/16\"", dec: ".9375", frac: ["1\" - 14 NS"]},
  {size: "61/64\"", dec: ".9531"},
  {size: "31/32\"", dec: ".9688"},
  {size: "63/64\"", dec: ".9844", frac: ["1-1/8\" - 7 NC"]},
  {size: "1\"", dec: "1.0000"},
  {size: "1-1/64\"", dec: "1.0156"},
  {size: "1-1/32\"", dec: "1.0312"},
  {size: "1-1/16\"", dec: "1.0625", ext: "EX-9"},
  {size: "1-3/32\"", dec: "1.0938"},
  {size: "1-1/8\"", dec: "1.1250"},
  {size: "1-5/32\"", dec: "1.1562", pipe: ["1\" - 11-1/2 NPT"]},
  {size: "1-3/16\"", dec: "1.1875"},
  {size: "1-1/4\"", dec: "1.2500"},
  {size: "1-5/16\"", dec: "1.3125"},
  {size: "1-3/8\"", dec: "1.3750"},
  {size: "1-7/16\"", dec: "1.4375"},
  {size: "1-1/2\"", dec: "1.5000", pipe: ["1-1/4\" - 11-1/2 NPT"]},
];
/** Printed column-group sizes (rows per group on the page). */
export const TAP_GROUPS = [47, 47, 47, 46];

/** Cells kept as printed that look unusual. */
export const SOURCE_NOTES = [
  { size: '9/64"', note: '“8 - 40 NS” (a machine-screw size) is printed in the Fractional Tap column.' },
];

export const LEGEND = [
  ['NC', 'National Coarse (USS)'],
  ['NF', 'National Fine (SAE)'],
  ['NEF', 'National Extra Fine'],
  ['NS', 'National Special'],
  ['NPT', 'National Pipe Taper'],
  ['BSP', 'British Standard Pipe'],
];

export function sizeKind(size) {
  if (/mm$/.test(size)) return 'metric';
  if (/"$/.test(size)) return 'fraction';
  if (/^[A-Z]$/.test(size)) return 'letter';
  return 'number';
}

/** Short drill label: "#7", "F", "1/4\"", "6.5 mm". */
export function drillLabel(size) {
  return sizeKind(size) === 'number' ? '#' + size : size;
}

/** Parse "200-300" into [200, 300]. */
export function sfmRange(s) {
  const [a, b] = String(s).split('-').map(Number);
  return [a, b ?? a];
}

/** RPM = SFM x 3.82 / drill diameter (inches). */
export function rpm(sfm, diameterIn) {
  if (!(diameterIn > 0) || !(sfm > 0)) return NaN;
  return (sfm * RPM_FACTOR) / diameterIn;
}

/**
 * Drill diameter in inches from user text: 0.25, .25, 1/4, 1-1/8, 1 1/8, 6.5 mm, 6.5mm, #7, 7 (gauge), F.
 * A bare integer 1-60 is read as a number-gauge drill (from the chart); "1" alone means #1.
 */
export function parseDiameter(text) {
  const raw = String(text || '').trim();
  const inchMark = /["”]|in\.?$/.test(raw);
  const t = raw.replace(/["”]|in\.?$/g, '').trim();
  if (!t) return NaN;
  const mm = t.match(/^(\d+(?:\.\d+)?)\s*mm$/i);
  if (mm) return Number(mm[1]) / 25.4;
  const gauge = t.match(/^#?\s*(\d{1,2})$/);
  if (gauge && !inchMark) {
    const row = TAP_DRILL.find((r) => r.size === gauge[1]);
    if (row) return Number(row.dec);
  }
  if (/^[A-Za-z]$/.test(t)) {
    const row = TAP_DRILL.find((r) => r.size === t.toUpperCase());
    return row ? Number(row.dec) : NaN;
  }
  const mixed = t.match(/^(\d+)[\s-]+(\d+)\/(\d+)$/);
  if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
  const frac = t.match(/^(\d+)\/(\d+)$/);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  return /^\d*\.?\d+$/.test(t) ? Number(t) : NaN;
}

export function feedFor(diameterIn) {
  return FEEDS.find((f) => diameterIn >= f.lo && diameterIn <= f.hi) || null;
}

/** All taps on a row with their column meaning. */
export function rowTaps(r) {
  return [
    ...(r.frac || []).map((t) => ({ t, kind: 'Fractional' })),
    ...(r.ms || []).map((t) => ({ t, kind: 'Machine screw' })),
    ...(r.pipe || []).map((t) => ({ t, kind: 'Pipe' })),
    ...(r.metric || []).map((t) => ({ t, kind: 'Metric' })),
  ];
}

/** Hover text for a tap-drill row. */
export function rowTitle(r) {
  const kind = { number: 'No. ' + r.size + ' drill', letter: 'Letter ' + r.size + ' drill', fraction: r.size + ' drill', metric: r.size + ' drill' }[sizeKind(r.size)];
  const mm = (Number(r.dec) * 25.4).toFixed(2);
  const taps = rowTaps(r).map((x) => `${x.kind} tap ${x.t}`);
  if (r.ext) taps.push('Screw extractor ' + r.ext);
  return `${kind} = ${r.dec} in (${mm} mm)` + (taps.length ? '\n' + taps.join('\n') : '');
}

/**
 * Compact list for the panel: the standard inch taps (NC / NF, machine screw and fractional)
 * with their tap drill, in thread-size order as they appear in the chart.
 */
export function commonInchTaps() {
  const out = [];
  for (const r of TAP_DRILL) {
    for (const t of [...(r.ms || []), ...(r.frac || [])]) {
      if (/ N[CF]$/.test(t)) out.push({ tap: t, drill: drillLabel(r.size), dec: r.dec, row: r, screw: !t.includes('"') });
    }
  }
  return out;
}

/** Coarse/standard metric taps with every tap drill the chart lists for them. */
export function metricTaps() {
  const map = new Map();
  for (const r of TAP_DRILL) {
    for (const t of r.metric || []) {
      if (!map.has(t)) map.set(t, []);
      map.get(t).push(r);
    }
  }
  return [...map.entries()].map(([tap, rows]) => ({ tap, rows }));
}

export const DOCS = [
  {
    id: 'osg-drilling-technical-guide-vol1.pdf',
    label: 'OSG Drilling Technical Guide, Vol 1',
    web: 'https://res.cloudinary.com/osg-usa-inc/image/upload/v1709319429/Literature/03%20-%20Charts%20and%20Guides/Technical%20Guides/OSG_-_Literature_-_Other_-_Technical_Data_-_Drilling-_Vol_1_-_IA.pdf',
  },
  {
    id: 'irwin-metal-drilling-reference-guide.pdf',
    label: 'IRWIN Metal Drilling Reference Guide (PDF)',
    web: 'https://github.com/f4k3id/scalar/raw/master/docs/reference/irwin-metal-drilling-reference-guide.pdf',
  },
];
