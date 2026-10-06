// The simulation is independent of the screen and touch controls.
export const CONFIG = Object.freeze({width:640,height:432,duration:180,speed:210,fireInterval:.17,protection:1.8});
export function direction(dx,dy,deadzone=8){
  const length=Math.hypot(dx,dy);
  if(length<deadzone)return {x:0,y:0};
  const angle=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*Math.PI/4;
  return {x:Math.cos(angle),y:Math.sin(angle)};
}
export function clamp(value,low,high){return Math.max(low,Math.min(high,value));}
function overlap(a,b){return Math.abs(a.x-b.x)<a.w/2+b.w/2 && Math.abs(a.y-b.y)<a.h/2+b.h/2;}
export class Flight {
  constructor(){this.state='ready';this.resetData();}
  resetData(){
    this.player={x:100,y:190,w:24,h:14,protected:0};
    this.enemies=[];this.bullets=[];this.hostile=[];this.particles=[];
    this.score=0;this.lives=3;this.time=0;this.wave=0;this.spawnIn=2.4;this.fireIn=0;this.events=[];this.seed=731;
  }
  random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
  start(){this.resetData();this.state='playing';this.events.push('start');}
  pause(){if(this.state==='playing'){this.state='paused';this.events.push('pause');}}
  resume(){if(this.state==='paused'){this.state='playing';this.events.push('resume');}}
  burst(x,y,colour,count=12){
    for(let i=0;i<count;i++)this.particles.push({x,y,vx:(this.random()-.5)*130,vy:(this.random()-.5)*130,life:.3+this.random()*.4,colour});
  }
  spawnWave(){
    this.wave++;
    const formation=this.wave%4;
    const count=this.time<25?2:this.time<75?3:4;
    const base=80+this.random()*(CONFIG.height-180);
    for(let i=0;i<count;i++){
      const type=formation===3&&i===0?'gunner':formation===2?'drifter':'dart';
      this.enemies.push({x:CONFIG.width+24+i*62,y:clamp(base+(i-(count-1)/2)*44,65,CONFIG.height-44),baseY:clamp(base+(i-(count-1)/2)*44,65,CONFIG.height-44),w:type==='gunner'?30:22,h:type==='gunner'?24:18,type,hp:type==='gunner'?3:1,age:0,speed:65+Math.min(this.time*.25,30)+(type==='dart'?15:0),shootIn:2.4+i*.35,flash:0});
    }
    this.spawnIn=this.time<30?3.8:this.time<90?3.1:2.6;
  }
  damage(){
    if(this.player.protected>0||this.state!=='playing')return false;
    this.lives--;this.player.protected=CONFIG.protection;
    this.burst(this.player.x,this.player.y,'#c8ab7e',18);
    this.hostile=this.hostile.filter(b=>Math.hypot(b.x-this.player.x,b.y-this.player.y)>100);
    this.events.push('hit');
    if(this.lives===0){this.state='over';this.events.push('over');}
    return true;
  }
  step(dt,input={x:0,y:0,fire:false}){
    if(this.state!=='playing')return;
    dt=clamp(dt,0,.05);this.time=Math.min(CONFIG.duration,this.time+dt);
    const p=this.player;
    const magnitude=Math.max(1,Math.hypot(input.x||0,input.y||0));
    p.x=clamp(p.x+(input.x||0)/magnitude*CONFIG.speed*dt,22,CONFIG.width-22);
    p.y=clamp(p.y+(input.y||0)/magnitude*CONFIG.speed*dt,56,CONFIG.height-22);
    p.protected=Math.max(0,p.protected-dt);
    this.fireIn=Math.max(0,this.fireIn-dt);
    if(input.fire&&this.fireIn<=0){this.bullets.push({x:p.x+21,y:p.y,w:13,h:4});this.fireIn=CONFIG.fireInterval;this.events.push('shot');}
    this.spawnIn-=dt;
    if(this.spawnIn<=0&&this.time<CONFIG.duration-4)this.spawnWave();
    for(const e of this.enemies){
      e.age+=dt;e.x-=e.speed*dt;e.flash=Math.max(0,e.flash-dt);
      if(e.type==='drifter')e.y=e.baseY+Math.sin(e.age*2)*24;
      if(e.type==='gunner'&&this.time>18&&e.x<CONFIG.width-28&&e.x>p.x+65){
        e.shootIn-=dt;
        if(e.shootIn<=0){
          const angle=Math.atan2(p.y-e.y,p.x-e.x);
          this.hostile.push({x:e.x-18,y:e.y,vx:Math.cos(angle)*130,vy:Math.sin(angle)*130,w:7,h:7});
          e.shootIn=3.2;this.events.push('enemyShot');
        }
      }
    }
    for(const b of this.bullets)b.x+=530*dt;
    for(const b of this.hostile){b.x+=b.vx*dt;b.y+=b.vy*dt;}
    for(const b of this.bullets){
      if(b.dead)continue;
      for(const e of this.enemies){
        if(e.hp<=0||!overlap(b,e))continue;
        b.dead=true;e.hp--;e.flash=.09;
        if(e.hp===0){this.score+=e.type==='gunner'?150:100;this.burst(e.x,e.y,'#ba8060');this.events.push('destroy');}
        break;
      }
    }
    for(const e of this.enemies){if(e.hp>0&&overlap(p,e)&&this.damage()){e.hp=0;this.burst(e.x,e.y,'#ba8060');}}
    for(const b of this.hostile){if(!b.dead&&overlap(p,b)&&this.damage())b.dead=true;}
    this.enemies=this.enemies.filter(e=>e.hp>0&&e.x>-50);
    this.bullets=this.bullets.filter(b=>!b.dead&&b.x<CONFIG.width+30);
    this.hostile=this.hostile.filter(b=>!b.dead&&b.x>-20&&b.x<CONFIG.width+30&&b.y>30&&b.y<CONFIG.height+20);
    for(const s of this.particles){s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;}
    this.particles=this.particles.filter(s=>s.life>0);
    if(this.time>=CONFIG.duration&&this.state==='playing'){this.state='complete';this.events.push('complete');}
  }
  takeEvents(){return this.events.splice(0);}
}
