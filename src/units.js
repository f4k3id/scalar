// Conversion data. Each unit: factor = how many BASE units one of this unit equals.
// Temperature uses explicit toBase/fromBase (base = kelvin).
export const CATEGORIES = [
  { id: 'length', name: 'Length', icon: '📏', base: 'm', units: [
    ['nm','Nanometre',1e-9],['um','Micrometre',1e-6,'µm'],['mm','Millimetre',1e-3],['cm','Centimetre',1e-2],
    ['m','Metre',1],['km','Kilometre',1e3],['in','Inch',0.0254],['ft','Foot',0.3048],['yd','Yard',0.9144],
    ['mi','Mile',1609.344],['nmi','Nautical mile',1852]] },
  { id: 'weight', name: 'Weight', icon: '⚖️', base: 'kg', units: [
    ['mg','Milligram',1e-6],['g','Gram',1e-3],['kg','Kilogram',1],['t','Tonne (metric)',1000],
    ['gr','Grain',6.479891e-5],['oz','Ounce',0.028349523125],['lb','Pound',0.45359237],['st','Stone',6.35029318],
    ['ton','Short ton (US)',907.18474]] },
  { id: 'temperature', name: 'Temperature', icon: '🌡️', base: 'K', units: [
    ['C','Celsius',null,'°C',c=>c+273.15,k=>k-273.15],
    ['F','Fahrenheit',null,'°F',f=>(f-32)*5/9+273.15,k=>(k-273.15)*9/5+32],
    ['K','Kelvin',null,'K',k=>k,k=>k],
    ['R','Rankine',null,'°R',r=>r*5/9,k=>k*9/5]] },
  { id: 'volume', name: 'Volume', icon: '🧪', base: 'L', units: [
    ['mL','Millilitre',1e-3],['L','Litre',1],['m3','Cubic metre',1000,'m³'],['tsp','Teaspoon (US)',0.00492892159375],
    ['tbsp','Tablespoon (US)',0.01478676478125],['floz','Fluid ounce (US)',0.0295735295625,'fl oz'],
    ['cup','Cup (US)',0.2365882365],['pt','Pint (US)',0.473176473],['qt','Quart (US)',0.946352946],
    ['gal','Gallon (US)',3.785411784],['impgal','Gallon (UK)',4.54609,'gal UK'],['ft3','Cubic foot',28.316846592,'ft³']] },
  { id: 'area', name: 'Area', icon: '⬛', base: 'm²', units: [
    ['mm2','Square millimetre',1e-6,'mm²'],['cm2','Square centimetre',1e-4,'cm²'],['m2','Square metre',1,'m²'],
    ['ha','Hectare',1e4],['km2','Square kilometre',1e6,'km²'],['in2','Square inch',0.00064516,'in²'],
    ['ft2','Square foot',0.09290304,'ft²'],['yd2','Square yard',0.83612736,'yd²'],['ac','Acre',4046.8564224],
    ['mi2','Square mile',2589988.110336,'mi²']] },
  { id: 'speed', name: 'Speed', icon: '💨', base: 'm/s', units: [
    ['mps','Metre/second',1,'m/s'],['kmh','Kilometre/hour',1/3.6,'km/h'],['mph','Mile/hour',0.44704],
    ['kn','Knot',1852/3600],['fps','Foot/second',0.3048,'ft/s'],['mach','Mach (sea level)',340.29]] },
  { id: 'time', name: 'Time', icon: '⏱️', base: 's', units: [
    ['ms','Millisecond',1e-3],['s','Second',1],['min','Minute',60],['h','Hour',3600],['d','Day',86400],
    ['wk','Week',604800],['mo','Month (avg)',2629746],['yr','Year (365.2425 d)',31556952]] },
  { id: 'data', name: 'Data', icon: '💾', base: 'byte', note: 'SI: 1 KB = 1000 B. Binary (IEC): 1 KiB = 1024 B.', units: [
    ['bit','Bit',1/8],['B','Byte',1],['KB','Kilobyte (SI)',1e3],['MB','Megabyte (SI)',1e6],['GB','Gigabyte (SI)',1e9],
    ['TB','Terabyte (SI)',1e12],['KiB','Kibibyte',1024],['MiB','Mebibyte',1024**2],['GiB','Gibibyte',1024**3],
    ['TiB','Tebibyte',1024**4]] },
  { id: 'energy', name: 'Energy', icon: '⚡', base: 'J', units: [
    ['eV','Electronvolt',1.602176634e-19],['J','Joule',1],['kJ','Kilojoule',1e3],['cal','Calorie',4.184],
    ['kcal','Kilocalorie',4184],['Wh','Watt-hour',3600],['kWh','Kilowatt-hour',3.6e6],['BTU','BTU (IT)',1055.05585262]] },
].map(c => ({ ...c, units: c.units.map(([id,name,factor,symbol,toBase,fromBase]) =>
  ({ id, name, symbol: symbol || id, factor, toBase, fromBase, builtin: true })) }));

export const toBase = (u, v) => u.toBase ? u.toBase(v) : v * u.factor + (u.offset || 0);
export const fromBase = (u, b) => u.fromBase ? u.fromBase(b) : (b - (u.offset || 0)) / u.factor;
export const convert = (from, to, v) => fromBase(to, toBase(from, v));

export function formatNum(n, sig = 10) {
  if (!isFinite(n)) return '';
  if (n === 0) return '0';
  const a = Math.abs(n);
  if (a >= 1e15 || a < 1e-9) return n.toExponential(sig - 1).replace(/\.?0+e/, 'e');
  return String(parseFloat(n.toPrecision(sig)));
}
