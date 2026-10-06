import {Flight,CONFIG,direction,clamp} from './engine.js';
import {Renderer} from './art.js';
import {AudioFeedback} from './audio.js';

const $=id=>document.getElementById(id);
const app=$('app'),overlay=$('overlay'),zone=$('steer-zone'),joystick=$('joystick'),stick=$('stick'),fire=$('fire');
const flight=new Flight(),renderer=new Renderer($('game')),audio=new AudioFeedback();
const input={x:0,y:0,fire:false};
const keys=new Set();let movePointer=null,firePointer=null,origin={x:0,y:0},pointerDirection={x:0,y:0};
let lastState='',lastScore=-1,lastLives=-1,lastSecond=-1,lastFrame=0,accumulator=0,visualTime=0,noticeTimer,hitTimer;

function feedback(){audio.unlock();audio.play('press');try{if(typeof navigator.vibrate==='function')navigator.vibrate(8);}catch{}}
function notice(text){$('notice').textContent=text;$('notice').classList.add('visible');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>$('notice').classList.remove('visible'),2200);}
function clearControls(){
  keys.clear();movePointer=null;firePointer=null;pointerDirection={x:0,y:0};input.x=0;input.y=0;input.fire=false;
  joystick.classList.remove('active');zone.classList.remove('engaged');fire.classList.remove('pressed');
}
function combineControls(){
  const keyboardX=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0);
  const keyboardY=(keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0);
  input.x=movePointer!==null?pointerDirection.x:keyboardX;input.y=movePointer!==null?pointerDirection.y:keyboardY;
  input.fire=firePointer!==null||keys.has('Space');
}
function panel({eyebrow,title,text,button,note,secondary=false}){
  $('eyebrow').textContent=eyebrow;$('panel-title').innerHTML=title;$('panel-text').textContent=text;
  $('primary').innerHTML=button+' <span aria-hidden="true">→</span>';$('panel-note').textContent=note;$('secondary').hidden=!secondary;
}
function sync(){
  if(lastScore!==flight.score){$('score').textContent=String(flight.score).padStart(6,'0');lastScore=flight.score;}
  if(lastLives!==flight.lives){$('lives').textContent=Array.from({length:3},(_,i)=>i<flight.lives?'◆':'◇').join(' ');$('lives').setAttribute('aria-label',flight.lives+' lives');lastLives=flight.lives;}
  const second=Math.ceil(CONFIG.duration-flight.time);
  if(lastSecond!==second){$('time').textContent=String(Math.floor(second/60)).padStart(2,'0')+':'+String(second%60).padStart(2,'0');lastSecond=second;}
  if(lastState===flight.state)return;
  lastState=flight.state;app.dataset.mode=flight.state;overlay.hidden=flight.state==='playing';
  $('pause').disabled=!['playing','paused'].includes(flight.state);
  $('pause').setAttribute('aria-label',flight.state==='paused'?'Resume game':'Pause game');
  $('pause').innerHTML=flight.state==='paused'?'▶ <span>RESUME</span>':'Ⅱ <span>PAUSE</span>';
  if(flight.state!=='playing')clearControls();
  if(flight.state==='playing')$('flight-status').textContent='SCOUT IN FLIGHT · KEEP MOVING';
  if(flight.state==='paused'){
    $('flight-status').textContent='FLIGHT PAUSED';
    panel({eyebrow:'TAKE A BREATHER',title:'FLIGHT<br><span>PAUSED</span>',text:'Your scout is safe. Continue when you’re ready.',button:'RESUME FLIGHT',note:'Movement and firing stop while paused.',secondary:true});
  }
  if(flight.state==='over'){
    $('flight-status').textContent='SCOUT SIGNAL LOST';
    panel({eyebrow:'THE SKY CAN WAIT',title:'SIGNAL<br><span>LOST</span>',text:'Final score: '+flight.score.toLocaleString()+'. Another scout. Another chance.',button:'TRY AGAIN',note:'Restart this flight with three lives.'});
  }
  if(flight.state==='complete'){
    $('flight-status').textContent='FLIGHT TEST COMPLETE';
    panel({eyebrow:'THREE MINUTES. STILL FLYING.',title:'CLEAR<br><span>HORIZON</span>',text:'Flight test complete. Score: '+flight.score.toLocaleString()+'.',button:'FLY AGAIN',note:'Scrapjaw and special weapons arrive in Stage 2.'});
  }
}
function start(){
  if(window.matchMedia('(orientation: portrait)').matches)return;
  audio.unlock();clearControls();flight.start();accumulator=0;sync();
}
function pause(reason){
  if(flight.state!=='playing')return;
  flight.pause();audio.suspend();sync();if(reason)notice(reason);
}
function resume(){
  if(document.hidden||window.matchMedia('(orientation: portrait)').matches)return;
  audio.unlock();clearControls();flight.resume();accumulator=0;sync();
}
function togglePause(){if(flight.state==='playing')pause();else if(flight.state==='paused')resume();}

zone.addEventListener('pointerdown',e=>{
  if(flight.state!=='playing'||movePointer!==null||(e.pointerType==='mouse'&&e.button!==0))return;
  e.preventDefault();movePointer=e.pointerId;zone.setPointerCapture(e.pointerId);
  const bounds=zone.getBoundingClientRect();origin={x:e.clientX,y:e.clientY};
  joystick.style.left=(e.clientX-bounds.left)+'px';joystick.style.top=(e.clientY-bounds.top)+'px';
  joystick.classList.add('active');zone.classList.add('engaged');stick.style.transform='translate(0,0)';pointerDirection={x:0,y:0};feedback();
});
zone.addEventListener('pointermove',e=>{
  if(e.pointerId!==movePointer)return;e.preventDefault();
  const dx=e.clientX-origin.x,dy=e.clientY-origin.y;
  pointerDirection=direction(dx,dy);const length=Math.hypot(dx,dy),scale=length>28?28/length:1;
  stick.style.transform='translate('+dx*scale+'px,'+dy*scale+'px)';
});
function endMove(e){if(e.pointerId!==movePointer)return;movePointer=null;pointerDirection={x:0,y:0};joystick.classList.remove('active');zone.classList.remove('engaged');}
zone.addEventListener('pointerup',endMove);zone.addEventListener('pointercancel',endMove);zone.addEventListener('lostpointercapture',endMove);

fire.addEventListener('pointerdown',e=>{
  if(flight.state!=='playing'||firePointer!==null||(e.pointerType==='mouse'&&e.button!==0))return;
  e.preventDefault();firePointer=e.pointerId;fire.setPointerCapture(e.pointerId);fire.classList.add('pressed');feedback();
});
function endFire(e){if(e.pointerId!==firePointer)return;firePointer=null;fire.classList.remove('pressed');}
fire.addEventListener('pointerup',endFire);fire.addEventListener('pointercancel',endFire);fire.addEventListener('lostpointercapture',endFire);
fire.addEventListener('click',e=>{if(e.detail===0&&flight.state==='playing'){audio.unlock();flight.fireIn=0;flight.step(1/60,{x:0,y:0,fire:true});}});
$('special').addEventListener('pointerdown',e=>{e.preventDefault();$('special').classList.add('pressed');feedback();notice('Special weapons arrive in Stage 2.');});
function endSpecial(){$('special').classList.remove('pressed');}
window.addEventListener('pointerup',endSpecial);window.addEventListener('pointercancel',endSpecial);
$('special').addEventListener('click',e=>{if(e.detail===0)notice('Special weapons arrive in Stage 2.');});
$('primary').addEventListener('click',()=>{feedback();if(flight.state==='paused')resume();else start();});
$('secondary').addEventListener('click',()=>{feedback();start();});
$('pause').addEventListener('click',()=>{feedback();togglePause();});

try{audio.enabled=localStorage.getItem('rust-horizon-sound')!=='off';}catch{}
function syncSound(){const muted=!audio.enabled;$('sound-state').textContent=muted?'OFF':'ON';$('sound').setAttribute('aria-label',muted?'Enable sound':'Mute sound');$('sound').setAttribute('aria-pressed',String(muted));}
syncSound();
$('sound').addEventListener('click',()=>{audio.setEnabled(!audio.enabled);syncSound();try{localStorage.setItem('rust-horizon-sound',audio.enabled?'on':'off');}catch{}if(audio.enabled)feedback();});

const controls=new Set(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','KeyW','KeyA','KeyS','KeyD','Space']);
window.addEventListener('keydown',e=>{
  if(controls.has(e.code)){
    if(e.code==='Space'&&e.target instanceof HTMLButtonElement)return;
    e.preventDefault();if(flight.state==='playing')keys.add(e.code);
  }
  if((e.code==='Escape'||e.code==='KeyP')&&!e.repeat){e.preventDefault();togglePause();}
});
window.addEventListener('keyup',e=>{keys.delete(e.code);});
window.addEventListener('blur',()=>pause());
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
window.addEventListener('pagehide',()=>pause());
window.addEventListener('resize',()=>{if(window.matchMedia('(orientation: portrait)').matches)pause();});
zone.addEventListener('contextmenu',e=>e.preventDefault());fire.addEventListener('contextmenu',e=>e.preventDefault());

function frame(now){
  const elapsed=lastFrame?clamp((now-lastFrame)/1000,0,.1):0;lastFrame=now;
  if(flight.state==='playing'){
    combineControls();accumulator+=elapsed;
    while(accumulator>=1/60){flight.step(1/60,input);accumulator-=1/60;}
    visualTime+=elapsed;
  }else{accumulator=0;if(flight.state==='ready')visualTime+=elapsed*.25;}
  for(const event of flight.takeEvents()){
    audio.play(event);
    if(event==='hit'){
      $('viewport').classList.add('hit');clearTimeout(hitTimer);hitTimer=setTimeout(()=>$('viewport').classList.remove('hit'),200);
      try{if(typeof navigator.vibrate==='function')navigator.vibrate([25,20,25]);}catch{}
    }
  }
  sync();renderer.draw(flight,visualTime);requestAnimationFrame(frame);
}
sync();requestAnimationFrame(frame);
