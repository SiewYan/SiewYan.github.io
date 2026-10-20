import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {buildDetector} from './detector.js';
import {TYPES,pt,trajectory} from './physics.js';
export function createScene(container,state,onSelect){
 let renderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});}catch{return null;}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x030e17,1);renderer.outputColorSpace=T.SRGBColorSpace;container.appendChild(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color(0x030e17);const camera=new T.PerspectiveCamera(39,1,.01,250);camera.up.set(0,1,0);
 scene.add(new T.AmbientLight(0xb8d9ff,.7));const key=new T.DirectionalLight(0xa8c8ff,1.1);key.position.set(10,20,10);scene.add(key);const rim=new T.DirectionalLight(0x4275ac,.6);rim.position.set(-10,0,-15);scene.add(rim);
 const detector=buildDetector(scene),events=new T.Group(),truths=new T.Group();scene.add(events,truths);
 const grid=new T.GridHelper(65,65,0x274356,0x112a3b);grid.position.y=-7.7;grid.material.transparent=true;grid.material.opacity=.12;scene.add(grid);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.08;controls.minDistance=2;controls.maxDistance=85;controls.autoRotateSpeed=.35;
 const composer=new EffectComposer(renderer);composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new T.Vector2(1,1),.42,.35,1.05);composer.addPass(bloom);composer.addPass(new OutputPass());
 // Only event materials exceed bloom threshold; detector materials stay subdued.
 const unitSphere=new T.SphereGeometry(1,8,6),unitBox=new T.BoxGeometry(1,1,1);let eventObjects=[],selectable=[],current=null;
 const shared=new Set([unitSphere,unitBox]);
 const raycaster=new T.Raycaster();raycaster.params.Line.threshold=.11;let down=[0,0];
 renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
 renderer.domElement.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=container.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);let hit=raycaster.intersectObjects(selectable).find(h=>h.object.visible&&h.object.parent.visible);onSelect(hit?hit.object.userData.id:null);});
 function dispose(group){while(group.children.length){const c=group.children[0];group.remove(c);c.traverse(o=>{if(o.geometry&&!shared.has(o.geometry))o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose();}});}}
 function line(points,color,opacity=1,dashed=false){let g=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p)));let mat=dashed?new T.LineDashedMaterial({color,dashSize:.14,gapSize:.10,transparent:true,opacity,depthTest:false}):new T.LineBasicMaterial({color,transparent:true,opacity,depthTest:false});const l=new T.Line(g,mat);l.renderOrder=20;if(dashed)l.computeLineDistances();return l;}
 function load(event){
  current=event;dispose(events);dispose(truths);eventObjects=[];selectable=[];
  for(const p of event.particles){if(p.type==='neutrino')continue;const color=new T.Color(TYPES[p.type].color);const response=p.response;
   const group=new T.Group(),items=[];group.userData.id=p.id;events.add(group);
   const track=p.q||p.type==='photon'?line(response.trackPoints,color.clone().multiplyScalar(p.type==='muon'?1.9:1.2),1,!p.q):null;
   if(track){track.userData.id=p.id;track.userData.particle=p;group.add(track);selectable.push(track);items.push({obj:track,stage:2,track:true,start:0,total:response.points.length});}
   if(p.type==='muon'&&response.extrapolation.length){const outer=line(response.extrapolation,color.clone().multiplyScalar(1.3),.7,true);outer.userData.id=p.id;group.add(outer);selectable.push(outer);items.push({obj:outer,stage:2,track:true,start:response.trackPoints.length-1,total:response.points.length});}
   for(const h of response.hits){const mu=h.system==='muon',mesh=new T.Mesh(mu?unitBox:unitSphere,new T.MeshBasicMaterial({color:color.clone().multiplyScalar(mu?2.3:1.6),transparent:true}));mesh.position.set(...h.position);mesh.scale.set(mu?.09:.035,mu?.3:.035,mu?.3:.035);mesh.userData.id=p.id;group.add(mesh);selectable.push(mesh);items.push({obj:mesh,stage:1,system:h.system});}
   for(const d of response.deposits){const mesh=new T.Mesh(unitBox,new T.MeshBasicMaterial({color:color.clone().multiplyScalar(1.6),transparent:true}));mesh.position.set(...d.position);const size=.06+Math.min(.38,Math.sqrt(d.E)*.04);mesh.scale.set(size,size,size*1.3);mesh.lookAt(0,0,0);mesh.userData.id=p.id;group.add(mesh);selectable.push(mesh);items.push({obj:mesh,stage:1,system:d.system});}
   if(p.type==='muon'){const a=response.points.at(-1),marker=new T.Mesh(unitSphere,new T.MeshBasicMaterial({color:color.clone().multiplyScalar(2),transparent:true}));marker.scale.setScalar(.075);marker.position.set(...a);group.add(marker);items.push({obj:marker,stage:3});}
   const truth=line(trajectory(p,true),0xe5ecff,.4,true);truths.add(truth);truth.userData.id=p.id;
   eventObjects.push({p,group,items,truth});
  }
  // Event-level transverse missing momentum arrow. Never detector hits or neutrino trajectory.
  const m=event.met;if(m.pt>.3){const len=Math.min(5,.8+m.pt*.07),dir=new T.Vector3(m.px/m.pt,m.py/m.pt,0);const arrow=new T.ArrowHelper(dir,new T.Vector3(),len,0xe570f7,.25,.13);arrow.userData.met=true;events.add(arrow);eventObjects.push({met:true,group:arrow});}
  for(const j of event.jets){const dir=new T.Vector3(j.px,j.py,j.pz).normalize(),len=2.7;const cone=new T.Mesh(new T.ConeGeometry(.42,len,18,1,true),new T.MeshBasicMaterial({color:0xffa263,transparent:true,opacity:.13,side:T.DoubleSide,depthWrite:false}));cone.position.copy(dir.clone().multiplyScalar(len/2));cone.quaternion.setFromUnitVectors(new T.Vector3(0,-1,0),dir);events.add(cone);eventObjects.push({jet:true,group:cone});}
  events.traverse(o=>{if(o.isMesh||o.isLine)o.renderOrder=20;});
  const flash=new T.Mesh(unitSphere,new T.MeshBasicMaterial({color:new T.Color(2,2.6,3),transparent:true}));flash.scale.setScalar(.08);events.add(flash);eventObjects.push({flash:true,group:flash});
 }
 function visible(p){return state.filters[p.type]&&(p.q?pt(p.rec)>=state.pt:true);}
 function update(progress){
  const stage=Math.min(3,Math.floor(progress*4));
  for(const entry of eventObjects){if(entry.met){entry.group.visible=stage>=3&&state.filters.met;continue;}if(entry.jet){entry.group.visible=stage>=3&&state.filters.jet;continue;}if(entry.flash){entry.group.scale.setScalar(.04+.14*(1-progress));entry.group.material.opacity=.6;continue;}
   const {p,group,items,truth}=entry;group.visible=visible(p);truth.visible=state.truth&&group.visible;truth.material.opacity=state.selected&&state.selected!==p.id?.1:.4;
   for(const i of items){i.obj.visible=stage>=i.stage&&(!i.system||state.systems[i.system]);i.obj.material.opacity=state.selected&&state.selected!==p.id?.22:1;
    if(i.track){const n=i.obj.geometry.attributes.position.count;i.obj.geometry.setDrawRange(0,Math.max(0,Math.min(n,Math.floor(i.total*Math.min(1,Math.max(0,(progress-.35)/.4)))-i.start)));}
    if(i.stage===1){let r=i.obj.position.length();i.obj.visible&&=progress>.12+Math.min(.22,r*.018);}
   }
  }
  controls.autoRotate=state.orbit;controls.update();
 }
 function preset(i){const poses=[[30,9,22],[0,0,33],[32,0,0],[3.5,2.4,4.5],[23,16,35]];camera.position.set(...poses[i]);controls.target.set(0,0,0);if(innerWidth>1099&&i!==3)controls.target.set(0,-2,0);controls.update();}
 function resize(){const r=container.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height);composer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.fov=r.width<600?58:39;camera.updateProjectionMatrix();}
 const observer=new ResizeObserver(resize);observer.observe(container);preset(0);resize();
 function project(v){const p=new T.Vector3(...v).project(camera);return {x:(p.x*.5+.5)*container.clientWidth,y:(-.5*p.y+.5)*container.clientHeight,visible:p.z<1};}
 return {renderer,detector,load,update,preset,project,render:()=>composer.render(),capture:()=>{composer.render();const c=document.createElement('canvas');c.width=renderer.domElement.width;c.height=renderer.domElement.height;const ctx=c.getContext('2d');ctx.drawImage(renderer.domElement,0,0);ctx.fillStyle='#e6f0fa';ctx.font='20px monospace';ctx.fillText('CMS // Event Display',24,36);ctx.font='12px monospace';ctx.fillStyle='#a8baff';ctx.fillText('SIMULATED EVENT · seed '+current.seed+' · '+current.category,24,60);ctx.fillText('Approximate Run 3 geometry · illustrative outer muon continuation',24,c.height-24);return c.toDataURL('image/png');},reduceQuality:()=>{renderer.setPixelRatio(1);bloom.enabled=false;resize();}};
}
