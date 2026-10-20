export function hash(s){let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
export function random(seed){let a=Number(seed)>>>0; return ()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
export const normal=r=>Math.sqrt(-2*Math.log(Math.max(1e-15,r())))*Math.cos(2*Math.PI*r());
export const exponential=(r,mean)=>-mean*Math.log(1-r());
export function poisson(r,lambda){if(lambda<30){let k=0,p=1,L=Math.exp(-lambda);do{k++;p*=r();}while(p>L);return k-1;} // exact PTRS rejection for large means
 const b=.931+2.53*Math.sqrt(lambda),a=-.059+.02483*b,inv=1.1239+1.1328/(b-3.4),vr=.9277-3.6224/(b-2);
 for(;;){const u=r()-.5,v=r(),us=.5-Math.abs(u),k=Math.floor((2*a/us+b)*u+lambda+.43);if(us>=.07&&v<=vr)return k;if(k<0||(us<.013&&v>us))continue;if(Math.log(v*inv/(a/(us*us)+b))<=-lambda+k*Math.log(lambda)-logGamma(k+1))return k;}}
export function logGamma(z){const cof=[676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-.13857109526572012,9.984369578019572e-6,1.5056327351493116e-7];let x=.99999999999980993;z--;for(let i=0;i<cof.length;i++)x+=cof[i]/(z+i+1);let t=z+7.5;return .9189385332046727+(z+.5)*Math.log(t)-t+Math.log(x);}
