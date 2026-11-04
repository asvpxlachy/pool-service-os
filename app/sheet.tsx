'use client';
import {useEffect,useId,useRef,type ReactNode} from 'react';
import {X} from 'lucide-react';

export default function Sheet({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null);
  const id=useId();
  useEffect(()=>{
    const dialog=ref.current!;
    const previous=document.activeElement as HTMLElement|null;
    const overflow=document.body.style.overflow;
    dialog.showModal();document.body.style.overflow='hidden';
    return ()=>{dialog.close();document.body.style.overflow=overflow;previous?.focus();};
  },[]);
  return <dialog ref={ref} className="visit-sheet" aria-labelledby={id} onCancel={e=>{e.preventDefault();onClose();}}>
    <div className="sheet-heading"><h2 id={id}>{title}</h2><button type="button" className="icon-button" aria-label={`Close ${title}`} onClick={onClose}><X size={20}/></button></div>
    <div className="sheet-content">{children}</div>
  </dialog>;
}
