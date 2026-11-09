import { CATEGORIES, convert } from './src/units.js';
import { evaluate, asFraction, fractionParts, tokenizeExpr, endsWithOperand, fractionCaretMove } from './src/calc.js';
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
t('1⁄32',evaluate('1⁄32'),0.03125);t('2×3⁄4',evaluate('2×3⁄4'),1.5);t('1⁄(2+2)',evaluate('1⁄(2+2)'),0.25);t('3⁄4+1⁄4',evaluate('3⁄4+1⁄4'),1);
t('1÷32 frac',asFraction(evaluate('1÷32'))==='1/32'?1:0,1);
const fp=fractionParts(-0.375);t('frac parts',fp.neg&&fp.n==='3'&&fp.d==='8'?1:0,1);
const tk=tokenizeExpr('1⁄32+5');t('tokenize frac',tk[0].t==='frac'&&tk[0].num==='1'&&tk[0].den==='32'&&tk[1].t==='op'?1:0,1);
const tk2=tokenizeExpr('7⁄');t('tokenize open frac',tk2[0].t==='frac'&&tk2[0].den===''?1:0,1);
try{evaluate('1⁄');console.log('FAIL empty denominator');process.exitCode=1}catch{console.log('PASS empty denominator errors')}

t('empty entry not operand',endsWithOperand('')?0:1,1);t('after + not operand',endsWithOperand('2+')?0:1,1);t('after 7 operand',endsWithOperand('7')?1:0,1);
t('down to denominator',fractionCaretMove('12⁄5',1,'down'),4);t('up to numerator',fractionCaretMove('12⁄5',4,'up'),2);
