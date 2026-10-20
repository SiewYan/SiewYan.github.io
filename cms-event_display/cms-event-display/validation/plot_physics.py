"""Independent ideal-field geometry figure; requires NumPy and Matplotlib."""
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from pathlib import Path
K=.2998; B=3.8; R=.6/(K*B); t=np.linspace(0,2*np.pi,1200); a=.7
x=R*(np.sin(a)-np.sin(a-t)); y=R*(np.cos(a-t)-np.cos(a)); z=.2/(K*B)*t
plt.rcParams.update({'font.size':10,'axes.spines.top':False,'axes.spines.right':False})
fig,axs=plt.subplots(1,3,figsize=(13.2,4.3),layout='constrained')
ax=axs[0]; ax.plot(x,y,color='#2251ff',lw=2); ax.scatter([0],[0],color='black',s=25,label='Production vertex'); ax.scatter([R*np.sin(a)],[-R*np.cos(a)],marker='+',s=65,color='#be7d2c',label='Orbit centre'); ax.set_aspect('equal'); ax.set(xlabel='x [m]',ylabel='y [m]',title='A curl is a circle, not an expanding spiral'); ax.legend(loc='lower left',fontsize=8); ax.grid(alpha=.2)
ax=axs[1]; Rm=45.731152085124364/(K*B); tm=np.linspace(0,2*np.arcsin(1.1/(2*Rm)),150); xm=Rm*np.sin(tm); ym=Rm*(np.cos(tm)-1); ax.plot(xm,ym*1000,color='#d63358',lw=2); ax.axhline(0,color='#bbb',lw=1,ls='--'); ax.set(xlabel='Along initial direction x [m]',ylabel='Lateral bending y [mm]',title='45.7 GeV/c muon: R ≈ 40.14 m'); ax.text(.04,.12,'Different x/y units: bending magnified',transform=ax.transAxes,fontsize=8,color='#666'); ax.grid(alpha=.2)
ax=axs[2]; r=np.hypot(x,y); ax.plot(z,np.sign(y)*r,color='#df6171',lw=1.2,ls='--',label='Old sign(y) × r: false jump'); ax.plot(z,r,color='#2251ff',lw=2,label='Correct r = √(x² + y²)'); ax.set(xlabel='z [m]',ylabel='Radial coordinate [m]',title='Corrected longitudinal projection'); ax.legend(loc='lower left',fontsize=8); ax.grid(alpha=.2)
fig.suptitle('CMS display physics check · ideal uniform +3.8 T field',fontsize=15,fontweight='bold')
fig.savefig(Path(__file__).with_name('physics-check.png'),dpi=170,facecolor='white')
