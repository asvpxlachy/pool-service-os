'use client';
import {useLayoutEffect,useRef,useState,type ReactNode,type PointerEvent} from 'react';
type Direction='left'|'right';
type Gesture={id:number;x:number;y:number;at:number;dx:number;locked:boolean;direction:Direction;target:string|null;width:number;settling:boolean};
const reduced=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export default function MainSwipe({screen,enabled,destination,onNavigate,renderPage}:{screen:string;enabled:boolean;destination:(direction:Direction)=>string|null;onNavigate:(screen:string)=>void;renderPage:(screen:string)=>ReactNode}){
 const viewport=useRef<HTMLDivElement>(null),current=useRef<HTMLDivElement>(null),incoming=useRef<HTMLDivElement>(null);
 const gesture=useRef<Gesture|null>(null),frame=useRef(0),suppress=useRef(0),animations=useRef<Animation[]>([]),committed=useRef(false),previousScreen=useRef(screen);
 const [preview,setPreview]=useState<{target:string|null;direction:Direction;top:number}|null>(null);
 function paint(){const g=gesture.current;if(!g)return;const offset=g.target?g.dx:g.dx*.12;if(current.current)current.current.style.transform=`translate3d(${offset}px,0,0)`;if(incoming.current)incoming.current.style.transform=`translate3d(${offset+(g.direction==='left'?g.width:-g.width)}px,0,0)`;}
 function reset(){cancelAnimationFrame(frame.current);animations.current.forEach(a=>a.cancel());animations.current=[];gesture.current=null;if(current.current)current.current.style.transform='';setPreview(null);}
 useLayoutEffect(()=>{reset();if(previousScreen.current!==screen&&!committed.current&&!reduced())current.current?.animate([{opacity:.8,transform:'translateX(10px)'},{opacity:1,transform:'translateX(0)'}],{duration:160,easing:'ease-out'});previousScreen.current=screen;committed.current=false;return()=>{cancelAnimationFrame(frame.current);animations.current.forEach(a=>a.cancel());gesture.current=null;};},[screen,enabled]);
 useLayoutEffect(()=>{if(preview)paint();},[preview]);
 async function settle(complete:boolean){const g=gesture.current;if(!g||g.settling)return;g.settling=true;cancelAnimationFrame(frame.current);paint();const sign=g.direction==='left'?-1:1;const end=complete&&g.target?sign*g.width:0;const duration=reduced()?0:Math.min(280,Math.max(150,Math.abs(end-g.dx)*.55));const options:KeyframeAnimationOptions={duration,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'};const list:Animation[]=[];
 if(current.current)list.push(current.current.animate([{transform:current.current.style.transform},{transform:`translate3d(${end}px,0,0)`}],options));
 if(incoming.current)list.push(incoming.current.animate([{transform:incoming.current.style.transform},{transform:`translate3d(${end-sign*g.width}px,0,0)`}],options));
 animations.current=list;try{await Promise.all(list.map(a=>a.finished));}catch{return;}if(gesture.current!==g)return;
 if(complete&&g.target){committed.current=true;onNavigate(g.target);}reset();
 }
 function start(event:PointerEvent<HTMLDivElement>){if(gesture.current?.settling)return;gesture.current=null;if(!enabled||event.pointerType!=='touch'||!event.isPrimary)return;if((event.target as Element).closest('input,textarea,select,dialog,[contenteditable="true"]'))return;gesture.current={id:event.pointerId,x:event.clientX,y:event.clientY,at:Date.now(),dx:0,locked:false,direction:'left',target:null,width:viewport.current?.clientWidth||window.innerWidth,settling:false};}
 function move(event:PointerEvent<HTMLDivElement>){const g=gesture.current;if(!g||g.id!==event.pointerId||g.settling)return;const dx=event.clientX-g.x,dy=event.clientY-g.y;
 if(!g.locked){if(Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){gesture.current=null;return;}if(Math.abs(dx)<8)return;g.locked=true;g.direction=dx<0?'left':'right';g.target=destination(g.direction);setPreview({target:g.target,direction:g.direction,top:Math.max(0,-(viewport.current?.getBoundingClientRect().top||0))});event.currentTarget.setPointerCapture(event.pointerId);}
 g.dx=Math.sign(dx)*Math.min(Math.abs(dx),g.width);cancelAnimationFrame(frame.current);frame.current=requestAnimationFrame(paint);
 }
 function finish(event:PointerEvent<HTMLDivElement>){const g=gesture.current;if(!g||g.id!==event.pointerId)return;if(!g.locked){gesture.current=null;return;}suppress.current=Date.now()+500;const sameDirection=(g.direction==='left'&&g.dx<0)||(g.direction==='right'&&g.dx>0);const velocity=Math.abs(g.dx)/Math.max(1,Date.now()-g.at);void settle(!!g.target&&sameDirection&&(Math.abs(g.dx)>g.width*.25||(Math.abs(g.dx)>35&&velocity>.55)));}
 return <div ref={viewport} className={`motion-viewport${preview?' motion-active':''}`} style={{touchAction:enabled?'pan-y':'auto'}} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={()=>{void settle(false);}} onClickCapture={event=>{if(Date.now()<suppress.current){event.preventDefault();event.stopPropagation();}}}>
 <div ref={current} className="motion-current">{renderPage(screen)}</div>
 {preview?.target&&<div ref={incoming} className="motion-incoming" inert aria-hidden="true" style={{top:preview.top,transform:`translate3d(${preview.direction==='left'?1:-1}00%,0,0)`}}>{renderPage(preview.target)}</div>}
 </div>;
}
