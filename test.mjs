import { CATEGORIES, convert } from './src/units.js';
import { evaluate, asFraction } from './src/calc.js';
const U=(c,u)=>CATEGORIES.find(x=>x.id===c).units.find(x=>x.id===u);
const t=(n,a,b)=>{const ok=Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b));console.log(ok?'PASS':'FAIL',n,a,b);if(!ok)process.exitCode=1};
t('100C->F',convert(U('temperature','C'),U('temperature','F'),100),212);
t('-40F->C',convert(U('temperature','F'),U('temperature','C'),-40),-40);
t('0K->C',convert(U('temperature','K'),U('temperature','C'),0),-273.15);
t('1GiB->MB',convert(U('data','GiB'),U('data','MB'),1),1073.741824);
t('1GB->MiB',convert(U('data','GB'),U('data','MiB'),1),953.67431640625);
t('1mi->km',convert(U('length','mi'),U('length','km'),1),1.609344);
t('1kWh->BTU',convert(U('energy','kWh'),U('energy','BTU'),1),3412.141633127942);
t('2+3×4',evaluate('2+3×4'),14);t('sin30 deg',evaluate('sin(30)'),0.5);
t('sin(π÷6) rad',evaluate('sin(π÷6)',{angle:'rad'}),0.5);t('Ans×2',evaluate('Ans×2',{ans:21}),42);
t('sin⁻¹(1)',evaluate('sin⁻¹(1)'),90);t('5!',evaluate('5!'),120);t('2ᴇ3',evaluate('1÷2ᴇ3'),0.0005);
t('√(16',evaluate('√(16'),4);t('2²+log(100)',evaluate('2²+log(100)'),6);t('50%',evaluate('50%×8'),4);
console.log(asFraction(evaluate('1÷3+1÷4')));try{evaluate('2++×');}catch(e){console.log('err ok',e.message)}
