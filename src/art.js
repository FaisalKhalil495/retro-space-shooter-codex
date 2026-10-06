import {CONFIG} from './engine.js?v=layout2';
// Original hand-drawn pixel maps. Each letter is a colour, each dot is transparent.
const colours={r:'#a96b58',R:'#c68b6d',d:'#584b48',s:'#748789',S:'#a5b6aa',a:'#d0af79',b:'#35464d',w:'#dccba6'};
const scout=[
  '....ddd.............',
  '...drrrd............',
  '...drrRRd...........',
  '..bdrrrrrd..........',
  '.bbrrrrrssssdd......',
  'bbdrrrraSSSaarrrdd..',
  'bbdrrrraSSSaarRRrrrd',
  '.bbrrrrrssssddrrrrd.',
  '..bdrrrrrd...dddd...',
  '...drrRRd...........',
  '...drrrd............',
  '....ddd.............'
];
const dart=[
  '..sss..........',
  '.ssbbs.........',
  'ssbbbbssss.....',
  '..bbaabbbs.....',
  'ssbbbbssss.....',
  '.ssbbs.........',
  '..sss..........'
];
const drifter=[
  '...ddddd......',
  '..drrrRrd.....',
  '.drrbbbbdd....',
  'draaSbbbbdd...',
  '.drrbbbbdd....',
  '..drrrRrd.....',
  '...ddddd......'
];
const gunner=[
  '...bbbbbb......',
  '..bsSSsssb.....',
  '..bssssssbb....',
  '.dbbssssssbb...',
  'ddraaaassssbb..',
  '.dbbssssssbb...',
  '..bssssssbb....',
  '..bsSSsssb.....',
  '...bbbbbb......'
];
function sprite(ctx,rows,x,y,scale=2,flash=false){
  const ox=Math.round(x-rows[0].length*scale/2),oy=Math.round(y-rows.length*scale/2);
  rows.forEach((row,j)=>{[...row].forEach((pixel,i)=>{if(pixel!=='.'){ctx.fillStyle=flash?'#decba2':colours[pixel];ctx.fillRect(ox+i*scale,oy+j*scale,scale,scale);}});});
}
function seeded(seed){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
export class Renderer {
  constructor(canvas){
    this.ctx=canvas.getContext('2d',{alpha:false});this.ctx.imageSmoothingEnabled=false;
    const rand=seeded(640360);
    this.stars=Array.from({length:85},()=>({x:rand()*640,y:rand()*CONFIG.height,z:1+Math.floor(rand()*3)}));
    this.wrecks=Array.from({length:7},(_,i)=>({x:i*155+rand()*90,y:CONFIG.height*.57+rand()*CONFIG.height*.43,w:32+Math.floor(rand()*75),h:12+Math.floor(rand()*22)}));
  }
  background(time){
    const c=this.ctx;c.fillStyle='#14202d';c.fillRect(0,0,640,CONFIG.height);
    c.fillStyle='#192936';c.fillRect(0,82,640,CONFIG.height-174);
    c.fillStyle='#1d2f3b';c.fillRect(0,130,640,66);
    c.fillStyle='#20333d';c.fillRect(120,155,520,13);
    c.fillStyle='#25353c';c.beginPath();c.arc(539,100,76,0,Math.PI*2);c.fill();
    c.fillStyle='#38433f';c.beginPath();c.arc(532,96,66,0,Math.PI*2);c.fill();
    c.fillStyle='#494b42';c.fillRect(492,50,47,5);c.fillRect(478,66,41,7);c.fillRect(472,92,59,8);c.fillRect(497,115,51,6);c.fillRect(523,144,26,4);
    c.fillStyle='#29363b';c.beginPath();c.arc(561,85,63,0,Math.PI*2);c.fill();
    for(const star of this.stars){
      c.fillStyle=star.z===3?'#a49b84':star.z===2?'#667b80':'#425b69';
      const x=((star.x-time*star.z*7)%640+640)%640;
      c.fillRect(Math.floor(x),Math.floor(star.y),star.z===3?2:1,star.z===3?2:1);
    }
    // An old relay mast in the far distance.
    const mast=((590-time*9)%820+820)%820-80;
    c.fillStyle='#2f4046';c.fillRect(mast,112,8,143);c.fillRect(mast-19,112,44,5);c.fillRect(mast-8,126,24,11);c.fillRect(mast-27,159,57,4);c.fillRect(mast-3,190,15,65);
    c.fillStyle='#826d50';c.fillRect(mast+3,116,2,3);
    for(const w of this.wrecks){
      const x=((w.x-time*24)%1100+1100)%1100-140;
      c.fillStyle='#283941';c.fillRect(x,w.y,w.w,w.h);c.fillRect(x+w.w*.25,w.y-9,w.w*.45,9);
      c.fillStyle='#48504a';c.fillRect(x+5,w.y+3,w.w-10,3);
      c.fillStyle='#80644f';c.fillRect(x+9,w.y+8,8,3);c.fillRect(x+w.w-14,w.y+8,4,3);
      c.fillStyle='#162530';c.fillRect(x+w.w*.4,w.y+9,w.w*.28,8);
    }
    c.fillStyle='#10202b';c.fillRect(0,CONFIG.height-11,640,11);
    const offset=(time*39)%120;
    for(let i=-1;i<7;i++){const x=i*120-offset;c.fillStyle='#29353a';c.fillRect(x,CONFIG.height-20,78,9);c.fillStyle='#594c40';c.fillRect(x+18,CONFIG.height-23,39,3);}
  }
  draw(flight,visualTime){
    const c=this.ctx;this.background(visualTime);
    for(const e of flight.enemies){
      sprite(c,e.type==='gunner'?gunner:e.type==='drifter'?drifter:dart,e.x,e.y,2,e.flash>0);
      if(e.type==='gunner'&&e.shootIn<.7){c.fillStyle='#cbaa77';c.fillRect(Math.floor(e.x-23),Math.floor(e.y)-2,5,4);c.fillRect(Math.floor(e.x-31),Math.floor(e.y)-1,3,2);}
    }
    for(const b of flight.bullets){c.fillStyle='#ac7959';c.fillRect(Math.round(b.x)-8,Math.round(b.y)-2,13,4);c.fillStyle='#dbc79b';c.fillRect(Math.round(b.x)+2,Math.round(b.y)-1,5,2);}
    for(const b of flight.hostile){c.fillStyle='#b3795d';c.fillRect(Math.round(b.x)-3,Math.round(b.y)-3,6,6);c.fillStyle='#dec595';c.fillRect(Math.round(b.x)-1,Math.round(b.y)-1,2,2);}
    for(const s of flight.particles){c.fillStyle=s.colour;c.globalAlpha=Math.min(1,s.life*3);c.fillRect(Math.round(s.x),Math.round(s.y),3,3);}c.globalAlpha=1;
    const p=flight.player;
    if(flight.state!=='over'&&(p.protected<=0||Math.floor(p.protected*10)%2===0)){
      const flame=4+Math.floor(visualTime*18)%3*2;
      c.fillStyle='#ac7959';c.fillRect(Math.round(p.x)-26-flame,Math.round(p.y)-3,flame+5,6);
      c.fillStyle='#dbc79b';c.fillRect(Math.round(p.x)-26,Math.round(p.y)-1,5,2);
      sprite(c,scout,p.x,p.y);
    }
  }
}
