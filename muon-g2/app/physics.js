import {C,scales} from './constants.js';
export const TAU=2*Math.PI;
export const mod=x=>(x%TAU+TAU)%TAU;
// +z field, positive charge; clockwise viewed from +z.
export function orbit(t,p,B,a,charge=1){const s=scales(p,B,a),theta=-charge*s.wc*t,pa=theta-Math.PI/2*charge,sa=pa-charge*s.wa*t;return {position:[s.R*Math.cos(theta),s.R*Math.sin(theta),0],momentum:[p*Math.cos(pa),p*Math.sin(pa),0],spin:[Math.cos(sa),Math.sin(sa),0],phase:-charge*s.wa*t,theta};}
export function michel(r,P){for(;;){const x=r(),ct=2*r()-1;const pdf=x*x*((3-2*x)+P*ct*(2*x-1));if(2*r()<pdf)return {x,ct,az:TAU*r()};}}
export function boostPositron(m,phase,p){const s=scales(p),e=m.x*C.massGeV/2,st=Math.sqrt(1-m.ct*m.ct),u=st*Math.cos(m.az),v=st*Math.sin(m.az);
 const nl=m.ct*Math.cos(phase)-u*Math.sin(phase),nt=m.ct*Math.sin(phase)+u*Math.cos(phase);
 return {energy:s.gamma*e*(1+s.beta*nl),local:[s.gamma*e*(nl+s.beta),e*nt,e*v],restEnergy:e};}
export function positronMomentum(local,theta){const [l,t,z]=local;return [l*Math.sin(theta)+t*Math.cos(theta),-l*Math.cos(theta)+t*Math.sin(theta),z];}
export function helix(vertex,p,B,dt,charge=1){const E=Math.hypot(...p),k=C.k*B*charge,w=C.c*k/E,th=w*dt;return [vertex[0]+(p[0]*Math.sin(th)+p[1]*(1-Math.cos(th)))/k,vertex[1]+(p[1]*Math.sin(th)-p[0]*(1-Math.cos(th)))/k,vertex[2]+C.c*p[2]/E*dt];}
export function helixMomentum(p,B,dt,charge=1){const th=C.c*C.k*B*charge/Math.hypot(...p)*dt;return [p[0]*Math.cos(th)+p[1]*Math.sin(th),p[1]*Math.cos(th)-p[0]*Math.sin(th),p[2]];}
