import {generate,interpret,TYPES,CATEGORIES,pt,eta,phi,mass,K,B} from './physics.js';
import {SYSTEMS} from './detector.js';
import {createScene} from './scene.js';
import {createPlots} from './plots.js';
import {createAnalysis} from './analysis.js';
import {PROCESSES,observable} from './analysis-data.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const state={seed:314159,category:'zmm',number:1,rate:.5,playing:false,selected:null,mode:'cutaway',cut:110,opacity:.18,labels:true,orbit:false,pt:0,pileup:false,intensity:2,truth:false,plot:'rz',systems:Object.fromEntries(Object.keys(SYSTEMS).map(k=>[k,true])),filters:{muon:true,electron:true,photon:true,hadron:true,neutral:true,jet:true,met:true}};
let event,progress=1,replaying=false,history=[],scene,plots,dirty=true,analysis,activeView='display';
const fmt=(n,d=2)=>Number(n).toFixed(d);
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2500);}
function select(id){state.selected=id;renderSelected();renderList();if(id)$('#selected').scrollIntoView({block:'nearest'});dirty=true;}
for(const [key,s] of Object.entries(SYSTEMS)){
 const row=document.createElement('div');row.className='system-row';row.innerHTML=`<label><i class="swatch" style="color:${s.color};background:currentColor"></i>${s.name}</label><input type="checkbox" checked aria-label="Show ${s.name}">`;row.querySelector('label').htmlFor='sys-'+key;row.querySelector('input').id='sys-'+key;
 row.querySelector('input').onchange=e=>{state.systems[key]=e.target.checked;scene?.detector.update(state);dirty=true;};$('#systems').append(row);
}
for(const [key,name,color] of [['muon','μ Muons',TYPES.muon.color],['electron','e Electrons',TYPES.electron.color],['photon','γ Photons',TYPES.photon.color],['hadron','h± Hadrons',TYPES.hadron.color],['neutral','h⁰ Neutral',TYPES.neutral.color],['jet','Jets','#ffa263'],['met','pTmiss','#e570f7']]){
 const b=document.createElement('button');b.className='active';b.setAttribute('aria-pressed','true');b.innerHTML=`<i class="swatch" style="color:${color};background:currentColor"></i>${name}`;b.onclick=()=>{state.filters[key]=!state.filters[key];b.classList.toggle('active',state.filters[key]);b.setAttribute('aria-pressed',state.filters[key]);if(event.particles.find(p=>p.id===state.selected)?.type===key&&!state.filters[key])select(null);renderList();dirty=true;};$('#filters').append(b);
}
function renderSelected(){
 const p=event.particles.find(p=>p.id===state.selected);if(!p){$('#selected').innerHTML='<span class="muted">Click a track or an object to inspect its measurements.</span>';return;}
 const r=p.rec,t=p.truth;const rows=[['Charge',p.q?`${p.q>0?'+':''}${p.q} e`:'0'],['pT',`${fmt(pt(r))} GeV/c`],['η / φ',`${fmt(eta(r),3)} / ${fmt(phi(r),3)}`],['Energy',`${fmt(r.E)} GeV`],['px / py',`${fmt(r.px)} / ${fmt(r.py)}`],['pz [GeV/c]',fmt(r.pz)],['Vertex [m]',p.vertex.map(v=>fmt(v,3)).join(', ')],['Hits / deposits',`${p.response.hits.length} / ${p.response.deposits.length}`],['Truth pT',`${fmt(pt(t))} GeV/c`],['Truth η / φ',`${fmt(eta(t),3)} / ${fmt(phi(t),3)}`],['Truth E',`${fmt(t.E)} GeV`],['Inner-field R',p.q?`${fmt(pt(r)/(K*Math.abs(p.q)*B),3)} m`:'not charged'],['Helix pitch / turn',p.q?`${fmt(2*Math.PI*r.pz/(K*Math.abs(p.q)*B),3)} m`:'not charged'],['Path end',p.response.propagation.termination]];
 $('#selected').innerHTML=`<div class="selected-title" style="color:${TYPES[p.type].color}">${TYPES[p.type].label} #${String(p.id).padStart(3,'0')} <small>${p.primary?'PRIMARY':'PILE-UP'}</small></div><div class="details">${rows.map(([k,v])=>`<span>${k}</span><b>${v}</b>`).join('')}</div>`;
}
function renderList(){const ps=event.particles.filter(p=>p.type!=='neutrino'&&state.filters[p.type]&&(!p.q||pt(p.rec)>=state.pt)).sort((a,b)=>pt(b.rec)-pt(a.rec)).slice(0,4);$('#object-list').replaceChildren();for(const p of ps){const b=document.createElement('button');b.className='object-button'+(state.selected===p.id?' selected':'');b.setAttribute('aria-pressed',state.selected===p.id);b.innerHTML=`<i class="swatch" style="color:${TYPES[p.type].color};background:currentColor"></i>${TYPES[p.type].label} ${p.q>0?'+':p.q<0?'−':''} <span>${fmt(pt(p.rec),1)} GeV/c</span>`;b.onclick=()=>select(state.selected===p.id?null:p.id);$('#object-list').append(b);}}
function summary(){
 $('#event-number').textContent=String(state.number).padStart(6,'0');$('#event-title').textContent=CATEGORIES[state.category];$('#seed').value=state.seed;
 const def=observable(state.category,PROCESSES[state.category].observables[0]);
 $('#mass-label').textContent=def.label.toUpperCase();$('#mass').textContent=fmt(event.values[PROCESSES[state.category].observables[0]],2);$('#mass-unit').textContent=def.unit;
 $('#event-process-note').textContent=PROCESSES[state.category].chain+(state.category.startsWith('tt')?' · truth-assigned jet proxies':'');
 const count=t=>event.particles.filter(p=>p.type===t).length,leading=Math.max(...event.particles.filter(p=>p.type!=='neutrino').map(p=>pt(p.rec)));
 const stats=[['Tracks',event.particles.filter(p=>p.q).length],['Vertices',event.vertices],['Muons',count('muon')],['Electrons',count('electron')],['Photons',count('photon')],['Jets',event.jets.length],['Lead pT',fmt(leading,1)],['pTmiss',fmt(event.met.pt,1)]];
 $('#summary').innerHTML=stats.map(([k,v])=>`<div class="stat" title="Momenta in GeV/c; counts before display filters"><span>${k}</span><b>${v}</b></div>`).join('');renderList();renderSelected();
}
function load(animate=false,log=true){event=interpret(generate(state.seed,state.category,state.pileup?state.intensity:0));analysis?.collect(event);state.selected=null;scene?.load(event);plots.load(event);summary();progress=animate&&!reduced?0:1;replaying=animate&&!state.playing&&!reduced;dirty=true;if(log){history.unshift({n:state.number,cat:CATEGORIES[state.category],mass:event.pairMass,met:event.met.pt});history=history.slice(0,3);}else if(history.length){history[0]={n:state.number,cat:CATEGORIES[state.category],mass:event.pairMass,met:event.met.pt};}$('#event-log').innerHTML=history.map(h=>`<div><b>EVT ${String(h.n).padStart(6,'0')}</b>${h.cat} · ${h.mass!==null?'m '+fmt(h.mass,2)+' GeV/c²':'pTmiss '+fmt(h.met,2)+' GeV/c'}</div>`).join('');}
function next(){state.number++;state.seed=(state.seed+1)>>>0;load(true);}
function play(){state.playing=!state.playing;$('#play').innerHTML=`${state.playing?'Ⅱ Pause':'▶ Play'} <kbd>SPACE</kbd>`;$('#play-status').textContent=state.playing?'PLAYING':'PAUSED';if(state.playing&&progress>=1)progress=0;replaying=false;}
$('#category').innerHTML=Object.entries(CATEGORIES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
function switchView(view){activeView=view;if(view==='analysis'&&state.playing)play();$('#console').hidden=view!=='display';$('#analysis-view').hidden=view!=='analysis';for(const v of ['display','analysis']){const b=$('#'+v+'-tab');b.classList.toggle('active',v===view);b.setAttribute('aria-selected',v===view);b.tabIndex=v===view?0:-1;}analysis?.refresh();dirty=true;}
$('#display-tab').onclick=()=>switchView('display');$('#analysis-tab').onclick=()=>switchView('analysis');
$('.workspace-tabs').onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const view=e.key==='Home'?'display':e.key==='End'?'analysis':activeView==='display'?'analysis':'display';switchView(view);$('#'+view+'-tab').focus();}};
analysis=createAnalysis((category,seed)=>{state.category=category;state.seed=seed;$('#category').value=category;switchView('display');load(true);window.scrollTo({top:0,behavior:'instant'});},toast);
scene=createScene($('#viewport'),state,select);if(!scene){$('#webgl-error').hidden=false;$('#capture').disabled=true;$('#orbit').disabled=true;$('#diagnostic').textContent='2D MODE · WEBGL UNAVAILABLE';}plots=createPlots(state,select);scene?.detector.update(state);load(false);
$('#play').onclick=play;$('#next').onclick=next;$('#replay').onclick=()=>{progress=0;replaying=true;dirty=true;toast('Replaying seed '+state.seed);};
$('#category').onchange=e=>{state.category=e.target.value;load(true);};
$('#rates').onclick=e=>{const b=e.target.closest('[data-rate]');if(!b)return;state.rate=+b.dataset.rate;$$('[data-rate]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b);});};
function setMode(mode){state.mode=mode;$$('[data-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-pressed',b.dataset.mode===mode);});$('#cut').disabled=mode!=='cutaway';scene?.detector.update(state);}
$('#modes').onclick=e=>{if(e.target.dataset.mode)setMode(e.target.dataset.mode);};
$('#camera').onchange=e=>scene?.preset(+e.target.value);
function reset(){scene?.preset(0);$('#camera').value='0';state.orbit=false;$('#orbit').checked=false;}
$('#reset').onclick=reset;
for(const [id,prop,convert,format] of [['opacity','opacity',v=>v/100,v=>v+'%'],['cut','cut',Number,v=>v+'°'],['pt','pt',Number,v=>Number(v).toFixed(1)+' GeV/c'],['intensity','intensity',Number,v=>v]]){$('#'+id).oninput=e=>{state[prop]=convert(e.target.value);$('#'+id+'-value').textContent=format(e.target.value);if(id==='intensity')load(true,false);else if(id==='pt'){renderList();if(state.selected&&pt(event.particles.find(p=>p.id===state.selected).rec)<state.pt)select(null);}else scene?.detector.update(state);dirty=true;};}
$('#labels-toggle').onchange=e=>state.labels=e.target.checked;$('#orbit').onchange=e=>state.orbit=e.target.checked;$('#truth').onchange=e=>{state.truth=e.target.checked;dirty=true;};$('#pileup').onchange=e=>{state.pileup=e.target.checked;$('#intensity').disabled=!state.pileup;load(true,false);};
$('#apply-seed').onclick=()=>{const n=Number($('#seed').value);if(!Number.isInteger(n)||n<0||n>4294967295){toast('Enter an integer seed from 0 to 4294967295.');return;}state.seed=n;state.number=1;load(true);toast('Deterministic seed applied');};$('#seed').onkeydown=e=>{if(e.key==='Enter')$('#apply-seed').click();};
function plot(mode){state.plot=mode;$('#rz-tab').classList.toggle('active',mode==='rz');$('#map-tab').classList.toggle('active',mode==='map');$('#projection-unit').textContent=mode==='rz'?'z–r · m':'η · φ [rad]';$('#projection-note').innerHTML=mode==='rz'?'r = √(x²+y²) ≥ 0 <span>z ±12 m</span>':'CELL SIZE ∝ √DEPOSIT ENERGY <span>GeV</span>';dirty=true;}
$('#rz-tab').onclick=()=>plot('rz');$('#map-tab').onclick=()=>plot('map');
$$('.collapse').forEach(b=>b.onclick=()=>{const collapsed=b.closest('.panel').classList.toggle('collapsed');b.textContent=collapsed?'+':'−';b.setAttribute('aria-expanded',!collapsed);});
const dialog=$('#about-dialog');$('#about').onclick=$('#notes').onclick=()=>dialog.showModal();$('#close-about').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}};
$('#capture').onclick=()=>{if(!scene)return;try{const a=document.createElement('a');a.href=scene.capture();a.download=`cms-simulated-seed-${state.seed}.png`;a.click();toast('3D scene exported as PNG');}catch{toast('Screenshot export is unavailable in this browser.');}};
document.addEventListener('keydown',e=>{if(activeView!=='display'||['INPUT','SELECT','TEXTAREA','BUTTON'].includes(e.target.tagName))return;if(dialog.open){if(e.key==='Escape')dialog.close();return;}switch(e.key.toLowerCase()){case' ':e.preventDefault();play();break;case'n':next();break;case'r':reset();break;case'c':{const modes=['cutaway','transparent','solid','exploded'];setMode(modes[(modes.indexOf(state.mode)+1)%4]);break;}case'l':state.labels=!state.labels;$('#labels-toggle').checked=state.labels;break;case'escape':select(null);break;default:if(/^[1-5]$/.test(e.key)){scene?.preset(+e.key-1);$('#camera').value=String(+e.key-1);}}});
const anchors=[['muon','DT / RPC · barrel',[4.7,5.2,-2]],['yoke','STEEL RETURN YOKE',[-4,4,-4]],['solenoid','SOLENOID · 3.8 T',[2.3,2.7,4.5]],['strip','SILICON TRACKER',[.4,.6,1.6]],['ecal','ECAL',[.9,1.1,-2.4]],['gem','GE1/1 · GEM',[1.4,1.4,-5.65]]];
for(const a of anchors){const el=document.createElement('div');el.className='detector-label';el.textContent=a[1];$('#labels').append(el);a.push(el);}
let last=performance.now(),lastPlot=0,frames=0,perfStart=last,poor=0;
function frame(now){if(activeView!=='display'){last=now;requestAnimationFrame(frame);return;}const dt=Math.min(.05,(now-last)/1000);last=now;if(state.playing||replaying){progress+=dt*state.rate;if(progress>=1){progress=1;if(state.playing)next();else replaying=false;}dirty=true;}
 scene?.update(progress);scene?.render();
 if(dirty||now-lastPlot>180){plots.draw(progress);lastPlot=now;dirty=false;$('#progress').style.width=progress*100+'%';const step=Math.min(3,Math.floor(progress*4));$$('.stages>div').forEach((el,i)=>el.classList.toggle('done',i<=step));$('#phase-label').textContent=['COLLISION','DETECTOR SIGNALS','TRACKS & CLUSTERS','PHYSICS OBJECTS'][step];}
 for(const [sys,,pos,el] of anchors){if(!scene||!state.labels||!state.systems[sys]){el.style.display='none';continue;}const point=scene.project(pos);el.style.display=point.visible?'block':'none';el.style.left=point.x+'px';el.style.top=point.y+'px';}
 frames++;if(now-perfStart>2500){const fps=frames*1000/(now-perfStart);if(scene){$('#diagnostic').textContent=`APPLICATION · ${Math.round(fps)} FPS · WEBGL`;if(fps<24&&++poor===2){scene.reduceQuality();toast('Rendering detail reduced for smoother interaction');}}frames=0;perfStart=now;}
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);window.addEventListener('resize',()=>dirty=true);
