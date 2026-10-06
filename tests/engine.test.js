import test from 'node:test';
import assert from 'node:assert/strict';
import {Flight,CONFIG,direction} from '../src/engine.js';

function advance(flight,seconds,input={x:0,y:0,fire:false}){for(let i=0;i<Math.round(seconds*60);i++)flight.step(1/60,input);}

test('eight-way steering has a deadzone and consistent diagonal speed',()=>{
  assert.deepEqual(direction(2,3),{x:0,y:0});
  const diagonal=direction(30,-29);assert.ok(diagonal.x>0&&diagonal.y<0);assert.ok(Math.abs(Math.hypot(diagonal.x,diagonal.y)-1)<1e-9);
  const straight=new Flight(),slanted=new Flight();straight.start();slanted.start();
  advance(straight,.25,{x:1,y:0});advance(slanted,.25,{x:1,y:1});
  assert.ok(Math.abs(Math.hypot(slanted.player.x-100,slanted.player.y-190)-(straight.player.x-100))<1e-8);
});
test('ship stays inside the action area and below the score display',()=>{
  const f=new Flight();f.start();advance(f,2,{x:-1,y:-1});
  assert.equal(f.player.x,22);assert.equal(f.player.y,56);
  f.enemies=[];f.spawnIn=999;advance(f,5,{x:1,y:1});
  assert.equal(f.player.x,CONFIG.width-22);assert.equal(f.player.y,CONFIG.height-22);
});
test('holding fire repeats shots and release stops new shots',()=>{
  const f=new Flight();f.start();advance(f,1,{x:0,y:0,fire:true});
  assert.equal(f.takeEvents().filter(x=>x==='shot').length,6);
  advance(f,.5);assert.equal(f.takeEvents().filter(x=>x==='shot').length,0);
});
test('a hit removes exactly one life and protects against repeated collisions',()=>{
  const f=new Flight();f.start();assert.equal(f.damage(),true);assert.equal(f.lives,2);
  assert.equal(f.damage(),false);assert.equal(f.lives,2);advance(f,CONFIG.protection+.05);
  assert.equal(f.damage(),true);assert.equal(f.lives,1);advance(f,CONFIG.protection+.05);
  f.damage();assert.equal(f.state,'over');assert.equal(f.lives,0);
  f.damage();assert.equal(f.lives,0);f.start();assert.equal(f.lives,3);assert.equal(f.score,0);assert.equal(f.time,0);
});
test('pause freezes movement, damage, shots, and stage clock',()=>{
  const f=new Flight();f.start();advance(f,1);f.pause();
  const prior={x:f.player.x,y:f.player.y,time:f.time,lives:f.lives};
  advance(f,3,{x:1,y:1,fire:true});f.damage();
  assert.deepEqual({x:f.player.x,y:f.player.y,time:f.time,lives:f.lives},prior);
  assert.equal(f.bullets.length,0);f.resume();advance(f,.1,{x:1,y:0});assert.ok(f.player.x>prior.x);
});
test('destroyed enemies score once; overlapping enemies do not multiply damage',()=>{
  const f=new Flight();f.start();f.spawnIn=999;
  f.enemies=[{x:130,y:190,w:22,h:18,hp:1,type:'dart',age:0,speed:0,flash:0}];
  f.bullets=[{x:130,y:190,w:13,h:4},{x:131,y:190,w:13,h:4}];
  f.step(.001);assert.equal(f.score,100);assert.equal(f.enemies.length,0);f.step(.001);assert.equal(f.score,100);
  f.enemies=Array.from({length:3},()=>({x:f.player.x,y:f.player.y,w:22,h:18,hp:1,type:'dart',age:0,speed:0,flash:0}));
  f.step(.001);assert.equal(f.lives,2);
});
test('flight trial ends at three minutes without starting a later stage',()=>{
  const f=new Flight();f.start();f.spawnIn=999;advance(f,181);
  assert.equal(f.state,'complete');assert.equal(f.time,180);assert.equal(f.lives,3);
});
test('long held-fire simulation stays bounded and replayable',()=>{
  const a=new Flight(),b=new Flight();a.start();b.start();
  for(let i=0;i<120*60;i++){
    // Shield the test pilot to exercise every wave without ending the run early.
    a.player.protected=1;b.player.protected=1;
    const input={x:0,y:Math.sin(i/100),fire:true};a.step(1/60,input);b.step(1/60,input);
    assert.ok(a.bullets.length<15&&a.enemies.length<30&&a.hostile.length<30&&a.particles.length<120);
  }
  assert.equal(a.score,b.score);assert.deepEqual(a.enemies,b.enemies);assert.equal(a.time,b.time);
});
