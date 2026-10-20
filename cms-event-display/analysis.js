import {generate,CATEGORIES} from './physics.js';
import {PROCESSES,observable,gaussianFit,collectRecord,validRecords,MODEL_VERSION} from './analysis-data.js';
export function createAnalysis(showEvent,toast){
 const $=s=>document.querySelector(s),storageKey=MODEL_VERSION;let records=[],category='hgg',key='peak',fit=null,busy=false;
 try{records=validRecords(JSON.parse(localStorage.getItem(storageKey)||'[]'));}catch{}
 $('#analysis-category').innerHTML=Object.entries(CATEGORIES).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');$('#analysis-category').value=category;
 function save(){try{localStorage.setItem(storageKey,JSON.stringify(records));$('#storage-status').textContent='Saved in this browser · up to 20,000 unique events';}catch{$('#storage-status').textContent='Storage unavailable: this sample lasts for this visit only';}}
 const selected=()=>records.filter(r=>r.category===category);
 const data=()=>selected().map(r=>r.values[key]).filter(Number.isFinite);
 function options(){const p=PROCESSES[category];key=p.observables[0];$('#observable').innerHTML=p.observables.map(k=>`<option value="${k}">${observable(category,k).label}</option>`).join('');$('#process-title').textContent=p.title;$('#decay-chain').textContent=p.chain;$('#process-explanation').textContent=p.text;fit=null;render();}
 function render(){
  const n=selected().length,all=records.length,def=observable(category,key),xs=data();
  $('#sample-total').textContent=all.toLocaleString();$('#tab-count').textContent=all.toLocaleString();$('#sample-selected').textContent=n.toLocaleString();$('#sample-channels').textContent=new Set(records.map(r=>r.category)).size;$('#sample-entries').textContent=xs.length.toLocaleString();
  $('#hist-title').textContent=def.label;$('#observable-formula').textContent=def.formula;$('#sample-label').textContent=CATEGORIES[category];$('#fit-button').disabled=!def.fit||xs.length<20||busy;
  $('#fit-model-note').textContent=def.fit?'Unbinned Gaussian maximum likelihood · ≥20 events · all entries, no fit window':'No Gaussian fit: this observable is a continuum or an endpoint, not a resonance peak.';
  $('#injected-value').textContent=def.injected?`${def.injected} ${def.unit}`:'No fixed peak';
  $('#fit-mean').textContent=fit?`${fit.mean.toFixed(3)} ± ${fit.meanError.toFixed(3)}`:'—';$('#fit-width').textContent=fit?`${fit.sigma.toFixed(3)} ± ${fit.sigmaError.toFixed(3)}`:'—';$('#fit-unit').textContent=def.fit?def.unit:'';
  $('#fit-status').textContent=fit?`Fit uses ${fit.n.toLocaleString()} independent seeded toy events. Errors are approximate 1σ, under the Gaussian model.`:def.fit?(xs.length<20?'Collect at least 20 events to fit the peak.':'Sample ready. Fit the peak to estimate its position and width.'):'Choose a mass peak to estimate a resonance mass.';
  $('#channel-ledger').innerHTML=Object.entries(CATEGORIES).map(([c,label])=>{const count=records.filter(r=>r.category===c).length;return `<button data-channel="${c}" class="ledger-row ${c===category?'chosen':''}"><span>${label}</span><b>${count.toLocaleString()}</b><i style="width:${all?100*count/all:0}%"></i></button>`;}).join('');
  $('#export-sample').disabled=!all||busy;$('#clear-sample').disabled=!all||busy;draw();
 }
 function draw(){
  const canvas=$('#histogram'),rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
  const dpr=Math.min(devicePixelRatio,2);canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;const c=canvas.getContext('2d');c.scale(dpr,dpr);const w=rect.width,h=rect.height,L=52,R=20,T=32,D=51,pw=w-L-R,ph=h-T-D,def=observable(category,key),xs=data();
  c.fillStyle='#071a2a';c.fillRect(0,0,w,h);c.font='11px monospace';c.fillStyle='#91a9c0';
  if(!xs.length){c.textAlign='center';c.fillText('Collect a sample to reveal the distribution',w/2,h/2);return;}
  let min=Math.min(...xs),max=Math.max(...xs);if(def.injected){min=Math.min(min,def.injected);max=Math.max(max,def.injected);}const padding=Math.max((max-min)*.12,.1);min-=padding;max+=padding;if(!def.fit)min=Math.max(0,min);
  const bins=32,width=(max-min)/bins,counts=Array(bins).fill(0);for(const v of xs)counts[Math.min(bins-1,Math.max(0,Math.floor((v-min)/width)))]++;
  const density=x=>fit?xs.length*width/(fit.sigma*Math.sqrt(2*Math.PI))*Math.exp(-.5*((x-fit.mean)/fit.sigma)**2):0;
  const ymax=Math.max(1,...counts,fit?density(fit.mean):0)*1.2,x=v=>L+(v-min)/(max-min)*pw,y=v=>T+ph-v/ymax*ph;
  c.textAlign='right';for(let i=0;i<=4;i++){const value=ymax*i/4;c.strokeStyle='#1b3549';c.beginPath();c.moveTo(L,y(value));c.lineTo(w-R,y(value));c.stroke();c.fillText(Math.round(value),L-9,y(value)+4);}
  for(let i=0;i<bins;i++){c.fillStyle='#587ff0aa';c.fillRect(x(min+i*width)+1,y(counts[i]),pw/bins-2,ph*counts[i]/ymax);c.fillStyle='#8babff';c.fillRect(x(min+i*width)+1,y(counts[i]),pw/bins-2,2);}
  if(def.injected){c.setLineDash([4,5]);c.strokeStyle='#e2c481';c.beginPath();c.moveTo(x(def.injected),T);c.lineTo(x(def.injected),h-D);c.stroke();c.setLineDash([]);}
  if(fit){c.strokeStyle='#6ee6bc';c.lineWidth=2;c.beginPath();for(let i=0;i<=300;i++){const v=min+(max-min)*i/300;i?c.lineTo(x(v),y(density(v))):c.moveTo(x(v),y(density(v)));}c.stroke();c.lineWidth=1;}
  c.fillStyle='#91a9c0';c.textAlign='center';for(let i=0;i<=4;i++){const v=min+(max-min)*i/4;c.fillText(v.toFixed(max-min<10?1:0),x(v),h-D+20);}c.fillText(def.unit||'Dimensionless',L+pw/2,h-10);c.textAlign='left';c.fillText(`Events / ${width.toPrecision(3)} ${def.unit}`,L,19);
  canvas.setAttribute('aria-label',`${def.label}: ${xs.length} events; range ${min.toFixed(2)} to ${max.toFixed(2)} ${def.unit}.${fit?` Gaussian mean ${fit.mean.toFixed(3)}, width ${fit.sigma.toFixed(3)}.`:''}`);
 }
 async function batch(n){if(busy)return;busy=true;fit=null;$('#collect-100').disabled=$('#collect-1000').disabled=true;$('#analysis-category').disabled=true;$('#observable').disabled=true;
  const target=category,used=new Set(records.filter(r=>r.category===target).map(r=>r.seed));let seed=1,added=0;
  while(added<n&&records.length<20000){if(!used.has(seed)){collectRecord(records,generate(seed,target));used.add(seed);added++;}seed++;if(seed%100===0){$('#batch-status').textContent=`Generating ${added} / ${n}…`;await new Promise(r=>setTimeout(r,0));}}
  busy=false;$('#collect-100').disabled=$('#collect-1000').disabled=false;$('#analysis-category').disabled=false;$('#observable').disabled=false;save();render();$('#batch-status').textContent=`Added ${added} unique events${records.length>=20000?' · sample limit reached':''}.`;toast(`Collected ${added} simulated events`);
 }
 $('#collect-100').onclick=()=>batch(100);$('#collect-1000').onclick=()=>batch(1000);
 $('#analysis-category').onchange=e=>{category=e.target.value;options();};$('#observable').onchange=e=>{key=e.target.value;fit=null;render();};
 $('#channel-ledger').onclick=e=>{const b=e.target.closest('[data-channel]');if(!b||busy)return;category=b.dataset.channel;$('#analysis-category').value=category;options();};
 $('#fit-button').onclick=()=>{fit=gaussianFit(data());render();};$('#view-process').onclick=()=>{const r=selected().at(-1);showEvent(category,r?.seed??314159);};
 $('#clear-sample').onclick=()=>{records=[];fit=null;save();render();$('#batch-status').textContent='Local sample cleared. Generate events to start again.';};
 $('#export-sample').onclick=()=>{const keys=['peak','wMass','zMass','zOffMass','met','ht','leadPt','mjj','deta','mt'];const text=['model,category,seed,'+keys.join(','),...records.map(r=>[MODEL_VERSION,r.category,r.seed,...keys.map(k=>r.values[k]??'')].join(','))].join('\n');const url=URL.createObjectURL(new Blob([text],{type:'text/csv'})),a=document.createElement('a');a.href=url;a.download='cms-simulated-observables.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 new ResizeObserver(draw).observe($('#histogram'));options();
 return {collect(e){if(collectRecord(records,e)){fit=null;save();render();}},refresh:render};
}
