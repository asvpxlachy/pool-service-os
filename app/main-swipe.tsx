'use client';
import {useRef,type ReactNode} from 'react';

export default function MainSwipe({enabled,onSwipe,children}:{enabled:boolean;onSwipe:(direction:'left'|'right')=>void;children:ReactNode}){
  const start=useRef<{x:number;y:number;at:number;id:number}|null>(null);
  const suppressClick=useRef(0);
  return <div className="main-swipe" style={{touchAction:enabled?'pan-y':'auto'}} onPointerDown={event=>{
    start.current=null;
    if(!enabled||event.pointerType!=='touch'||!event.isPrimary)return;
    if((event.target as Element).closest('input,textarea,select,a,button:not(.job),label,summary,dialog,[contenteditable="true"]'))return;
    start.current={x:event.clientX,y:event.clientY,at:Date.now(),id:event.pointerId};
  }} onPointerMove={event=>{if(start.current&&Math.abs(event.clientY-start.current.y)>28)start.current=null;}} onPointerCancel={()=>{start.current=null;}} onPointerUp={event=>{
    const previous=start.current;start.current=null;
    if(!enabled||!previous||previous.id!==event.pointerId)return;
    const dx=event.clientX-previous.x,dy=event.clientY-previous.y;
    if(Math.abs(dx)>=70&&Math.abs(dx)>2*Math.abs(dy)&&Date.now()-previous.at<800){suppressClick.current=Date.now()+500;onSwipe(dx<0?'left':'right');}
  }} onClickCapture={event=>{if(Date.now()<suppressClick.current){event.preventDefault();event.stopPropagation();}}}>{children}</div>;
}
