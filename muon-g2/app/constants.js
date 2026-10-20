// Units: GeV, m, microseconds, tesla. SI constants are explicitly suffixed.
export const C = Object.freeze({c:299.792458, k:0.299792458, qSI:1.602176634e-19,
 massGeV:0.1056583755, massSI:0.1056583755*1e9*1.602176634e-19/(299792458**2), tau0:2.1969811,
 anomaly:0.001165920, referenceR:7.112, referenceP:3.094,
 referenceB:3.094/(0.299792458*7.112), acquisition:700, perFill:1000,
 version:'ring-to-result-1.0.0'});
export const defaults = Object.freeze({seed:240989, p:C.referenceP, spread:0, polarization:0.97,
 B:C.referenceB, anomaly:C.anomaly, mode:'ideal', efficiencyLoss:0, gainDrift:0});
export function scales(p=C.referenceP,B=C.referenceB,a=C.anomaly) {
 const gamma=Math.hypot(p,C.massGeV)/C.massGeV, beta=p/(gamma*C.massGeV);
 const wc=C.qSI*B/(gamma*C.massSI)*1e-6, wa=a*C.qSI*B/C.massSI*1e-6;
 return {gamma,beta,R:p/(C.k*B),wc,wa,tau:gamma*C.tau0,Tc:2*Math.PI/wc,Ta:wa?2*Math.PI/wa:Infinity,fa:wa/(2*Math.PI)*1000};
}
