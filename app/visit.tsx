'use client';
import {useEffect,useRef,useState,type FormEvent} from 'react';
import {Camera,ChevronRight,Clock,FlaskConical,MapPin,MessageSquare,Minus,Phone,Plus,Receipt,Trash2} from 'lucide-react';
import Sheet from './sheet';
import {billTotal,checkout,draftText,money,parsePrice,serviceTasks,upsertChemical,waterFields,type ChemicalLine,type Client,type Job,type Product} from './visit-model';

type Props={job:Job;client:Client;products:Product[];onProducts:(fn:(p:Product[])=>Product[])=>void;onChange:(fn:(j:Job)=>Job)=>void;onEdit:()=>void;onNext:()=>void;hasNext:boolean;canWrite:boolean};
type Overlay='water'|'chemicals'|'invoice'|'omw'|null;

function VisitTimer({start,end}:{start?:string;end?:string}) {
  const [now,setNow]=useState(()=>Date.now());
  useEffect(()=>{if(!start||end)return;const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id);},[start,end]);
  const seconds=start?Math.max(0,Math.floor(((end?Date.parse(end):now)-Date.parse(start))/1000)):0;
  return <span className="visit-timer"><Clock size={15}/>{start?`${Math.floor(seconds/3600).toString().padStart(2,'0')}:${Math.floor(seconds/60)%60<10?'0':''}${Math.floor(seconds/60)%60}:${(seconds%60).toString().padStart(2,'0')}`:'Not checked in'}</span>;
}

async function compressPhoto(file:File):Promise<string> {
  if(!file.type.startsWith('image/'))throw new Error('Choose an image.');
  if(file.size>25_000_000)throw new Error('Choose a photo under 25 MB.');
  const url=URL.createObjectURL(file);
  try {
    const img=new Image();img.src=url;await img.decode();
    const ratio=Math.min(1,1280/Math.max(img.naturalWidth,img.naturalHeight));
    const canvas=document.createElement('canvas');canvas.width=Math.round(img.naturalWidth*ratio);canvas.height=Math.round(img.naturalHeight*ratio);
    const context=canvas.getContext('2d');if(!context)throw new Error('Photo processing unavailable.');
    context.drawImage(img,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/jpeg',0.75);
  } finally {URL.revokeObjectURL(url);}
}

function Photo({label,value,disabled,onChange}:{label:string;value?:string;disabled:boolean;onChange:(value:string)=>void}) {
  const [busy,setBusy]=useState(false),[error,setError]=useState('');
  const alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  return <div className="visit-photo">
    {value&&<img src={value} alt={label}/>}
    <label className={`photo-picker ${disabled||busy?'unavailable':''}`}><Camera size={18}/>{busy?'Processing…':value?`Replace ${label.toLowerCase()}`:label}
      <input type="file" accept="image/*" capture="environment" disabled={disabled||busy} onChange={async e=>{
        const file=e.target.files?.[0];e.target.value='';if(!file)return;
        setBusy(true);setError('');
        try{const result=await compressPhoto(file);if(alive.current)onChange(result);}catch{if(alive.current)setError('Could not read photo. Try a JPEG or a smaller image.');}finally{if(alive.current)setBusy(false);}
      }}/>
    </label>{error&&<p className="field-error" role="alert">{error}</p>}
  </div>;
}

function ProductForm({product,onSave}:{product?:Product;onSave:(p:Product)=>void}) {
  const [error,setError]=useState('');
  function save(e:FormEvent<HTMLFormElement>) {
    e.preventDefault();const form=new FormData(e.currentTarget);
    try {
      const name=String(form.get('name')).trim();if(!name)throw new Error('Enter a product name.');
      onSave({id:product?.id??crypto.randomUUID(),name,ingredient:String(form.get('ingredient')).trim(),strength:String(form.get('strength')).trim(),unit:form.get('unit') as Product['unit'],priceCents:parsePrice(String(form.get('price')))});
    }catch(err){setError((err as Error).message);}
  }
  return <form className="product-form" onSubmit={save}>
    <label className="fieldgroup"><span className="fieldlabel">Product name</span><input className="field" name="name" required maxLength={100} defaultValue={product?.name}/></label>
    <div className="grid2"><label className="fieldgroup"><span className="fieldlabel">Active ingredient</span><input className="field" name="ingredient" placeholder="From product label" defaultValue={product?.ingredient}/></label>
    <label className="fieldgroup"><span className="fieldlabel">Strength / formulation</span><input className="field" name="strength" placeholder="Include concentration units" defaultValue={product?.strength}/></label></div>
    <div className="grid2"><label className="fieldgroup"><span className="fieldlabel">Quantity & billing unit</span><select className="field" name="unit" defaultValue={product?.unit??'L'}>{['L','kg','g','mL'].map(unit=><option key={unit}>{unit}</option>)}</select></label>
    <label className="fieldgroup"><span className="fieldlabel">Price per unit · GST included</span><input className="field" name="price" inputMode="decimal" placeholder="Add later" defaultValue={product?.priceCents===null||product?.priceCents===undefined?'':(product.priceCents/100).toFixed(2)}/></label></div>
    <p className="muted small">Use the same unit for the amount added and unit price. Product details alone do not enable dose estimates.</p>
    {error&&<p className="field-error" role="alert">{error}</p>}<button className="button primary full" type="submit">Save product</button>
  </form>;
}

function Chemicals({products,lines,onProducts,onConfirm,onRemove}:{products:Product[];lines:ChemicalLine[];onProducts:Props['onProducts'];onConfirm:(line:ChemicalLine)=>void;onRemove:(id:string)=>void}) {
  const [selected,setSelected]=useState(products[0]?.id??'');
  const [quantity,setQuantity]=useState(()=>String(lines.find(l=>l.productId===products[0]?.id)?.quantity??''));
  const [editing,setEditing]=useState<'new'|'edit'|null>(products.length?null:'new');
  const [error,setError]=useState('');
  const product=products.find(p=>p.id===selected);
  const existing=lines.find(l=>l.productId===selected);
  const amount=Number(quantity);
  const step=product?.unit==='g'||product?.unit==='mL'?1:0.1;
  function select(id:string){setSelected(id);setQuantity(String(lines.find(l=>l.productId===id)?.quantity??''));setEditing(null);setError('');}
  return <>
    <div className="estimate-status"><FlaskConical size={18}/><div><b>Dose estimates not available yet</b><p>Record the amount you decide to add. Validated calculations and product specifications are required before estimates can be enabled.</p></div></div>
    {products.length>0&&<label className="fieldgroup"><span className="fieldlabel">Chemical product</span><select className="field" value={selected} onChange={e=>select(e.target.value)}>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label>}
    <div className="flexgap"><button className="button small" onClick={()=>setEditing(editing==='new'?null:'new')}><Plus size={15}/> New product</button>{product&&<button className="button small" onClick={()=>setEditing(editing==='edit'?null:'edit')}>Edit product / price</button>}</div>
    {editing&&<ProductForm key={editing==='new'?'new':product?.id} product={editing==='edit'?product:undefined} onSave={p=>{const changedUnit=product?.id===p.id&&product.unit!==p.unit;onProducts(old=>[...old.filter(v=>v.id!==p.id),p]);select(p.id);if(changedUnit)setQuantity('');}}/>}
    {product&&!editing&&<div className="dose-card">
      <b>{product.name}</b><p className="muted small">{product.ingredient||'Ingredient not specified'} · {product.strength||'Strength not specified'}</p>
      <label className="fieldlabel" htmlFor="actual-amount">Amount actually added ({product.unit})</label>
      <div className="quantity-control"><button className="button" aria-label="Decrease amount" onClick={()=>setQuantity(String(Math.max(0,Math.round(((Number(quantity)||0)-step)*1000)/1000)))}><Minus size={18}/></button><input id="actual-amount" className="field" type="number" min="0" max="100000" step="any" inputMode="decimal" value={quantity} onChange={e=>setQuantity(e.target.value)}/><button className="button" aria-label="Increase amount" onClick={()=>setQuantity(String(Math.round(((Number(quantity)||0)+step)*1000)/1000))}><Plus size={18}/></button></div>
      <div className="line row"><span>Charge · GST included</span><b>{product.priceCents===null?'Price required':Number.isFinite(amount)&&amount>0?money(Math.round(amount*product.priceCents)):money(0)}</b></div>
      {existing&&<p className="muted small">This replaces the existing quantity for this product; it does not add a second charge.</p>}
      {error&&<p className="field-error" role="alert">{error}</p>}
      <button className="button primary full" onClick={()=>{try{const line:ChemicalLine={productId:product.id,name:product.name,ingredient:product.ingredient,strength:product.strength,unit:product.unit,quantity:amount,priceCents:product.priceCents,confirmedAt:new Date().toISOString()};upsertChemical(lines,line);onConfirm(line);}catch(err){setError((err as Error).message);}}}>{existing?'Update amount & bill':'Confirm added & add to bill'}</button>
    </div>}
    {lines.length>0&&<><h3>Recorded chemicals</h3>{lines.map(line=><div className="line row" key={line.productId}><button className="text-button" onClick={()=>select(line.productId)}>{line.name}<span className="muted small">{line.quantity} {line.unit} · {line.priceCents===null?'Price required':money(Math.round(line.quantity*line.priceCents))}</span></button><button className="icon-button" aria-label={`Remove ${line.name}`} onClick={()=>onRemove(line.productId)}><Trash2 size={17}/></button></div>)}</>}
  </>;
}

function FeeEditor({value,onSave}:{value:number;onSave:(cents:number)=>void}) {
  const [text,setText]=useState((value/100).toFixed(2)),[error,setError]=useState('');
  return <form onSubmit={e=>{e.preventDefault();try{const cents=parsePrice(text);if(cents===null)throw new Error('Enter a service fee.');onSave(cents);setError('');}catch(err){setError((err as Error).message);}}}>
    <label className="fieldlabel" htmlFor="service-fee">Service fee · GST included · this visit</label><div className="flexgap"><input className="field" style={{flex:1}} id="service-fee" inputMode="decimal" value={text} onChange={e=>setText(e.target.value)}/><button className="button" type="submit">Apply</button></div>{error&&<p className="field-error" role="alert">{error}</p>}
  </form>;
}

export default function Visit({job,client,products,onProducts,onChange,onEdit,onNext,hasNext,canWrite}:Props) {
  const [overlay,setOverlay]=useState<Overlay>(null),[message,setMessage]=useState(''),[composerOpened,setComposerOpened]=useState(false);
  const mapUrl=`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`;
  const phone=client.phone.replace(/[^\d+]/g,'');
  const lines=job.chemicals??[];
  const fee=job.serviceFeeCents??client.serviceFeeCents??12000;
  const total=billTotal(fee,lines);
  const readCount=waterFields.filter(([key])=>job.readings[key]?.trim()).length;
  const frozen=job.done||!canWrite;
  function updateBill(change:(j:Job)=>Job){onChange(j=>{const next=change(j);return {...next,invoice:next.invoice?{...next.invoice,serviceFeeCents:next.serviceFeeCents??client.serviceFeeCents??12000,chemicals:(next.chemicals??[]).map(line=>({...line}))}:undefined};});}
  function finish(){onChange(j=>checkout(j,client,new Date().toISOString()));setOverlay('invoice');}
  function download(){const blob=new Blob([draftText(job,client)],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`poolOS-visit-${job.id}-draft.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setMessage('Draft downloaded. Nothing has been sent to the customer.');}
  return <div className="visit-flow">
    <div className="card visit-client"><button className="client-summary" onClick={onEdit}><span><b>{client.name}</b><span className="muted small">{client.address}</span><span className="muted tiny">{Number(client.pool.volume).toLocaleString()} L · {client.pool.surface}</span></span><ChevronRight size={18}/></button>
      {client.note&&<p className="access-note">{client.note}</p>}
      <div className="visit-actions"><a className="button" href={`tel:${phone}`} aria-label={`Call ${client.name}`}><Phone size={16}/>Call</a><a className="button" href={mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16}/>Navigate</a><button className="button" onClick={()=>setOverlay('omw')}><MessageSquare size={16}/>Nav + OMW</button></div>
    </div>
    <div className="visit-status"><span className={`status-pill ${job.done?'complete':''}`}>{job.done?'Completed':job.checkedInAt?'On site':'Ready to start'}</span><VisitTimer start={job.checkedInAt} end={job.checkedOutAt}/></div>
    {message&&<div className="notice" role="status">{message}</div>}
    <section className="visit-section"><div className="section-title"><span className="step-number">1</span><h2>Before photo</h2><span className="muted tiny">Optional</span></div><Photo label="Before photo" value={job.beforePhoto} disabled={frozen} onChange={value=>onChange(j=>({...j,beforePhoto:value}))}/></section>
    <section className="visit-section"><button className="section-link" onClick={()=>setOverlay('water')}><span className="step-number">2</span><span><b>Water test & chemicals</b><span className="muted small">{readCount?`${readCount}/6 readings`:'Enter water readings'} · {lines.length?`${lines.length} chemical${lines.length===1?'':'s'}`:'No chemicals recorded'}</span></span><ChevronRight size={18}/></button>
      {readCount>0&&<div className="reading-strip">{waterFields.filter(([key])=>job.readings[key]?.trim()).map(([key,label,unit])=><span key={key}><span className="muted tiny">{label}</span><b>{job.readings[key]} <small>{unit}</small></b></span>)}</div>}
      <button className="text-button inline" disabled={!canWrite} onClick={()=>setOverlay('chemicals')}><Plus size={15}/> Add / adjust chemicals</button>
    </section>
    <section className="visit-section"><div className="section-title"><span className="step-number">3</span><h2>Equipment & service</h2><span className="muted tiny">{job.tasks.length}/{serviceTasks.length}</span></div>
      {serviceTasks.map(task=><label className="checkrow" key={task}><input type="checkbox" disabled={frozen} checked={job.tasks.includes(task)} onChange={e=>{const checked=e.target.checked;onChange(j=>({...j,tasks:checked?[...j.tasks,task]:j.tasks.filter(t=>t!==task),activity:[...j.activity,`${new Date().toISOString()}: ${checked?'Completed':'Unchecked'}: ${task}`]}));}}/>{task}</label>)}
      <label className="fieldgroup visit-notes"><span className="fieldlabel">Service notes / equipment issues</span><textarea className="field" rows={2} placeholder="What needs attention?" disabled={frozen} value={job.noteDraft??''} onChange={e=>{const value=e.target.value;onChange(j=>({...j,noteDraft:value}));}}/></label>
      {job.notes.length>0&&<details><summary>Saved notes ({job.notes.length})</summary>{job.notes.map((note,i)=><p key={i} className="small preserve-lines">{note}</p>)}</details>}
    </section>
    <section className="visit-section"><div className="section-title"><span className="step-number">4</span><h2>Finish photo</h2><span className="muted tiny">Optional</span></div><Photo label="Finish photo" value={job.afterPhoto} disabled={frozen} onChange={value=>onChange(j=>({...j,afterPhoto:value}))}/></section>
    <section className="visit-section"><button className="section-link" onClick={()=>setOverlay('invoice')}><span className="step-number">5</span><span><b>Invoice draft</b><span className="muted small">{money(fee)} service + chemicals · GST included</span></span><Receipt size={19}/></button><div className="bill-summary"><span>{total.missingPrices?'Priced subtotal':'Total'}</span><b>{money(total.knownCents)}</b></div>{total.missingPrices>0&&<p className="field-error">{total.missingPrices} chemical price{total.missingPrices===1?'':'s'} required — total incomplete</p>}</section>
    <details className="visit-section"><summary>Pool details & visit history</summary><dl className="pool-details">{[['System',client.pool.system],['Chlorinator',client.pool.chlorinator],['Filter',client.pool.filter],['Pump',client.pool.pump]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><button className="button small" disabled={!canWrite} onClick={onEdit}>Edit client & pool</button>{job.activity.map((event,i)=><p className="muted tiny" key={i}>{event}</p>)}</details>
    <div className="visit-footer">{job.done?<><button className="button" onClick={()=>setOverlay('invoice')}>Review draft</button><button className="button primary" onClick={onNext}>{hasNext?'Next job':'Back to today'}<ChevronRight size={17}/></button></>:<button className="button primary full" disabled={!canWrite} onClick={()=>{if(job.checkedInAt)finish();else onChange(j=>j.checkedInAt?j:{...j,checkedInAt:new Date().toISOString(),serviceFeeCents:j.serviceFeeCents??client.serviceFeeCents??12000,activity:[...j.activity,`${new Date().toISOString()}: Checked in`]});}}>{job.checkedInAt?'Check out & review invoice':'Check in · start timer'}<ChevronRight size={18}/></button>}</div>

    {overlay==='water'&&<Sheet title="Water test" onClose={()=>setOverlay(null)}><p className="muted small">{Number(client.pool.volume).toLocaleString()} L · {client.pool.surface} · {client.pool.system}<br/>Targets: chlorine {client.pool.fcMin}–{client.pool.fcMax} ppm · pH {client.pool.phMin}–{client.pool.phMax}</p><div className="grid2">{waterFields.map(([key,label,unit])=><label className="fieldgroup" key={key}><span className="fieldlabel">{label}{unit?` (${unit})`:''}</span><input className="field" type="number" inputMode="decimal" min="0" max={key==='ph'?14:undefined} step="any" disabled={frozen} value={job.readings[key]??''} onChange={e=>{const value=e.target.value;if(value!==''&&(!Number.isFinite(Number(value))||Number(value)<0||(key==='ph'&&Number(value)>14)))return;onChange(j=>({...j,readings:{...j.readings,[key]:value}}));}}/></label>)}</div><div className="estimate-status"><FlaskConical size={18}/><div><b>Manual treatment entry</b><p>Dose estimates are not enabled in this release. Use your assessment and product instructions.</p></div></div><p className="muted tiny">When enabled: estimated doses are for qualified technicians using professional judgement. Verify volume, product strength and results; follow product instructions and retest as appropriate.</p><button className="button primary full" disabled={!canWrite} onClick={()=>setOverlay('chemicals')}>Continue to chemicals<ChevronRight size={17}/></button><button className="button full" style={{marginTop:8}} onClick={()=>setOverlay(null)}>Done</button></Sheet>}
    {overlay==='chemicals'&&<Sheet title="Chemicals & billing" onClose={()=>setOverlay(null)}><fieldset disabled={!canWrite}><Chemicals products={products} lines={lines} onProducts={onProducts} onConfirm={line=>{updateBill(j=>({...j,chemicals:upsertChemical(j.chemicals??[],line),activity:[...j.activity,`${new Date().toISOString()}: Recorded ${line.quantity} ${line.unit} ${line.name}`]}));setOverlay(null);setMessage(`${line.name} amount and bill updated.`);}} onRemove={id=>updateBill(j=>({...j,chemicals:(j.chemicals??[]).filter(line=>line.productId!==id)}))}/></fieldset></Sheet>}
    {overlay==='invoice'&&<Sheet title="Invoice draft" onClose={()=>setOverlay(null)}><div className="draft-banner">Draft only · Not sent · Xero not connected</div><p><b>{job.invoice?.customerName??client.name}</b><br/><span className="muted small">{job.invoice?.address??client.address}</span></p><fieldset disabled={!canWrite}><FeeEditor value={fee} onSave={value=>updateBill(j=>({...j,serviceFeeCents:value}))}/></fieldset><div className="line row"><span>Pool service</span><b>{money(fee)}</b></div>{lines.map(line=><div className="line row" key={line.productId}><span>{line.name}<span className="muted small block">{line.quantity} {line.unit}</span></span><b>{line.priceCents===null?'Price required':money(Math.round(line.quantity*line.priceCents))}</b></div>)}<button className="text-button inline" disabled={!canWrite} onClick={()=>setOverlay('chemicals')}>Edit chemicals / prices<ChevronRight size={15}/></button><div className="bill-summary"><span>{total.missingPrices?'Priced subtotal':'Total · GST included'}</span><b>{money(total.knownCents)}</b></div>{total.missingPrices>0&&<p className="field-error">Add missing chemical prices before using this draft for billing.</p>}<details><summary>Service report · all water readings</summary>{waterFields.map(([key,label,unit])=><div className="line small row" key={key}><span>{label}</span><b>{job.readings[key]||'Not recorded'} {unit}</b></div>)}{job.notes.map((note,i)=><p key={i}>{note}</p>)}</details><p className="muted small">Download a draft for review. Customer delivery and Xero invoice creation are not connected yet.</p><button className="button full" onClick={download}>Download draft</button>{!job.done&&<button className="button primary full" style={{marginTop:8}} disabled={!job.checkedInAt||!canWrite} onClick={finish}>Check out & create draft</button>}{job.done&&<button className="button primary full" style={{marginTop:8}} onClick={onNext}>{hasNext?'Next job':'Back to today'}</button>}</Sheet>}
    {overlay==='omw'&&<Sheet title="Navigate + on my way" onClose={()=>setOverlay(null)}><p>Hi {client.name.split(' ')[0]}, I’m on my way to service your pool.</p><p className="muted small">Automatic SMS is not connected yet. Send the prefilled text in Messages, then return here to navigate.</p><a className="button primary full" href={`sms:${phone}&body=${encodeURIComponent(`Hi ${client.name.split(' ')[0]}, I’m on my way to service your pool.`)}`} onClick={()=>setComposerOpened(true)}><MessageSquare size={17}/>Open text message</a>{composerOpened&&<p className="muted small" role="status">Message composer opened. Delivery is not confirmed by poolOS.</p>}<a className="button full" style={{marginTop:8}} href={mapUrl} target="_blank" rel="noopener noreferrer"><MapPin size={17}/>Navigate to job</a></Sheet>}
  </div>;
}
