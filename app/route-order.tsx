'use client';
import {useEffect,useRef,useState,type PointerEvent} from 'react';
import type {Client,Job} from './visit-model';

type Drag={id:number;pointerId:number;x:number;y:number;active:boolean;over:number;timer:ReturnType<typeof setTimeout>|null};
export default function RouteOrder({jobs,clients,onMove}:{jobs:Job[];clients:Client[];onMove:(id:number,target:number)=>void}){
  const drag=useRef<Drag|null>(null);
  const [active,setActive]=useState<number|null>(null),[over,setOver]=useState<number|null>(null),[announcement,setAnnouncement]=useState('');
  useEffect(()=>()=>{if(drag.current?.timer)clearTimeout(drag.current.timer);},[]);
  function clear(){if(drag.current?.timer)clearTimeout(drag.current.timer);drag.current=null;setActive(null);setOver(null);}
  function start(event:PointerEvent<HTMLButtonElement>,id:number){
    if(!event.isPrimary||event.button!==0)return;
    clear();
    const current:Drag={id,pointerId:event.pointerId,x:event.clientX,y:event.clientY,active:false,over:id,timer:null};
    drag.current=current;
    event.currentTarget.setPointerCapture(event.pointerId);
    current.timer=setTimeout(()=>{if(drag.current===current){current.active=true;setActive(id);setOver(id);setAnnouncement('Move over another job, then release to place it.');}},400);
  }
  function move(event:PointerEvent<HTMLButtonElement>){
    const current=drag.current;if(!current||current.pointerId!==event.pointerId)return;
    if(!current.active){if(Math.hypot(event.clientX-current.x,event.clientY-current.y)>12)clear();return;}
    event.preventDefault();
    const row=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-route-id]');
    if(row){current.over=Number(row.dataset.routeId);setOver(current.over);}
  }
  function finish(event:PointerEvent<HTMLButtonElement>){
    const current=drag.current;if(!current||current.pointerId!==event.pointerId)return;
    const id=current.id,target=current.over,shouldMove=current.active&&id!==target;
    clear();
    if(shouldMove){onMove(id,target);setAnnouncement('Route order updated.');}
  }
  return <><p id="route-drag-help" className="muted small">Hold the grip, drag over a job, then release. You can also use the arrow buttons.</p><span className="sr-only" role="status">{announcement}</span>{jobs.map((job,index)=>{
    const client=clients.find(c=>c.id===job.clientId)!;
    return <div key={job.id} data-route-id={job.id} className={`card row route-row${active===job.id?' route-lifted':''}${over===job.id&&active!==job.id?' route-drop':''}`}>
      <button type="button" className="icon-button route-grip" aria-label={`Hold to move ${client.name}`} aria-describedby="route-drag-help" aria-pressed={active===job.id} onContextMenu={event=>event.preventDefault()} onPointerDown={event=>start(event,job.id)} onPointerMove={move} onPointerUp={finish} onPointerCancel={clear} onLostPointerCapture={clear} onKeyDown={event=>{if(event.key==='ArrowUp'&&index>0){event.preventDefault();onMove(job.id,jobs[index-1].id);}if(event.key==='ArrowDown'&&index<jobs.length-1){event.preventDefault();onMove(job.id,jobs[index+1].id);}}}><span aria-hidden="true">⠿</span></button>
      <b>{index+1}</b><div className="jobmain"><b>{client.name}</b><div className="muted tiny">{client.suburb}</div></div>
      <div className="route-arrows"><button type="button" className="button small" aria-label={`Move ${client.name} up`} disabled={index===0} onClick={()=>onMove(job.id,jobs[index-1].id)}>↑</button><button type="button" className="button small" aria-label={`Move ${client.name} down`} disabled={index===jobs.length-1} onClick={()=>onMove(job.id,jobs[index+1].id)}>↓</button></div>
    </div>;
  })}</>;
}
