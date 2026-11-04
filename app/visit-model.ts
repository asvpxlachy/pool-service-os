export type Pool = {volume:string;surface:string;system:string;chlorinator:string;filter:string;pump:string;fcMin:string;fcMax:string;phMin:string;phMax:string};
export type Client = {id:number;name:string;phone:string;address:string;suburb:string;note:string;photo?:string;serviceFeeCents?:number;pool:Pool};
export type Product = {id:string;name:string;ingredient:string;strength:string;unit:'L'|'kg'|'g'|'mL';priceCents:number|null};
export type ChemicalLine = {productId:string;name:string;ingredient:string;strength:string;unit:Product['unit'];quantity:number;priceCents:number|null;confirmedAt:string};
export type InvoiceDraft = {createdAt:string;customerName:string;address:string;serviceFeeCents:number;chemicals:ChemicalLine[];readings:Record<string,string>;notes:string[];tasks:string[]};
export type Job = {id:number;clientId:number;time:string;done:boolean;tasks:string[];readings:Record<string,string>;notes:string[];activity:string[];checkedInAt?:string;checkedOutAt?:string;beforePhoto?:string;afterPhoto?:string;noteDraft?:string;serviceFeeCents?:number;chemicals?:ChemicalLine[];invoice?:InvoiceDraft};
export const waterFields = [['fc','Free chlorine','ppm'],['ph','pH',''],['ta','Total alkalinity','ppm'],['cya','Stabiliser','ppm'],['ch','Calcium hardness','ppm'],['salt','Salt','ppm']] as const;
export const serviceTasks = ['Skim surface','Empty skimmer basket','Empty pump basket','Brush walls and steps','Inspect equipment','Backwash / clean filter','Test water'];
export const money = (cents:number) => new Intl.NumberFormat('en-AU',{style:'currency',currency:'AUD'}).format(cents/100);
export function parsePrice(value:string):number|null {
  if (!value.trim()) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) throw new Error('Use a positive price with up to two decimal places.');
  const cents = Math.round(Number(value)*100);
  if (!Number.isSafeInteger(cents) || cents > 100_000_000) throw new Error('Price is too large.');
  return cents;
}
export function upsertChemical(lines:ChemicalLine[], line:ChemicalLine):ChemicalLine[] {
  if (!Number.isFinite(line.quantity) || line.quantity<=0 || line.quantity>100_000) throw new Error('Enter an amount greater than zero and no more than 100,000.');
  return [...lines.filter(item=>item.productId!==line.productId),line];
}
export function billTotal(fee:number, lines:ChemicalLine[]) {
  const missingPrices = lines.filter(line=>line.priceCents===null).length;
  const knownCents = fee+lines.reduce((sum,line)=>sum+(line.priceCents===null?0:Math.round(line.quantity*line.priceCents)),0);
  return {knownCents,missingPrices,totalCents:missingPrices?null:knownCents};
}
export function checkout(job:Job, client:Client, now:string):Job {
  if (job.done) return job;
  if (!job.checkedInAt) throw new Error('Check in before checking out.');
  const notes = job.noteDraft?.trim() ? [...job.notes,job.noteDraft.trim()] : job.notes;
  const invoice:InvoiceDraft = {createdAt:now,customerName:client.name,address:client.address,serviceFeeCents:job.serviceFeeCents??client.serviceFeeCents??12000,chemicals:(job.chemicals??[]).map(line=>({...line})),readings:{...job.readings},notes:[...notes],tasks:[...job.tasks]};
  return {...job,done:true,checkedOutAt:now,notes,noteDraft:'',invoice,activity:[...job.activity,`${now}: Checked out; invoice draft created`]};
}
export function draftText(job:Job, client:Client):string {
  const invoice=job.invoice??{createdAt:'',customerName:client.name,address:client.address,serviceFeeCents:job.serviceFeeCents??client.serviceFeeCents??12000,chemicals:job.chemicals??[],readings:job.readings,notes:job.notes,tasks:job.tasks};
  const total=billTotal(invoice.serviceFeeCents,invoice.chemicals);
  return ['POOL OS — DRAFT ONLY / NOT SENT',invoice.customerName,invoice.address,invoice.createdAt?`Visit: ${new Date(invoice.createdAt).toLocaleString('en-AU')}`:'',`Service (GST included): ${money(invoice.serviceFeeCents)}`,...invoice.chemicals.map(line=>`${line.name}: ${line.quantity} ${line.unit} — ${line.priceCents===null?'Price required':money(Math.round(line.quantity*line.priceCents))}`),total.totalCents===null?`Priced subtotal: ${money(total.knownCents)} — ${total.missingPrices} price(s) required`:`Total (GST included): ${money(total.totalCents)}`,'','Water readings',...waterFields.map(([key,label,unit])=>`${label}: ${invoice.readings[key]||'Not recorded'} ${unit}`),'','Work performed',...invoice.tasks,'','Service notes',...invoice.notes].join('\n');
}
// Validate before accepting browser data so a corrupt record is never silently overwritten.
export function readSavedData(raw:string):{clients:Client[];jobs:Job[];products:Product[]} {
  const data=JSON.parse(raw);
  const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
  const strings=(v:unknown)=>Array.isArray(v)&&v.every(x=>typeof x==='string');
  const cents=(v:unknown)=>typeof v==='number'&&Number.isSafeInteger(v)&&v>=0;
  const line=(v:unknown)=>record(v)&&typeof v.productId==='string'&&typeof v.name==='string'&&typeof v.ingredient==='string'&&typeof v.strength==='string'&&['L','kg','g','mL'].includes(String(v.unit))&&typeof v.quantity==='number'&&Number.isFinite(v.quantity)&&v.quantity>0&&(v.priceCents===null||cents(v.priceCents))&&typeof v.confirmedAt==='string';
  const readings=(v:unknown)=>record(v)&&Object.values(v).every(x=>typeof x==='string');
  if (!record(data)||!Array.isArray(data.clients)||!data.clients.length||!Array.isArray(data.jobs)||!data.jobs.length) throw new Error('Invalid saved data.');
  if (!data.clients.every(c=>record(c)&&Number.isInteger(c.id)&&['name','phone','address','suburb','note'].every(k=>typeof c[k]==='string')&&record(c.pool)&&['volume','surface','system','chlorinator','filter','pump','fcMin','fcMax','phMin','phMax'].every(k=>typeof (c.pool as Record<string,unknown>)[k]==='string')&&(c.photo===undefined||typeof c.photo==='string')&&(c.serviceFeeCents===undefined||cents(c.serviceFeeCents)))) throw new Error('Invalid customer data.');
  const ids=new Set(data.clients.map(c=>(c as Client).id));
  if(ids.size!==data.clients.length) throw new Error('Duplicate customer IDs.');
  if (!data.jobs.every(j=>record(j)&&Number.isInteger(j.id)&&ids.has(j.clientId as number)&&typeof j.time==='string'&&typeof j.done==='boolean'&&strings(j.tasks)&&strings(j.notes)&&strings(j.activity)&&readings(j.readings)&&['checkedInAt','checkedOutAt'].every(k=>j[k]===undefined||(typeof j[k]==='string'&&Number.isFinite(Date.parse(j[k] as string))))&&['beforePhoto','afterPhoto','noteDraft'].every(k=>j[k]===undefined||typeof j[k]==='string')&&(j.serviceFeeCents===undefined||cents(j.serviceFeeCents))&&(j.chemicals===undefined||(Array.isArray(j.chemicals)&&j.chemicals.every(line)))&&(j.invoice===undefined||(record(j.invoice)&&typeof j.invoice.createdAt==='string'&&typeof j.invoice.customerName==='string'&&typeof j.invoice.address==='string'&&cents(j.invoice.serviceFeeCents)&&Array.isArray(j.invoice.chemicals)&&j.invoice.chemicals.every(line)&&readings(j.invoice.readings)&&strings(j.invoice.notes)&&strings(j.invoice.tasks))))) throw new Error('Invalid visit data.');
  if(new Set(data.jobs.map(j=>(j as Job).id)).size!==data.jobs.length) throw new Error('Duplicate visit IDs.');
  const products=data.products??[];
  if (!Array.isArray(products)||!products.every(p=>record(p)&&['id','name','ingredient','strength'].every(k=>typeof p[k]==='string')&&['L','kg','g','mL'].includes(String(p.unit))&&(p.priceCents===null||cents(p.priceCents)))) throw new Error('Invalid products.');
  return {clients:data.clients as Client[],jobs:data.jobs as Job[],products:products as Product[]};
}
