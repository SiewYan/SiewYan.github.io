import {TYPES,pt,eta,phi,trajectory,longitudinal} from './physics.js';
export function createPlots(state,onSelect){
 const xy=document.querySelector('#xy'),rz=document.querySelector('#rz');let current=null,targets=new Map();

 for(const canvas of [xy,rz])canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,dist=12;for(const t of targets.get(canvas)||[]){const d=Math.hypot(t.x-x,t.y-y);if(d<dist){dist=d;best=t.id;}}onSelect(best);});
 function draw(canvas,map,progress){
  const rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height,dpr=Math.min(devicePixelRatio,2);if(canvas.width!==Math.floor(w*dpr)||canvas.height!==Math.floor(h*dpr)){canvas.width=w*dpr;canvas.height=h*dpr;}
  const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);c.font='8px "JetBrains Mono",monospace';const points=[];targets.set(canvas,points);
  const mapMode=map==='map',xmax=mapMode?3.2:map==='xy'?8:12,ymax=mapMode?Math.PI:8;
  const sx=map==='xy'?Math.min((w-36)/16,(h-20)/16):(w-36)/(2*xmax),sy=map==='xy'?sx:map==='rz'?(h-25)/ymax:(h-22)/(2*ymax),cx=w/2,cy=map==='rz'?h-14:h/2;
  const tr=([x,y])=>[cx+x*sx,cy-y*sy];
  function path(ps,color,width=1,dashed=false){if(!ps.length)return;c.beginPath();ps.forEach((p,i)=>{const [x,y]=tr(p);i?c.lineTo(x,y):c.moveTo(x,y);});c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dashed?[3,3]:[]);c.stroke();c.setLineDash([]);}
  c.strokeStyle='#244356';c.lineWidth=.6;for(let n=-2;n<=2;n++){if(map!=='rz'||n>=0)path([[-xmax,n*ymax/2],[xmax,n*ymax/2]],'#173247');path([[n*xmax/2,map==='rz'?0:-ymax],[n*xmax/2,ymax]],'#173247');}
  if(map==='xy'){for(let [r,color] of [[1.1,'#4e8fa066'],[1.55,'#4c978c66'],[2.85,'#a18a5c66'],[3.4,'#728bac55'],[4.3,'#809eb966'],[5.2,'#809eb944'],[6.2,'#809eb944'],[7.2,'#809eb944']]){c.beginPath();c.arc(cx,cy,r*sx,0,Math.PI*2);c.strokeStyle=color;c.stroke();}}
  if(map==='rz')for(let [r,z] of [[1.1,2.7],[1.5,3.2],[2.85,5.2],[3.4,6.25],[7.2,6.3]])path([[-z,0],[z,0],[z,r],[-z,r],[-z,0]],'#42637866');
  c.fillStyle='#627f98';c.fillText(mapMode?'η':map==='xy'?'x':'z',w-15,cy-5);c.fillText(mapMode?'φ':map==='xy'?'y':'r ≥ 0',cx+5,10);
  if(mapMode){c.fillText('−3.2',8,h-5);c.fillText('+3.2',w-32,h-5);c.fillText('+π',3,10);c.fillText('−π',3,h-5);}
  else{c.fillText(String(-xmax),8,h-5);c.fillText('+'+xmax,w-27,h-5);}
  if(!current)return;
  for(const p of current.particles){if(p.type==='neutrino'||!state.filters[p.type]||(p.q&&pt(p.rec)<state.pt))continue;
   const color=TYPES[p.type].color,selected=state.selected===p.id;c.globalAlpha=state.selected&&!selected?.25:1;
   const proj=v=>map==='xy'?[v[0],v[1]]:longitudinal(v);
   if(mapMode){if(progress<.25)continue;const deps=p.response.deposits.filter(d=>state.systems[d.system]);if(!deps.length)continue;const [x,y]=tr([eta(p.rec),phi(p.rec)]);if(x<10||x>w-10)continue;let size=2+Math.min(8,Math.sqrt(deps.reduce((s,d)=>s+d.E,0))*.7);c.fillStyle=color;c.fillRect(x-size/2,y-size/2,size,size);if(selected){c.strokeStyle='#fff';c.strokeRect(x-size/2-2,y-size/2-2,size+4,size+4);}points.push({x,y,id:p.id});}
   else{
    if((p.q||p.type==='photon')&&progress>.35){const n=Math.floor(p.response.points.length*Math.min(1,(progress-.35)/.4));const ps=p.response.trackPoints.slice(0,n).map(proj);path(ps,color,selected?2:1,p.type==='photon');if(p.type==='muon'&&p.response.extrapolation.length){const count=Math.max(0,n-p.response.trackPoints.length+1);const outer=p.response.extrapolation.slice(0,count).map(proj);path(outer,color,selected?2:1,true);ps.push(...outer);}for(let i=0;i<ps.length;i+=3){const [x,y]=tr(ps[i]);points.push({x,y,id:p.id});}}
    if(progress>.25)for(const d of [...p.response.deposits,...p.response.hits.filter(h=>h.system==='muon')]){if(!state.systems[d.system])continue;const [x,y]=tr(proj(d.position));c.fillStyle=color;c.fillRect(x-1.5,y-1.5,3,3);points.push({x,y,id:p.id});}
    if(state.truth)path(trajectory(p,true).map(proj),'#c0ccda55',.6,true);
   }
  }
  c.globalAlpha=1;
  if(state.filters.met&&map==='xy'&&progress>.75&&current.met.pt>.3){const m=current.met,len=Math.min(5,.8+m.pt*.07),end=[m.px/m.pt*len,m.py/m.pt*len];path([[0,0],end],'#e570f7',1.5,true);let [x,y]=tr(end);c.fillStyle='#e570f7';c.fillText('pTmiss',x+3,y-3);}
 }
 return {load:e=>current=e,draw:progress=>{draw(xy,'xy',progress);draw(rz,state.plot==='map'?'map':'rz',progress);}};
}
