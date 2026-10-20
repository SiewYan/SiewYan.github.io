// This module receives only measured times / histograms and declared model corrections.
// It imports neither generator nor apparatus truth.
import {random,poisson} from './random.js';
export function histogram(times,start,end,width=.5){const n=Math.ceil((end-start)/width),edges=Array.from({length:n+1},(_,i)=>Math.min(end,start+i*width)),counts=new Array(n).fill(0);for(const t of times)if(t>=start&&t<end)counts[Math.min(n-1,Math.floor((t-start)/width))]++;return {edges,counts};}
// Analytic integral of exp(-k t) times 1 + c cos(wt) + s sin(wt).
export function integral(lo,hi,tau,c,s,w){const k=1/tau,D=k*k+w*w;const f=t=>{const ex=Math.exp(-k*t),co=Math.cos(w*t),si=Math.sin(w*t);return ex*(-1/k+c*(-k*co+w*si)/D+s*(-k*si-w*co)/D);};return f(hi)-f(lo);}
export function shape(lo,hi,tau,c,s,w,correction={}){let v=integral(lo,hi,tau,c,s,w);if(correction.loss)v-=correction.loss*Math.exp((correction.flight??.02)/80)*integral(lo,hi,1/(1/tau+1/80),c,s,w);return v;}
export function expectation(edges,p,correction={}){return edges.slice(0,-1).map((lo,i)=>p.N0*shape(lo,edges[i+1],p.tau,p.A*Math.cos(p.phi),-p.A*Math.sin(p.phi),p.omega,correction));}
function nm(fn,start,steps,max=700){const n=start.length;let simplex=[start,...steps.map((s,i)=>start.map((v,j)=>v+(i===j?s:0)))].map(x=>({x,f:fn(x)})),iterations=0;
 for(;iterations<max;iterations++){simplex.sort((a,b)=>a.f-b.f);if(Math.abs(simplex[n].f-simplex[0].f)<1e-8&&simplex.every(v=>v.x.every((x,i)=>Math.abs(x-simplex[0].x[i])<1e-5)))break;
 const centroid=start.map((_,j)=>simplex.slice(0,n).reduce((s,v)=>s+v.x[j],0)/n),candidate=factor=>{const x=centroid.map((v,j)=>v+factor*(v-simplex[n].x[j]));return {x,f:fn(x)};},r=candidate(1);
 if(r.f<simplex[0].f){const e=candidate(2);simplex[n]=e.f<r.f?e:r;}else if(r.f<simplex[n-1].f)simplex[n]=r;else {const factor=r.f<simplex[n].f?.5:-.5,c=candidate(factor);if(c.f<Math.min(r.f,simplex[n].f))simplex[n]=c;else for(let i=1;i<=n;i++){simplex[i].x=simplex[i].x.map((x,j)=>(x+simplex[0].x[j])/2);simplex[i].f=fn(simplex[i].x);}}
 }simplex.sort((a,b)=>a.f-b.f);return {...simplex[0],iterations,converged:iterations<max};}
export function invert(a){const n=a.length,m=a.map((row,i)=>[...row,...Array.from({length:n},(_,j)=>i===j?1:0)]);for(let i=0;i<n;i++){let pivot=i;for(let j=i+1;j<n;j++)if(Math.abs(m[j][i])>Math.abs(m[pivot][i]))pivot=j;if(Math.abs(m[pivot][i])<1e-18)throw Error('Singular covariance');[m[i],m[pivot]]=[m[pivot],m[i]];let v=m[i][i];m[i]=m[i].map(x=>x/v);for(let j=0;j<n;j++)if(i!==j){let v=m[j][i];m[j]=m[j].map((x,k)=>x-v*m[i][k]);}}return m.map(row=>row.slice(n));}
function positiveDefinite(a){let n=a.length,L=Array.from({length:n},()=>new Array(n).fill(0));for(let i=0;i<n;i++)for(let j=0;j<=i;j++){let v=a[i][j];for(let k=0;k<j;k++)v-=L[i][k]*L[j][k];if(i===j){if(!(v>0))return false;L[i][j]=Math.sqrt(v);}else L[i][j]=v/L[j][j];}return true;}
export function deviance(y,mu){return y.reduce((s,n,i)=>s+2*(mu[i]-n+(n?n*Math.log(n/mu[i]):0)),0);}
export function fitHistogram(h,correction={},progress=()=>{}){const {edges,counts:y}=h,n=y.reduce((a,b)=>a+b,0),fail=reason=>({ok:false,reason,histogram:h});if(n<600)return fail('Insufficient information: at least 600 selected arrivals are required.');
 const mids=y.map((_,i)=>(edges[i]+edges[i+1])/2);
 const evaluate=x=>{const [lt,c,s,w]=x,tau=Math.exp(lt);if(tau<10||tau>200||c*c+s*s>=.95**2||w<.2||w>3.5)return 1e80;let total=0,logSum=0;for(let i=0;i<y.length;i++){const v=shape(edges[i],edges[i+1],tau,c,s,w,correction);if(!(v>0))return 1e80;total+=v;if(y[i])logSum+=y[i]*Math.log(v);}return n*Math.log(total)-logSum;};
 // Lifetime initialization from observations, using a smooth exponential-only Poisson fit.
 const nullFit=nm(x=>evaluate([x[0],0,0,1]),[Math.log(65)],[.1],150),lt=nullFit.x[0],tau0=Math.exp(lt),base=edges.slice(0,-1).map((v,i)=>shape(v,edges[i+1],tau0,0,0,1,correction)),sum=base.reduce((a,b)=>a+b,0),freqs=[];
 for(let w=.2;w<=3.50001;w+=.005){let c=0,s=0;for(let i=0;i<y.length;i++){const d=y[i]-n*base[i]/sum;c+=d*Math.cos(w*mids[i]);s+=d*Math.sin(w*mids[i]);}freqs.push({w,c:2*c/n,s:2*s/n,score:c*c+s*s});}
 freqs.sort((a,b)=>b.score-a.score);const seeds=[];for(const f of freqs)if(seeds.every(g=>Math.abs(g.w-f.w)>.045)){seeds.push(f);if(seeds.length===10)break;}
 const results=seeds.map((f,i)=>{progress({stage:'Frequency search',completed:i,total:10});const amp=Math.hypot(f.c,f.s),fac=amp>.8?.8/amp:1;return nm(evaluate,[lt,f.c*fac,f.s*fac,f.w],[.06,.06,.06,.003]);}).sort((a,b)=>a.f-b.f);
 const best=results[0],[logtau,c,s,omega]=best.x,tau=Math.exp(logtau),A=Math.hypot(c,s),phi=Math.atan2(-s,c),total=edges.slice(0,-1).reduce((v,lo,i)=>v+shape(lo,edges[i+1],tau,c,s,omega,correction),0),params={N0:n/total,tau,A,omega,phi};
 if(!best.converged)return fail('Optimizer did not converge. Increase data or change the fit window.');
 const alt=results.find(r=>Math.abs(r.x[3]-omega)>.02),aliasDelta=alt?alt.f-best.f:Infinity;
 if(aliasDelta<4)return fail('Frequency ambiguity: competing solutions remain within Δ log L = 4.');
 if(2*(nullFit.f-best.f)<35||A<.015)return fail('Insufficient coherent modulation: frequency is not identifiable (polarization, threshold or sample size).');
 if(omega<.205||omega>3.495||tau<10.2||tau>198||A>.94)return fail('Fit at a physical/search boundary; uncertainty is unreliable.');
 const mu=expectation(edges,params,correction),keys=['N0','tau','A','omega','phi'],steps=[params.N0*1e-4,.005,1e-5,1e-5,1e-4];
 const nll=p=>{const m=expectation(edges,p,correction);return m.reduce((v,x,i)=>v+x-(y[i]?y[i]*Math.log(x):0),0);},f0=nll(params),H=keys.map(()=>new Array(5).fill(0));
 for(let i=0;i<5;i++)for(let j=0;j<=i;j++){let val;if(i===j){val=(nll({...params,[keys[i]]:params[keys[i]]+steps[i]})-2*f0+nll({...params,[keys[i]]:params[keys[i]]-steps[i]}))/(steps[i]*steps[i]);}else{let sum=0;for(const si of [-1,1])for(const sj of [-1,1])sum+=si*sj*nll({...params,[keys[i]]:params[keys[i]]+si*steps[i],[keys[j]]:params[keys[j]]+sj*steps[j]});val=sum/(4*steps[i]*steps[j]);}H[i][j]=H[j][i]=val;}
 if(!positiveDefinite(H))return fail('Observed likelihood curvature is not positive definite; covariance rejected.');
 let cov;try{cov=invert(H);}catch{return fail('Singular covariance; frequency uncertainty rejected.');}
 const errors=Object.fromEntries(keys.map((k,i)=>[k,Math.sqrt(cov[i][i])])),correlations=cov.map((row,i)=>row.map((x,j)=>x/Math.sqrt(cov[i][i]*cov[j][j])));
 if(!Number.isFinite(errors.omega)||errors.omega>.1||A/errors.A<4)return fail('Oscillation significance or covariance is too weak to quote a reliable frequency.');
 const d=deviance(y,mu),r=random(310557),reference=Array.from({length:160},()=>deviance(mu.map(m=>poisson(r,m)),mu)).sort((a,b)=>a-b),q99=reference[158];
 return {ok:true,params,errors,covariance:cov,correlations,parameterOrder:keys,mu,histogram:h,correction,n,converged:true,iterations:best.iterations,aliasDelta:Number.isFinite(aliasDelta)?aliasDelta:null,search:[.2,3.5],deviance:d,ndf:y.length-5,reference99:q99,mismatch:d>q99,diagnostic:'99% fixed-parameter Poisson deviance reference (160 draws; no parameter refit, not a calibrated fit p-value)',residuals:y.map((v,i)=>(v-mu[i])/Math.sqrt(mu[i])),nullLikelihoodRatio:2*(nullFit.f-best.f)};
}
