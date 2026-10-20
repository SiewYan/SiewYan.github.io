import {C} from './constants.js';
import {mod,helix} from './physics.js';
export const calorimeters=Array.from({length:24},(_,i)=>({id:i+1,az:2*Math.PI*i/24,r:C.referenceR-.35,halfWidth:.42,halfHeight:.10}));
export const trackers=[{id:1,az:2*Math.PI*7/24,r:C.referenceR-.17,halfWidth:.45,halfHeight:.08},{id:2,az:2*Math.PI*15/24,r:C.referenceR-.17,halfWidth:.45,halfHeight:.08}];
// Exact intersection with a finite vertical tangent rectangle, first cyclotron turn.
export function intersect(vertex,p,B,surface){const k=C.k*B,E=Math.hypot(...p),nx=Math.cos(surface.az),ny=Math.sin(surface.az),cx=vertex[0]+p[1]/k,cy=vertex[1]-p[0]/k,dx=-p[1]/k,dy=p[0]/k;
 const a=nx*dx+ny*dy,b=nx*dy-ny*dx,v=surface.r-nx*cx-ny*cy,h=Math.hypot(a,b);if(!h||Math.abs(v)>h)return null;
 const base=Math.atan2(b,a),off=Math.acos(Math.max(-1,Math.min(1,v/h))),candidates=[mod(base+off),mod(base-off)].sort((x,y)=>x-y);
 for(const angle of candidates){if(angle<1e-9)continue;const flight=angle*E/(C.c*k),point=helix(vertex,p,B,flight),u=-ny*point[0]+nx*point[1];if(Math.abs(u)<=surface.halfWidth&&Math.abs(point[2])<=surface.halfHeight)return {station:surface.id,flight,point,u,angle};}return null;}
export function detectorHit(vertex,p,B){let first=null;for(const s of calorimeters){const h=intersect(vertex,p,B,s);if(h&&(!first||h.flight<first.flight))first=h;}return first;}
export function trackerHits(vertex,p,B,maxFlight,normal){const hits=[];for(const s of trackers){for(let module=0;module<8;module++){const h=intersect(vertex,p,B,{...s,r:s.r-module*.006});if(h&&h.flight<maxFlight){const z=h.point[2];for(const stereo of [-.13,.13]){const coord=h.u*Math.cos(stereo)+z*Math.sin(stereo),wire=Math.round(coord/.005)*.005,drift=Math.abs(coord-wire);hits.push({station:s.id,module,stereo,wire,drift,measuredDrift:Math.max(0,drift+.00015*normal()),point:h.point});}}}}return hits;}
