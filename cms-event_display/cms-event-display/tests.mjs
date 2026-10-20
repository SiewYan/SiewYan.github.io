import assert from 'node:assert/strict';
import {generate,interpret,trajectory,mass,sum,pt,K,B,advanceHelix,propagate,longitudinal,SURFACES,intersectSurface,response} from './dist/physics.js';
for(const cat of ['zmm','zee','hgg','jj','wmn'])for(const seed of [0,1,314159,4294967295]){
 const a=interpret(generate(seed,cat,2)),b=interpret(generate(seed,cat,2));assert.deepEqual(a,b,'fixed seed determinism');
 const visible=a.particles.filter(p=>p.type!=='neutrino');const s=sum(visible.map(p=>p.rec));assert.ok(Math.abs(a.met.px+s.px)<1e-9);assert.ok(Math.abs(a.met.py+s.py)<1e-9);
 const truth=sum(a.particles.map(p=>p.truth));assert.ok(Math.hypot(truth.px,truth.py)<1e-9,'truth transverse balance');
 if(a.pairMass!==null)assert.equal(a.pairMass,mass(a.particles.slice(0,2).map(p=>p.rec)));
 if(cat!=='jj')assert.ok(Math.abs(a.truthMass-(cat==='hgg'?125.1:cat==='wmn'?80.38:91.1876))<1e-8);
 for(const p of a.particles){assert.ok(p.rec.E>=Math.hypot(p.rec.px,p.rec.py,p.rec.pz)-1e-8);if(p.type==='neutrino')assert.equal(p.response.points.length+p.response.hits.length+p.response.deposits.length,0);if(!p.q)assert.ok(!p.response.hits.some(h=>['pixel','strip'].includes(h.system)));if(p.type==='photon')for(const v of p.response.points)assert.ok(Math.abs(v[0]*p.rec.py-v[1]*p.rec.px)<1e-8,'photon straight');}
}
const mu=generate().particles[0],path=trajectory(mu),r=pt(mu.rec)/(K*B),cx=mu.rec.py/pt(mu.rec)*r,cy=-mu.rec.px/pt(mu.rec)*r;
for(const p of path.filter(p=>Math.hypot(p[0],p[1])<2.9))assert.ok(Math.abs(Math.hypot(p[0]-cx,p[1]-cy)-r)<.001,'inner helix radius');
const nominal=generate(),pile=generate(314159,'zmm',3);assert.equal(pile.particles.length-nominal.particles.length,24);assert.equal(pile.vertices,13);
console.log('PASS: 20 deterministic category/seed fixtures, four-vector masses, balance, missing momentum, neutral signatures, helix curvature, and pile-up.');
// Independent Runge–Kutta integration of dP/ds = k q (P × B) / |P|.
// This oracle uses Cartesian force components, not the application's helix formula.
function rk4(initial,q,bz,length,h=.001){
 let a=initial.slice();const n=Math.ceil(length/h);h=length/n;
 const f=v=>{const P=Math.hypot(v[3],v[4],v[5]);return [v[3]/P,v[4]/P,v[5]/P,K*q*bz*v[4]/P,-K*q*bz*v[3]/P,0];};
 const plus=(v,d,t)=>v.map((x,i)=>x+t*d[i]);
 for(let i=0;i<n;i++){const k1=f(a),k2=f(plus(a,k1,h/2)),k3=f(plus(a,k2,h/2)),k4=f(plus(a,k3,h));a=a.map((x,j)=>x+h*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6);}
 return a;
}
let maxOracleError=0,cases=0;
for(const pT of [.05,.6,1,45.7])for(const q of [-1,0,1])for(const bz of [-3.8,0,3.8])for(const pz of [-2,0,3]){
 const a=.63,v={px:pT*Math.cos(a),py:pT*Math.sin(a),pz,E:Math.hypot(pT,pz,.13957)},vertex=[.012,-.023,.08];
 const length=.4,exact=advanceHelix(vertex,v,q,length,bz),numeric=rk4([...vertex,v.px,v.py,v.pz],q,bz,length,.0005);
 const err=Math.hypot(...exact.position.map((x,i)=>x-numeric[i]));maxOracleError=Math.max(err,maxOracleError);assert.ok(err<2e-9,'Cartesian Lorentz-force oracle');
 assert.ok(Math.abs(Math.hypot(exact.momentum.px,exact.momentum.py,exact.momentum.pz)-Math.hypot(v.px,v.py,v.pz))<1e-10,'magnetic field does no work');
 assert.ok(Math.abs(exact.position[2]-vertex[2]-length*pz/Math.hypot(pT,pz))<1e-10,'pitch uses pz / |p| with 3D arc length');cases++;
}
// Fixed-radius orbit around a displaced centre; no artificial expanding spiral.
for(const q of [-1,1])for(const pT of [.05,.6,45.7]){
 const v={px:pT,py:0,pz:.3,E:Math.hypot(pT,.3,.13957)},P=Math.hypot(pT,.3),R=pT/(K*B),turnLength=2*Math.PI*P/(K*B),pitch=2*Math.PI*.3/(K*B);
 for(let i=0;i<=64;i++){const at=advanceHelix([0,0,0],v,q,turnLength*i/64);assert.ok(Math.abs(Math.hypot(at.position[0],at.position[1]+q*R)-R)<1e-10);}
 const full=advanceHelix([0,0,0],v,q,turnLength);assert.ok(Math.hypot(full.position[0],full.position[1])<1e-10);assert.ok(Math.abs(full.position[2]-pitch)<1e-10);
 const near=advanceHelix([0,0,0],v,q,.001);assert.equal(Math.sign(near.position[1]),-q,'positive q bends -y for +x momentum and +z field');
}
// Projection regression: crossing y=0 at x≠0 must not connect +r to -r.
const a=longitudinal([1,-1e-8,2]),b=longitudinal([1,1e-8,2.001]);assert.ok(a[1]>=0&&b[1]>=0);assert.ok(Math.abs(a[1]-b[1])<1e-12);
const testParticle=(type,q,px,py,pz)=>({type,q,vertex:[0,0,0],rec:{px,py,pz,E:Math.hypot(px,py,pz,.13957)},truth:{px,py,pz,E:Math.hypot(px,py,pz,.13957)}});
const curl=propagate(testParticle('hadron',1,.2,0,0));assert.equal(curl.termination,'one-turn display limit');assert.ok(curl.turns<=1+1e-10);assert.ok(Math.max(...curl.points.map(v=>Math.hypot(v[0],v[1])))<=2*.2/(K*B)+1e-9);
const parallel=propagate(testParticle('muon',1,0,0,45));assert.ok(parallel.points.every(p=>p.every(Number.isFinite)&&p[0]===0&&p[1]===0));
const muResponse=response(testParticle('muon',1,45.7,0,0));assert.ok(muResponse.propagation.fieldExitIndex>0);const exit=muResponse.points[muResponse.propagation.fieldExitIndex];assert.ok(Math.abs(Math.hypot(exit[0],exit[1])-3)<1e-8);
const outer=muResponse.extrapolation,dir=outer.at(-1).map((v,i)=>v-outer[0][i]);for(const p of outer)assert.ok(Math.abs((p[0]-outer[0][0])*dir[1]-(p[1]-outer[0][1])*dir[0])<1e-8,'outer continuation explicitly tangent');
assert.equal(intersectSurface([0,0,5],[2,0,5],{kind:'cylinder',r:1,zMax:2.7,system:'strip'}),null,'no barrel hits past the barrel');
assert.equal(intersectSurface([0,0,2],[0,0,4],{kind:'disk',z:3.2,rMin:.32,rMax:1.55,system:'ecal'}),null,'no hits in endcap beam hole');
assert.equal(response(testParticle('photon',0,0,0,45)).hits.length,0);
for(const cat of ['zmm','zee','hgg','jj','wmn'])for(const p of interpret(generate(314159,cat)).particles){
 for(const h of p.response.hits){const ss=h.system==='muon'?SURFACES.muon:SURFACES.tracker.filter(s=>s.system===h.system);assert.ok(ss.some(s=>s.kind==='cylinder'?Math.abs(Math.hypot(h.position[0],h.position[1])-s.r)<1e-6&&Math.abs(h.position[2])<=s.zMax+1e-6:Math.abs(h.position[2]-s.z)<1e-6&&Math.hypot(h.position[0],h.position[1])>=s.rMin-1e-6&&Math.hypot(h.position[0],h.position[1])<=s.rMax+1e-6),'hit lies on an active surface');}
}
console.log(`PASS: ${cases} independent Lorentz-force comparisons; max position disagreement ${maxOracleError.toExponential(3)} m. Circle radius, charge sign, pitch, energy, one-turn cutoff, axial tracks, field boundary, finite hits and r–z continuity checked.`);
console.log('Default muon R [m]:', (pt(generate().particles[0].rec)/(K*B)).toFixed(6));

// Sequential decays, off-shell kinematics, and inference are checked independently of drawing.
const {PROCESSES,gaussianFit,collectRecord,validRecords}=await import('./dist/analysis-data.js');
for(const category of ['ttbar','ttll','h4l','vbf'])for(let seed=1;seed<=250;seed++){
 const e=generate(seed,category),s=sum(e.particles.map(p=>p.truth));assert.ok(Math.hypot(s.px,s.py)<2e-8,'full truth pT balance');
 for(const d of e.decays){const total=sum(d.daughters);for(const k of ['px','py','pz','E'])assert.ok(Math.abs(total[k]-d.parent[k])<1e-7,`${category}: ${d.name} conserves ${k}`);}
 for(const p of e.particles){assert.ok(p.truth.E>=Math.hypot(p.truth.px,p.truth.py,p.truth.pz)-1e-8);assert.ok(Object.values(p.rec).every(Number.isFinite));}
 if(PROCESSES[category].injected)assert.ok(Math.abs(e.truthMass-PROCESSES[category].injected)<1e-7,'exact injected mass');
 if(category==='h4l'){const zz=e.decays.find(d=>d.name==='H → ZZ*').daughters;assert.ok(mass([zz[1]])>=12-1e-8&&mass([zz[1]])<32+1e-8);assert.ok(mass([zz[0]])+mass([zz[1]])<125.1);assert.equal(e.particles.filter(p=>p.type==='electron'||p.type==='muon').length,4);}
 assert.equal(e.jets.length,category==='ttbar'?4:category==='h4l'?0:2);
 assert.equal(e.particles.filter(p=>p.type==='neutrino').length,category==='ttbar'?1:category==='ttll'?2:0);
 for(let j=0;j<e.jets.length;j++)assert.deepEqual(e.jets[j],sum(e.particles.filter(p=>p.jet===j).map(p=>p.rec)));
 if(seed===1){const shown=interpret(e);for(const p of shown.particles)assert.ok(p.response.points.every(v=>v.every(Number.isFinite)));}
}
for(const cat of ['zmm','zee','hgg','h4l','vbf','ttbar']){
 const values=Array.from({length:1000},(_,i)=>generate(i+1,cat).values.peak),f=gaussianFit(values);assert.ok(Math.abs(f.mean-PROCESSES[cat].injected)<Math.max(.12,5*f.meanError));assert.ok(f.sigma>0&&f.sigma<5);console.log(`${cat}: N=${f.n}, mass=${f.mean.toFixed(3)} ± ${f.meanError.toFixed(3)}, width=${f.sigma.toFixed(3)} GeV/c²`);
}
const known=gaussianFit(Array.from({length:100},(_,i)=>i%2?102:98));assert.equal(known.mean,100);assert.equal(known.sigma,2);assert.equal(known.meanError,.2);assert.equal(gaussianFit([1,2]),null);assert.equal(gaussianFit(Array(20).fill(1)),null);
const records=[],first=generate(123,'h4l');assert.equal(collectRecord(records,first),true);assert.equal(collectRecord(records,first),false);assert.equal(collectRecord(records,generate(123,'h4l',1)),false);assert.equal(collectRecord(records,generate(123,'ttbar')),true);assert.deepEqual(validRecords(JSON.parse(JSON.stringify(records))),records);assert.equal(validRecords([{category:'bad'}]).length,0);
console.log('PASS: 1,000 sequential-decay fixtures, momentum closure, off-shell bounds, jet sums, neutrino multiplicities, six 1,000-event peak fits, analytic fit oracle and sample de-duplication.');
