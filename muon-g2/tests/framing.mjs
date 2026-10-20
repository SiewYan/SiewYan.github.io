import assert from 'node:assert/strict';
import {PerspectiveCamera} from '../vendor/three.module.js';
import {frameRing} from '../app/framing.js';
let checks=0;
for(const aspect of [.65,1,1.14,1.8,2.5,3.2])for(const elevation of ['overview','top'])for(const yaw of [0,.8,2.2,4.7]){
 const camera=new PerspectiveCamera(42,aspect,.03,120);camera.up.set(0,0,1);
 const d=elevation==='top'?[0,.01,26]:[9,-12,12],direction=[d[0]*Math.cos(yaw)-d[1]*Math.sin(yaw),d[0]*Math.sin(yaw)+d[1]*Math.cos(yaw),d[2]];
 const b=frameRing(camera,direction),r=b.ring,a=b.apparatus;
 assert.ok(Math.abs(r.minX+r.maxX)<1e-9&&Math.abs(r.minY+r.maxY)<1e-9,'Ring silhouette must be centered');
 assert.ok(Math.max(...Object.values(a).map(Math.abs))<=.88001,'Entire apparatus must fit with padding');
 assert.ok(Number.isFinite(b.distance));checks++;
}
console.log(`PASS ${checks} camera cases: centered and unclipped across aspect ratios, rotation and top/overview views`);
