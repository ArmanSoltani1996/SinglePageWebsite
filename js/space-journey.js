/* Cinematic, deterministic scroll-controlled deep space. Canvas 2D, no external assets. */
(()=>{
'use strict';
const canvas=document.getElementById('spaceJourney');
const ctx=canvas&&canvas.getContext('2d',{alpha:false});
if(!ctx)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let width=0,height=0,dpr=1,current=0,target=0,frameId=0;
const rnd=(seed)=>()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const random=rnd(20261116);
const stars=Array.from({length:1900},()=>({
 x:(random()-.5)*4.5,y:(random()-.5)*3.4,z:1+random()*80,
 size:.22+Math.pow(random(),7)*1.7,brightness:.25+random()*.7,
 color:random(),seed:random()
}));
const planets=[
 {x:.85,y:-.3,z:12,size:.24,kind:0,seed:12,ring:false},
 {x:-.9,y:.25,z:24,size:.29,kind:1,seed:23,ring:true},
 {x:.8,y:.48,z:38,size:.23,kind:2,seed:31,ring:false},
 {x:-.75,y:-.36,z:51,size:.3,kind:3,seed:44,ring:true},
 {x:.9,y:-.2,z:65,size:.24,kind:0,seed:55,ring:false},
 {x:-.85,y:.4,z:78,size:.28,kind:2,seed:61,ring:false}
];
const palettes=[
 [[29,57,85],[48,93,119],[129,153,150],[192,199,180]],
 [[95,69,53],[160,117,76],[196,164,113],[106,91,80]],
 [[43,73,68],[74,112,101],[134,148,116],[195,189,157]],
 [[60,66,95],[105,119,154],[160,154,158],[77,85,119]]
];
function noise(x,y,seed){
 const s=Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453;
 return s-Math.floor(s);
}
function smooth(x,y,seed){
 const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;
 const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
 const a=noise(ix,iy,seed)*(1-u)+noise(ix+1,iy,seed)*u;
 const b=noise(ix,iy+1,seed)*(1-u)+noise(ix+1,iy+1,seed)*u;
 return a*(1-v)+b*v;
}
function texture(p){
 const n=256,off=document.createElement('canvas');off.width=off.height=n;
 const c=off.getContext('2d'),image=c.createImageData(n,n),data=image.data;
 const palette=palettes[p.kind];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
  const nx=(x-n/2)/(n/2),ny=(y-n/2)/(n/2),rr=nx*nx+ny*ny;
  if(rr>=1)continue;
  const nz=Math.sqrt(1-rr),longitude=Math.atan2(nx,nz),latitude=Math.asin(ny);
  const a=smooth(longitude*3.4+9,latitude*7.2+11,p.seed);
  const b=smooth(longitude*13+4,latitude*18+8,p.seed+1);
  const cNoise=smooth(longitude*32+7,latitude*35+2,p.seed+3);
  const band=p.kind===1||p.kind===3?Math.sin(latitude*34+a*4)*.16:0;
  const t=Math.max(0,Math.min(.999,a*.68+b*.25+cNoise*.07+band));
  const idx=Math.min(3,Math.floor(t*4));
  const base=palette[idx];
  const cloud=p.kind===0&&b>.63?(b-.63)*1.4:0;
  const light=Math.max(.045,nx*(-.48)+ny*(-.27)+nz*.84);
  const shade=.15+.85*Math.pow(light,.72);
  const i=(y*n+x)*4;
  for(let k=0;k<3;k++)data[i+k]=Math.min(255,(base[k]*(1-cloud)+230*cloud)*shade);
  data[i+3]=Math.min(255,255*Math.min(1,(1-rr)*n*.3));
 }
 c.putImageData(image,0,0);return off;
}
planets.forEach(p=>p.texture=texture(p));
function resize(){
 width=innerWidth;height=innerHeight;dpr=Math.min(devicePixelRatio||1,2);
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);
}
function progress(){return Math.max(0,Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)));}
function render(){
 const w=width,h=height,cx=w*.5,cy=h*.49,unit=Math.min(w,h)*.8,travel=current*76;
 ctx.fillStyle='#03060c';ctx.fillRect(0,0,w,h);
 const nebula=ctx.createRadialGradient(w*.62,h*.36,0,w*.62,h*.36,Math.max(w,h)*.82);
 nebula.addColorStop(0,'#142031');nebula.addColorStop(.35,'#0a1120');nebula.addColorStop(1,'#03060c');
 ctx.fillStyle=nebula;ctx.fillRect(0,0,w,h);
 // Distant galactic haze: very low contrast, with a nonuniform profile.
 ctx.save();ctx.translate(w*.53,h*.49);ctx.rotate(-.36);ctx.scale(1,.22);
 const haze=ctx.createRadialGradient(0,0,0,0,0,Math.max(w,h)*.76);
 haze.addColorStop(0,'rgba(69,91,117,.13)');haze.addColorStop(.5,'rgba(48,69,96,.055)');
 haze.addColorStop(1,'rgba(0,0,0,0)');
 ctx.fillStyle=haze;ctx.beginPath();ctx.arc(0,0,Math.max(w,h)*.76,0,Math.PI*2);ctx.fill();ctx.restore();
 for(const star of stars){
  const z=((star.z-travel)%80+80)%80+1.5;
  const k=3.4/z,x=cx+star.x*unit*k,y=cy+star.y*unit*k;
  if(x<0||x>w||y<0||y>h)continue;
  const radius=Math.min(2.4,star.size*(.52+2.8/z));
  const alpha=star.brightness*Math.min(1,z/4)*Math.min(1,(81-z)/12);
  const rgb=star.color<.12?'255,219,192':star.color>.9?'188,212,255':'235,240,249';
  if(radius>1.05){
   const halo=ctx.createRadialGradient(x,y,0,x,y,radius*4);
   halo.addColorStop(0,'rgba('+rgb+','+(alpha*.38)+')');
   halo.addColorStop(1,'rgba('+rgb+',0)');
   ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,radius*4,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle='rgba('+rgb+','+alpha+')';
  ctx.beginPath();ctx.arc(x,y,Math.max(.25,radius),0,Math.PI*2);ctx.fill();
 }
 for(const p of planets){
  const z=p.z-travel;if(z<1.4||z>25)continue;
  const k=3.3/z,x=cx+p.x*unit*k,y=cy+p.y*unit*k;
  const radius=Math.min(Math.max(w,h),p.size*unit*k);
  if(x+radius*2<0||x-radius*2>w||y+radius*2<0||y-radius*2>h)continue;
  const alpha=Math.max(0,Math.min(1,(25-z)/5,(z-1.4)/2.5));
  ctx.save();ctx.globalAlpha=alpha;
  const glow=ctx.createRadialGradient(x,y,radius*.85,x,y,radius*1.85);
  glow.addColorStop(0,'rgba(114,151,173,.16)');glow.addColorStop(1,'rgba(70,110,145,0)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(x,y,radius*1.85,0,Math.PI*2);ctx.fill();
  if(p.ring){
   ctx.save();ctx.translate(x,y);ctx.rotate(-.25);
   ctx.strokeStyle='rgba(185,172,152,.35)';ctx.lineWidth=Math.max(1,radius*.12);
   ctx.beginPath();ctx.ellipse(0,0,radius*1.75,radius*.43,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  ctx.drawImage(p.texture,x-radius,y-radius,radius*2,radius*2);
  ctx.restore();
 }
 const vignette=ctx.createRadialGradient(cx,cy,Math.min(w,h)*.24,cx,cy,Math.max(w,h)*.82);
 vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.52)');
 ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
}
function tick(){
 frameId=0;
 if(reduced)current=target;
 else{current+=(target-current)*.085;if(Math.abs(target-current)<.00004)current=target;}
 render();if(current!==target)frameId=requestAnimationFrame(tick);
}
function update(){target=progress();if(!frameId)frameId=requestAnimationFrame(tick);}
addEventListener('scroll',update,{passive:true});
addEventListener('resize',()=>{resize();update();},{passive:true});
resize();target=current=progress();render();
})();
