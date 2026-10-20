import * as T from 'three';
// Approximate display envelopes in metres; not survey or engineering geometry.
import {GEOMETRY} from './geometry-config.js';
export {GEOMETRY};
export const SYSTEMS={beam:{name:'Beam pipe',color:'#66869e'},pixel:{name:'Pixel tracker',color:'#73d8ee'},strip:{name:'Silicon strip tracker',color:'#3c9faf'},ecal:{name:'ECAL',color:'#50b5a4'},hcal:{name:'HCAL',color:'#ba995c'},solenoid:{name:'Solenoid',color:'#697ea8'},yoke:{name:'Steel return yoke',color:'#995964'},muon:{name:'Muon · DT / CSC / RPC',color:'#9bbed7'},gem:{name:'GEM · GE1/1',color:'#8c9fd2'},forward:{name:'Forward HCAL',color:'#a08d66'}};
function wedge(r1,r2,length,angle){
 const shape=new T.Shape();shape.absarc(0,0,r2,-angle/2,angle/2,false);shape.lineTo(r1*Math.cos(angle/2),r1*Math.sin(angle/2));shape.absarc(0,0,r1,angle/2,-angle/2,true);shape.closePath();
 const g=new T.ExtrudeGeometry(shape,{depth:length,bevelEnabled:false,curveSegments:3});g.translate(0,0,-length/2);return g;
}
export function buildDetector(scene){
 const root=new T.Group(),batches=[],systems={};scene.add(root);Object.keys(SYSTEMS).forEach(k=>{systems[k]=new T.Group();root.add(systems[k]);});
 const dummy=new T.Object3D(),temp=new T.Vector3();
 function outline(g,count,color){const edge=new T.EdgesGeometry(g,25);const src=edge.attributes.position.array.slice();edge.dispose();const geom=new T.BufferGeometry();geom.setAttribute('position',new T.BufferAttribute(new Float32Array(src.length*count),3));const wire=new T.LineSegments(geom,new T.LineBasicMaterial({color,transparent:true,opacity:.18,depthWrite:false}));wire.userData.edge=src;wire.frustumCulled=false;return wire;}
 function ring(sys,r1,r2,len,zs,n=48,fill=.94){
  const g=wedge(r1,r2,len,Math.PI*2/n*fill),mat=new T.MeshStandardMaterial({color:SYSTEMS[sys].color,metalness:.45,roughness:.55,transparent:true,opacity:.33,depthWrite:false,side:T.DoubleSide});
  const transforms=[];for(let z of zs)for(let i=0;i<n;i++)transforms.push({z,a:i*Math.PI*2/n,radial:0});
  const mesh=new T.InstancedMesh(g,mat,transforms.length);mesh.frustumCulled=false;
  const wire=outline(g,transforms.length,SYSTEMS[sys].color);wire.frustumCulled=false;
  systems[sys].add(mesh,wire);batches.push({mesh,wire,transforms,sys,r:r2});
 }
 function chambers(r,zs){
  const geo=new T.BoxGeometry(.13,1.55,2.22),mat=new T.MeshStandardMaterial({color:0xa5d1eb,transparent:true,opacity:.28,metalness:.6,roughness:.5,depthWrite:false});
  const ts=[];for(let z of zs)for(let i=0;i<12;i++)ts.push({z,a:i*Math.PI/6,radial:r});
  const mesh=new T.InstancedMesh(geo,mat,ts.length),wire=outline(geo,ts.length,0xa5d1eb);systems.muon.add(mesh,wire);batches.push({mesh,wire,transforms:ts,sys:'muon',r});
 }
 ring('beam',.018,.026,25,[0],24);
 for(let r of GEOMETRY.pixel)ring('pixel',r,r+.008,.12,Array.from({length:8},(_,i)=>(i-3.5)*.13),24);
 for(let z of [.3,.4,.5])ring('pixel',.04,.18,.016,[-z,z],24);
 for(let r of GEOMETRY.strip)ring('strip',r,r+.018,.34,Array.from({length:14},(_,i)=>(i-6.5)*.36),36);
 for(let z of [1.25,1.5,1.8,2,2.2,2.45,2.65])ring('strip',.25,1.1,.035,[-z,z],36);
 ring('ecal',1.29,1.55,.42,Array.from({length:14},(_,i)=>(i-6.5)*.44),64);
 ring('ecal',.32,1.55,.25,[-3.2,3.2],64);
 ring('hcal',1.8,2.85,.65,Array.from({length:12},(_,i)=>(i-5.5)*.69),48);
 ring('hcal',.4,2.9,.7,[-4.65,4.65],48);
 ring('solenoid',3,3.4,.4,Array.from({length:28},(_,i)=>(i-13.5)*.445),48);
 const wheels=[-5.1,-2.55,0,2.55,5.1];
 for(let [r1,r2] of [[4.65,4.95],[5.65,5.95],[6.55,6.95]])ring('yoke',r1,r2,2.35,wheels,12,.97);
 for(let r of GEOMETRY.muon)chambers(r,wheels);
 for(let z of GEOMETRY.endcap){ring('yoke',.65,7.05,.38,[-z,z],12,.97);ring('muon',1,6.85,.09,[-z+.26,z-.26],36,.93);ring('muon',1.15,6.6,.035,[-z-.28,z+.28],36,.93);}
 ring('gem',1.45,2.45,.035,[-5.65,-5.72,5.65,5.72],36,.93);
 ring('forward',.15,1.35,1.45,[-GEOMETRY.forwardZ,GEOMETRY.forwardZ],36);
 function update(state){
  for(let [key,group] of Object.entries(systems))group.visible=state.systems[key];
  const cut=state.mode==='cutaway'?state.cut*Math.PI/180:0;
  for(let b of batches){
   b.mesh.material.opacity=state.opacity*(state.mode==='solid'?1.9:state.mode==='transparent'?.48:1);b.mesh.material.opacity=Math.min(.9,b.mesh.material.opacity);b.wire.material.opacity=state.mode==='transparent'?.025:.055;
   b.transforms.forEach((p,i)=>{
    // Opening faces the default camera (+x,+y); geometry only, never event coordinates.
    const a=T.MathUtils.euclideanModulo(p.a-Math.PI/4+Math.PI,Math.PI*2)-Math.PI;
    const hidden=b.sys!=='beam'&&Math.abs(a)<cut/2;
    let z=p.z;if(state.mode==='exploded')z+=Math.sign(z)*(Math.abs(z)>6?3.4:Math.abs(z)>2?.7:0);
    dummy.position.set(p.radial*Math.cos(p.a),p.radial*Math.sin(p.a),z);dummy.rotation.set(0,0,p.a);dummy.scale.setScalar(hidden?0:1);dummy.updateMatrix();b.mesh.setMatrixAt(i,dummy.matrix);const src=b.wire.userData.edge,dest=b.wire.geometry.attributes.position.array;for(let k=0;k<src.length;k+=3){temp.set(src[k],src[k+1],src[k+2]).applyMatrix4(dummy.matrix);dest.set([temp.x,temp.y,temp.z],i*src.length+k);}
   });b.mesh.instanceMatrix.needsUpdate=true;b.wire.geometry.attributes.position.needsUpdate=true;
  }
 }
 return {root,systems,update};
}
