import test from 'node:test';
import assert from 'node:assert/strict';
import {billTotal,checkout,draftText,parsePrice,readSavedData,upsertChemical} from '../app/visit-model.ts';

const client={id:1,name:'Pilot customer',phone:'0400000000',address:'Test address',suburb:'Perth',note:'Gate',pool:{volume:'42000',surface:'Fibreglass',system:'Saltwater',chlorinator:'Example',filter:'Sand',pump:'Variable',fcMin:'2',fcMax:'4',phMin:'7.2',phMax:'7.8'}};
const job={id:1,clientId:1,time:'8:30',done:false,tasks:[],readings:{fc:'0',ch:'250',salt:'4000'},notes:[],activity:[]};
const chemical={productId:'one',name:'Test product',ingredient:'From label',strength:'From label',unit:'L',quantity:1.25,priceCents:450,confirmedAt:'2026-11-03T00:00:00Z'};

test('old browser records load without dropping readings or existing notes',()=>{
  const data=readSavedData(JSON.stringify({clients:[client],jobs:[{...job,notes:['Keep this note']}]}));
  assert.equal(data.jobs[0].readings.fc,'0');assert.equal(data.jobs[0].notes[0],'Keep this note');assert.deepEqual(data.products,[]);
});
test('empty, malformed and orphaned records are rejected before saving',()=>{
  for(const value of ['{','{}',JSON.stringify({clients:[],jobs:[]}),JSON.stringify({clients:[client],jobs:[{...job,clientId:9}]}),JSON.stringify({clients:[client],jobs:[{...job,notes:3}]}),JSON.stringify({clients:[client],jobs:[{...job,checkedInAt:'invalid'}]})])assert.throws(()=>readSavedData(value));
});
test('money accepts zero, distinguishes blank and rejects precision loss',()=>{
  assert.equal(parsePrice('120'),12000);assert.equal(parsePrice('0'),0);assert.equal(parsePrice(''),null);assert.equal(parsePrice('4.50'),450);
  for(const price of ['-2','1.001','Infinity','NaN','1e3'])assert.throws(()=>parsePrice(price));
});
test('changing the actual amount replaces its charge instead of duplicating it',()=>{
  const original=upsertChemical([],chemical);const updated=upsertChemical(original,{...chemical,quantity:2});
  assert.equal(updated.length,1);assert.equal(updated[0].quantity,2);assert.equal(original[0].quantity,1.25);
  assert.equal(billTotal(12000,updated).totalCents,12900);
});
test('a missing price cannot become a complete zero-price invoice',()=>{
  assert.deepEqual(billTotal(12000,[{...chemical,priceCents:null}]),{knownCents:12000,missingPrices:1,totalCents:null});
  assert.equal(billTotal(12000,[{...chemical,priceCents:0}]).totalCents,12000);
});
test('fractional product quantities round once per line to cents',()=>{
  assert.equal(billTotal(12000,[chemical]).totalCents,12563);
});
test('invalid quantities cannot be recorded',()=>{
  for(const quantity of [0,-1,NaN,Infinity,100001])assert.throws(()=>upsertChemical([],{...chemical,quantity}));
});
test('checkout requires check-in, captures notes and is idempotent',()=>{
  assert.throws(()=>checkout(job,client,'2026-11-03T01:00:00Z'));
  const result=checkout({...job,checkedInAt:'2026-11-03T00:00:00Z',noteDraft:'Equipment checked',chemicals:[chemical]},client,'2026-11-03T01:00:00Z');
  assert.equal(result.done,true);assert.equal(result.invoice.serviceFeeCents,12000);assert.deepEqual(result.invoice.notes,['Equipment checked']);assert.equal(result.noteDraft,'');
  assert.equal(checkout(result,client,'2026-11-03T02:00:00Z'),result);
});
test('invoice snapshot does not change when source readings, profile or lines change',()=>{
  const source={...job,readings:{...job.readings},tasks:['Test water'],checkedInAt:'2026-11-03T00:00:00Z',chemicals:[{...chemical}]};
  const customer={...client};const result=checkout(source,customer,'2026-11-03T01:00:00Z');
  source.readings.ch='999';source.chemicals[0].quantity=9;customer.name='Changed';source.tasks.push('Other');
  assert.equal(result.invoice.readings.ch,'250');assert.equal(result.invoice.chemicals[0].quantity,1.25);assert.equal(result.invoice.customerName,'Pilot customer');assert.equal(result.invoice.tasks.length,1);
});
test('draft includes all readings and cannot be mistaken for a sent invoice',()=>{
  const text=draftText(job,client);assert.match(text,/DRAFT ONLY \/ NOT SENT/);assert.match(text,/Calcium hardness: 250 ppm/);assert.match(text,/Salt: 4000 ppm/);assert.match(text,/Free chlorine: 0 ppm/);
});
