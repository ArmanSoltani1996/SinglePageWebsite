/* Scroll-synchronized, reversible space journey; no dependencies or external assets. */
(()=>{
  'use strict';
  const canvas=document.getElementById('spaceJourney');
  if(!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx)return;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w=0,h=0,dpr=1,target=0,current=0,raf=0,dirty=true;
  const random=(seed)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  const rand=random(391974);
  const stars=Array.from({length:1100},()=>({
    x:(rand()-.5)*2.9,y:(rand()-.5)*2.2,z:rand()*28+1,
    r:.4+rand()*1.3,hue:rand()>.92?170+rand()*70:210+rand()*45,
    alpha:.35+rand()*.65
  }));
  const planets=[
    {x:.88,y:-.3,z:7,r:.21,base:'#4a7e91',glow:'#377e94',ring:true},
    {x:-.86,y:.26,z:16,r:.28,base:'#956b58',glow:'#76564d'},
    {x:.65,y:.48,z:25,r:.19,base:'#668c71',glow:'#466b58',ring:true},
    {x:-.62,y:-.45,z:35,r:.24,base:'#62749d',glow:'#4b5c89'},
    {x:.92,y:-.15,z:46,r:.32,base:'#8e726b',glow:'#654b50',ring:true},
    {x:-.75,y:.4,z:58,r:.2,base:'#638b9a',glow:'#3e677c'}
  ];
  const travel=70;
  function resize(){
    dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;
  }
  function getScroll(){return Math.max(0,window.scrollY)/(Math.max(1,document.documentElement.scrollHeight-innerHeight));}
  function draw(){
    dirty=false;
    ctx.fillStyle='#050810';ctx.fillRect(0,0,w,h);
    const cx=w*.5,cy=h*.48,scale=Math.min(w,h)*.72;
    const mist=ctx.createRadialGradient(cx,cy,10,cx,cy,Math.max(w,h)*.75);
    mist.addColorStop(0,'#142037');mist.addColorStop(.5,'#090e1d');mist.addColorStop(1,'#050810');
    ctx.fillStyle=mist;ctx.fillRect(0,0,w,h);
    const distance=current*travel;
    // Fixed world coordinates make reverse scrolling retrace exactly the same path.
    for(const star of stars){
      const depth=((star.z-distance%28+28)%28)+.5;
      const perspective=2.8/depth;
      const x=cx+star.x*scale*perspective,y=cy+star.y*scale*perspective;
      if(x<0||x>w||y<0||y>h)continue;
      const size=Math.min(3.8,star.r*(.6+4/depth));
      const alpha=star.alpha*Math.min(1,(28-depth)/6)*Math.min(1,depth/2);
      ctx.fillStyle='hsla('+star.hue+',65%,88%,'+alpha+')';
      ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
    }
    for(const p of planets){
      const z=p.z-distance;
      if(z<1.2||z>22)continue;
      const k=3/z,x=cx+p.x*scale*k,y=cy+p.y*scale*k,r=Math.min(Math.max(w,h)*.7,p.r*scale*k);
      if(x+r<0||x-r>w||y+r<0||y-r>h)continue;
      const fade=Math.min(1,(22-z)/4,(z-1.2)/2);
      ctx.save();ctx.globalAlpha=Math.max(0,fade);
      const aura=ctx.createRadialGradient(x,y,r*.4,x,y,r*2.4);
      aura.addColorStop(0,p.glow+'55');aura.addColorStop(1,'#00000000');
      ctx.fillStyle=aura;ctx.beginPath();ctx.arc(x,y,r*2.4,0,Math.PI*2);ctx.fill();
      if(p.ring){
        ctx.save();ctx.translate(x,y);ctx.rotate(-.3);
        ctx.strokeStyle='rgba(170,195,185,.42)';ctx.lineWidth=Math.max(1,r*.09);
        ctx.beginPath();ctx.ellipse(0,0,r*1.65,r*.42,0,0,Math.PI*2);ctx.stroke();ctx.restore();
      }
      const sphere=ctx.createRadialGradient(x-r*.38,y-r*.4,r*.04,x+r*.15,y+r*.16,r*1.2);
      sphere.addColorStop(0,'#c0cbd0');sphere.addColorStop(.25,p.base);sphere.addColorStop(1,'#111824');
      ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
      ctx.restore();
    }
    const vignette=ctx.createRadialGradient(cx,cy,Math.min(w,h)*.2,cx,cy,Math.max(w,h)*.8);
    vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.55)');
    ctx.fillStyle=vignette;ctx.fillRect(0,0,w,h);
  }
  function frame(){
    raf=0;
    if(reduce){current=target;}else{current+=(target-current)*.085;if(Math.abs(target-current)<.00005)current=target;}
    draw();
    if(current!==target)raf=requestAnimationFrame(frame);
  }
  function schedule(){
    target=getScroll();
    if(!raf)raf=requestAnimationFrame(frame);
  }
  addEventListener('resize',()=>{resize();schedule()},{passive:true});
  addEventListener('scroll',schedule,{passive:true});
  resize();target=current=getScroll();draw();
})();
