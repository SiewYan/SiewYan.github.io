import {CATEGORIES} from './physics.js';
export const MODEL_VERSION='cms-teaching-v2';
export const PROCESSES={
 zmm:{title:'A clean mass standard',chain:'Z → μ⁺ + μ⁻',text:'Opposite-charge muons form a narrow dimuon peak. Compare the fitted mass with the injected Z mass.',peak:'Dimuon mass',injected:91.1876,observables:['peak','leadPt','met']},
 zee:{title:'The same resonance, different response',chain:'Z → e⁺ + e⁻',text:'Electrons use a broader toy momentum response than muons. Compare the peak width with the dimuon sample.',peak:'Dielectron mass',injected:91.1876,observables:['peak','leadPt','met']},
 hgg:{title:'Higgs through light',chain:'g + g → H → γ + γ',text:'A leading-order gluon-fusion-inspired topology with no Higgs transverse recoil. Two photons reconstruct the Higgs mass.',peak:'Diphoton mass',injected:125.1,observables:['peak','leadPt','met']},
 h4l:{title:'The golden four-lepton channel',chain:'g + g → H → Z Z* → e⁺e⁻ μ⁺μ⁻',text:'One Z is on shell; the other has a toy mass sampled uniformly from 12–32 GeV. All four leptons reconstruct the Higgs. This virtual-mass spectrum is an illustration, not the Standard Model prediction.',peak:'Four-lepton mass',injected:125.1,observables:['peak','zMass','zOffMass','leadPt','met']},
 vbf:{title:'Forward jets tell a production story',chain:'q + q → q + q + H; H → γγ',text:'Two widely separated forward jet proxies accompany a recoiling Higgs. Inspect their invariant mass and pseudorapidity gap. This is a VBF-inspired topology, not a calculation of production probabilities.',peak:'Diphoton mass',injected:125.1,observables:['peak','mjj','deta','ht','met']},
 ttbar:{title:'Rebuild a top quark',chain:'tt̄ → (b W⁺)(b̄ W⁻) → (b jj)(b̄ μ⁻ ν̄μ)',text:'Combine the two assigned W jets, then add the assigned b jet. The hadronic top can be reconstructed without a neutrino. Assignment uses generator truth; no jet clustering, b tagging or combinatorial search is performed.',peak:'Hadronic top mass',injected:172.5,observables:['peak','wMass','ht','met','leadPt']},
 ttll:{title:'Two invisible particles',chain:'tt̄ → (b e⁺ νe)(b̄ μ⁻ ν̄μ)',text:'Two charged leptons, two b-jet proxies and missing transverse momentum. Two neutrinos prevent a simple visible invariant-mass reconstruction of the tops; the Gaussian mass fit is intentionally unavailable.',observables:['met','ht','leadPt']},
 jj:{title:'A busy, balanced collision',chain:'Two opposing groups of toy jet constituents',text:'Explore the dijet mass and scalar sum of jet transverse momenta. There is no injected resonance in this continuum sample.',observables:['mjj','ht','met']},
 wmn:{title:'An edge instead of a peak',chain:'W⁺ → μ⁺ + νμ',text:'The neutrino is inferred from transverse imbalance. The transverse mass uses the muon and missing momentum; it has an endpoint near the injected W mass before smearing. A Gaussian peak fit is inappropriate.',observables:['mt','met','leadPt']}
};
export function observable(category,key){const p=PROCESSES[category];return ({peak:{label:p.peak,unit:'GeV/c²',injected:p.injected,fit:true,formula:'m² = (ΣE)² − |Σp|²  (c = 1)'},wMass:{label:'Assigned W dijet mass',unit:'GeV/c²',injected:80.38,fit:true,formula:'m(j₁ + j₂), using the known W daughters'},zMass:{label:'On-shell Z mass',unit:'GeV/c²',injected:91.1876,fit:true,formula:'m(e⁺ + e⁻)'},zOffMass:{label:'Off-shell Z* mass',unit:'GeV/c²',formula:'m(μ⁺ + μ⁻); injected virtual mass: uniform 12–32 GeV'},met:{label:'Missing transverse momentum',unit:'GeV/c',formula:'pTmiss = |−Σvisible p⃗T|'},ht:{label:'Jet HT',unit:'GeV/c',formula:'HT = Σjets |p⃗T|'},leadPt:{label:'Leading visible particle pT',unit:'GeV/c',formula:'max √(px² + py²), over visible particles'},mjj:{label:'Dijet invariant mass',unit:'GeV/c²',formula:'m(j₁ + j₂)'},deta:{label:'Tag-jet separation |Δη|',unit:'',formula:'|η(j₁) − η(j₂)|'},mt:{label:'W transverse mass',unit:'GeV/c²',formula:'mT² = 2 pT(μ) pTmiss [1 − cos Δφ]  (c = 1)'}})[key];}
export function gaussianFit(values){
 if(values.length<20||values.some(x=>!Number.isFinite(x)))return null;
 const n=values.length,mean=values.reduce((a,x)=>a+x,0)/n,variance=values.reduce((a,x)=>a+(x-mean)**2,0)/n,sigma=Math.sqrt(variance);
 if(!sigma)return null;
 return {n,mean,sigma,meanError:sigma/Math.sqrt(n),sigmaError:sigma/Math.sqrt(2*n)};
}
export function recordEvent(e){return {key:`${e.category}:${e.seed}`,category:e.category,seed:e.seed,values:{...e.values}};}
export function collectRecord(records,e){if(e.pileup||records.length>=20000)return false;const r=recordEvent(e);if(records.some(x=>x.key===r.key))return false;records.push(r);return true;}
export function validRecords(raw){
 const seen=new Set();return Array.isArray(raw)?raw.slice(0,20000).filter(r=>{
  if(!r||!CATEGORIES[r.category]||!Number.isInteger(r.seed)||r.seed<0||r.seed>4294967295||r.key!==`${r.category}:${r.seed}`||!r.values||!PROCESSES[r.category].observables.every(k=>Number.isFinite(r.values[k]))||seen.has(r.key))return false;
  seen.add(r.key);return true;
 }):[];
}
