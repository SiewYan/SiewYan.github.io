import {configID} from './generator.js';
export const LIMIT=300000;
export function appendUnique(events,incoming,config){const id=configID(config),ids=new Set(events.map(e=>e.id));for(const e of incoming){if(!e.id.startsWith(id+'/'))throw Error('Incompatible configuration');if(!ids.has(e.id)){events.push(e);ids.add(e.id);}}return events;}
export function persist(config,n,selection,field,history){localStorage.setItem('muon-g2-v1',JSON.stringify({config,n,selection,field,history:history.slice(-12)}));}
export function restore(){try{return JSON.parse(localStorage.getItem('muon-g2-v1'));}catch{return null;}}
export function download(name,data,type='application/json'){const blob=new Blob([typeof data==='string'?data:JSON.stringify(data,null,2)],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
