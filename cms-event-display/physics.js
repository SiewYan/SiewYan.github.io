import {GEOMETRY} from './geometry-config.js';
// Educational toy generator. All momenta in GeV/c, energies in GeV, lengths in metres.
export const B=3.8, K=0.2998;
export const TYPES={muon:{label:'Muon',color:'#ff5674',mass:.10566},electron:{label:'Electron',color:'#59e6a0',mass:.000511},photon:{label:'Photon',color:'#ffe07b',mass:0},hadron:{label:'Charged hadron',color:'#589dff',mass:.13957},neutral:{label:'Neutral hadron',color:'#a3c6ef',mass:.939},neutrino:{label:'Neutrino',color:'#df70f4',mass:0}};
export const CATEGORIES={zmm:'Z → μ⁺μ⁻',zee:'Z → e⁺e⁻',hgg:'ggF · H → γγ',h4l:'ggF · H → ZZ* → 4ℓ',vbf:'VBF · H → γγ + jj',ttbar:'tt̄ → μν + 4 jets',ttll:'tt̄ → eμ + νν + bb',jj:'Dijet',wmn:'W → μν'};
export function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
export const pt=p=>Math.hypot(p.px,p.py);
export const phi=p=>Math.atan2(p.py,p.px);
export const eta=p=>Math.asinh(p.pz/Math.max(pt(p),1e-9));
export function sum(ps){return ps.reduce((s,p)=>({px:s.px+p.px,py:s.py+p.py,pz:s.pz+p.pz,E:s.E+p.E}),{px:0,py:0,pz:0,E:0});}
export function mass(ps){const s=sum(ps);return Math.sqrt(Math.max(0,s.E*s.E-s.px*s.px-s.py*s.py-s.pz*s.pz));}
function vector(type,px,py,pz){return {px,py,pz,E:Math.hypot(px,py,pz,TYPES[type].mass)};}
// A rotation-free Lorentz boost from a parent's rest frame to the lab.
export function boost(v,parent){
 const m=mass([parent]),g=parent.E/m,b=[parent.px/parent.E,parent.py/parent.E,parent.pz/parent.E],b2=b.reduce((a,x)=>a+x*x,0);
 if(b2<1e-24)return {...v};
 const dot=b[0]*v.px+b[1]*v.py+b[2]*v.pz,f=(g-1)*dot/b2+g*v.E;
 return {px:v.px+f*b[0],py:v.py+f*b[1],pz:v.pz+f*b[2],E:g*(v.E+dot)};
}
export function twoBody(parent,m1,m2,rng){
 const M=mass([parent]);if(M<m1+m2)throw Error('Kinematically forbidden decay');
 const p=Math.sqrt(Math.max(0,(M*M-(m1+m2)**2)*(M*M-(m1-m2)**2)))/(2*M),c=2*rng()-1,a=2*Math.PI*rng(),t=Math.sqrt(1-c*c);
 const v={px:p*t*Math.cos(a),py:p*t*Math.sin(a),pz:p*c};
 return [boost({...v,E:Math.hypot(p,m1)},parent),boost({px:-v.px,py:-v.py,pz:-v.pz,E:Math.hypot(p,m2)},parent)];
}
export function generate(seed=314159,category='zmm',pileup=0){
 const rng=random(seed),particles=[],decays=[],groups={};let id=0;
 function add(type,q,v,vertex=[0,0,0],primary=true,jet=null){let scale=1+(rng()+rng()+rng()-1.5)*({muon:.008,electron:.014,photon:.014,hadron:.035,neutral:.07,neutrino:0}[type]);let rec=vector(type,v.px*scale,v.py*scale,v.pz*scale);particles.push({id:++id,type,q,truth:v,rec,vertex,primary,jet});return id;}
 const M=category==='hgg'?125.1:category==='wmn'?80.38:91.1876;
 const angle=.38+(rng()-.5)*.6,cosTheta=(rng()-.5)*.7,sinTheta=Math.sqrt(1-cosTheta*cosTheta),rapidity=(rng()-.5)*.45;
 const decay=(name,parent,m1,m2)=>{const daughters=twoBody(parent,m1,m2,rng);decays.push({name,parent,daughters});return daughters;};
 const parent=(m,pz=0,px=0,py=0)=>({px,py,pz,E:Math.hypot(m,px,py,pz)});
 const group=(key,ids)=>{groups[key]=ids;return ids;};
 // Two-hadron clusters are momentum-conserving jet proxies, not a shower or b-tag model.
 const jet=(v,j,charge=0)=>{const types=charge?['hadron','neutral']:['hadron','hadron'],qs=charge?[charge,0]:[1,-1];return decay('jet proxy',v,...types.map(t=>TYPES[t].mass)).map((x,i)=>add(types[i],qs[i],x,[0,0,0],true,j));};
 if(category==='ttbar'||category==='ttll'){
  const root=parent(400+350*rng(),(rng()-.5)*500),tops=decay('ttbar',root,172.5,172.5);
  for(let i=0;i<2;i++){
   const [b,w]=decay('t → bW',tops[i],5,80.38),bs=group('b'+i,jet(b,i));
   if(i===0&&category==='ttbar'){
    const ws=decay('W → jj',w,5,5),ids=[...jet(ws[0],2,1),...jet(ws[1],3)];group('wHad',ids);group('peak',[...bs,...ids]);
   }else{
    const type=i===0?'electron':'muon',vs=decay('W → ℓν',w,TYPES[type].mass,0);group('lepton'+i,[add(type,i===0?1:-1,vs[0])]);add('neutrino',0,vs[1]);
   }
  }
 }else if(category==='h4l'){
  const h=parent(125.1,(rng()-.5)*150),virtualMass=12+20*rng(),zs=decay('H → ZZ*',h,91.1876,virtualMass);
  for(let i=0;i<2;i++){const type=i?'muon':'electron',vs=decay(i?'Z* → μμ':'Z → ee',zs[i],TYPES[type].mass,TYPES[type].mass);group(i?'zOff':'zOn',vs.map((v,j)=>add(type,j?-1:1,v)));}
  group('peak',[...groups.zOn,...groups.zOff]);
 }else if(category==='vbf'){
  const a=rng()*2*Math.PI,p1=35+60*rng(),p2=35+60*rng(),a2=a+Math.PI+(rng()-.5)*.8;
  const j1=parent(5,p1*Math.sinh(2.2+rng()*1.5),p1*Math.cos(a),p1*Math.sin(a)),j2=parent(5,-p2*Math.sinh(2.2+rng()*1.5),p2*Math.cos(a2),p2*Math.sin(a2));
  const h=parent(125.1,(rng()-.5)*150,-j1.px-j2.px,-j1.py-j2.py);
  // This specifies a conserving H+jj topology; it is not a VBF matrix-element calculation.
  decays.push({name:'H + forward jets topology',parent:sum([h,j1,j2]),daughters:[h,j1,j2]});
  group('peak',decay('H → γγ',h,0,0).map(v=>add('photon',0,v)));jet(j1,0);jet(j2,1);
 }else if(category!=='jj'){
  const type=category==='zee'?'electron':category==='hgg'?'photon':'muon',other=category==='wmn'?'neutrino':type;
  const m1=TYPES[type].mass,m2=TYPES[other].mass,p=Math.sqrt((M*M-(m1+m2)**2)*(M*M-(m1-m2)**2))/(2*M);
  for(let i=0;i<2;i++){let t=i?other:type,s=i?-1:1;let v=vector(t,s*p*sinTheta*Math.cos(angle),s*p*sinTheta*Math.sin(angle),s*p*cosTheta);const e=v.E;v.E=e*Math.cosh(rapidity)+v.pz*Math.sinh(rapidity);v.pz=v.pz*Math.cosh(rapidity)+e*Math.sinh(rapidity);add(t,t==='photon'||t==='neutrino'?0:s,v);}
 }else{
  for(let j=0;j<12;j++){const a=angle+(rng()-.5)*.3,p=3+rng()*13,z=(rng()-.5)*p*.6,t=j%4===0?'neutral':j%5===0?'photon':'hadron';for(let s of [1,-1])add(t,t==='hadron'?s:0,vector(t,s*p*Math.cos(a),s*p*Math.sin(a),s*z),[0,0,0],true,s===1?0:1);}
 }
 // Balanced soft pairs avoid inventing missing momentum before response smearing.
 for(let j=0;j<5+pileup*4;j++){
  const vtx=j<5?[0,0,0]:[0,0,(rng()-.5)*.28],a=rng()*Math.PI*2,p=.18+rng()*2.8,z=(rng()-.5)*p*3;
  for(let s of [1,-1])add('hadron',s,vector('hadron',s*p*Math.cos(a),s*p*Math.sin(a),s*z),vtx,j<5);
 }
 const visible=particles.filter(p=>p.type!=='neutrino'),v=sum(visible.map(p=>p.rec));
 const jets=[...new Set(particles.filter(p=>p.jet!==null).map(p=>p.jet))].sort((a,b)=>a-b).map(j=>sum(particles.filter(p=>p.jet===j).map(p=>p.rec))).filter(p=>p.E>0);
 if(!groups.peak&&['zmm','zee','hgg'].includes(category))groups.peak=[1,2];
 const grouped=(key,truth=false)=>particles.filter(p=>groups[key]?.includes(p.id)).map(p=>p[truth?'truth':'rec']);
 const values={met:Math.hypot(v.px,v.py),ht:jets.reduce((a,j)=>a+pt(j),0),leadPt:Math.max(...visible.map(p=>pt(p.rec))),nJets:jets.length};
 if(groups.peak)values.peak=mass(grouped('peak'));
 if(groups.wHad)values.wMass=mass(grouped('wHad'));
 if(groups.zOn){values.zMass=mass(grouped('zOn'));values.zOffMass=mass(grouped('zOff'));}
 if(jets.length>=2){values.mjj=mass(jets.slice(0,2));values.deta=Math.abs(eta(jets[0])-eta(jets[1]));}
 if(category==='wmn'){const l=particles[0].rec;values.mt=Math.sqrt(Math.max(0,2*(pt(l)*values.met+l.px*v.px+l.py*v.py)));}
 return {seed,category,pileup,particles,jets,groups,decays,values,vertices:1+pileup*4,met:{px:-v.px,py:-v.py,pt:values.met},pairMass:values.peak??null,truthMass:groups.peak?mass(grouped('peak',true)):category==='wmn'?mass(particles.slice(0,2).map(p=>p.truth)):null};
}
// Exact Lorentz-force step for a uniform axial field, parameterized by 3D path length.
// Bz > 0 is +z. q > 0 and initial +x momentum bend toward -y (q v × B).
export function advanceHelix(position,momentum,q,ds,bz=B){
 const P=Math.hypot(momentum.px,momentum.py,momentum.pz);
 if(P===0)return {position:position.slice(),momentum:{...momentum}};
 const d=-K*q*bz*ds/P;
 const sinc=Math.abs(d)<1e-5?1-d*d/6:Math.sin(d)/d;
 const cosc=Math.abs(d)<1e-5?d/2-d*d*d/24:(1-Math.cos(d))/d;
 const {px,py,pz}=momentum,c=Math.cos(d),s=Math.sin(d);
 return {position:[position[0]+ds*(px*sinc-py*cosc)/P,position[1]+ds*(py*sinc+px*cosc)/P,position[2]+ds*pz/P],momentum:{...momentum,px:px*c-py*s,py:px*s+py*c}};
}
const cylinder=(r,zMax,system)=>({kind:'cylinder',r,zMax,system});
const disk=(z,rMin,rMax,system)=>({kind:'disk',z,rMin,rMax,system});
const diskPair=(z,rMin,rMax,system)=>[-z,z].map(z=>disk(z,rMin,rMax,system));
export const SURFACES={
 tracker:[...GEOMETRY.pixel.map(r=>cylinder(r,.52,'pixel')),...GEOMETRY.strip.map(r=>cylinder(r,2.52,'strip')),...[.3,.4,.5].flatMap(z=>diskPair(z,.04,.18,'pixel')),...[1.25,1.5,1.8,2,2.2,2.45,2.65].flatMap(z=>diskPair(z,.25,1.1,'strip'))],
 ecal:[cylinder(1.29,3.07,'ecal'),...diskPair(3.2,.32,1.55,'ecal')],
 hcal:[cylinder(2.2,4.12,'hcal'),...diskPair(4.65,.4,2.9,'hcal'),...diskPair(10.5,.15,1.35,'forward')],
 muon:[...GEOMETRY.muon.map(r=>cylinder(r,6.28,'muon')),...GEOMETRY.endcap.flatMap(z=>diskPair(z-.26,1,6.85,'muon'))]
};
// Intersections of a short sampled chord with a finite detector surface.
export function intersectSurface(a,b,surface){
 const d=b.map((v,i)=>v-a[i]);let ts=[];
 if(surface.kind==='disk'){
  if(Math.abs(d[2])<1e-14)return null;
  ts=[(surface.z-a[2])/d[2]];
 }else{
  const A=d[0]**2+d[1]**2,Bb=2*(a[0]*d[0]+a[1]*d[1]),C=a[0]**2+a[1]**2-surface.r**2,disc=Bb**2-4*A*C;
  if(A<1e-20||disc<0)return null;
  ts=[(-Bb-Math.sqrt(disc))/(2*A),(-Bb+Math.sqrt(disc))/(2*A)];
 }
 for(const t of ts.sort((a,b)=>a-b)){
  if(t<=1e-9||t>1+1e-9)continue;
  const p=a.map((v,i)=>v+Math.min(1,t)*d[i]),r=Math.hypot(p[0],p[1]);
  if(surface.kind==='disk'?(r<surface.rMin-1e-8||r>surface.rMax+1e-8):Math.abs(p[2])>surface.zMax+1e-8)continue;
  return {position:p,t,system:surface.system};
 }
 return null;
}
function firstHit(points,surface){for(let i=1;i<points.length;i++){const hit=intersectSurface(points[i-1],points[i],surface);if(hit)return {...hit,index:i};}return null;}
const insideField=p=>Math.hypot(p[0],p[1])<3&&Math.abs(p[2])<6.25;
export function propagate(p,truth=false){
 if(p.type==='neutrino')return {points:[],fieldExitIndex:null,termination:'invisible',turns:0,pathLength:0};
 let momentum={...(truth?p.truth:p.rec)},position=p.vertex.slice();const P=Math.hypot(momentum.px,momentum.py,momentum.pz),points=[position.slice()];
 if(P===0)return {points,fieldExitIndex:null,termination:'zero momentum',turns:0,pathLength:0};
 let turns=0,pathLength=0,fieldExitIndex=null,termination='path display limit';
 const stopping=p.type==='muon'?[]:p.type==='electron'||p.type==='photon'?SURFACES.ecal:SURFACES.hcal;
 for(let i=0;i<10000&&pathLength<80;i++){
  let bz=insideField(position)?B:0;
  // One revolution is a DISPLAY budget, not an energy-loss/stopping model.
  let ds=Math.min(.025,p.q&&bz?.025*P/(K*Math.abs(p.q*bz)):.025,80-pathLength);
  if(p.q&&bz)ds=Math.min(ds,(1-turns)*2*Math.PI*P/(K*Math.abs(p.q*bz)));
  let step=advanceHelix(position,momentum,p.q,ds,bz);
  if(bz&&!insideField(step.position)){
   let lo=0,hi=ds;for(let j=0;j<35;j++){const mid=(lo+hi)/2;if(insideField(advanceHelix(position,momentum,p.q,mid,bz).position))lo=mid;else hi=mid;}
   ds=hi;step=advanceHelix(position,momentum,p.q,ds,bz);fieldExitIndex=points.length;
  }
  let first=null;for(const surf of stopping){const hit=intersectSurface(position,step.position,surf);if(hit&&(!first||hit.t<first.t))first=hit;}
  if(first){points.push(first.position);pathLength+=ds*first.t;turns+=Math.abs(K*p.q*bz*ds*first.t/P)/(2*Math.PI);termination=first.system+' surface';break;}
  position=step.position;momentum=step.momentum;points.push(position.slice());pathLength+=ds;turns+=Math.abs(K*p.q*bz*ds/P)/(2*Math.PI);
  if(Math.hypot(...position.slice(0,2))>=7.35||Math.abs(position[2])>=11.95){termination='display envelope';break;}
  if(turns>=1-1e-10){termination='one-turn display limit';break;}
 }
 return {points,fieldExitIndex,termination,turns,pathLength};
}
export function trajectory(p,truth=false){return propagate(p,truth).points;}
export const longitudinal=p=>[p[2],Math.hypot(p[0],p[1])];
export function response(p,truth=false){
 const propagation=propagate(p,truth),points=propagation.points,hits=[],deposits=[];
 if(!points.length)return {points,hits,deposits,trackPoints:[],extrapolation:[],propagation};
 const v=truth?p.truth:p.rec;
 if(p.q)for(const s of SURFACES.tracker){const hit=firstHit(points,s);if(hit)hits.push(hit);}
 if(p.type==='muon')for(const s of SURFACES.muon){const hit=firstHit(points,s);if(hit)hits.push(hit);}
 for(const [system,surfaces] of [['ecal',SURFACES.ecal],['hcal',SURFACES.hcal]]){
  const candidates=surfaces.map(s=>firstHit(points,s)).filter(Boolean).sort((a,b)=>a.index-b.index||a.t-b.t);
  const hit=candidates[0];if(!hit)continue;
  const isEM=['electron','photon'].includes(p.type),E=p.type==='muon'?Math.min(.2,v.E*.02):v.E*(system==='ecal'?(isEM?.96:.12):.88);
  deposits.push({...hit,E});
 }
 // A fitted charged track is shown only in the tracker. Muons continue inside the
 // ideal solenoid, then switch to a visibly dashed, unvalidated outer extrapolation.
 let split=points.length;
 if(p.type==='muon'){if(propagation.fieldExitIndex!==null)split=propagation.fieldExitIndex+1;}
 else if(p.q){const index=points.findIndex(v=>Math.hypot(v[0],v[1])>1.1||Math.abs(v[2])>2.7);if(index>=0)split=index;}
 const trackPoints=points.slice(0,Math.max(1,split));
 const extrapolation=split<points.length?points.slice(Math.max(0,split-1)):[];
 return {points,hits,deposits,trackPoints,extrapolation,propagation};
}
export function interpret(event){for(const p of event.particles)p.response=response(p);return event;}
