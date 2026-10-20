import {Vector3} from '../vendor/three.module.js';

// Fit the visible apparatus, then center the projected ring silhouette. A perspective
// view of a circle is not generally centered on the projection of its world origin.
// Only the camera changes: physical geometry and detector-hit coordinates stay fixed.
export const ringBounds = Array.from({length:96},(_,i)=>{
 const a=i*Math.PI/48;
 return [-.85,.85].map(z=>new Vector3(8.15*Math.cos(a),8.15*Math.sin(a),z));
}).flat();
export const apparatusBounds = [...ringBounds,
 ...[7.12,7.31].flatMap(x=>[-6.5,-.5].flatMap(y=>[-.1,.1].map(z=>new Vector3(x,y,z))))];

function projectBounds(camera,points){
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
 for(const point of points){const p=point.clone().project(camera);minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);}
 return {minX,maxX,minY,maxY};
}

export function frameRing(camera,direction,zoom=1){
 const axis=new Vector3(...direction).normalize();
 function place(distance){
  camera.clearViewOffset();camera.position.copy(axis).multiplyScalar(distance);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);
  const b=projectBounds(camera,ringBounds),cx=(b.minX+b.maxX)/2,cy=(b.minY+b.maxY)/2;
  camera.projectionMatrix.elements[8]+=cx;camera.projectionMatrix.elements[9]+=cy;
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  return projectBounds(camera,apparatusBounds);
 }
 let low=12,high=160;
 for(let i=0;i<24;i++){
  const mid=(low+high)/2,b=place(mid),extent=Math.max(Math.abs(b.minX),Math.abs(b.maxX),Math.abs(b.minY),Math.abs(b.maxY));
  if(extent>.88)low=mid;else high=mid;
 }
 const distance=high*zoom;camera.far=Math.max(120,distance+30);place(distance);
 return {distance,ring:projectBounds(camera,ringBounds),apparatus:projectBounds(camera,apparatusBounds)};
}
